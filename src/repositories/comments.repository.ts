import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';
import { Comment } from 'src/comments/entities/comment.entity';
import { Repository } from 'typeorm';

export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const newComment = this.repository.create(createCommentDto);
    return this.repository.save(newComment);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.repository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.repository.softDelete(id);
  }
}
