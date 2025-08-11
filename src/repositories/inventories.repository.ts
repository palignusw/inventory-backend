import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInventoryDto } from 'src/inventories/dto/create-inventory.dto';
import { UpdateInventoryDto } from 'src/inventories/dto/update-inventory.dto';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectRepository(Inventory) private readonly repo: Repository<Inventory>,
  ) {}

  createBasic(dto: CreateInventoryDto, owner: User) {
    const inv = this.repo.create({ ...dto, createdBy: owner });
    return this.repo.save(inv);
  }

  findByIdWithOwner(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['createdBy'] });
  }

  findMine(userId: number) {
    return this.repo
      .createQueryBuilder('inv')
      .innerJoin('inv.access', 'acc', 'acc.user_id = :uid', { uid: userId })
      .leftJoinAndSelect('inv.createdBy', 'owner')
      .orderBy('inv.id', 'DESC')
      .getMany();
  }

  async updateWithVersion(invId: number, dto: UpdateInventoryDto) {
    if (dto.version != null) {
      const { version, ...rest } = dto as any;

      const result = await this.repo
        .createQueryBuilder()
        .update(Inventory)
        .set({ ...rest, version: () => 'version + 1' })
        .where('id = :id', { id: invId })
        .andWhere('version = :version', { version: Number(version) })
        .execute();

      if (!result.affected) {
        throw new ConflictException(
          'Инвентарь уже изменён другим пользователем. Обновите данные.',
        );
      }
      return this.repo.findOneByOrFail({ id: invId });
    }

    const { version, ...rest } = dto as any;
    await this.repo
      .createQueryBuilder()
      .update(Inventory)
      .set({ ...rest, updatedAt: () => 'CURRENT_TIMESTAMP' })
      .where('id = :id', { id: invId })
      .execute();

    return this.repo.findOneByOrFail({ id: invId });
  }

  async removeByOwner(invId: number, ownerId: number) {
    const inv = await this.findByIdWithOwner(invId);
    if (!inv) throw new NotFoundException();
    if (inv.createdBy.id !== ownerId) throw new ForbiddenException();
    await this.repo.delete(invId);
    return { ok: true };
  }
}
