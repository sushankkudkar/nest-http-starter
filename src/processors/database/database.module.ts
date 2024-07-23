/**
 * @file Database module
 * @module module/database
 * @description Provides database services and configuration for the application.
 */

import { Global, Module } from '@nestjs/common'

import { getProviderByTypegooseClass } from '~/transformers/model.transformer'
import { databaseProvider } from './database.provider'
import { DatabaseService } from './database.service'

// Define an empty array of models
const models = [].map((model) => getProviderByTypegooseClass(model))

@Global()
@Module({
  providers: [DatabaseService, databaseProvider, ...models],
  exports: [DatabaseService, databaseProvider, ...models],
})
export class DatabaseModule {}
