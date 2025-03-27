import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface IBaseConfig {
  version: string;
  env: string;
}

export interface IAuthConfig {
  accessToken: {
    secret: string;
    expiresIn: string;
  };
  refreshToken: {
    secret: string;
    expiresIn: string;
  };
}

export interface IAppConfig {
  base: IBaseConfig;
  db: TypeOrmModuleOptions;
  auth: IAuthConfig;
}
