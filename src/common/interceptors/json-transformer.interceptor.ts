/**
 * JSON Transformer Interceptor.
 * @file Interceptor for transforming response bodies into JSON standard format.
 * @module interceptor/json-transformer
 * @description Converts response bodies to use snake_case keys and serializes objects.
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { isArrayLike, isObjectLike } from 'lodash'
import { Observable, map } from 'rxjs'
import snakecaseKeys from 'snakecase-keys'

import { RESPONSE_PASSTHROUGH_METADATA } from '~/constants/system.constant'

@Injectable()
export class JSONTransformerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler()

    // Skip requests that are marked to bypass transformation
    const bypass = this.reflector.get<boolean>(
      RESPONSE_PASSTHROUGH_METADATA,
      handler,
    )
    if (bypass) {
      return next.handle()
    }

    const http = context.switchToHttp()
    if (!http.getRequest()) {
      return next.handle()
    }

    return next.handle().pipe(map((data) => this.serialize(data)))
  }

  private serialize(obj: any): any {
    if (!isObjectLike(obj)) {
      return obj
    }

    if (isArrayLike(obj)) {
      return Array.from(obj).map((item) => this.serialize(item))
    } else {
      // If the object has toJSON or toObject methods, call them
      if (obj.toJSON || obj.toObject) {
        obj = obj.toJSON?.() ?? obj.toObject?.()
      }

      // Remove MongoDB internal version key
      Reflect.deleteProperty(obj, '__v')

      // Serialize object properties
      for (const key of Object.keys(obj)) {
        const val = obj[key]

        if (isObjectLike(val)) {
          if (val.toJSON) {
            obj[key] = val.toJSON()
            if (!isObjectLike(obj[key])) {
              continue
            }
            Reflect.deleteProperty(obj[key], '__v')
          }
          obj[key] = this.serialize(obj[key])
        }
      }

      // Convert keys to snake_case
      obj = snakecaseKeys(obj)
    }

    return obj
  }
}
