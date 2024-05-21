import express, { Request, Response } from 'express';
import fs from 'fs';
import { readAllFiles } from '../../util/fs';
import dotenv from "dotenv";

dotenv.config({ path: '/home/openphoto/config/.env' });

const UPLOADS_DIR = process.env.UPLOADS_DIR;

const router = express.Router();
router.get('/scans', async (req: Request, res: Response) => {
    try {
        const { limit: _limit, withDetections: _withDetections, withRecognitions: _withRecognitions } = req.query || {};
        const withDetections = _withDetections === 'true';
        const withRecognitions = _withRecognitions === 'true';

        const limit = _limit ? parseInt(_limit as string) : undefined;
        let files = [];
        let total_count = 0;
        for (const file of readAllFiles(UPLOADS_DIR)) {
            total_count++;
            let checks = [];
            checks.push(files.length < limit);
            checks.push(file.includes('/scans/'));
            checks.push(file.includes('.json'));
            if (checks.every(a => a)) {
                const f = JSON.parse(fs.readFileSync(file, 'utf8'))
                if (withDetections) {
                    if (f.faces.detected.length > 0) {
                        files.push({ ...f, jsonFile: file });
                    }
                } else if (withRecognitions) {
                    if (f.faces.recognized.length > 0) {
                        files.push({ ...f, jsonFile: file });
                    }
                } else {
                    files.push({ ...f, jsonFile: file });
                }
            }
        }

        res.status(200).json({
            data: files,
            total: total_count,
        })
    } catch (e) {
        console.error(e);
        res.status(e.status).json({
            data: null,
            total: 0,
            error: e.message
        })
    }
});

router.get('/scans/faces/:type', async (req: Request, res: Response) => {
    try {
        const { type } = req.params;
        const { limit: _limit } = req.query || {};
        const limit = _limit ? parseInt(_limit as string) : 100;
        let files = [];
        let total_count = 0;
        let tmp_count = 0;
        let returnValue = {};
        console.log({ limit, type })
        for (const file of readAllFiles(UPLOADS_DIR)) {
            total_count++;

            let checks = [];
            checks.push(tmp_count < limit);
            checks.push(file.includes('/scans/'));
            checks.push(file.includes('.json'));
            if (checks.every(a => a)) {
                const f = JSON.parse(fs.readFileSync(file, 'utf8'))
                let d = f.faces[type];

                if (d.length > 0) {
                    d.forEach(f => {
                        const k = type === 'recognized' ? f.subject_id : 'unknown';

                        if (returnValue[k]) {
                            returnValue[k].push({ ...f, jsonFile: file })
                        } else {
                            returnValue[k] = [{ ...f, jsonFile: file }]
                        }
                    })
                    tmp_count += d.length;
                }
            }
        }

        res.status(200).json({
            data: returnValue,
            total: total_count,
            subtotal: tmp_count,
        })
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