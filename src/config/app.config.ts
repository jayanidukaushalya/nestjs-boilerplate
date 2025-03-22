import { registerAs } from '@nestjs/config';
import { VERSION } from 'src/common/version';

export interface IAppConfig {
  version: string;
  env: string;
}

export const appConfig = registerAs(
  'app',
  (): IAppConfig => ({
    version: VERSION,
    env: process.env.NODE_ENV as string,
  }),
);
