/**
 * Cache config service.
 * @file Cache 
 * @module processor/cache/config.service
 */

import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisStore from 'cache-manager-ioredis';
import { Redis } from 'ioredis';
import { logger } from '~/global/consola.global';

const Badge = `['RedisDB']`;

@Injectable()
export class CacheProvider implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    // Construct Redis URI from configuration
    const redisUri = `redis://${this.configService.get('app.redis.host')}:${this.configService.get('app.redis.port')}`;

    // Create Redis client instance
    const client = new Redis(redisUri, {
      password: this.configService.get('app.redis.password'),
      tls: {},
      enableReadyCheck: true, // Optional: enable ready check
    });

    // Log Redis connection events
    client.on('connecting', () => logger.info(Badge, 'connecting...'));
    client.on('connect', () => logger.info(Badge, 'connected successfully!'));
    client.once('ready', () => logger.info(Badge, 'connection ready!'));
    client.on('close', () => logger.info(Badge, 'connection closed.'));
    client.on('end', () => logger.info(Badge, 'connection ended.'));
    client.on('error', (error) => logger.error(Badge, 'error:', error));

    // Return cache module options
    return {
      store: redisStore, // Use cache-manager-ioredis as the store
      ttl: this.configService.get('app.redis.ttl'), // Default TTL for cache entries (in milliseconds)
      max: this.configService.get('app.redis.max'), // Maximum number of items in cache
      is_cacheable_value: () => true, // Function to determine if a value is cacheable
      ...{
        host: this.configService.get('app.redis.host'), // Redis host
        port: this.configService.get('app.redis.port'), // Redis port
        password: this.configService.get('app.redis.password'), // Redis password
      },
      client, // Return the Redis client instance directly
    };
  }
}
