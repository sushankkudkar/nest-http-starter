/**
 * Global module for helper services.
 * @file Helper Module
 * @module modules/helper
 * @description Provides global services like `HttpService` across the application.
 */

import { Global, Module, Provider } from '@nestjs/common'
import { HttpService } from './helper.http.service'

const providers: Provider[] = [HttpService]

@Module({
  imports: [],
  providers,
  exports: providers,
})
@Global()
export class HelperModule {}
