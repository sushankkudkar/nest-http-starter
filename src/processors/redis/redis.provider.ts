import { createClient, RedisClientType } from 'redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { REDIS_CONNECTION_TOKEN } from '~/constants/system.constant';
import { logger } from '~/global/consola.global';

@Injectable()
class RedisProvider {
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    const redisConfig = this.configService.get('app.redis');
    if (!redisConfig) {
      throw new Error('Redis configuration is not defined in the configuration.');
    }

    this.client = createClient({
      url: `redis://${redisConfig.host}:${redisConfig.port}`,
      password: redisConfig.password,
      database: redisConfig.database
    });

    this.client.on('error', (err) => logger.error('Redis Client Error', err));
  }

  async connect() {
    await this.client.connect();
    logger.info('Connected to Redis');
  }

  getClient() {
    return this.client;
  }
}

export const redisProvider = {
  provide: REDIS_CONNECTION_TOKEN,
  useFactory: async (configService: ConfigService) => {
    const provider = new RedisProvider(configService);
    await provider.connect();
    return provider.getClient();
  },
  inject: [ConfigService],
};