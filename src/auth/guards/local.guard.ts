import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { StrategyKeys } from '../constants/strategy-keys.constants';
import { LoginRequestBodyDto } from '../dtos/login-request.dto';

@Injectable()
export class LocalGuard extends AuthGuard(StrategyKeys.LOCAL_STRATEGY) {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const { username, password } = request.body as LoginRequestBodyDto;

    if (!username || !password) {
      return true;
    }

    return super.canActivate(context);
  }
}
