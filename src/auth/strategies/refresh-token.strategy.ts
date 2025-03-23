import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAuthConfig } from 'src/config/auth.config';
import { IAppConfig } from 'src/config/config.schema';
import { REFRESH_TOKEN_KEY } from '../constants';
import { StrategyKeys } from '../constants/strategy-keys.constants';
import { IJwtPayload } from '../types/jwt-payload.types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  StrategyKeys.JWT_REFRESH_STRATEGY,
) {
  constructor(private readonly configService: ConfigService<IAppConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies[REFRESH_TOKEN_KEY] as string | null;
        },
      ]),
      secretOrKey: configService.get<IAuthConfig>('auth')?.refreshToken.secret as string,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(payload: IJwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}
