/**
 * Cache module.
 * @file Cache 全局模块
 * @module processor/cache/module
 * @author Surmon <https://github.com/surmon-china>
 */
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'

import { CacheProvider } from './cache.provider'
import { CacheService } from './cache.service'

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      useClass: CacheProvider,
      inject: [CacheProvider],
    }),
  ],
  providers: [CacheProvider, CacheService],
  exports: [CacheService],
})
export class CacheModule {}