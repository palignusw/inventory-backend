import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from 'src/likes/entities/like.entity';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(Like) private readonly repo: Repository<Like>,
  ) {}

  async addOnce(itemId: number, userId: number) {
    const exists = await this.repo.exists({
      where: { item: { id: itemId }, user: { id: userId } },
    });
    if (!exists) {
      const entity = this.repo.create({
        item: { id: itemId } as any,
        user: { id: userId } as any,
      });
      await this.repo.save(entity);
    }
  }

  remove(itemId: number, userId: number) {
    return this.repo.delete({
      item: { id: itemId } as any,
      user: { id: userId } as any,
    });
  }

  count(itemId: number) {
    return this.repo.count({ where: { item: { id: itemId } } });
  }
}
