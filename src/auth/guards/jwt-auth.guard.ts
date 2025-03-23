import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { StrategyKeys } from '../constants/strategy-keys.constants';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JWTAuthGuard extends AuthGuard(StrategyKeys.JWT_ACCESS_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
