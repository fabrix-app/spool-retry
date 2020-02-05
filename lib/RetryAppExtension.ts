import EventEmitter from 'events'
import { FabrixApp } from '@fabrix/fabrix'

export class RetryAppExtension extends EventEmitter {
  private _active_retries = new Map()
  private _cancelled_retries = new Map()
  private _failed_retries = new Map()
  private _unloaded_retries = new Map()

  constructor(public app: FabrixApp) {
    super()
  }

  get active() {
    Object.keys(this.app.retries).forEach((r) => {
      this._active_retries.set(this.app.retries[r].name, this.app.retries[r].active_retries)
    })
    return this._active_retries
  }

  get failed() {
    Object.keys(this.app.retries).forEach((r) => {
      this._failed_retries.set(this.app.retries[r].name, this.app.retries[r].failed_retries)
    })
    return this._failed_retries
  }

  get cancelled() {
    Object.keys(this.app.retries).forEach((r) => {
      this._cancelled_retries.set(this.app.retries[r].name, this.app.retries[r].cancelled_retries)
    })
    return this._cancelled_retries
  }

  // TODO
  configure() {
    // Have each retryManager subscriber to this App Extension
    Object.keys(this.app.retries).forEach((r) => {
      this.app.retries[r].subscribe()
    })

    this.emit('configure')
    this.emitStatus('configured')
    return Promise.resolve()
  }
  // TODO
  initialize() {

    this.emit('initialize')
    this.emitStatus('initialized')
    return Promise.resolve()
  }
  // TODO
  unload() {
    this.emit('unload')
    this.emitStatus('unloaded')
    return Promise.resolve()
  }

  emitStatus(status = 'unknown') {
    this.app.emit(`retryManager:${status}`)
  }
}
