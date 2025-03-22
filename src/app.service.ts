import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IBaseConfig } from './config/base.config';
import { IAppConfig } from './config/config.schema';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<IAppConfig>) {}

  getHealthCheck() {
    return {
      message: 'Welcome to the Orient Hardware POS API',
      version: this.configService.get<IBaseConfig>('base')?.version,
      environment: this.configService.get<IBaseConfig>('base')?.env,
    };
  }
}
