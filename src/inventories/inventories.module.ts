import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryRepository } from 'src/repositories/inventories.repository';
import { AccessModule } from 'src/access/access.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), AccessModule],
  controllers: [InventoriesController],
  providers: [InventoriesService, InventoryRepository],
})
export class InventoriesModule {}
