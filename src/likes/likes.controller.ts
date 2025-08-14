import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('inventories/:invId/items/:itemId')
export class LikesController {
  constructor(private readonly s: LikesService) {}

  @Post('like')
  like(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Req() req: any,
  ) {
    return this.s.like(invId, itemId, req.user.id);
  }

  @Delete('like')
  unlike(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Req() req: any,
  ) {
    return this.s.unlike(invId, itemId, req.user.id);
  }

  @Get('likes/count')
  count(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.s.count(invId, itemId);
  }
}
