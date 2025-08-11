import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Access } from 'src/access/entities/access.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccessRepository {
  constructor(
    @InjectRepository(Access) private readonly repo: Repository<Access>,
  ) {}

  find(invId: number, userId: number) {
    return this.repo.findOne({
      where: { inventory: { id: invId }, user: { id: userId } },
      relations: ['inventory', 'inventory.createdBy'],
    });
  }

  async upsert(invId: number, userId: number, canWrite: boolean) {
    const existing = await this.find(invId, userId);
    if (existing) {
      existing.canWrite = canWrite;
      return this.repo.save(existing);
    }
    return this.repo.save(
      this.repo.create({
        inventory: { id: invId } as any,
        user: { id: userId } as any,
        canWrite,
      }),
    );
  }
}
