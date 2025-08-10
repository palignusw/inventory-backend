import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/decorators/roles';
import { Public } from 'src/decorators/public';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Get('ping-public')
  pingPublic() {
    return { ok: true, who: 'guest or user' };
  }

  @Get('me')
  me(@Req() req) {
    return req.user;
  }

  @Roles('admin')
  @Get('admin-only')
  adminOnly() {
    return { secret: 'for admin' };
  }

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
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
