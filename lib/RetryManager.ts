import { FabrixApp } from '@fabrix/fabrix'
import { FabrixGeneric } from '@fabrix/fabrix/dist/common'
import { promiseRetry } from './promiseRetry'
import nano from 'nano-time'

export class RetryManager extends FabrixGeneric {
  public active_retries = new Map()
  public cancelled_retries = new Set()
  public failed_retries = new Map()
  public config: {[key: string]: any} = {}

  constructor(app: FabrixApp) {
    super(app)

    // Add defaults to config if not set
    this.config = {
      ...this.config,
      ...this.app.config.get('retry')
    }
  }

  get name() {
    return this.constructor.name
  }

  public subscribe() {
    // Subscribe to the ReloadAppExtension unload event
    this.app.retry.on('unload', this.unload)

    return
  }

  public attempt (fn, ...params) {
    if (!fn || !fn.constructor || !fn.constructor.name) {
      throw new Error('Retry Function must be named!')
    }

    const config = this.config
    const name = fn.constructor.name + '_' + (nano())

    const { operation, promise } = promiseRetry(config, (retry, number) => {

      if (this.cancelled_retries.has(name)) {
        return Promise.resolve(operation.stop())
      }

      this.app.log.debug(`${this.name}:${name}`, 'attempt number', number)

      return fn(params)
        .catch(err => {
          this.app.log.debug(`${this.name}:${name}`, 'attempt failed', number)

          if (this.failed_retries.has(name)) {
            const curr = this.failed_retries.get(name)
            this.failed_retries.set(name, {
              ...curr,
              [number]: err
            })
          }
          else {
            this.failed_retries.set(name, {
              [number]: err
            })
          }

          // After Each Attempt, expose the retry operation
          return this.afterEachAttempt(name, retry, number)
            .then(_retry => {
              // After, run the after each failure
              return this.afterEachFailure(name, params, _retry, number, err)
            })
        })
      })

    this.active_retries.set(name, operation)

    return promise
      .then((value) => {
        this.active_retries.delete(name)
        this.failed_retries.delete(name)
        return this.afterSuccessAttempt(name, value)
      })
      .catch(err => {
        this.active_retries.delete(name)
        return this.afterCompleteFailure(name, err)
      })
  }

  /**
   * After Each Attempt, expose the retry operation, must return retry
   * @param name
   * @param retry
   * @param number
   */
  public afterEachAttempt(name, retry, number) {
    return Promise.resolve(retry)
  }

  /**
   * After a Successful attempt, allows for transforms before returning to the original issuer
   * @param name
   * @param value
   */
  public afterSuccessAttempt(name, value) {
    return Promise.resolve(value)
  }

  /**
   * After each Failure, expose the params, and retry
   * @param name
   * @param params
   * @param retry
   * @param number
   * @param err
   */
  public afterEachFailure(name, params, retry, number, err) {
    return retry(err)
  }

  /**
   * After this completely fails, expose the name, and err
   * @param name
   * @param err
   */
  public afterCompleteFailure(name, err) {
    return Promise.reject(err)
  }

  public unload(msg) {
    // If Unload get's called too fast
    if (this.active_retries && this.cancelled_retries) {
      this.active_retries.forEach((value, key, map) => {
        this.cancelled_retries.add(key)
        this.active_retries.delete(key)
      })
    }
    console.log(`RetryManager: ${ this.name } will unload`)
    return
  }
}
