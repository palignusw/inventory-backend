import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsRepository {
  constructor(
    @InjectRepository(Item) private readonly repo: Repository<Item>,
  ) {}

  list(invId: number) {
    return this.repo.find({
      where: { inventory: { id: invId } },
      order: { id: 'DESC' },
    });
  }

  findById(invId: number, id: number) {
    return this.repo.findOne({ where: { id, inventory: { id: invId } } });
  }

  existsByCustomId(invId: number, customId: string) {
    return this.repo.exists({ where: { inventory: { id: invId }, customId } });
  }

  createForInventory(invId: number, data: Partial<Item>) {
    const entity = this.repo.create({
      ...data,
      inventory: { id: invId } as any,
    });
    return this.repo.save(entity);
  }

  async updateWithVersion(
    invId: number,
    id: number,
    patch: Partial<Item> & { version?: number },
  ) {
    if (patch.version == null) {
      const { version, ...rest } = patch as any;
      const r = await this.repo
        .createQueryBuilder()
        .update(Item)
        .set({ ...rest, updatedAt: () => 'CURRENT_TIMESTAMP' })
        .where('id = :id', { id })
        .andWhere('inventory_id = :invId', { invId })
        .execute();
      if (!r.affected) throw new NotFoundException('Item not found');
      return this.repo.findOneByOrFail({ id });
    }

    const { version, ...rest } = patch as any;
    const r = await this.repo
      .createQueryBuilder()
      .update(Item)
      .set({ ...rest, version: () => 'version + 1' })
      .where('id = :id', { id })
      .andWhere('inventory_id = :invId', { invId })
      .andWhere('version = :version', { version: Number(version) })
      .execute();

    if (!r.affected)
      throw new ConflictException(
        'Item was modified by another user. Refresh data.',
      );
    return this.repo.findOneByOrFail({ id });
  }

  remove(item: Item) {
    return this.repo.remove(item);
  }
}
