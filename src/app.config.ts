import { isDev } from './utils/environment.utils'
import type { AxiosRequestConfig } from 'axios'

export const PORT = 3333
export const CROSS_DOMAIN = {
  allowedOrigins: ['*'],
  allowedReferer: '*',
}

export const MONGO_DB = {
  dbName: 'thetruefinhealth',
  host: 'staging.mongodb.thetruepal.aws',
  port: 27017,
  get uri() {
    return `mongodb://${this.host}:${this.port}/${
      process.env.TEST ? 'thetruefinhealth' : this.dbName
    }`
  },
}

export const REDIS = {
  host: 'master.staging-tf-rep-group-1.qdxpl3.aps1.cache.amazonaws.com',
  port: 6379,
  password: 'pwQ3wjUMdVN9Egz9PZ3R',
  httpCacheTTL: 5,
  max: 5,
  tls: {},
  disableApiCache: isDev && !process.env.ENABLE_CACHE_DEBUG,
}

export const AXIOS_CONFIG: AxiosRequestConfig = {
  timeout: 10000,
}
