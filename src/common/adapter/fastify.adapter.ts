/**
 * Fastify Adapter configuration.
 * @file Fastify Adapter Setup
 * @module app/fastify
 */

import { FastifyAdapter } from '@nestjs/platform-fastify'

// Create a FastifyAdapter instance with trustProxy enabled
const fastifyApp: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
})

export { fastifyApp }

// Add custom hooks to the Fastify instance
fastifyApp.getInstance().addHook('onRequest', (request, reply, done) => {
  // Set `origin` header if undefined
  const origin = request.headers.origin
  if (!origin) {
    request.headers.origin = request.headers.host
  }

  // Handle requests for .php files
  const url = request.url
  if (url.endsWith('.php')) {
    reply.raw.statusMessage =
      'Eh. PHP is not supported on this machine. Yep, I also think PHP is a great programming language. But for me, it is beyond my reach.'
    return reply.code(418).send()
  }

  // Handle specific admin URLs
  if (/\/(adminer|admin|wp-login)$/i.test(url)) {
    reply.raw.statusMessage = 'Hey, What are you doing!'
    return reply.code(200).send()
  }

  // Skip requests for favicon and manifest
  if (/favicon.ico$/.test(url) || /manifest.json$/.test(url)) {
    return reply.code(204).send()
  }

  // Continue processing request
  done()
})
