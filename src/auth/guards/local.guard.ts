import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyKeys } from '../constants/strategy-keys.constants';

@Injectable()
export class LocalGuard extends AuthGuard(StrategyKeys.LOCAL_STRATEGY) {}
