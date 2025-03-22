import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/app.config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHealthCheck() {
    return {
      message: 'Welcome to the Orient Hardware POS API',
      version: this.configService.get<IAppConfig>('app')?.version,
      environment: this.configService.get<IAppConfig>('app')?.env,
    };
  }
}
