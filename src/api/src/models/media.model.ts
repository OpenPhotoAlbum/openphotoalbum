import fs from 'fs';

import { DetectedFace, Image, RecognizedFace, Scan, image } from 'types';
import { Timestamps } from './shared.types';

import db from '.';
import Media from 'src/media-exif';

type RawFacesModel = Timestamps & { id: number, media_id: number, subject_id: number; path: string, verified: boolean, similarity: number, data: string };
type RawMediaModel = Timestamps & { id: number, path: Image, exif: string };

export const addMedia = async (path: Image): Promise<number> => {

    const insertDatabaseRows = async (data: Scan) => {
        const { faces: { detected, recognized } } = data;

        const media_id = await db('media')
            .insert({
                path,
                exif: JSON.stringify(data.exif)
            });

        for (let f of recognized) {
            const { subject, similarity, image, ...rest } = f;

            await db('faces').insert({
                media_id: media_id[0],
                subject_id: subject,
                similarity: parseFloat(similarity.toString()),
                path: image,
                verified: similarity === 1,
                data: JSON.stringify(rest)
            });
        }

        for (let f of detected) {
            const { image, ...rest } = f;
            await db('faces').insert({
                media_id: media_id[0],
                path: f.image,
                verified: false,
                data: JSON.stringify(rest)
            });
        }

        return media_id[0];
    }

    try {
        const image_path = image(decodeURI(path));
        const media = new Media({ path: image_path });
        const data: Scan = JSON.parse(fs.readFileSync(media.json_scan_file, { encoding: 'utf-8' }));

        const inserted_media_id = await insertDatabaseRows(data);

        return inserted_media_id;
    } catch (e) {
        console.error(e);
    }
}

export const getMediaByPath = async (path: Image): Promise<Partial<Scan>> => {
    try {
        const media_data = await db<RawMediaModel>('media')
            .where({ path })
            .select('*')
            .first();

        const faces_data = await db<RawFacesModel>('faces')
            .where({ media_id: media_data.id })
            .select('*');

        const recognized: RecognizedFace[] = [];
        const detected: DetectedFace[] = [];

        faces_data.forEach((f) => {
            const { data, ...rest } = f;
            if (f.subject_id) {
                recognized.push({
                    image: rest.path,
                    subject: rest.subject_id,
                    similarity: rest.similarity,
                    verified: rest.verified,
                    ...JSON.parse(data)
                });
            } else {
                detected.push({
                    image: rest.path,
                    ...JSON.parse(data)
                });
            }
        });

        return {
            id: media_data.id,
            faces: { recognized, detected },
            exif: JSON.parse(media_data.exif)
        };
    } catch (e) {
        console.error(e);
    }
}