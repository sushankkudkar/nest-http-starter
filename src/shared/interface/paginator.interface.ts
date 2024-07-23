/**
 * Pagination interface and class.
 * @file Pagination Interface and Class
 * @module shared/interfaces/pagination
 * @description Defines the structure for pagination data and the associated paginator metadata.
 */

export interface Pagination<T> {
  /**
   * Array of paginated data items.
   */
  data: T[]

  /**
   * Pagination metadata.
   */
  pagination: Paginator
}

export class Paginator {
  /**
   * Total number of items.
   */
  readonly total: number

  /**
   * Number of items per page.
   */
  readonly size: number

  /**
   * Current page number.
   */
  readonly currentPage: number

  /**
   * Total number of pages.
   */
  readonly totalPage: number

  /**
   * Indicates if there is a next page.
   */
  readonly hasNextPage: boolean

  /**
   * Indicates if there is a previous page.
   */
  readonly hasPrevPage: boolean
}
