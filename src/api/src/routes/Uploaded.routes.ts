import dotenv from "dotenv";
import fs from 'fs';
import express, { Request, Response } from 'express';

import { offset, readAllDirectories, take } from 'src/util/fs';

dotenv.config({ path: '/home/openphoto/config/.env' });

const UPLOADS_DIR = process.env.UPLOADS_DIR;

const router = express.Router();

router.get('/uploaded', (req: Request, res: Response) => {
    const { src = '', limit, from = 0, expand = true } = req.body;

    const dir = `${UPLOADS_DIR}/${src}`;

    if (typeof expand !== 'boolean') {
        res.status(400).json({
            data: null,
            total: 0,
            error: '`expand` must be a boolean'
        });
        return;
    }

    if (limit && isNaN(limit)) {
        res.status(400).json({
            data: null,
            total: 0,
            error: '`limit` must be a positive integer'
        });
        return;
    }

    if (from && (isNaN(from) || from < 1)) {
        res.status(400).json({
            data: null,
            total: 0,
            error: '`from` must be greater than 0'
        });
        return;
    }

    try {
        fs.lstatSync(dir).isDirectory();
    } catch (e) {
        res.status(404).json({
            data: null,
            total: 0,
            error: `src is not a valid directory`
        });
        return;
    }

    try {
        let r = [];
        if (limit) {
            r = Array.from(take(offset(readAllDirectories(dir, expand), from), limit));
        } else {
            r = Array.from(offset(readAllDirectories(dir, expand), from));
        }
        r = r.map(f => f.replace(UPLOADS_DIR, ''))
        res.status(200).json(r)
    } catch (e) {
        console.error(e);
        res.status(404).send()
    }
});

export default router;
