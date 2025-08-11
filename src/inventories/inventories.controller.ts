import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

class ShareDto {
  userId: number; // кому даём доступ
  canWrite: boolean; // true=editor, false=viewer
}

@UseGuards(AuthGuard('jwt'))
@Controller('inventories')
export class InventoriesController {
  constructor(private readonly s: InventoriesService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateInventoryDto) {
    // owner = req.user из JwtStrategy
    return this.s.create(dto, req.user);
  }

  @Get('mine')
  mine(@Req() req) {
    return this.s.findMine(req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.s.update(id, req.user.id, dto);
  }

  @Post(':id/share')
  share(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ShareDto,
  ) {
    return this.s.share(id, req.user.id, dto.userId, dto.canWrite);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.s.remove(id, req.user.id);
  }
}
