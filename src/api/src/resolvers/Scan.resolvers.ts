import dotenv from "dotenv";
import Media from "src/media-exif";
import { type Image, image as brandImage } from '../types/Image.types';
import { readAllFiles, take, offset } from 'src/util/fs';
import { addMedia } from "src/models/media.model";
import Logger from "src/Logger";
import { secondsToHms } from "src/util/time";

dotenv.config({ path: '/home/openphoto/config/.env' });

const UPLOADS_DIR = process.env.UPLOADS_DIR;
const SCANABLE_FILES_REGEX = new RegExp(`(${process.env.SCANABLE_FILES_REGEX.split(",").map(t => `.${t}`).join('|')})$`, 'gmi');

const logger = new Logger('Scan.resolvers.ts');

export const scanAndExportUploadedImage = async (_img: Image): Promise<string | { FAILED: { image: Image; error: any; } }> => {

    try {
        let img = _img;

        if (img.startsWith(UPLOADS_DIR)) {
            img = brandImage(img.replace(UPLOADS_DIR, ''));
        }

        const media = new Media({ path: img })
        const res = await media.exportAllData({
            extractFaces: true
        });

        await addMedia(img)
        return res

    } catch (e) {
        return { FAILED: { image: _img, error: e } };
    }
}

export const scanAndExportDirectory = async ({ dir: _dir = UPLOADS_DIR, from, limit = -1, batch = 1 }, check?: (arg: string) => boolean) => {
    let dir = !_dir.startsWith(UPLOADS_DIR) ? `${UPLOADS_DIR}${_dir}` : _dir;

    let files: string[] = [];

    if (limit > 0) {
        files = Array.from(take(offset(readAllFiles(dir, SCANABLE_FILES_REGEX, check), from), limit));
    } else {
        files = Array.from(offset(readAllFiles(dir, SCANABLE_FILES_REGEX, check), from));
    }

    let scan_result = [];

    const chunk = (arr: string[], size: number) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );

    const chunks = chunk(files, batch);
    const total_count = files.length;
    const current_listeners = process.listeners('exit').length;
    process.setMaxListeners(batch + 1 + current_listeners);
    logger.info(`Scanning ${total_count} new images, ${batch} at a time`);
    logger.record('scan', `Scanning ${total_count} new images, ${batch} at a time`);
    const start_time_all = Date.now();
    let count = 0;
    let successes = 0;
    let failures = 0;

    for await (const a of chunks) {
        const start = Date.now()
        const contents = await Promise.all(a.map((i: string) => {
            const image_path = brandImage(i);
            return scanAndExportUploadedImage(image_path);
        }));

        contents.forEach(res => {
            if (typeof res === 'string') {
                successes++;
            } else {
                failures++;
            }
        })

        const end = Date.now()
        const time_for_one = (end - start) / 1000 / batch;
        const duration = (end - start) / 1000;
        count = count + batch;
        logger.info(
            `${a.length} files scanned in ${secondsToHms(duration)} ` +
            `with an average of ${secondsToHms(time_for_one)} per image.  ${count}/${total_count}`);
        scan_result = [...scan_result, ...contents];
    }
    process.setMaxListeners(current_listeners);
    const total_duration = (Date.now() - start_time_all) / 1000;
    logger.record('scan', `Scanning complete: ${secondsToHms(total_duration)}, Limit:${limit}, Offset:${from}, Batch:${batch}, Dir:${dir}`)
    logger.record('scan', `    Successes: ${successes}, Failures: ${failures}`);
    logger.info(`Scanning complete: ${secondsToHms(total_duration)} Successes: ${successes}, Failures: ${failures}`);
    return scan_result;
}