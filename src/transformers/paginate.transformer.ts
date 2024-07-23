/**
 * Pagination transformation utilities.
 * @file Pagination Transformation Utilities
 * @module utils/pagination
 * @description Provides functions to transform pagination data into a standardized format.
 */

import type { mongoose } from '@typegoose/typegoose'
import type { Pagination } from '~/shared/interface/paginator.interface'

/**
 * Transforms a `mongoose.PaginateResult` into a standardized `Pagination` format.
 * @param data - The data to transform, typically the result of a paginated query.
 * @returns A `Pagination` object containing the data and pagination information.
 */
export function transformDataToPaginate<T = any>(
  data: mongoose.PaginateResult<T>,
): Pagination<T> {
  return {
    data: data.docs,
    pagination: {
      total: data.totalDocs,
      currentPage: data.page as number,
      totalPage: data.totalPages as number,
      size: data.limit,
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage,
    },
  }
}
