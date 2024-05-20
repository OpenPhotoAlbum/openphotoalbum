import fs, { CopyOptions, PathLike, PathOrFileDescriptor, WriteFileOptions } from 'fs';
// import filenamify from 'filenamify';

import Logger from '../../Logger'
import { dirname } from 'path';

class Fs {
    logger = new Logger('FsHelp');

    formatFilename(str: string /*, replacement = '_' */) {
        // const returned = filenamify(str, { replacement });

        const returned = str;

        if (str !== returned) {
            this.logger.warn(`Using: ${returned} instead of ${str}`)
        }
        return returned;
    }

    fileExists(path: PathLike) {
        return fs.existsSync(path)
    }

    deleteFile(path: PathLike) {
        return fs.unlinkSync(path);
    }

    isValidDirectory(dir: PathLike) {
        try {
            return fs.lstatSync(dir).isDirectory();
        } catch (e) {
            return false
        }
    }

    dataToFile(path: string, _data: number | string | NodeJS.ArrayBufferView | object) {
        const data = JSON.stringify(_data);
        fs.mkdirSync(dirname(path), { recursive: true });
        fs.writeFileSync(path, data);
    }

    mkdirSync(path: string) {
        fs.mkdirSync(path, { recursive: true });
    }

    getBuffer(path: PathLike) {
        return fs.promises.readFile(path)
    }

    writeFile(args: { dest: string, data: Buffer, options: WriteFileOptions }) {
        try {
            fs.writeFileSync(args.dest, args.data, args.options);
        } catch (e) {
            this.logger.error(e)
        }
    }
}

export default Fs