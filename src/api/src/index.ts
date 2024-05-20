import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
import * as redis from "redis";
import connectRedis from "connect-redis";

dotenv.config({ path: '/home/openphoto/config/.env.local' });

const UPLOADS_DIR = process.env.UPLOADS_DIR;

const redis_url = `redis://127.0.0.1:${process.env.REDIS_PORT}`;
export const redisClient = redis.createClient({ url: redis_url });

import { ScanRoutes, UploadRoutes, ImgRoutes } from './routes';

console.log('API STARTED')

const app = express();


app.use(bodyParser.json());

app.use((req, res, next) => {
    req.on("end", () => {
        console.info(req.method, res.statusCode, req.url);
    });
    next();
});

app.use(cors({ origin: ['http://10.0.0.15:8777'] }));

redisClient.connect().catch(console.error);

const store = new connectRedis({
    client: redisClient,
    prefix: "photogate:",
});

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

// app.use((req, res, next) => {
//     next()
// })

app.use(ImgRoutes)
app.use(ScanRoutes);
app.use(UploadRoutes);

app.get('/img/*', async (req: Request, res: Response) => {
    try {
        res.sendFile(req.path.replace('/img', ''))
    } catch (e) {
        res.status(404).send()
    }
});


app.get("/images/*", async (req: Request, res: Response) => {
    const { limit: _limit } = req.query;

    const limit = _limit ? parseInt(_limit as string) : undefined;

    const files = [];
    let _files = [];

    for (const file of readAllFiles(`${UPLOADS_DIR}/cayce`)) {
        if (_files.length < limit) {
            _files.push(file);
        }
    }

    res.json(_files)
});

app.listen(9447, () => {
    console.log("Server running on port 9447");
});
