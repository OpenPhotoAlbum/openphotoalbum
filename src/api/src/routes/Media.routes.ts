import express, { Request, Response } from 'express';
import dotenv from "dotenv";

import { image } from 'src/types/Image.types';
import { getImageBuffer } from 'src/resolvers';
import { getMedia, getMediaByPath } from 'src/models/media.model';

dotenv.config({ path: '/home/openphoto/config/.env' });

const router = express.Router();

router.get('/img*', async (req: Request, res: Response) => {
    try {
        const image_path = image(decodeURI(req.path.replace('/img', '')));
        const { buffer, headers } = await getImageBuffer(image_path, req.query);
        return res.set(headers).status(200).send(buffer);
    } catch (e) {
        console.error(e);
        res.status(404).send()
    }
});

router.get('/media', async (req: Request, res: Response) => {
    try {
        const from = req.query.from ? parseInt(String(req.query.from)) : undefined;
        const limit = req.query.limit ? parseInt(String(req.query.limit)) : undefined;
        const faces = req.query.faces === 'true';

        const { headers, data } = await getMedia({ from, limit, faces });
        return res.set(headers).status(200).send(data);
    } catch (e) {
        console.error(e);
        res.status(404).send()
    }
});

router.get('/meta*', async (req: Request, res: Response) => {
    try {
        const image_path = image(decodeURI(req.path.replace('/meta', '')));
        const media_data = await getMediaByPath(image(image_path))
        return res.status(200).json(media_data);
    } catch (e) {
        console.error(e);
        res.status(404).send()
    }
});

export default router;