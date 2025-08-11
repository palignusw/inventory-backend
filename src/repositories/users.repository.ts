import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthProvider } from 'src/enums/provider';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  private normalizeEmail(email: string | null) {
    return email ? email.trim().toLowerCase() : null;
  }

  async findByEmail(email: string | null) {
    const e = this.normalizeEmail(email);
    if (!e) return null;
    return this.repo.findOne({ where: { email: e } });
  }

  findByProvider(provider: AuthProvider, providerId: string) {
    return this.repo.findOne({ where: { provider, providerId } });
  }

  async linkProvider(
    userId: number,
    provider: AuthProvider,
    providerId: string,
  ) {
    const taken = await this.repo.findOne({ where: { provider, providerId } });
    if (taken && taken.id !== userId) {
      throw new ConflictException(
        'Этот провайдер уже привязан к другому аккаунту',
      );
    }
    await this.repo.update(userId, { provider, providerId });
    return this.findById(userId);
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async createUser(dto: CreateUserDto) {
    const user = this.repo.create({
      ...dto,
      name: dto.name?.trim(),
      email: this.normalizeEmail(dto.email ?? null),
    });
    return this.repo.save(user);
  }
}
