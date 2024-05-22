import dotenv from "dotenv";
import Media from "src/media-exif";
import { type Image, image as brandImage } from '../types/Image.types';
import { readAllFiles, take, offset } from 'src/util/fs';
import { addMedia } from "src/models/media.model";
import Logger from "src/Logger";

dotenv.config({ path: '/home/openphoto/config/.env' });

const UPLOADS_DIR = process.env.UPLOADS_DIR;
const SCANABLE_FILES_REGEX = new RegExp(process.env.SCANABLE_FILES_REGEX.split(",").map(t => `.${t}`).join('|'), 'gi');

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

export const scanAndExportDirectory = async ({ dir: _dir = UPLOADS_DIR, from, limit }, check?: (arg: string) => boolean) => {
    logger.info(`Scanning ${limit} new images`);

    let dir = _dir;

    if (!dir.startsWith(UPLOADS_DIR)) {
        dir = `${UPLOADS_DIR}${dir}`;
    }

    const r = Array.from(take(offset(readAllFiles(dir, SCANABLE_FILES_REGEX, check), from), limit));

    let scan_result = [];

    let cnt = 0;
    for (let i of r) {
        const image_path = brandImage(i);
        const result = await scanAndExportUploadedImage(image_path);
        scan_result.push(result);
        logger.info(`Scanned ${image_path}: ${cnt + 1}/${r.length}`);
        cnt++;
    }

    logger.info(`Scanning complete`);
    return scan_result;
}