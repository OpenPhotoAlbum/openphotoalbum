import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import express, { Request, Response } from 'express';

import { scanAndExportUploadedImage, scanAndExportDirectory } from 'src/resolvers';
import { image as brandImage } from 'src/types';

dotenv.config({ path: '/home/openphoto/config/.env.local' });

const UPLOADS_DIR = process.env.UPLOADS_DIR;

const router = express.Router();

router.post('/scan/new', async (req: Request, res: Response) => {
    try {
        const { count = 1 } = req.body;

        if (count <= 0) {
            res.status(400).json({
                data: null,
                total: 0,
                error: 'count is required'
            });
            return;
        }

        scanAndExportDirectory({ from: 0, limit: count }, f => {
            const scan_directory = `${path.parse(f).dir}/scans`;
            const json_scan_file = `${scan_directory}/${path.parse(f).name}.json`;
            return !fs.existsSync(json_scan_file);
        });

        res.status(200).json({ started: true });
    } catch (e) {
        console.error(e);
        res.status(e.status).json({
            started: false,
            error: e.message
        })
    }
});

router.post('/scan/directory', async (req: Request, res: Response) => {
    const { src: dir = '', limit, from = 0 } = req.body;

    if (!dir) {
        res.status(400).json({
            data: null,
            total: 0,
            error: 'src is required'
        });
        return;
    }

    if (limit && (isNaN(limit) || limit < 0)) {
        res.status(400).json({
            data: null,
            total: 0,
            error: '`limit` must be 0 or above. No limit:0 (default)'
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
        fs.lstatSync(`${UPLOADS_DIR}/${dir}`).isDirectory();
    } catch (e) {
        res.status(404).json({
            data: null,
            total: 0,
            error: 'src is not a valid directory'
        });
        return;
    }

    let scan_result = await scanAndExportDirectory({ dir, from, limit });

    try {
        res.status(200).json(scan_result.map(r => r.replace(UPLOADS_DIR, '')))
    } catch (e) {
        console.error(e);
        res.status(e.status).json({
            data: null,
            total: 0,
            error: e.message
        })
    }
});

router.post('/scan/image', async (req: Request, res: Response) => {
    const { src } = req.body;

    if (!src) {
        res.status(400).json({
            data: null,
            total: 0,
            error: 'src is required'
        });
        return;
    }

    const image_path = brandImage(src);
    let scan_result = await scanAndExportUploadedImage(image_path);

    try {
        if (typeof scan_result === 'string') {
            scan_result = scan_result.replace(UPLOADS_DIR, '');
        }

        res.status(200).json(scan_result)
    } catch (e) {
        console.error(e);
        res.status(e.status).json({
            data: null,
            total: 0,
            error: e.message
        })
    }
});

export default router;
