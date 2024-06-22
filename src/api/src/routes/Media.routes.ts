import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import mime from "mime-types";
import fs from 'fs';

import { image } from 'src/types/Image.types';
import { getImageBuffer } from 'src/resolvers';
import { getMedia, getMediaByPath } from 'src/models/media.model';

dotenv.config({ path: '/home/openphoto/config/.env' });

const router = express.Router();

const UPLOADS_DIR = process.env.UPLOADS_DIR;

router.get('/static*', async (req: Request, res: Response) => {
    try {
        const media_path = image(decodeURI(req.path.replace('/static', '')));
		const mimeLookup = mime.lookup(media_path);
		const isImage = mimeLookup && mimeLookup.includes("image/");
		const isVideo = mimeLookup && mimeLookup.includes("video/");
        
        if (isImage) {
            const { buffer, headers } = await getImageBuffer(media_path, req.query);
            return res.set(headers).status(200).send(buffer);
        }

        if (isVideo) {
				const headers = {
					"Content-Type": mimeLookup,
					"Cache-Control": "public, max-age=86400",
					Expires: new Date(Date.now() + 86400000).toUTCString(),
				};
				res.contentType(mimeLookup).set(headers);
				const readStream = fs.createReadStream(`${UPLOADS_DIR}${media_path}`);
				readStream.pipe(res);
        }

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