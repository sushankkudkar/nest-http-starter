/**
 * Application controller.
 * @file App Controller
 * @module controller/app
 * @description Handles basic application routes.
 */

import { Controller, Get } from '@nestjs/common'
import { CacheService } from './processors/cache/cache.service'

@Controller()
export class AppController {

  constructor(private readonly cs: CacheService){}
  /**
   * Handles the '/health-check' and '/' routes.
   * @returns 'working'
   */
  @Get(['health-check', '/'])
  ping(): string {
    return 'working'
  }
}
