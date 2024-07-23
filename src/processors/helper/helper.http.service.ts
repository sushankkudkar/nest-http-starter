/**
 * HTTP Service for handling HTTP requests with caching and logging.
 * @file Http Service
 * @module services/http
 * @description Provides methods for making HTTP requests, caching responses, and logging request/response details.
 */

import { performance } from 'node:perf_hooks'
import { inspect } from 'node:util'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Injectable, Logger } from '@nestjs/common'

import { AXIOS_CONFIG } from '~/app.config'
import { RedisKeys } from '~/constants/cache.constant'
import { getRedisKey } from '~/utils/redis.util'
import { CacheService } from '../cache/cache.service'
import { version } from '~/../package.json'

declare module 'axios' {
  interface AxiosRequestConfig {
    __requestStartedAt?: number
    __requestEndedAt?: number
    __requestDuration?: number
    __debugLogger?: boolean
  }
}

@Injectable()
export class HttpService {
  private http: AxiosInstance
  private logger: Logger
  private axiosDefaultConfig: AxiosRequestConfig<any>

  constructor(private readonly cacheService: CacheService) {
    this.logger = new Logger(HttpService.name)

    this.axiosDefaultConfig = {
      ...AXIOS_CONFIG,
      headers: {
        'user-agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 MX-Space/${version}`,
      },
    }

    this.http = this.bindInterceptors(axios.create(this.axiosDefaultConfig))
  }

  /**
   * Extend the Axios instance with additional configurations and bind debug verbose interceptor.
   * @param config - Additional Axios request configuration.
   * @returns Extended Axios instance.
   */
  extend(config: AxiosRequestConfig<any>): AxiosInstance {
    return this.bindDebugVerboseInterceptor(
      axios.create({ ...this.axiosDefaultConfig, ...config }),
    )
  }

  /**
   * Fetches data from a URL and caches the response.
   * @param url - The URL to fetch.
   * @returns Cached or fetched data.
   */
  public async getAndCacheRequest(url: string): Promise<string> {
    this.logger.debug(`--> GET: ${url}`)
    const client = this.cacheService.getClient()
    const cachedData = await client.hget(getRedisKey(RedisKeys.HTTPCache), url)

    if (cachedData) {
      this.logger.debug(`--> GET: ${url} from redis`)
      return cachedData
    }

    const { data } = await this.http.get(url, { responseType: 'text' })
    this.logger.debug(`--> GET: ${url} from remote`)

    await client.hset(getRedisKey(RedisKeys.HTTPCache), url, data)
    return data
  }

  public get axiosRef(): AxiosInstance {
    return this.http
  }

  /**
   * Binds the debug verbose interceptor to the Axios instance.
   * @param $http - Axios instance.
   * @returns Updated Axios instance with interceptors.
   */
  private bindDebugVerboseInterceptor($http: AxiosInstance): AxiosInstance {
    $http.interceptors.request.use((req) => {
      if (!req.__debugLogger) {
        return req
      }
      req.__requestStartedAt = performance.now()

      this.logger.log(
        `HTTP Request: [${req.method?.toUpperCase()}] ${req.baseURL || ''}${req.url}
params: ${this.prettyStringify(req.params)}
data: ${this.prettyStringify(req.data)}`,
      )

      return req
    })

    $http.interceptors.response.use(
      (res) => {
        if (!res.config.__debugLogger) {
          return res
        }
        const endAt = performance.now()
        res.config.__requestEndedAt = endAt
        res.config.__requestDuration = res.config.__requestStartedAt
          ? endAt - res.config.__requestStartedAt
          : undefined

        this.logger.log(
          `HTTP Response ${`${res.config.baseURL || ''}${res.config.url}`} +${res.config.__requestDuration?.toFixed(2)}ms: \n${this.prettyStringify(res.data)}`,
        )

        return res
      },
      (err) => {
        const res = err.response
        const error = Promise.reject(err)

        if (!res) {
          this.logger.error(
            `HTTP Response Failed ${err.config.url || ''}, Network Error: ${err.message}`,
          )
          return error
        }

        this.logger.error(
          `HTTP Response Failed ${`${res.config.baseURL || ''}${res.config.url}`}\n${this.prettyStringify(res.data)}`,
        )

        return error
      },
    )

    return $http
  }

  /**
   * Binds debug verbose interceptor and returns the updated Axios instance.
   * @param $http - Axios instance.
   * @returns Updated Axios instance with interceptors.
   */
  private bindInterceptors($http: AxiosInstance): AxiosInstance {
    this.bindDebugVerboseInterceptor($http)
    return $http
  }

  /**
   * Pretty prints data for debugging purposes.
   * @param data - Data to be printed.
   * @returns Pretty-printed data.
   */
  private prettyStringify(data: any): string {
    return inspect(data, { colors: true })
  }
}
