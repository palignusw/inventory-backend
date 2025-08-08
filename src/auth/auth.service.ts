import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: any) {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        name: displayName,
        email,
      });
    }

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
