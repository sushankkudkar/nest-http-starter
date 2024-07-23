import { Cache } from 'cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisService } from '~/processors/redis/redis.service';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private cache: Cache;

  constructor(
    @Inject(CACHE_MANAGER) cache: Cache,
    private readonly redisService: RedisService
  ) {
    this.cache = cache;
    this.redisService.getClient().on('ready', () => {
      this.logger.log('Redis is ready!');
    });
  }

  private get redisClient(): Redis {
    return this.redisService.getClient() as unknown as Redis;
  }

  public async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key);
  }

  public async set(key: string, value: any, ttl: number = 0): Promise<void> {
    return this.cache.set(key, value, ttl);
  }

  public getClient(): Redis {
    return this.redisClient;
  }
}