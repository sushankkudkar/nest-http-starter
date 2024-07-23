/**
 * Business Exception Class.
 * @file Custom business exception for handling application-specific errors.
 * @module exception/biz-exception
 * @description Extends HttpException to provide application-specific error handling.
 */

import { HttpException } from '@nestjs/common'

import { ErrorCode } from '~/constants/error-code.constant'
import type { ErrorCodeEnum } from '~/constants/error-code.constant'

/**
 * Custom exception for business logic errors.
 * @class BizException
 * @extends HttpException
 */
export class BizException extends HttpException {
  /**
   * Creates an instance of BizException.
   * @param {ErrorCodeEnum} code - The error code representing the specific error.
   */
  constructor(code: ErrorCodeEnum) {
    // Retrieve error details from ErrorCode constant
    const [message, chMessage, status] = ErrorCode[code]

    // Call the parent class constructor with the appropriate error details
    super(HttpException.createBody({ code, message, chMessage }), status)
  }
}
