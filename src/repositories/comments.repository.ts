import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment) private readonly repo: Repository<Comment>,
  ) {}

  list(invId: number, offset = 0, limit = 20) {
    return this.repo.find({
      where: { inventory: { id: invId } },
      order: { createdAt: 'ASC' }, // линейная лента
      skip: offset,
      take: limit,
      relations: ['author'],
    });
  }

  findById(invId: number, id: number) {
    return this.repo.findOne({
      where: { id, inventory: { id: invId } },
      relations: ['author'],
    });
  }

  createForInventory(invId: number, authorId: number | null, content: string) {
    const c = this.repo.create({
      content,
      inventory: { id: invId } as any,
      author: authorId ? ({ id: authorId } as any) : null,
      isEdited: false,
    });
    return this.repo.save(c);
  }

  async updateContent(id: number, content: string) {
    await this.repo.update({ id }, { content, isEdited: true });
    return this.repo.findOneByOrFail({ id });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
