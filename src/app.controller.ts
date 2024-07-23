/**
 * Application controller.
 * @file App Controller
 * @module controller/app
 * @description Handles basic application routes.
 */

import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  /**
   * Handles the '/health-check' and '/' routes.
   * @returns 'working'
   */
  @Get(['/health-check', '/'])
  ping(): string {
    return 'working'
  }
}
