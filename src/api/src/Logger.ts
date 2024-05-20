type LoggerLvl = 'log' | 'warn' | 'info' | 'debug' | 'error' | 'critical'

class Logger {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    _format(lvl: LoggerLvl, msg: unknown) {
        return `${new Date().toISOString()} [${this.name}] [${lvl}]- ${msg}`
    }

    log(msg: unknown) { console.log(this._format('log', msg)) }
    warn(msg: unknown) { console.warn(this._format('warn', msg)) }
    info(msg: unknown) { console.info(this._format('info', msg)) }
    debug(msg: unknown) { console.debug(this._format('debug', msg)) }
    error(msg: unknown) { console.error(this._format('error', msg)) }
    critical(msg: unknown) { console.error(this._format('critical', msg)) }
}

export default Logger