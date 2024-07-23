/**
 * Logger Configuration.
 * @file Configures and exports a logger instance with custom settings.
 * @module config/logger
 * @description Sets up a pretty logger and prevents PM2 from overriding the console methods.
 */

import { createLogger } from 'nestjs-pretty-logger'

// Create and configure a logger instance
export const logger = createLogger()
logger.wrapAll()

// Prevent PM2 from overriding console methods
Object.defineProperty(process.stdout, 'write', {
  value: process.stdout.write,
  writable: false,
  configurable: false,
})

Object.defineProperty(process.stderr, 'write', {
  value: process.stderr.write, // Fix: Should use process.stderr.write for stderr
  writable: false,
  configurable: false,
})

// Export the logger instance with an alias
export { logger as consola }
