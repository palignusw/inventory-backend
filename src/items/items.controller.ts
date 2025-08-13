// src/items/items.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('inventories/:invId/items')
export class ItemsController {
  constructor(private readonly s: ItemsService) {}

  @Get() list(@Param('invId', ParseIntPipe) invId: number) {
    return this.s.list(invId);
  }
  @Get(':id') getOne(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.s.getOne(invId, id);
  }
  @Post() create(
    @Param('invId', ParseIntPipe) invId: number,
    @Body() dto: CreateItemDto,
  ) {
    return this.s.create(invId, dto);
  }
  @Put(':id') update(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.s.update(invId, id, dto);
  }
  @Delete(':id') remove(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.s.remove(invId, id);
  }
}
