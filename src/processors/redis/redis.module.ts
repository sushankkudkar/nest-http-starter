import { Global, Module } from '@nestjs/common';

import { redisProvider } from './redis.provider';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, redisProvider],
  exports: [RedisService, redisProvider],
})
export class RedisModule {}
