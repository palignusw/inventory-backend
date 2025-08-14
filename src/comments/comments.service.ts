import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'src/enums/role';
import { CommentsRepository } from 'src/repositories/comments.repository';
import { InventoryRepository } from 'src/repositories/inventories.repository';

const MAX_LIMIT = 100;

@Injectable()
export class CommentsService {
  constructor(
    private readonly repo: CommentsRepository,
    private readonly inventories: InventoryRepository,
  ) {}

  private async ensureInventory(invId: number) {
    const exists = await this.inventories.exists(invId);
    if (!exists) throw new NotFoundException('Inventory not found');
  }

  private assertCanModify(
    authorId: number | undefined,
    user: { id: number; role: Role },
  ) {
    if (user.role === 'admin') return;
    if (authorId === user.id) return;
    throw new ForbiddenException();
  }

  async list(invId: number, offset = 0, limit = 20) {
    await this.ensureInventory(invId);
    return this.repo.list(invId, offset, Math.min(limit, MAX_LIMIT));
  }

  async create(invId: number, userId: number, content: string) {
    await this.ensureInventory(invId);
    return this.repo.createForInventory(invId, userId, content);
  }

  async update(
    invId: number,
    id: number,
    user: { id: number; role: Role },
    content: string,
  ) {
    const comment = await this.repo.findById(invId, id);
    if (!comment) throw new NotFoundException('Comment not found');
    this.assertCanModify(comment.author?.id, user);
    return this.repo.updateContent(id, content);
  }

  async remove(invId: number, id: number, user: { id: number; role: Role }) {
    const comment = await this.repo.findById(invId, id);
    if (!comment) throw new NotFoundException('Comment not found');
    this.assertCanModify(comment.author?.id, user);
    await this.repo.remove(id);
    return { ok: true };
  }
}
