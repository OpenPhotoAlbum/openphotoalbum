import dotenv from "dotenv";
import fs from 'fs';
import express, { Request, Response } from 'express';

import { offset, readAllDirectories, take } from 'src/util/fs';
import Logger from "src/Logger";

dotenv.config({ path: '/home/openphoto/config/.env' });

const UPLOADS_DIR = process.env.UPLOADS_DIR;

const router = express.Router();
const logger = new Logger('Uploaded.routes.ts');

router.get('/uploaded', (req: Request, res: Response) => {
    try {
        const { src = '', limit, from = 0, expand = true } = req.body;

        const dir = `${UPLOADS_DIR}/${src}`;

        if (typeof expand !== 'boolean') throw new Error('`expand` must be a boolean')
        if (limit && isNaN(limit)) throw new Error('`limit` must be a positive integer')
        if (from && (isNaN(from) || from < 1)) throw new Error('`from` must be greater than 0');
        fs.lstatSync(dir).isDirectory();

        let r = [];
        if (limit) {
            r = Array.from(take(offset(readAllDirectories(dir, expand), from), limit));
        } else {
            r = Array.from(offset(readAllDirectories(dir, expand), from));
        }
        r = r.map(f => f.replace(UPLOADS_DIR, ''));
        res.status(200).json(r);

    } catch (e) {
        logger.error(e);
        res.status(400).json({
            data: null,
            total: 0,
            error: e.message
        });
    }
});

export default router;
