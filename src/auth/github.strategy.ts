import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from './auth.service';
import { AuthProvider } from 'src/enums/provider';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/redirect',
      scope: ['user:email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const user = await this.authService.validateOAuthUser({
      email: profile.emails?.[0]?.value,
      name: profile.displayName || profile.username,
      provider: AuthProvider.GITHUB,
      providerId: profile.id,
    });
    done(null, user);
  }
}
