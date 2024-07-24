/**
 * Application module.
 * @file App Module
 * @module app
 * @description The root module of the application that brings together all the modules, controllers, and providers.
 */

import { LoggerModule } from 'nestjs-pretty-logger'

import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

import { AppController } from './app.controller'
import { AllExceptionsFilter } from './common/filters/any-exception.filter'
import { HttpCacheInterceptor } from './common/interceptors/cache.interceptor'
import { JSONTransformerInterceptor } from './common/interceptors/json-transformer.interceptor'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { CacheModule } from './processors/cache/cache.module'
import { DatabaseModule } from './processors/database/database.module'
import { HelperModule } from './processors/helper/helper.module'
import { AppConfigModule } from './processors/app-config/app-config.module'

@Module({
  imports: [
    CacheModule,
    DatabaseModule,
    HelperModule,
    LoggerModule,
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: JSONTransformerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
