import dotenv from "dotenv";
import express, { Request, Response } from 'express';

import Logger from "src/Logger";
import { getSubjectRows } from 'src/models/subjects.model';
import { addSubject, addSubjectExample } from "src/resolvers/Compreface.resolvers";
import { image as imageBrand } from "types";

dotenv.config({ path: '/home/openphoto/config/.env' });

const router = express.Router();
const logger = new Logger('Subjects.routes.ts');

router.get('/subjects', async (req: Request, res: Response) => {
    try {
        const subjects = await getSubjectRows();
        res.status(200).json(subjects);
    } catch (e) {
        logger.error(e);
        res.status(e.status).json({ error: e.message })
    }
});

// UNTESTED
router.post('/subjects', async (req: Request, res: Response) => {
    try {
        const { subjectId } = JSON.parse(req.body);
        const id = subjectId.replaceAll(' ', '_').toLowerCase();
        const r = await addSubject(id);
        res.status(200).json(r)
    } catch (e) {
        console.error(e);
        res.status(400).send();
    }
});

// UNTESTED
router.post('/subjects/:subjectId/examples', async (req: Request, res: Response) => {
    try {
        const body = JSON.parse(req.body);

        const { subjectId, subjects } = body;

        let successes = [];
        let failures = [];

        for (let subject in subjects) {
            const image = imageBrand(subjects[subject].image);
            addSubjectExample(subjectId, image);
        }

        res.status(200).send({ successes, failures })
    } catch (e) {
        logger.error(e);
        res.status(400).json({ error: e.message })
    }
});

export default router;
