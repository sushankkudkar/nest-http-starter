/**
 * All Exceptions Filter.
 * @file Global exception filter for handling and logging errors.
 * @module filter/all-exceptions
 * @description Catches and handles all exceptions thrown in the application.
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyReply, FastifyRequest } from 'fastify'

import { HTTP_REQUEST_TIME } from '~/constants/meta.constant'
import { REFLECTOR } from '~/constants/system.constant'

import { getIp } from '~/utils/ip.util'
import { LoggingInterceptor } from '~/common/interceptors/logging.interceptor'

/**
 * Custom error type.
 */
type MyError = {
  readonly status: number
  readonly statusCode?: number
  readonly message?: string
}

/**
 * Exception filter that handles all exceptions and logs them.
 * @class AllExceptionsFilter
 * @implements {ExceptionFilter}
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  constructor(@Inject(REFLECTOR) private readonly reflector: Reflector) {}

  /**
   * Handles the exception thrown and sends an appropriate response.
   * @param exception The exception thrown.
   * @param host The arguments host containing the request and response.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   */
  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return response.status(HttpStatus.OK).send()
    }

    // Determine the status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception as MyError)?.status ||
          (exception as MyError)?.statusCode ||
          HttpStatus.INTERNAL_SERVER_ERROR

    // Determine the error message
    const message =
      (exception as any)?.response?.message ||
      (exception as MyError)?.message ||
      'Unknown Error'

    const url = request.raw.url!

    // Log the error
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception, 'Internal Server Error')
    } else {
      const ip = getIp(request)
      this.logger.warn(
        `IP: ${ip} Error Info: (${status}) ${message} Path: ${decodeURI(url)}`,
      )
    }

    // Log the request duration if available
    const prevRequestTs = this.reflector.get(HTTP_REQUEST_TIME, request as any)
    if (prevRequestTs) {
      const content = `${request.method} -> ${request.url}`
      Logger.debug(
        `--- ResponseError: ${content} +${Date.now() - prevRequestTs}ms`,
        LoggingInterceptor.name,
      )
    }

    // Send the error response
    const res = (exception as any).response
    response
      .status(status)
      .type('application/json')
      .send({
        ok: 0,
        code: res?.code || status,
        chMessage: res?.chMessage || res?.message,
        message,
      })
  }
}
