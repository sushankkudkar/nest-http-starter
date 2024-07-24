/**
 * Global Configuration Setup.
 * @file Global configuration and utility registration
 * @module config/global
 * @description Registers global utilities and settings for the application.
 */

 import { consola } from './consola.global'
import './dayjs.global'
import { isDev } from './env.global'

/**
 * Registers global settings and utilities.
 * @function registerGlobal
 * @description Sets up global variables and overrides default console behavior based on environment settings.
 */
function registerGlobal() {
  // Enable verbose logging if in development mode
  $.verbose = isDev

  // Assign global properties
  Object.assign(globalThis, {
    isDev,
    consola,
   })

  // Override console.debug to use consola if in development mode
  console.debug = (...rest: any[]) => {
    if (isDev) {
      consola.log.call(console, ...rest)
    }
  }
}

/**
 * Initializes global settings and utilities.
 * @function register
 * @description Calls `registerGlobal` to set up the global environment.
 */
export function register() {
  registerGlobal()
}
