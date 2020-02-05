'use strict'
/* global describe, it */
const assert = require('assert')
const _ = require('lodash')

describe('# Retry Managers', () => {
  it('should exist', () => {
    assert(global.app.retry)
    assert.ok(global.app.retries['Retry'])
  })
  it('should run normal function', (done) => {
    const func = () => { return Promise.resolve({hello: 'world'}) }
    global.app.retries.Retry.attempt(func)
      .then(res => {
        assert.deepEqual(res, {hello: 'world'})
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should retry a normal function', (done) => {
    let total = 0
    const func = () => {
      if (total === 4) {
        return Promise.resolve(total)
      }
      else {
        total++
        return Promise.reject(total)
      }
    }

    global.app.retries.Retry.attempt(func)
      .then(res => {
        assert.equal(res, 4)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should retry a controlled function from rules set in the class', (done) => {
    let total = 0
    const func = () => {
      if (total === 5) {
        return Promise.resolve(total)
      }
      else {
        total++
        return Promise.reject(total)
      }
    }

    global.app.retries.Retry.attempt(func)
      .then(res => {
        assert.equal(total, 5)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
