import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/repositories/users.repository';


@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: number) {
    return this.usersRepository.findById(id);
  }

  create(data: { name: string; email: string }) {
    return this.usersRepository.createUser(data);
  }
}
