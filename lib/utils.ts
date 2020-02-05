import { FabrixApp } from '@fabrix/fabrix'

export const Utils = {
  init: (app: FabrixApp) => {
    //
    return app.retry.initialize()
  },
  configure: (app: FabrixApp) => {
    //
    return app.retry.configure()
  },
  unload: (app: FabrixApp) => {
    //
    return app.retry.unload()
  }
}
