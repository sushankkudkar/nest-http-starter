/**
 * NestJS execution context utilities.
 * @file NestJS Execution Context Utilities
 * @module utils/context
 * @description Provides a utility function to extract the Fastify request object from the NestJS execution context.
 */

import type { ExecutionContext } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

/**
 * Retrieves the Fastify request object from a NestJS execution context.
 * @param context - The NestJS execution context.
 * @returns The Fastify request object, augmented with additional properties if necessary.
 */
export function getNestExecutionContextRequest(
  context: ExecutionContext,
): FastifyRequest & Record<string, any> {
  return context.switchToHttp().getRequest<FastifyRequest>()
}
