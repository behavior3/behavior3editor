var CRITICAL = 50
var ERROR    = 40
var WARN     = 30
var INFO     = 20
var DEBUG    = 10
var SILLY    = 0

var map = {
  50 : 'CRITICAL',
  40 : 'ERROR',
  30 : 'WARN',
  20 : 'INFO',
  10 : 'DEBUG',
  0  : 'SILLY',
}

export class Logging {
  constructor(level=CRITICAL) {
    this.CRITICAL = CRITICAL
    this.ERROR    = ERROR
    this.WARN     = WARN
    this.INFO     = INFO
    this.DEBUG    = DEBUG
    this.SILLY    = SILLY

    this._level = level
  }

  _log(type, message) {
    if (type < this._level) return

    // LOG HERE
    console.log(map[type]+':', message)
  }

  setLevel(level) {
    this._level = level
  }

  critical(message) {
    this._log(CRITICAL, message)
  }
  error(message) {
    this._log(ERROR, message)
  }
  warn(message) {
    this._log(WARN, message)
  }
  info(message) {
    this._log(INFO, message)
  }
  debug(message) {
    this._log(DEBUG, message)
  }
  silly(message) {
    this._log(SILLY, message)
  }
}
const logger = new Logging()
export default logger
