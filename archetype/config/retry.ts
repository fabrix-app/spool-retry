/**
 * retry Config
 */
export const retry = {
  // retries: The maximum amount of times to retry the operation. Default is 10.
  retries: 10,
  // factor: The exponential factor to use. Default is 2.
  factor: 2,
  // minTimeout: The number of milliseconds before starting the first retry. Default is 1000.
  minTimeout: 1000, // 1000,
  // maxTimeout: The maximum number of milliseconds between two retries. Default is Infinity.
  maxTimeout: null,
  // randomize: Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is false.
  randomize: false
}
