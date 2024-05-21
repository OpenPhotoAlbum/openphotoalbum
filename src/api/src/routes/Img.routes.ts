import express, { Request, Response } from 'express';
import fs from 'fs';
import dotenv from "dotenv";
import { image } from 'src/types/Image.types';
import { getImageBuffer, scanAndExportUploadedImage } from 'src/resolvers';
import Media from 'src/media-exif';

dotenv.config({ path: '/home/openphoto/config/.env.local' });

const UPLOADS_DIR = process.env.UPLOADS_DIR;

const router = express.Router();

router.get('/img*', async (req: Request, res: Response) => {
    try {
        const image_path = image(decodeURI(req.path.replace('/img', '')));

        const { buffer, headers } = await getImageBuffer(image_path, req.query);

        return res
            .set(headers)
            .status(200)
            .send(buffer);
    } catch (e) {
        console.error(e);
        res.status(404).send()
    }
});

router.get('/meta*', async (req: Request, res: Response) => {
    try {
        const image_path = image(decodeURI(req.path.replace('/meta', '')));
        const media = new Media({ path: image_path });

        if (!fs.existsSync(media.json_scan_file)) {
            await scanAndExportUploadedImage(image_path);
        }

        const data = fs.readFileSync(media.json_scan_file, { encoding: 'utf-8' });

        return res
            .status(200)
            .json(JSON.parse(data));
    } catch (e) {
        console.error(e);
        res.status(404).send()
    }
});
export default router;