import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthProvider } from 'src/enums/provider';

type OAuthProfile = {
  name: string;
  email: string | null;
  provider: AuthProvider;
  providerId: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthUser(profile: OAuthProfile) {
    const { email, provider, providerId, name } = profile;

    let user = await this.usersService.findByProvider(provider, providerId);
    if (user?.isBlocked) throw new ForbiddenException('User is blocked');

    if (!user && email) {
      const byEmail = await this.usersService.findByEmail(email);
      if (byEmail) {
        if (byEmail.isBlocked) throw new ForbiddenException('User is blocked');
        user = await this.usersService.linkProvider(
          byEmail.id,
          provider,
          providerId,
        );
      }
    }

    if (!user) {
      user = await this.usersService.create({
        name,
        email,
        provider,
        providerId,
      });
    }

    return user;
  }

  async login(user: any) {
    if (user.isBlocked) throw new ForbiddenException('User is blocked'); 

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role ?? 'user',
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
