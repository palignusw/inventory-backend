import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.usersService.findById(+id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get('email/:email')
  async getByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Post()
  async create(@Body() body: { name: string; email: string }) {
    return this.usersService.create(body);
  }
}
