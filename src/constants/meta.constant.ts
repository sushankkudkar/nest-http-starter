/**
 * Constants for HTTP caching and request metadata.
 * @file Defines constants related to HTTP caching and request metadata.
 * @module constants/cache
 */

import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
} from '@nestjs/common/cache/cache.constants'

// Metadata key for HTTP cache key
export const HTTP_CACHE_KEY_METADATA = CACHE_KEY_METADATA

// Metadata key for HTTP cache TTL (time-to-live)
export const HTTP_CACHE_TTL_METADATA = CACHE_TTL_METADATA

// Key for disabling the cache module
export const HTTP_CACHE_DISABLE = 'cache_module:cache_disable'

// Key for tracking HTTP request time
export const HTTP_REQUEST_TIME = 'http:req_time'

// Metadata key for custom HTTP response transformation and pagination
export const HTTP_RES_TRANSFORM_PAGINATE = '__customHttpResTransformPagenate__'

// Metadata key for updating document count type in HTTP responses
export const HTTP_RES_UPDATE_DOC_COUNT_TYPE = '__updateDocCount__'
