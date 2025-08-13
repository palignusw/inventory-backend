// src/fields/fields.controller.ts
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
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { ReorderFieldsDto } from './dto/reorder-fields.dto';

@Controller('inventories/:invId/fields')
export class FieldsController {
  constructor(private readonly s: FieldsService) {}

  @Get() list(@Param('invId', ParseIntPipe) invId: number) {
    return this.s.list(invId);
  }

  @Get(':id')
  getOne(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.s.getOne(invId, id);
  }
  @Post() create(
    @Param('invId', ParseIntPipe) invId: number,
    @Body() dto: CreateFieldDto,
  ) {
    return this.s.create(invId, dto);
  }
  @Put(':id') update(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFieldDto,
  ) {
    return this.s.update(invId, id, dto);
  }
  @Delete(':id') remove(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.s.remove(invId, id);
  }
  @Post('reorder') reorder(
    @Param('invId', ParseIntPipe) invId: number,
    @Body() dto: ReorderFieldsDto,
  ) {
    return this.s.reorder(invId, dto.ids);
  }
}
