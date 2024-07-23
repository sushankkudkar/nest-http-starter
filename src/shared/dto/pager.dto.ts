/**
 * Data Transfer Object for pagination.
 * @file Pager Data Transfer Object (DTO)
 * @module dto/pager
 * @description Defines the structure and validation for pagination parameters.
 */

import { Expose, Transform } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'

export class PagerDto {
  /**
   * Number of items per page.
   * @example 10
   */
  @Min(1)
  @Max(50)
  @IsInt()
  @Expose()
  @Transform(({ value: val }) => (val ? Number.parseInt(val) : 10), {
    toClassOnly: true,
  })
  size?: number

  /**
   * Current page number.
   * @example 1
   */
  @Transform(({ value: val }) => (val ? Number.parseInt(val) : 1), {
    toClassOnly: true,
  })
  @Min(1)
  @IsInt()
  @Expose()
  page?: number

  /**
   * Fields to select.
   * @example 'name,age'
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  select?: string
}
