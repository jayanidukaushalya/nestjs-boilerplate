import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyKeys } from '../constants/strategy-keys.constants';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(StrategyKeys.JWT_REFRESH_STRATEGY) {}
