/**
 * Data Transfer Objects for ID validation.
 * @file ID Validation DTOs
 * @module dto/id
 * @description Defines DTOs for validating MongoDB IDs and integer or MongoDB IDs.
 */

import { Transform } from 'class-transformer'
import { IsDefined, IsMongoId, isMongoId } from 'class-validator'
import { UnprocessableEntityException } from '@nestjs/common'

export class MongoIdDto {
  /**
   * MongoDB Object ID.
   * @example '507f1f77bcf86cd799439011'
   */
  @IsMongoId()
  id: string
}

export class IntIdOrMongoIdDto {
  /**
   * ID that can be either a MongoDB Object ID or an integer.
   * @example '507f1f77bcf86cd799439011' or 123
   * @throws UnprocessableEntityException if the ID is invalid
   */
  @IsDefined()
  @Transform(({ value }) => {
    if (isMongoId(value)) {
      return value
    }
    const nid = +value
    if (!Number.isNaN(nid)) {
      return nid
    }
    throw new UnprocessableEntityException('Invalid id')
  })
  id: string | number
}
