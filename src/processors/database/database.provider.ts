/**
 * @file Database provider
 * @module providers/database
 * @description Provides a MongoDB connection provider for dependency injection.
 */

import { mongoose } from '@typegoose/typegoose';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DB_CONNECTION_TOKEN } from '~/constants/system.constant';
import { logger } from '~/global/consola.global';

const RECONNECT_INTERVAL = 6000;
const Badge = `['MongoDB']`;

/**
 * Creates a MongoDB connection and sets up event handlers for connection states.
 * @returns The MongoDB connection.
 */
@Injectable()
class DatabaseProvider {
  constructor(private readonly configService: ConfigService) {}

  async createConnection() {
    let reconnectionTask: NodeJS.Timeout | null = null;

    const connection = () => {
      const uri = this.configService.get<string>('app.mongoose.uri');
      if (!uri) {
        throw new Error('MongoDB URI is not defined in the configuration.');
      }
      return mongoose.connect(uri);
    };

    mongoose.connection.on('connecting', () => {
      logger.info(Badge, `connecting...`);
    });

    mongoose.connection.on('open', () => {
      logger.info(Badge, `connected successfully!`);
      if (reconnectionTask) {
        clearTimeout(reconnectionTask);
        reconnectionTask = null;
      }
    });

    mongoose.connection.on('disconnected', () => {
      logger.log(
        Badge,
        `disconnected! retry when after ${RECONNECT_INTERVAL / 1000}s`,
      );
      reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
    });

    mongoose.connection.on('error', (error) => {
      logger.error(Badge, 'error!', error);
      mongoose.disconnect();
    });

    return await connection().then((mongoose) => mongoose.connection);
  }
}

export const databaseProvider = {
  provide: DB_CONNECTION_TOKEN,
  useFactory: (configService: ConfigService) => {
    const provider = new DatabaseProvider(configService);
    return provider.createConnection();
  },
  inject: [ConfigService],
};
