# spool-retry

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build Status][ci-image]][ci-url]
[![Test Coverage][coverage-image]][coverage-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Follow @FabrixApp on Twitter][twitter-image]][twitter-url]

:package: retry Spool

A Spool to make it easy to use [Retries](https://www.npmjs.com/package/promise-retry) with Fabrix

## Install
```sh
$ npm install --save @fabrix/spool-retry
```

## Configure

```js
// config/main.ts
import { RetrySpool } from '@fabrix/spool-retry'
export const main = {
  spools: [
    // ... other spools
    RetrySpool
  ]
}
```

## Configuration

```
// config/retry.ts
export const retry = {
  // retries: The maximum amount of times to retry the operation. Default is 10.
  retries: null, // 10,
  // factor: The exponential factor to use. Default is 2.
  factor: null, // 2,
  // minTimeout: The number of milliseconds before starting the first retry. Default is 1000.
  minTimeout: null, // 1000,
  // maxTimeout: The maximum number of milliseconds between two retries. Default is Infinity.
  maxTimeout: null,
  // randomize: Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is false.
  randomize: false
}
```

For more information about store (type and configuration) please see the retry documentation.

## Usage
For the best results, create a Base Class and override or extend the default methods. 
```ts
  import { RetryManager } from '@fabrix/spool-retry'
  
  export class MyRetry extends RetryManager {
    myFunc(data, opts) {
      const func = this.app.services.somePromiseService(data, opts)
      return this.attempt(func)
        .catch(err => {
           this.app.log.error(err)
           return Promise.reject(err)
        })
    }

    cancelByNameAt5 (name, number) {
      if (number === 5) {
        this.cancelled_retries.add(name)
      }
      return
    }

    // We are overriding the AfterEachFailure function to have it cancel softly at 5 tries
    afterEachFailure(name, params, retry, number, err) {
      this.cancelByNameAt5(name, number)
      return retry(err)
    }
  }
```

Or simply
```ts
 this.app.retries.MyRetry.attempt(func, params)
```

[npm-image]: https://img.shields.io/npm/v/@fabrix/spool-retry.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@fabrix/spool-retry
[ci-image]: https://img.shields.io/circleci/project/github/fabrix-app/spool-retry/master.svg
[ci-url]: https://circleci.com/gh/fabrix-app/spool-retry/tree/master
[daviddm-image]: http://img.shields.io/david/fabrix-app/spool-retry.svg?style=flat-square
[daviddm-url]: https://david-dm.org/fabrix-app/spool-retry
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/fabrix-app/fabrix
[twitter-image]: https://img.shields.io/twitter/follow/FabrixApp.svg?style=social
[twitter-url]: https://twitter.com/FabrixApp
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/fabrix-app/spool-retry.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/fabrix-app/spool-retry/coverage

