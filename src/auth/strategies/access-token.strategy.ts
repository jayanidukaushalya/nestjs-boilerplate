import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedError } from 'src/common/exceptions/unauthorized-exception copy';
import { IAuthConfig } from 'src/config/auth.config';
import { IAppConfig } from 'src/config/config.schema';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { StrategyKeys } from '../constants/strategy-keys.constants';
import { IJwtPayload } from '../types/jwt-payload.types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  StrategyKeys.JWT_ACCESS_STRATEGY,
) {
  constructor(
    private readonly configService: ConfigService<IAppConfig>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<IAuthConfig>('auth')?.accessToken.secret as string,
      ignoreExpiration: false,
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const user = await this.userService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedError();
    }

    return user;
  }
}
