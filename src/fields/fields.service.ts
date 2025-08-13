// src/fields/fields.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFieldDto } from './dto/update-field.dto';
import { CreateFieldDto } from './dto/create-field.dto';
import { FieldsRepository } from 'src/repositories/fields.repository';

const LIMIT_PER_TYPE = 3;

@Injectable()
export class FieldsService {
  constructor(private readonly repo: FieldsRepository) {}

  list(invId: number) {
    return this.repo.findAll(invId);
  }

  async getOne(invId: number, id: number) {
    const field = await this.repo.findById(invId, id);
    if (!field) throw new NotFoundException('Поле не найдено');
    return field;
  }

  async create(invId: number, dto: CreateFieldDto) {
    const count = await this.repo.countByType(invId, dto.type);
    if (count >= LIMIT_PER_TYPE) {
      throw new BadRequestException(
        `Лимит для типа ${dto.type} исчерпан (≤${LIMIT_PER_TYPE})`,
      );
    }

    const order = await this.repo.nextOrder(invId);
    return this.repo.createForInventory(invId, { ...dto, order });
  }

  async update(invId: number, id: number, dto: UpdateFieldDto) {
    const current = await this.repo.findById(invId, id);
    if (!current) throw new NotFoundException('Поле не найдено');

    if (dto.type && dto.type !== current.type) {
      const count = await this.repo.countByType(invId, dto.type);
      if (count >= LIMIT_PER_TYPE) {
        throw new BadRequestException(
          `Лимит для типа ${dto.type} исчерпан (≤${LIMIT_PER_TYPE})`,
        );
      }
    }

    const patch = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined),
    );

    return this.repo.updateWithVersion(invId, id, patch);
  }

  async remove(invId: number, id: number) {
    const field = await this.repo.findById(invId, id);
    if (!field) throw new NotFoundException('Поле не найдено');

    await this.repo.remove(field);

    const all = await this.repo.findAll(invId);
    for (let i = 0; i < all.length; i++) {
      if (all[i].order !== i) {
        all[i].order = i;
        await this.repo.save(all[i]);
      }
    }
    return { ok: true };
  }

  async reorder(invId: number, ids: number[]) {
    const all = await this.repo.findAll(invId);
    if (ids.length !== all.length || new Set(ids).size !== ids.length) {
      throw new BadRequestException('ids должны содержать все поля без дублей');
    }
    const map = new Map(all.map((f) => [f.id, f]));
    ids.forEach((id, idx) => {
      const f = map.get(id);
      if (!f)
        throw new BadRequestException(`Поле ${id} не принадлежит инвентарю`);
      f.order = idx;
    });
    // сохраняем
    for (const f of map.values()) await this.repo.save(f);
    return this.repo.findAll(invId);
  }
}
