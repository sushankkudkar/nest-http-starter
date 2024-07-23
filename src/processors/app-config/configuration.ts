/**
 * Application configuration.
 * @file Application configuration settings
 * @module config/app.config
 * @description Provides configuration settings for the application, including environment variables and database settings.
 */

import { registerAs } from '@nestjs/config'

/**
 * Registers application configuration.
 * @returns {Object} Configuration settings for the application.
 */
export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  port: process.env.PORT,
  app_base_url: process.env.APP_BASE_URL, // Fixed case of the environment variable

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: false,
    password: process.env.REDIS_PASSWORD,
    database: process.env.REDIS_DATABASE,
  },

  mongoose: {
    uri: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
    database: process.env.MONGO_DATABASE,
    host: process.env.MONGO_HOST,
    userName: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    port: process.env.MONGO_PORT,
    authSource: process.env.MONGO_AUTH_SOURCE,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
}))
