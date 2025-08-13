import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { User } from 'src/users/entities/user.entity';
import { InventoryRepository } from 'src/repositories/inventories.repository';
import { AccessRepository } from 'src/repositories/access.repository';

@Injectable()
export class InventoriesService {
  constructor(
    private readonly invRepo: InventoryRepository,
    private readonly accessRepo: AccessRepository,
  ) {}

  async create(dto: CreateInventoryDto, owner: User) {
    const inv = await this.invRepo.createBasic(dto, owner);
    await this.accessRepo.upsert(inv.id, owner.id, true);
    return inv;
  }

  findMine(userId: number) {
    return this.invRepo.findMine(userId);
  }

  async update(invId: number, userId: number, dto: UpdateInventoryDto) {
    const acc = await this.accessRepo.find(invId, userId);
    if (!acc) throw new ForbiddenException();
    const isOwner = acc.inventory.createdBy?.id === userId;
    if (!isOwner && !acc.canWrite) throw new ForbiddenException();

    return this.invRepo.updateWithVersion(invId, dto);
  }

  async share(
    invId: number,
    ownerId: number,
    targetUserId: number,
    canWrite: boolean,
  ) {
    const inv = await this.invRepo.findByIdWithOwner(invId);
    if (!inv) throw new NotFoundException();
    if (inv.createdBy.id !== ownerId) throw new ForbiddenException();
    return this.accessRepo.upsert(invId, targetUserId, canWrite);
  }

  remove(invId: number, ownerId: number) {
    return this.invRepo.removeByOwner(invId, ownerId);
  }
}
