/**
 * AllowAllCorsInterceptor class.
 * @file CORS interceptor for Fastify.
 * @module interceptor/cors
 * @description Intercepts requests to allow CORS for all origins and methods.
 */

import { RequestMethod } from '@nestjs/common'
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common'

import type { FastifyReply, FastifyRequest } from 'fastify'

// Extend FastifyRequest interface to include a CORS property
declare module 'fastify' {
  // @ts-ignore
  interface FastifyRequest {
    cors?: boolean
  }
}

/**
 * Interceptor to handle CORS settings for Fastify requests.
 * @class AllowAllCorsInterceptor
 * @implements {NestInterceptor}
 */
export class AllowAllCorsInterceptor implements NestInterceptor {
  /**
   * Intercepts requests to set CORS headers and flags.
   * @param context Execution context for the request.
   * @param next Call handler to proceed with the request.
   * @returns Observable that handles the request.
   */
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const handle = next.handle()
    const request = context.switchToHttp().getRequest() as FastifyRequest
    const response: FastifyReply<any> = context.switchToHttp().getResponse()

    // Allowed HTTP methods for CORS
    const allowedMethods = [
      RequestMethod.GET,
      RequestMethod.HEAD,
      RequestMethod.PUT,
      RequestMethod.PATCH,
      RequestMethod.POST,
      RequestMethod.DELETE,
    ]

    // Allowed HTTP headers for CORS
    const allowedHeaders = [
      'Authorization',
      'Origin',
      'No-Cache',
      'X-Requested-With',
      'If-Modified-Since',
      'Last-Modified',
      'Cache-Control',
      'Expires',
      'Content-Type',
    ]

    // Set CORS headers
    response.headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': allowedHeaders.join(','),
      'Access-Control-Allow-Methods': allowedMethods.join(','),
      'Access-Control-Max-Age': '86400',
    })

    // Flag request as CORS-enabled
    request.cors = true

    // Proceed with the request handling
    return handle
  }
}
