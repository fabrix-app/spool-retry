'use strict'

module.exports = {
  pkg: {
    name: require('../../package').name + '-test'
  },
  api: {
    retries: {
      Retry: require('./Retry')
    }
  },
  config: {
    retry: {
      retries: 6,
      minTimeout: 10
    },
    main: {
      spools: [
        require('../../dist').RetrySpool
      ]
    }
  }
}


