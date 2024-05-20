import express, { Request, Response } from 'express';
import { deleteSubjectDetection } from '../../resolvers';

const router = express.Router();

// TODO: Add `mediaId` to all media scans
// TODO: Add `id` to all media scan detections
router.delete('/media/:mediaId/detections/:id', async (req: Request, res: Response) => {
    try {
        const body = JSON.parse(req.body);

        res.status(200).send(await deleteSubjectDetection(body))
    } catch (e) {
        res.status(400).send()
    }
});

export default router;