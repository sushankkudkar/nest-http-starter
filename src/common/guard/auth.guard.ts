/**
 * JWT Auth Guard.
 * @file JWT authentication guard for NestJS.
 * @module guard/jwt
 * @description Provides JWT authentication protection for routes.
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard as _AuthGuard } from '@nestjs/passport'

import { getNestExecutionContextRequest } from '~/transformers/get-req.transformer'

/**
 * JWTAuthGuard class.
 * @class JWTAuthGuard
 * @extends {_AuthGuard}
 * @implements {CanActivate}
 */
@Injectable()
export class JWTAuthGuard extends _AuthGuard('jwt') implements CanActivate {
  /**
   * Determines if the request can be activated based on JWT authentication.
   * @param context Execution context for the request.
   * @returns {boolean} True if request is authenticated or can be authenticated, otherwise false.
   */
  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context)

    // If user is already set, request is considered authenticated
    if (typeof request.user !== 'undefined') {
      return true
    }

    // Proceed with the default AuthGuard logic
    return super.canActivate(context) as boolean
  }

  /**
   * Retrieves the request object from the execution context.
   * @param context Execution context for the request.
   * @returns {any} The request object.
   */
  getRequest(context: ExecutionContext): any {
    return getNestExecutionContextRequest(context)
  }
}
