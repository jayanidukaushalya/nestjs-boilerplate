import { registerAs } from '@nestjs/config';
import { VERSION } from 'src/common/version';
import { IBaseConfig } from './config.types';

export const appConfig = registerAs(
  'base',
  (): IBaseConfig => ({
    version: VERSION,
    env: process.env.NODE_ENV as string,
  }),
);
