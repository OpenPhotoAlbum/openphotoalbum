import express, { Express, Request, Response } from 'express';
import request from 'request-promise';


const addSubject = async (id: string) => {
    let options: any = {
        method: "POST",
        url: `http://10.0.0.15:7000/api/v1/recognition/subjects`,
        headers: {
            "x-api-key": "b8ed9cce-edbb-449a-9fa4-7be06fa72f34",
            "Content-Type": "application/json",
        },
        body: {
            subject: id,
        },
        json: true
    };
    return await request(options);

}

const SubjectRoutes = (app: Express) => {
    app.get('/subjects/', async (req: Request, res: Response) => {
        const options = {
            method: "GET",
            url: `http://10.0.0.15:7000/api/v1/recognition/subjects/`,
            headers: {
                "x-api-key": "b8ed9cce-edbb-449a-9fa4-7be06fa72f34",
                "Content-Type": "application/json",
            },
            json: true
        };

        try {
            const { subjects } = await request(options);
            res.status(200).send(subjects);
        } catch (e) {
            res.status(400).send([])
        }
    });

    app.post('/subjects/', async (req: Request, res: Response) => {
        try {
            const { subjectId } = JSON.parse(req.body);
            const r = await addSubject(subjectId.replaceAll(' ', '_').toLowerCase());
            res.status(200).json(r)
        } catch (e) {
            console.error(e);
            res.status(400).send();
        }
    });
}

export default SubjectRoutes;