import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FieldType } from 'src/enums/fieldType';
import { Field } from 'src/fields/entities/field.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FieldsRepository {
  constructor(
    @InjectRepository(Field) private readonly repo: Repository<Field>,
  ) {}

  findAll(invId: number) {
    return this.repo.find({
      where: { inventory: { id: invId } },
      order: { order: 'ASC' },
    });
  }

  countByType(invId: number, type: FieldType) {
    return this.repo.count({ where: { inventory: { id: invId }, type } });
  }

  async nextOrder(invId: number) {
    const { max } = await this.repo
      .createQueryBuilder('f')
      .select('MAX(f.order)', 'max')
      .where('f.inventoryId = :invId', { invId })
      .getRawOne<{ max: number | null }>();
    return (max ?? -1) + 1;
  }

  createForInventory(invId: number, data: Partial<Field>) {
    const entity = this.repo.create({
      ...data,
      inventory: { id: invId } as any,
    });
    return this.repo.save(entity);
  }

  findById(invId: number, id: number) {
    return this.repo.findOne({ where: { id, inventory: { id: invId } } });
  }

  async updateWithVersion(
    invId: number,
    id: number,
    dto: Partial<Field> & { version?: number },
  ) {
    if (dto.version == null) {
      const { version, ...rest } = dto as any;
      const r = await this.repo
        .createQueryBuilder()
        .update(Field)
        .set({ ...rest, updatedAt: () => 'CURRENT_TIMESTAMP' })
        .where('id = :id', { id })
        .andWhere('inventoryId = :invId', { invId })
        .execute();
      if (!r.affected) throw new NotFoundException('Поле не найдено');
      return this.repo.findOneByOrFail({ id });
    }

    const { version, ...rest } = dto as any;
    const result = await this.repo
      .createQueryBuilder()
      .update(Field)
      .set({ ...rest, version: () => 'version + 1' })
      .where('id = :id', { id })
      .andWhere('inventoryId = :invId', { invId })
      .andWhere('version = :version', { version: Number(version) })
      .execute();

    if (!result.affected) {
      throw new ConflictException(
        'Поле уже изменено другим пользователем. Обновите данные.',
      );
    }
    return this.repo.findOneByOrFail({ id });
  }

  save(field: Field) {
    return this.repo.save(field);
  }
  remove(field: Field) {
    return this.repo.remove(field);
  }
}
