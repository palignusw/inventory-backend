import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('inventories/:invId/comments')
export class CommentsController {
  constructor(private readonly s: CommentsService) {}

  @Get()
  list(
    @Param('invId', ParseIntPipe) invId: number,
    @Query('offset') offset = '0',
    @Query('limit') limit = '20',
  ) {
    return this.s.list(invId, Number(offset), Number(limit));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('invId', ParseIntPipe) invId: number,
    @Req() req: Request & { user: { id: number } },
    @Body() dto: CreateCommentDto,
  ) {
    return this.s.create(invId, req.user.id, dto.content);
  }

  @Put(':id')
  update(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.s.update(
      invId,
      id,
      { id: req.user.id, role: req.user.role },
      dto.content,
    );
  }

  @Delete(':id')
  remove(
    @Param('invId', ParseIntPipe) invId: number,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.s.remove(invId, id, { id: req.user.id, role: req.user.role });
  }
}
