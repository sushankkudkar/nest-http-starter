/**
 * HttpCache Interceptor.
 * @file Cache interceptor for HTTP requests.
 * @module interceptor/cache
 * @description Caches HTTP GET responses to improve performance and reduce load.
 */

import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  RequestMethod,
} from '@nestjs/common'
import { HttpAdapterHost, Reflector } from '@nestjs/core'

import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'

import { REDIS } from '~/app.config'
import * as META from '~/constants/meta.constant'
import * as SYSTEM from '~/constants/system.constant'
import { CacheService } from '~/processors/cache/cache.service'
import { getNestExecutionContextRequest } from '~/transformers/get-req.transformer'

/**
 * HttpCacheInterceptor class.
 * @class
 * @description Intercepts HTTP requests to apply caching for GET requests.
 */
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpCacheInterceptor.name)

  constructor(
    private readonly cacheManager: CacheService,
    @Inject(SYSTEM.REFLECTOR) private readonly reflector: Reflector,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  /**
   * Intercepts the request and handles caching logic.
   * @param context Execution context for the request.
   * @param next Call handler to proceed with the request.
   * @returns An observable that either returns cached data or the response from the call handler.
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    // Proceed with the call handler if caching is disabled or method is not GET
    const call$ = next.handle()

    if (REDIS.disableApiCache) {
      return call$
    }

    const request = this.getRequest(context)

    // Only cache GET requests
    if (request.method.toLowerCase() !== 'get') {
      return call$
    }

    const handler = context.getHandler()
    const isCacheDisabled = this.reflector.get(META.HTTP_CACHE_DISABLE, handler)
    if (isCacheDisabled) {
      return call$
    }

    const key = this.trackBy(context) || `mx-api-cache:${request.url}`
    const metaTTL = this.reflector.get(META.HTTP_CACHE_TTL_METADATA, handler)
    const ttl = metaTTL || REDIS.httpCacheTTL

    try {
      const cachedValue = await this.cacheManager.get(key)

      return cachedValue
        ? of(cachedValue)
        : call$.pipe(
            tap((response) => {
              if (response) {
                this.cacheManager.set(key, response, ttl)
              }
            }),
          )
    } catch (error) {
      this.logger.error('Cache retrieval or storage failed', error)
      return call$
    }
  }

  /**
   * Determines the cache key to use based on request context and handler metadata.
   * @param context Execution context for the request.
   * @returns The cache key if applicable, otherwise undefined.
   */
  private trackBy(context: ExecutionContext): string | undefined {
    const request = this.getRequest(context)
    const httpServer = this.httpAdapterHost.httpAdapter
    const isHttpApp = Boolean(httpServer?.getRequestMethod)
    const isGetRequest =
      isHttpApp &&
      httpServer.getRequestMethod(request) === RequestMethod[RequestMethod.GET]
    const cacheKey = this.reflector.get(
      META.HTTP_CACHE_KEY_METADATA,
      context.getHandler(),
    )

    return isHttpApp && isGetRequest && cacheKey ? cacheKey : undefined
  }

  /**
   * Retrieves the request object from the execution context.
   * @returns A function to get the request from the execution context.
   */
  private getRequest = getNestExecutionContextRequest.bind(this)
}
