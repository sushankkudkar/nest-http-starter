/**
 * Authentication decorator.
 * @file Authentication decorator
 * @module decorator/auth
 */

import { UseGuards, applyDecorators } from '@nestjs/common'

import { JWTAuthGuard } from '../guard/auth.guard'

/**
 * Authentication decorator for protecting routes.
 * @function Auth
 * @description Applies the JWTAuthGuard to a route or class.
 * @returns MethodDecorator | ClassDecorator | PropertyDecorator
 */
export function Auth() {
  // List of decorators to be applied
  const decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [
    UseGuards(JWTAuthGuard),
  ]

  // Apply all decorators
  return applyDecorators(...decorators)
}
