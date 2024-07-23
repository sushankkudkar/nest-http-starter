import 'zx/globals'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Document, PaginateModel } from 'mongoose'
import { Consola } from 'nestjs-pretty-logger/lib/consola'

declare global {
  export const isDev: boolean

  export const consola: Consola

  export type MongooseModel<T> = ModelType<T> & PaginateModel<T & Document>
}

export { }
