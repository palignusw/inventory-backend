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
      relations: { inventory: { createdBy: true }, user: true },
    });
  }

  async upsert(invId: number, userId: number, canWrite: boolean) {
    console.log(userId);
    if (!Number.isInteger(userId)) throw new Error('userId is required');
    const existing = await this.find(invId, userId);
    if (existing) {
      existing.canWrite = !!canWrite;
      return this.repo.save(existing);
    }
    const row = this.repo.create({
      inventory: { id: invId } as any,
      user: { id: userId } as any,
      canWrite: !!canWrite,
    });
    return this.repo.save(row);
  }
}
