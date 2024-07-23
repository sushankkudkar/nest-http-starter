/**
 * Base model class with Mongoose plugins and schema options.
 * @file Base Model
 * @module models/base
 * @description Provides a base model class with common Mongoose plugins and schema options.
 */

import Paginate from 'mongoose-paginate-v2'
import { modelOptions, plugin } from '@typegoose/typegoose'

// Register Mongoose plugins
@plugin(Paginate)
@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: 'created',
      updatedAt: false,
    },
  },
})
export class BaseModel {
  created?: Date // Date when the model was created
  id?: string // Unique identifier for the model

  /**
   * Protected keys for the model.
   * @returns An array of keys that are considered protected.
   */
  static get protectedKeys() {
    return ['created', 'id', '_id']
  }
}
