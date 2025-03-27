import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAppConfig, IAuthConfig } from 'src/config/config.types';
import { UserService } from 'src/user/user.service';
import { REFRESH_TOKEN_KEY } from '../constants';
import { StrategyKeys } from '../constants/strategy-keys.constants';
import { IJwtPayload } from '../types/jwt-payload.types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  StrategyKeys.JWT_REFRESH_STRATEGY,
) {
  constructor(
    private readonly configService: ConfigService<IAppConfig>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies[REFRESH_TOKEN_KEY] as string | null;
        },
      ]),
      secretOrKey: configService.get<IAuthConfig>('auth')?.refreshToken.secret as string,
      ignoreExpiration: false,
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.userService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
