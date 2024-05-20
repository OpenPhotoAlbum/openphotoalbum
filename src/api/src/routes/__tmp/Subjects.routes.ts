import express, { Request, Response } from 'express';
import request from 'request-promise';
import fs from 'fs';
import path from 'path';
import { getSubjects, addSubject, deleteSubjectDetection, addSubjectExampleById } from '../../resolvers';
import { imagePath } from "src/lib/media.types";

const router = express.Router();

router.get('/subjects', async (_, res: Response) => {
    try {
        const { subjects } = await getSubjects();
        res.status(200).send(subjects);
    } catch (e) {
        res.status(400).send([])
    }
});

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

router.post('/subjects/:subjectId/examples', async (req: Request, res: Response) => {
    try {
        const { url, params, query } = req;
        const body = JSON.parse(req.body);

        const { subjectId, subjects } = body;

        let successes = [];
        let failures = [];

        for (let subject in subjects) {
            const image = imagePath(subjects[subject].image);
            addSubjectExampleById({ id: subjectId, image });
        }
        res.status(200).send({ successes, failures })
    } catch (e) {
        console.log(e);
        res.status(400).send()
    }
});

router.delete('/subjects/:subjectId/examples', async (req: Request, res: Response) => {
    try {
        const body = JSON.parse(req.body);

        res.status(200).send(await deleteSubjectDetection(body))
    } catch (e) {
        res.status(400).send()
    }
});

export default router;