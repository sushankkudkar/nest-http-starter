/**
 * Interceptor for transforming the structure of HTTP responses.
 * @file Handles response transformation including pagination.
 * @module interceptors/response.interceptor
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { isArrayLike } from 'lodash'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { HTTP_RES_TRANSFORM_PAGINATE } from '~/constants/meta.constant'
import * as SYSTEM from '~/constants/system.constant'
import { transformDataToPaginate } from '~/transformers/paginate.transformer'

export interface Response<T> {
  data: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest()

    if (!request) {
      return next.handle()
    }

    const handler = context.getHandler()

    // Skip requests marked with the bypass decorator
    const bypass = this.reflector.get<boolean>(
      SYSTEM.RESPONSE_PASSTHROUGH_METADATA,
      handler,
    )

    if (bypass) {
      return next.handle()
    }

    return next.handle().pipe(
      map((data) => {
        if (data === undefined) {
          context.switchToHttp().getResponse().status(204)
          return data
        }

        // Apply pagination transformation if applicable
        if (this.reflector.get<boolean>(HTTP_RES_TRANSFORM_PAGINATE, handler)) {
          return transformDataToPaginate(data)
        }

        // Return wrapped data for array-like objects, otherwise return data directly
        return isArrayLike(data) ? { data } : data
      }),
    )
  }
}
