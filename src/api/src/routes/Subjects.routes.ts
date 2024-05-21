import dotenv from "dotenv";
import express, { Request, Response } from 'express';

import { getSubjectRows } from 'src/models/subjects.model';

dotenv.config({ path: '/home/openphoto/config/.env' });

const router = express.Router();

router.get('/subjects', async (req: Request, res: Response) => {
    try {
        const subjects = await getSubjectRows();
        res.status(200).json(subjects);
    } catch (e) {
        console.error(e);
        res.status(e.status).json({
            started: false,
            error: e.message
        })
    }
});

export default router;
