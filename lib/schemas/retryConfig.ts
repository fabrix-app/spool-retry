import joi from 'joi'

export const retryConfig = joi.object().keys({
  // retries: The maximum amount of times to retry the operation. Default is 10.
  retries: joi.number().allow(null),
  // factor: The exponential factor to use. Default is 2.
  factor: joi.number().allow(null),
  // minTimeout: The number of milliseconds before starting the first retry. Default is 1000.
  minTimeout: joi.number().allow(null),
  // maxTimeout: The maximum number of milliseconds between two retries. Default is Infinity.
  maxTimeout: joi.number().allow(null),
  // randomize: Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is false.
  randomize: joi.number().allow(null, false),
}).unknown()
