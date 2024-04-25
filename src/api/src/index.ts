import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import request from 'request-promise';
import bodyParser from 'body-parser';
import cors from 'cors';

import SubjectRoutes from './routes/Subjects.routes';

console.log('API STARTED')

var app = express();

app.use(bodyParser.text({ type: 'application/json' }));
app.use(cors({
    origin: ['http://10.0.0.15:8777']
}));

/*

function* take<T>(input: Generator<T>, count: number): Generator<T> {
  for (let i = 0; i < count; i++) {
    const result = input.next();
    if (result.done) {
      return;
    }
    yield result.value;
  }
}

function* drop<T>(input: Generator<T>, count: number): Generator<T> {
  for (let i = 0; i < count; i++) {
    const result = input.next();
    if (result.done) {
      return;
    }
  }
  yield* input;
}

function* readAllFiles(dir: string): Generator<string> {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            yield* readAllFiles(path.join(dir, file.name));
        } else {
            yield path.join(dir, file.name);
        }
    }
}

const res = take(drop(something, 500), 100);
// take==limit, drop==skip/offset 

*/

export function* readAllFiles(dir: string): Generator<string> {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            yield* readAllFiles(path.join(dir, file.name));
        } else {
            yield path.join(dir, file.name);
        }
    }
}

SubjectRoutes(app);

app.get('/img/*', async (req: Request, res: Response) => {
    try {
        res.sendFile(req.path.replace('/img', ''))
    } catch (e) {
        res.status(404).send()
    }
});

const addSubjectExample = async (subjectId: string, filename: string) => {
    let options: any = {
        method: "POST",
        url: `http://10.0.0.15:7000/api/v1/recognition/faces?subject=${subjectId}`,
        headers: {
            "x-api-key": "b8ed9cce-edbb-449a-9fa4-7be06fa72f34",
            "Content-Type": "multipart/form-data",
        },
        formData: {
            "file": fs.createReadStream(filename)
        },
        json: true
    };
    return await request(options);
}

app.post('/add_subject_examples/*', async (req: Request, res: Response) => {
    try {
        const { url, params, query } = req;
        const body = JSON.parse(req.body);

        const { subjectId, subjects } = body;

        let successes = [];
        let failures = [];

        for (let subject in subjects) {
            try {
                // @ts-ignore
                const subjectImage = subjects[subject].image;
                const jsonfile = subjects[subject].jsonFile

                const jsondata = JSON.parse(fs.readFileSync(jsonfile, 'utf8'))
                const detections = jsondata.faces.detected;
                const detectedMatch = detections.findIndex(d => d.image === subjectImage)
                let updatedSubject = detections[detectedMatch];
                if (!updatedSubject) return;
                let newjsondata = jsondata;

                const new_subject_sample_image = subjectImage.replace(
                    '/detected',
                    `/subjects/${subjectId}`
                );

                updatedSubject.subject = {
                    subject: subjectId,
                    similarity: 1,
                }

                updatedSubject.image = new_subject_sample_image;
                updatedSubject.verified = true;
                updatedSubject.vendor_image_id = subjectId;
                newjsondata.faces.detected.splice(detectedMatch, 1)
                newjsondata.faces.recognized.push(updatedSubject);

                console.log({
                    subjectId,
                    subjectImage,
                    jsonfile,
                    new_subject_sample_image,
                })

                const { image_id, subject: _subject } = await addSubjectExample(subjectId, subjectImage)
                fs.writeFileSync(jsonfile, JSON.stringify(newjsondata));

                if (!fs.existsSync(path.parse(new_subject_sample_image).dir)) {
                    fs.mkdirSync(path.parse(new_subject_sample_image).dir, { recursive: true })
                }

                fs.renameSync(subjectImage, new_subject_sample_image);
                successes.push(subjectImage)
            } catch (e) {
                console.error(e);
                failures.push(subjects[subject].image)
            }
        }
        res.status(200).send({ successes, failures })
    } catch (e) {
        console.log(e);
        res.status(400).send()
    }
});

app.post('/delete/detected/subjects', async (req: Request, res: Response) => {
    try {
        const { url, params, query } = req;
        const body = JSON.parse(req.body);

        let successes = [];
        let failures = [];
        for (let _body in body) {
            try {
                const [jsonfile, imgs] = body[_body];

                for (let image in imgs) {
                    const subjectImage = imgs[image];
                    const jsondata = JSON.parse(fs.readFileSync(jsonfile, 'utf8'))
                    const detections = jsondata.faces.detected;
                    const detectedMatch = detections.findIndex(d => d.image === subjectImage)
                    let updatedSubject = detections[detectedMatch];
                    if (!updatedSubject) return;
                    let newjsondata = jsondata;

                    newjsondata.faces.detected.splice(detectedMatch, 1)

                    fs.writeFileSync(jsonfile, JSON.stringify(newjsondata));
                    successes.push(subjectImage)
                }
            } catch (e) {
                // console.error(e);
                // failures.push(subjects[subject].image)
            }
        }
        res.status(200).send({ successes, failures })
    } catch (e) {
        console.log(e);
        res.status(400).send()
    }
});

app.get("/scans/*", async (req: Request, res: Response) => {
    const { limit: _limit, withDetections = false, withRecognized = false } = req.query || {};

    const limit = _limit ? parseInt(_limit as string) : undefined;

    let files = [];
    let total_count = 0;
    for (const file of readAllFiles('/home/uploads')) {
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
            } else if (withRecognized) {
                if (f.faces.recognized.length > 0) {
                    files.push({ ...f, jsonFile: file });
                }
            } else {
                files.push({ ...f, jsonFile: file });
            }
        }
    }

    res.json({
        data: files,
        total: total_count,
    })
});

app.get("/images/*", async (req: Request, res: Response) => {
    const { limit: _limit } = req.query;

    const limit = _limit ? parseInt(_limit as string) : undefined;

    const files = [];
    let _files = [];

    for (const file of readAllFiles('/home/uploads/cayce')) {
        if (_files.length < limit) {
            _files.push(file);
        }
    }

    res.json(_files)
});

app.listen(9447, () => {
    console.log("Server running on port 9447");
});
