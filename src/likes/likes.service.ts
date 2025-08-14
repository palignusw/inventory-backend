// src/likes/likes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesRepository } from 'src/repositories/likes.repository';
import { ItemsRepository } from 'src/repositories/items.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly likes: LikesRepository,
    private readonly items: ItemsRepository,
  ) {}

  private async ensureItem(invId: number, itemId: number) {
    const it = await this.items.findById(invId, itemId);
    if (!it) throw new NotFoundException('Item not found');
    return it;
  }

  async like(invId: number, itemId: number, userId: number) {
    await this.ensureItem(invId, itemId);
    await this.likes.addOnce(itemId, userId);
    return { count: await this.likes.count(itemId) };
  }

  async unlike(invId: number, itemId: number, userId: number) {
    await this.ensureItem(invId, itemId);
    await this.likes.remove(itemId, userId);
    return { count: await this.likes.count(itemId) };
  }

  async count(invId: number, itemId: number) {
    await this.ensureItem(invId, itemId);
    return { count: await this.likes.count(itemId) };
  }
}
