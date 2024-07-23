import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import { Logger } from 'nestjs-pretty-logger'

import { AppModule } from './app.module'
import { CROSS_DOMAIN, PORT } from './app.config'
import { fastifyApp } from './common/adapter/fastify.adapter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { logger } from './global/consola.global'
import { isDev } from './utils/environment.utils'

declare const module: any

export async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    { logger: ['error', 'debug'] },
  )

  configureCors(app)
  setupGlobalConfig(app)

  await startServer(app)
  setupHotModuleReplacement(app)
}

function configureCors(app: NestFastifyApplication) {
  console.log('Came inside configureCors')
  const Origin = CROSS_DOMAIN.allowedOrigins
  const hosts = Origin.filter((host) => host !== '*').map(
    (host) => new RegExp(host, 'i'),
  )

  app.enableCors({
    origin: (origin, callback) => {
      if (Origin.includes('*')) {
        callback(null, true)
      } else {
        const allow = hosts.some((host) => host.test(origin))
        callback(null, allow)
      }
    },
    credentials: true,
  })
}

function setupGlobalConfig(app: NestFastifyApplication) {
  console.log('Came inside setupGlobalConfig')

  if (!isDev) {
    app.useGlobalInterceptors(new LoggingInterceptor())
  }
  app.setGlobalPrefix('health')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 422,
      forbidUnknownValues: true,
      enableDebugMessages: isDev,
      stopAtFirstError: true,
    }),
  )
}

async function startServer(app: NestFastifyApplication) {
  console.log('Came inside startServer')

  await app.listen(+PORT, '0.0.0.0', async (err) => {
    if (err) {
      logger.error(`Error starting server: ${err.message}`)
      return
    }
    app.useLogger(app.get(Logger))
    const url = await app.getUrl()

    logger.success(
      `[PID:${process.pid}] Server listening on: ${url}; ENV: ${process.env.NODE_ENV}`,
    )
  })
}

function setupHotModuleReplacement(app: NestFastifyApplication) {
  console.log('Came inside setupHotModuleReplacement')

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
