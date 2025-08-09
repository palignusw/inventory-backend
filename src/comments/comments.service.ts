import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsRepository } from 'src/repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}
  create(createCommentDto: CreateCommentDto) {
    return this.commentsRepository.create(createCommentDto);
  }

  findAll() {
    return this.commentsRepository.findAll();
  }

  findOne(id: number) {
    return this.commentsRepository.findOne(id);
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentsRepository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentsRepository.remove(id);
  }
}
