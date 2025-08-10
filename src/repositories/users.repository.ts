import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthProvider } from 'src/enums/provider';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string | null) {
    if (!email) return null;
    return this.repo.findOne({ where: { email } });
  }

  findByProvider(provider: AuthProvider, providerId: string) {
    return this.repo.findOne({ where: { provider, providerId } });
  }

  async linkProvider(
    userId: number,
    provider: AuthProvider,
    providerId: string,
  ) {
    await this.repo.update({ id: userId }, { provider, providerId });
    return this.findById(userId);
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async createUser(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }
}
