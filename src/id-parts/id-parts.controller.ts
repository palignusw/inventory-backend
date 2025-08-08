import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IdPartsService } from './id-parts.service';
import { CreateIdPartDto } from './dto/create-id-part.dto';
import { UpdateIdPartDto } from './dto/update-id-part.dto';

@Controller('id-parts')
export class IdPartsController {
  constructor(private readonly idPartsService: IdPartsService) {}

  @Post()
  create(@Body() createIdPartDto: CreateIdPartDto) {
    return this.idPartsService.create(createIdPartDto);
  }

  @Get()
  findAll() {
    return this.idPartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.idPartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIdPartDto: UpdateIdPartDto) {
    return this.idPartsService.update(+id, updateIdPartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.idPartsService.remove(+id);
  }
}
