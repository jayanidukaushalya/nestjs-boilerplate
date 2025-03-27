import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IBaseConfig } from './config/config.types';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<IAppConfig>) {}

  getHealthCheck() {
    return {
      message: 'Welcome to the NestJS Boilerplate API',
      version: this.configService.get<IBaseConfig>('base')?.version,
      environment: this.configService.get<IBaseConfig>('base')?.env,
    };
  }
}
