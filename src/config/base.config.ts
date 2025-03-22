import { registerAs } from '@nestjs/config';
import { VERSION } from 'src/common/version';

export interface IBaseConfig {
  version: string;
  env: string;
}

export const appConfig = registerAs(
  'base',
  (): IBaseConfig => ({
    version: VERSION,
    env: process.env.NODE_ENV as string,
  }),
);
