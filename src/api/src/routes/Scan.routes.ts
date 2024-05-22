import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import express, { Request, Response } from 'express';

import { scanAndExportUploadedImage, scanAndExportDirectory } from 'src/resolvers';
import { image as brandImage } from 'src/types';
import Logger from "src/Logger";

dotenv.config({ path: '/home/openphoto/config/.env' });

const UPLOADS_DIR = process.env.UPLOADS_DIR;

const router = express.Router();
const logger = new Logger('Scan.routes.ts');

let SCAN_LOCK: boolean = false;
const scanLock = (req: Request, res: Response, next: Function) => {
    if (SCAN_LOCK) {
        res.status(400).json({
            started: false,
            error: 'Scan already in progress'
        });
    } else {
        SCAN_LOCK = true;
        next();
    }
}

router.post('/scan/new', scanLock, async (req: Request, res: Response) => {
    try {
        const { count = 1 } = req.body;

        if (count <= 0) throw new Error('count is required');

        const filter = (f: string) => {
            const scan_directory = `${path.parse(f).dir}/scans`;
            const json_scan_file = `${scan_directory}/${path.parse(f).name}.json`;
            return !fs.existsSync(json_scan_file);
        };

        scanAndExportDirectory({ from: 0, limit: count }, filter)
            .finally(() => { SCAN_LOCK = false; });

        res.status(200).json({ started: true });
    } catch (e) {
        SCAN_LOCK = false;
        logger.error(e);
        res.status(e.status).json({ started: false, error: e.message })
    }
});

router.post('/scan/directory', scanLock, async (req: Request, res: Response) => {
    try {
        const { src: dir = '', limit, from = 0 } = req.body;

        // Validate inputs
        if (!dir) throw new Error('src is required')
        if (limit && (isNaN(limit) || limit < 0)) throw new Error('`limit` must be 0 or above. No limit:0 (default)');
        if (from && (isNaN(from) || from < 1)) throw new Error('`from` must be greater than 0');
        fs.lstatSync(`${UPLOADS_DIR}/${dir}`).isDirectory();

        logger.info(`Scanning directory ${dir}`);
        scanAndExportDirectory({ dir, from, limit })
            .finally(() => { SCAN_LOCK = false; });

        res.status(200).json({ started: true });

    } catch (e) {
        logger.error(e);
        SCAN_LOCK = false;
        res.status(400).json({ started: false, error: e.message })
    }
});

router.post('/scan/image', async (req: Request, res: Response) => {
    try {
        const { src } = req.body;

        if (!src) throw new Error('src is required');

        const image_path = brandImage(src);
        let scan_result = await scanAndExportUploadedImage(image_path);

        res.status(200).json(scan_result)
    } catch (e) {
        logger.error(e);
        res.status(400).json({ error: e.message })
    }
});

export default router;
