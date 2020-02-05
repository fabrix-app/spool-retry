import { ExtensionSpool } from '@fabrix/fabrix/dist/common/spools/extension'
import { Validator } from './validator'
import { Utils } from './utils'

import * as config from './config/index'
import * as pkg from '../package.json'
import * as api  from './api/index'
import { RetryAppExtension } from './RetryAppExtension'

export class RetrySpool extends ExtensionSpool {
  public retry

  constructor(app) {
    super(app, {
      config: config,
      pkg: pkg,
      api: api
    })

    // Initialize the extension
    this.retry = new RetryAppExtension(app)

    // Add the extension to Fabrix App
    this.extensions = {
      retry: {
        get: () => {
          return this.retry
        },
        set: (newInstances) => {
          throw new Error('retry can not be set through FabrixApp, check spool-retry instead')
        },
        enumerable: true,
        configurable: true
      }
    }
  }

  /**
   * Validate Configuration
   */
  async validate () {
    // const requiredSpools = [ 'router' ]
    // const spools = Object.keys(this.app.spools)
    //
    // if (!spools.some(v => requiredSpools.indexOf(v) >= 0)) {
    //   return Promise.reject(new Error(`spool-retry requires spools: ${ requiredSpools.join(', ') }!`))
    // }

    if (!this.app.config.get('retry')) {
      return Promise.reject(new Error('No configuration found at config.retry!'))
    }

    return Promise.all([
      Validator.validateRetryConfig(this.app.config.get('retry'))
    ])
      .catch(err => {
        return Promise.reject(err)
      })
  }

  /**
   * Configure
   */
  configure() {
    return Utils.configure(this.app)
  }

  /**
   * create caching stores
   */
  async initialize() {
    return Utils.init(this.app)
  }

  /**
   * unload caching stores
   */
  async unload() {
    return Utils.unload(this.app)
  }

  async sanity() {
    //
  }
}
