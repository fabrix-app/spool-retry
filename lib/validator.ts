/* eslint no-console: [0] */
'use strict'
import joi from 'joi'

import { retryConfig } from './schemas'

export const Validator = {

  // Validate retry Config
  validateRetryConfig (config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, retryConfig, (err, value) => {
        if (err) {
          return reject(new TypeError('config.retry: ' + err))
        }
        return resolve(value)
      })
    })
  }
}
