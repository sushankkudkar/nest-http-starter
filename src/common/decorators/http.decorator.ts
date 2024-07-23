/**
 * Custom decorators for HTTP response handling.
 * @file Custom decorators for handling HTTP responses in a NestJS application.
 * @module decorators/http
 */

import { SetMetadata } from '@nestjs/common'

import { HTTP_RES_TRANSFORM_PAGINATE } from '~/constants/meta.constant'
import * as SYSTEM from '~/constants/system.constant'

/**
 * Decorator to indicate that a method's response should be transformed using pagination.
 * @param target - The prototype of the class.
 * @param key - The name of the method.
 * @param descriptor - The property descriptor of the method.
 * @returns MethodDecorator
 */
export const Paginator: MethodDecorator = (
  target,
  key,
  descriptor: PropertyDescriptor,
) => {
  SetMetadata(HTTP_RES_TRANSFORM_PAGINATE, true)(descriptor.value)
}

/**
 * Decorator to bypass response body transformation.
 * @description Marks the method's response to skip any response body transformation.
 * @param target - The prototype of the class.
 * @param key - The name of the method.
 * @param descriptor - The property descriptor of the method.
 * @returns MethodDecorator
 */
export const Bypass: MethodDecorator = (
  target,
  key,
  descriptor: PropertyDescriptor,
) => {
  SetMetadata(SYSTEM.RESPONSE_PASSTHROUGH_METADATA, true)(descriptor.value)
}

/**
 * HTTP Decorators for response handling.
 * @type {Object}
 */
export const HTTPDecorators = {
  Paginator,
  Bypass,
}
