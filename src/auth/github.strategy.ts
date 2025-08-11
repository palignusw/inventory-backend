import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from './auth.service';
import { AuthProvider } from 'src/enums/provider';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private auth: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:3000/auth/github/redirect',
      scope: ['user:email'],
    });
  }

  async validate(_at: string, _rt: string, profile: any, done: any) {
    const email = profile.emails?.[0]?.value ?? null;
    const name =
      profile.displayName || profile.username || email || 'GitHub User';

    const user = await this.auth.validateOAuthUser({
      name,
      email,
      provider: AuthProvider.GITHUB,
      providerId: String(profile.id),
    });

    done(null, user);
  }
}
