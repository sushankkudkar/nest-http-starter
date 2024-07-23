/**
 * Logging Interceptor.
 * @file Interceptor for logging request and response details.
 * @module interceptor/logging
 * @description Logs request and response details in development mode.
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'

import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { HTTP_REQUEST_TIME } from '~/constants/meta.constant'
import { isDev } from '~/utils/environment.utils'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Only log requests and responses in development mode
    if (!isDev) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest()
    if (!request) {
      return next.handle()
    }

    const { method, url } = request
    const now = Date.now()
    const logContent = `${method} -> ${url}`

    // Log the incoming request
    this.logger.debug(`+++ Request: ${logContent}`)
    Reflect.defineMetadata(HTTP_REQUEST_TIME, now, request)

    return next.handle().pipe(
      tap(() => {
        // Log the response time
        const duration = Date.now() - now
        this.logger.debug(`--- Response: ${logContent} +${duration}ms`)
      }),
    )
  }
}
