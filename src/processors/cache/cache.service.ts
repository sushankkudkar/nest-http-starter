import { Cache } from 'cache-manager';
import { Redis } from 'ioredis';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

// Cache client manager

// Accessor
export type TCacheKey = string;
export type TCacheResult<T> = Promise<T | undefined>;

/**
 * @class CacheService
 * @classdesc Handles caching service
 * @example CacheService.get(CacheKey).then()
 * @example CacheService.set(CacheKey).then()
 */
@Injectable()
export class CacheService {
  private cache!: Cache;
  private logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) cache: Cache) {
    this.cache = cache;
    this.redisClient.on('ready', () => {
      this.logger.log('Redis is ready!');
    });
  }

  private get redisClient(): Redis {
    // @ts-expect-error
    return this.cache.store.getClient();
  }

  public async get<T>(key: TCacheKey): TCacheResult<T> {
    return await this.cache.get(key);
  }

  public async set(key: TCacheKey, value: any, ttl?: number | undefined) {
    return await this.cache.set(key, value, ttl || 0);
  }

  public getClient() {
    return this.redisClient;
  }
}
