// src/items/items.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ItemsRepository } from 'src/repositories/items.repository';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

function toText(v?: Record<string, any>): string {
  if (!v) return '';
  return Object.entries(v)
    .map(([k, val]) => `${k}:${String(val ?? '')}`)
    .join(' ');
}

@Injectable()
export class ItemsService {
  constructor(private readonly repo: ItemsRepository) {}

  list(invId: number) {
    return this.repo.list(invId);
  }

  async getOne(invId: number, id: number) {
    const it = await this.repo.findById(invId, id);
    if (!it) throw new NotFoundException('Item not found');
    return it;
  }

  async create(invId: number, dto: CreateItemDto) {
    if (await this.repo.existsByCustomId(invId, dto.customId)) {
      throw new BadRequestException('customId already used in this inventory');
    }
    return this.repo.createForInventory(invId, {
      customId: dto.customId,
      fieldValues: dto.fieldValues ?? null,
      fieldValuesText: toText(dto.fieldValues) || '',
    });
  }

  async update(invId: number, id: number, dto: UpdateItemDto) {
    const current = await this.repo.findById(invId, id);
    if (!current) throw new NotFoundException('Item not found');

    if (dto.customId && dto.customId !== current.customId) {
      if (await this.repo.existsByCustomId(invId, dto.customId)) {
        throw new BadRequestException(
          'customId already used in this inventory',
        );
      }
    }

    const patch: any = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined),
    );

    if (dto.fieldValues !== undefined) {
      patch.fieldValuesText = toText(dto.fieldValues);
    }

    return this.repo.updateWithVersion(invId, id, patch);
  }

  async remove(invId: number, id: number) {
    const it = await this.repo.findById(invId, id);
    if (!it) throw new NotFoundException('Item not found');
    await this.repo.remove(it);
    return { ok: true };
  }
}
