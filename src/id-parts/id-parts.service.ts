import { Injectable } from '@nestjs/common';
import { CreateIdPartDto } from './dto/create-id-part.dto';
import { UpdateIdPartDto } from './dto/update-id-part.dto';

@Injectable()
export class IdPartsService {
  create(createIdPartDto: CreateIdPartDto) {
    return 'This action adds a new idPart';
  }

  findAll() {
    return `This action returns all idParts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} idPart`;
  }

  update(id: number, updateIdPartDto: UpdateIdPartDto) {
    return `This action updates a #${id} idPart`;
  }

  remove(id: number) {
    return `This action removes a #${id} idPart`;
  }
}
