/**
 * Redis Service.
 * @file Redis Service
 * @module services/redis
 * @description Provides Redis-related services.
 */

import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_CONNECTION_TOKEN } from '~/constants/system.constant';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CONNECTION_TOKEN) private readonly redisClient: RedisClientType
  ) {}

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.redisClient.set(key, value, {
      EX: ttl,
    });
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  getClient(): RedisClientType {
    return this.redisClient;
  }
}
