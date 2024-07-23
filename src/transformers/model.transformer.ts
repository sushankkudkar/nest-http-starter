/**
 * Model transformation and helper functions.
 * @file Model Transform & Helper
 * @module transformer/model
 * @description Provides utilities for converting Typegoose models into NestJS providers and injection tokens.
 */

import { Inject } from '@nestjs/common'
import { getModelForClass } from '@typegoose/typegoose'

import {
  DB_CONNECTION_TOKEN,
  DB_MODEL_TOKEN_SUFFIX,
} from '~/constants/system.constant'

import type { Connection } from 'mongoose'
import type { Provider } from '@nestjs/common'

// Interface representing a Typegoose class.
export interface TypegooseClass {
  new (...args: any[]): any
}

/**
 * Generates a token for the model based on its name.
 * @param modelName - The name of the model.
 * @returns The model token string.
 */
export function getModelToken(modelName: string): string {
  return modelName + DB_MODEL_TOKEN_SUFFIX
}

/**
 * Creates a provider object for a Typegoose class.
 * @param typegooseClass - The Typegoose class to create a provider for.
 * @returns A NestJS provider for the Typegoose model.
 */
export function getProviderByTypegooseClass(
  typegooseClass: TypegooseClass,
): Provider {
  return {
    provide: getModelToken(typegooseClass.name),
    useFactory: (connection: Connection) =>
      getModelForClass(typegooseClass, { existingConnection: connection }),
    inject: [DB_CONNECTION_TOKEN],
  }
}

/**
 * A decorator for injecting a Typegoose model into a service or controller.
 * @param model - The Typegoose class to inject.
 * @returns A NestJS `Inject` decorator for the model token.
 */
export function InjectModel(model: TypegooseClass) {
  return Inject(getModelToken(model.name))
}
