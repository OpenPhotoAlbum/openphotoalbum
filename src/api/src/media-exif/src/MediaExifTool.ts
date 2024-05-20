import pathlib from 'path';
import { ExifTool, Tags } from 'exiftool-vendored';

import Fs from './Fs';
import Logger from '../../Logger';

// import { cpus } from 'os';
// Math.round(cpus().length / 4),
const EXIFTOOL_CPU_COUNT = 5;

const default_exiftool_config = {
    taskTimeoutMillis: 5000,
    maxProcs: EXIFTOOL_CPU_COUNT,
    maxTasksPerProcess: 500,
    taskRetries: 1,
    ignoreZeroZeroLatLon: true,
    geolocation: true,
    checkPerl: true
}

export type MediaExifToolType = {
    path: string
}

export type WriteArgs = {
    ext?: string;
    name?: string;
    dir?: string;
    overwrite?: boolean;
}

class MediaExifTool extends Fs {
    logger = new Logger('MediaExifTool');
    filename: string
    dir: string
    base: string
    name: string
    ext: string

    constructor({ path }: MediaExifToolType) {
        super();
        const { dir, base, ext, name } = pathlib.parse(path as string);
        this.filename = path    // '/home/foo/example.cr3'
        this.dir = dir          // '/home/foo'
        this.base = base        // 'example.cr3'
        this.name = name        // 'example'
        this.ext = ext          // '.cr3'
    }

    private async useExifTool<T>(f: string, ...args): Promise<T> {
        const et = new ExifTool(default_exiftool_config)
        const r = await et[f](...args)
        await et.end();
        return r;
    }

    async readTags(): Promise<Tags> {
        return await this.useExifTool<Tags>('read', this.filename);
    }

    async readTag(tag: keyof Tags): Promise<unknown> {
        const _tags = await this.readTags()
        return _tags[tag];
    }

    async writeTags(tags: Tags): Promise<unknown> {
        return await this.useExifTool('write', this.filename, tags);
    }

    async writeTagsToFile(args: WriteArgs) {
        const { dir, name, ext } = this._assertWriteIsValid({ ext: 'json', ...args });

        const tags = await this.readTags();
        const filename = `${dir}/${name}.${ext}`;
        this.dataToFile(filename, { exif: tags })
    }

    async rawToJpg(args: WriteArgs) {
        try {
            const { dir, name, ext } = this._assertWriteIsValid({ ext: 'jpg', ...args });
            const jpgFilename = `${dir}/${name}.${ext}`;

            return await this.useExifTool('extractJpgFromRaw', this.filename, jpgFilename);
        }
        catch (e) {
            this.logger.warn(e.message)
        }
    }

    async extractThumbnail(_args: WriteArgs) {
        const args = _args;

        try {
            const { dir, name, ext } = this._assertWriteIsValid({ ext: 'jpg', ...args });
            const jpgFilename = `${dir}/${name}.${ext}`;
            return await this.useExifTool('extractThumbnail', this.filename, jpgFilename);

        }
        catch (e) {
            this.logger.warn(e.message)
        }
    }

    _assertWriteIsValid(args: WriteArgs): WriteArgs {
        //  TODO: Allow for json key checking
        const { overwrite } = args;

        let dir = this.dir;
        let name = this.name;
        let ext = '.*';

        if (args.dir && this.isValidDirectory(args.dir)) {
            dir = args.dir;
        }

        if (args.name) {
            name = this.formatFilename(args.name);
        }

        if (args.ext) {
            ext = args.ext;
        }

        const jpgFilename = `${dir}/${name}${ext}`

        if (this.fileExists(jpgFilename)) {
            if (!overwrite) {
                throw new Error(`${jpgFilename} already exists.\nUse { overwrite: true; } to overwrite`);
            }
            this.deleteFile(jpgFilename);
        }

        return { dir, name, ext, overwrite };
    }
}

export default MediaExifTool;
