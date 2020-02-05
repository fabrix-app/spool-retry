// Modified from https://github.com/IndigoUnited/node-promise-retry/blob/master/index.js
// This modification exposes the operation from retry

import retry from 'retry'

const errcode = require('err-code')
const hasOwn = Object.prototype.hasOwnProperty

function isRetryError(err) {
  return err && err.code === 'EPROMISERETRY' && hasOwn.call(err, 'retried')
}

export const promiseRetry = function(fn, options) {
  let temp
  let operation

  if (typeof fn === 'object' && typeof options === 'function') {
    // Swap options and fn when using alternate signature (options, fn)
    temp = options
    options = fn
    fn = temp
  }

  operation = retry.operation(options)

  return {
    operation: operation,
    promise: new Promise(function (resolve, reject) {
      operation.attempt(function (number) {
        Promise.resolve()
          .then(function () {
            return fn(function (err) {
              if (isRetryError(err)) {
                err = err.retried
              }

              throw errcode(new Error('Retrying'), 'EPROMISERETRY', {retried: err})

            }, number)
          })
          .then(resolve, function (err) {
            if (isRetryError(err)) {
              err = err.retried

              if (operation.retry(err || new Error())) {
                return
              }
            }

            return reject(err)
          })
      })
    })
  }
}
