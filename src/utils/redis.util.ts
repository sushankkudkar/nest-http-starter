/**
 * Redis key utility function.
 * @file Redis Key Utility
 * @module utils/redis
 * @description Provides a utility function for generating Redis keys with a specific format.
 */

import type { RedisKeys } from '~/constants/cache.constant'

/**
 * Generates a Redis key with a specific format.
 * @param key - The base key, which should be a `RedisKeys` or wildcard `'*'`.
 * @param concatKeys - Additional strings to concatenate to the base key.
 * @returns A formatted Redis key string.
 * @example
 * // Returns 'nest:someKey:additional_part'
 * getRedisKey('someKey', 'additional_part')
 */
export const getRedisKey = <T extends string = RedisKeys | '*'>(
  key: T,
  ...concatKeys: string[]
): `${'nest'}:${T}${string}` => {
  return `${'nest'}:${key}${concatKeys.length ? `:${concatKeys.join('_')}` : ''}`
}
