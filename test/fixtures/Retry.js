const RetryManager = require('../../dist/RetryManager').RetryManager

module.exports = class Retry extends RetryManager {
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
