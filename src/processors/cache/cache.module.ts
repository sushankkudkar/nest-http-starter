import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { RedisModule } from '~/processors/redis/redis.module';
import { RedisService } from '~/processors/redis/redis.service';
import { CacheService } from './cache.service';
import * as redisStore from 'cache-manager-ioredis';

@Global()
@Module({
  imports: [
    RedisModule,
    NestCacheModule.registerAsync({
      imports: [RedisModule],
      useFactory: async (redisService: RedisService) => {
        const redisClient = redisService.getClient();
        return {
          store: redisStore,
          redisInstance: redisClient,
          ttl: 60,
          is_cacheable_value: () => true,
          max: 100,
        };
      },
      inject: [RedisService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}