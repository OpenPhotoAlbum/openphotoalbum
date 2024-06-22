import fs from 'fs';
import dotenv from "dotenv";

dotenv.config({ path: '/home/openphoto/config/.env' });

const LOGS_DIRECTORY = process.env.LOGS_DIRECTORY;
const ERROR_LOG_FILE = `${LOGS_DIRECTORY}/error.log`;

type LoggerLvl = 'log' | 'warn' | 'info' | 'debug' | 'error' | 'critical'

class Logger {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    _format(lvl: LoggerLvl | string, msg: unknown) {
        return `${new Date().toISOString()} [${this.name}] [${lvl}]- ${msg}`
    }

    log(msg: unknown) { console.log(this._format('log', msg)) }
    record(name: string, msg: unknown) {
        fs.appendFileSync(`${LOGS_DIRECTORY}/${name}.log`, `${this._format(name, msg)}\n`);
    }
    warn(msg: unknown) { console.warn(this._format('warn', msg)) }
    info(msg: unknown) { console.info(this._format('info', msg)) }
    debug(msg: unknown) { console.debug(this._format('debug', msg)) }
    error(msg: unknown, e?: Error) {
        fs.appendFileSync(ERROR_LOG_FILE, `${new Date().toISOString()} [${this.name}] [ERROR]: ${msg}\n`);
        e?.stack
            .split('\n')
            .slice(1)
            .map(r => r.match(/\((?<file>.*):(?<line>\d+):(?<pos>\d+)\)/))
            .forEach(r => {
                if (r && r.groups && r.groups.file.substr(0, 8) !== 'internal') {
                    const { file, line, pos } = r.groups
                    if (fs.existsSync(file)) {
                        const f = fs.readFileSync(file, 'utf8').split('\n');
                        fs.appendFileSync(ERROR_LOG_FILE, `  ${file}#${line}:${pos}\n`);
                        fs.appendFileSync(ERROR_LOG_FILE, `    ${f[Number(line) - 1].trim()}\n`);
                    }
                }
            })
        console.error(this._format('error', msg), e)
    }
    critical(msg: unknown) { console.error(this._format('critical', msg)) }
}

export default Logger