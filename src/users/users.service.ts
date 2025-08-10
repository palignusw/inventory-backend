import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthProvider } from 'src/enums/provider';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string | null) {
    return this.usersRepository.findByEmail(email);
  }

  findByProvider(p: AuthProvider, id: string) {
    return this.usersRepository.findByProvider(p, id);
  }

  linkProvider(userId: number, p: AuthProvider, id: string) {
    return this.usersRepository.linkProvider(userId, p, id);
  }

  findById(id: number) {
    return this.usersRepository.findById(id);
  }

  create(dto: CreateUserDto) {
    return this.usersRepository.createUser(dto);
  }
}
