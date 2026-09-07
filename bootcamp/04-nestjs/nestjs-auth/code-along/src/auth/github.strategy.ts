import { Strategy, type Profile } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.ts';

interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env['GITHUB_CLIENT_ID']!,
      clientSecret: process.env['GITHUB_CLIENT_SECRET']!,
      callbackURL: process.env['GITHUB_CALLBACK_URL']!,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const email = await this.resolvePrimaryEmail(accessToken, profile);
    if (!email) throw new Error('GitHub profile had no public email');
    return this.usersService.findOrCreateByEmail(email);
  }

  // `profile.emails` (from GitHub's basic /user endpoint) can be empty even
  // with the `user:email` scope granted, and when it isn't empty it's not
  // guaranteed to be the account's primary address — so relying on
  // `profile.emails[0]` isn't reliable, and it's the reason a GitHub login
  // isn't guaranteed to land on the same row a Google login for the same
  // person created. Asking GitHub's emails API directly and preferring the
  // primary+verified entry is the closest this app gets to matching what
  // GitHub itself treats as canonical for that account — it narrows the
  // gap but can't fully close it if the two providers report genuinely
  // different addresses.
  private async resolvePrimaryEmail(
    accessToken: string,
    profile: Profile,
  ): Promise<string | undefined> {
    try {
      const response = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${accessToken}` },
      });

      if (response.ok) {
        const emails = (await response.json()) as GithubEmail[];
        const primary = emails.find((e) => e.primary && e.verified);
        if (primary) return primary.email;
      }
    } catch {
      // Fall through to the profile-based fallback below.
    }

    return profile.emails?.[0]?.value;
  }
}
