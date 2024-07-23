/**
 * Enumeration for Redis keys used in the application.
 * @file Defines Redis keys for various cache stores.
 * @module constants/redis-keys
 */

export enum RedisKeys {
  // Key for caching HTTP responses
  HTTPCache = 'http_cache',
}

/**
 * Enumeration for general cache keys.
 * @note Currently empty but can be expanded for additional cache keys.
 * @module constants/cache-keys
 */
export enum CacheKeys {}
