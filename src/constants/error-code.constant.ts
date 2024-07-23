/**
 * Enumeration for error codes.
 * @file Defines error codes used across the application.
 * @module constants/error-codes
 */

export enum ErrorCodeEnum {
  // Error code for when a post is not found
  PostNotFoundError = 10000,

  // Error code for when the master (owner) is not found
  MasterLostError = 20000,
}

/**
 * Error codes with their associated messages and HTTP status codes.
 * @constant
 */
export const ErrorCode = Object.freeze<
  Record<ErrorCodeEnum, [string, string, number]>
>({
  // Error details for "Post Not Found"
  [ErrorCodeEnum.PostNotFoundError]: ['post not found', 'Post not found', 404],

  // Error details for "Master Lost"
  [ErrorCodeEnum.MasterLostError]: ['master lost', 'Master not found', 500],
})
