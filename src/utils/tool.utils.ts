/**
 * Utility functions.
 * @file Utility Functions
 * @module utils
 * @description Contains various utility functions for hashing, sleeping, JSON parsing, async pooling, and key transformation.
 */

import { createHash } from 'node:crypto'

/**
 * Generates an MD5 hash of the given text.
 * @param text - The text to hash.
 * @returns The MD5 hash of the text.
 */
export const md5 = (text: string): string =>
  createHash('md5').update(text).digest('hex')

/**
 * Sleeps for a given number of milliseconds.
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the given time.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Safely parses a JSON string.
 * @param p - The JSON string to parse.
 * @returns The parsed object or null if parsing fails.
 */
export const safeJSONParse = (p: any): any => {
  try {
    return JSON.parse(p)
  } catch {
    return null
  }
}

/**
 * Hashes a string with an optional seed.
 * @param str - The string to hash.
 * @param seed - The seed for hashing.
 * @returns The hash of the string.
 */
export const hashString = (str: string, seed = 0): number => {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

/**
 * Manages concurrency for an asynchronous pool of operations.
 * @param concurrency - The maximum number of concurrent operations.
 * @param iterable - The items to process.
 * @param iteratorFn - The function to apply to each item.
 * @returns An async iterable of results.
 */
export async function* asyncPool<T>(
  concurrency: number,
  iterable: T[],
  iteratorFn: (item: T, arr: T[]) => Promise<any>,
): AsyncIterableIterator<any> {
  const executing = new Set<Promise<any>>()

  async function consume() {
    const [promise, value] = await Promise.race(executing)
    executing.delete(promise)
    return value
  }

  for (const item of iterable) {
    const promise = (async () => await iteratorFn(item, iterable))().then(
      (value) => [promise, value] as [Promise<any>, any],
    )
    executing.add(promise)
    if (executing.size >= concurrency) {
      yield await consume()
    }
  }

  while (executing.size) {
    yield await consume()
  }
}

/**
 * Converts snake_case keys to camelCase.
 * @param key - The key to convert.
 * @returns The camelCase key.
 */
export const camelcaseKey = (key: string): string =>
  key.replace(/_(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))

/**
 * Recursively converts all keys of an object or array to camelCase.
 * @param obj - The object or array to convert.
 * @returns The object or array with camelCase keys.
 */
export const camelcaseKeys = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(camelcaseKeys)
  }
  const result: any = {}
  Object.keys(obj).forEach((k) => {
    result[camelcaseKey(k)] = camelcaseKeys(obj[k])
  })
  return result
}
