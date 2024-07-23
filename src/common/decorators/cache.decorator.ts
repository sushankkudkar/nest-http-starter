/**
 * Cache decorator for HTTP methods.
 * @file Cache decorator
 * @module decorator/cache
 */

import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { SetMetadata } from '@nestjs/common'

import * as META from '~/constants/meta.constant'

// Interface for cache options configuration
interface ICacheOption {
  ttl?: number // Time-to-live for cache (in seconds)
  key?: string // Custom cache key
  disable?: boolean // Flag to disable caching
}

/**
 * Decorator to apply caching to HTTP methods.
 * @function HttpCache
 * @description Configures caching behavior with options for key, TTL, and disable flag.
 * @param option - Configuration options for caching.
 * @returns MethodDecorator
 *
 * @example
 * @HttpCache({ key: 'my_cache_key', ttl: 3600 })
 * @example
 * @HttpCache({ disable: true })
 */
export function HttpCache(option: ICacheOption): MethodDecorator {
  const { disable, key, ttl = 60 } = option

  return (_, __, descriptor: PropertyDescriptor) => {
    if (disable) {
      // Set metadata to disable caching
      SetMetadata(META.HTTP_CACHE_DISABLE, true)(descriptor.value)
      return descriptor
    }
    if (key) {
      // Set custom cache key
      CacheKey(key)(descriptor.value)
    }
    if (typeof ttl === 'number' && !Number.isNaN(ttl)) {
      // Set cache TTL
      CacheTTL(ttl)(descriptor.value)
    }
    return descriptor
  }
}

// Static method to disable caching
HttpCache.disable = (_, __, descriptor) => {
  SetMetadata(META.HTTP_CACHE_DISABLE, true)(descriptor.value)
}
