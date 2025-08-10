import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: number) {
    return this.usersRepository.findById(id);
  }

  create(dto: CreateUserDto) {
    return this.usersRepository.createUser(dto);
  }
}
