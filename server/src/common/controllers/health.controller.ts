import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { envConfig } from '../config/env.config';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  check() {
    return {
      status: 'ok',
      service: 'Enterprise ERP Backend API',
      databaseConnected: this.dataSource.isInitialized,
      environment: envConfig.nodeEnv,
      timestamp: new Date().toISOString()
    };
  }
}
