import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
import { ScanRoutes, UploadRoutes, MediaRoutes, SubjectsRoutes } from './routes';
import './models';

dotenv.config({ path: '/home/openphoto/config/.env' });

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

app.use(MediaRoutes)
app.use(ScanRoutes);
app.use(UploadRoutes);
app.use(SubjectsRoutes);

const main = async () => {
    app.listen(process.env.API_PORT, () => {
        console.log("Server running on port 9447");
    });
}

main();
