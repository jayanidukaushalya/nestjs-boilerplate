import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { StrategyKeys } from '../constants/strategy-keys.constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, StrategyKeys.LOCAL_STRATEGY) {
  constructor(private authService: AuthService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.login({
      username,
      password,
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
