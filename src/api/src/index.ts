import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
import { ScanRoutes, UploadRoutes, ImgRoutes } from './routes';

dotenv.config({ path: '/home/openphoto/config/.env.local' });

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

app.use(ImgRoutes)
app.use(ScanRoutes);
app.use(UploadRoutes);

app.listen(process.env.API_PORT, () => {
    console.log("Server running on port 9447");
});
