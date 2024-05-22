import fs from 'fs';

import { DetectedFace, Image, RecognizedFace, Scan, image } from 'types';
import { Timestamps } from './shared.types';
import { redisClient } from 'src/redis';

import db from '.';
import Media from 'src/media-exif';
import { Headers } from 'request';
import { getClosestCityIdByCoords, getGeolocationById } from './geolocation.model';
import { Geolocation } from 'src/types/Geolocation.types';

type RawFacesModel = Timestamps & { id: number, media_id: number, subject_id: number; path: string, verified: boolean, similarity: number, data: string };
type RawMediaModel = Timestamps & { id: number, path: Image, exif: string, city_id: number; };

export const addMedia = async (path: Image): Promise<number> => {

    const insertDatabaseRows = async (data: Scan & { city_id?: number }) => {
        const { faces: { detected, recognized } } = data = { faces: { detected: [], recognized: [] }, ...data };

        const media_id = await db('media')
            .insert({
                path,
                exif: JSON.stringify(data.exif),
                city_id: data.city_id
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
        let city_id: number;

        const { GPSLatitude, GPSLongitude } = await media.getExifTags();
        if (GPSLatitude && GPSLongitude) {
            const { data: _city_id } = await getClosestCityIdByCoords(
                GPSLatitude, GPSLongitude
            );
            city_id = _city_id;
        }

        const data: Scan = JSON.parse(fs.readFileSync(media.json_scan_file, { encoding: 'utf-8' }));

        const inserted_media_id = await insertDatabaseRows({ ...data, city_id });

        return inserted_media_id;
    } catch (e) {
        console.error(e);
    }
}

export const getMediaByPath = async (path: Image): Promise<Partial<Scan> & { geolocation: Geolocation }> => {
    try {
        let geolocation: Geolocation;

        const media_data = await db<RawMediaModel>('media')
            .where({ path })
            .select('*')
            .first();

        if (media_data?.city_id) {
            geolocation = await getGeolocationById(media_data.city_id);
            console.log(geolocation)
        }

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
            src: media_data.path,
            faces: { recognized, detected },
            geolocation,
            exif: JSON.parse(media_data.exif)
        };
    } catch (e) {
        console.error(e);
    }
}

type GetMedia = { from: number, limit: number, faces: boolean };
const DEFAULT_GET_MEDIA = { from: 0, limit: 10, faces: true };
export const getMedia = async (query: GetMedia = DEFAULT_GET_MEDIA): Promise<{ headers: Headers, data: Partial<Scan>[] }> => {
    const { from, limit, faces } = query;

    let geolocation: Geolocation;

    const expiry_time = Date.now() + parseInt(process.env.REDIS_EXP_SECONDS_MEDIA) * 1000;

    let headers = {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${process.env.REDIS_EXP_SECONDS_MEDIA}`,
        Expires: new Date(expiry_time).toUTCString(),
    };

    const redisId = `mediafiles:${JSON.stringify(query)}`;

    try {
        const cached = await redisClient.GET(redisId);
        if (cached) return { headers, data: JSON.parse(cached) };
    } catch (e) {
        console.log(e);
    }

    try {
        const final = [];

        const media_files = await db<RawMediaModel>('media')
            .select('*')
            .limit(limit)
            .offset(from);

        for (let media_data of media_files) {
            if (media_data?.city_id) {
                geolocation = await getGeolocationById(media_data.city_id);
            }

            let media_file: Partial<Scan> & { geolocation: Geolocation } = {
                id: media_data.id,
                src: media_data.path,
                geolocation,
                exif: JSON.parse(media_data.exif)
            };

            if (faces) {
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

                media_file.faces = { recognized, detected };
            }

            final.push(media_file);
        }

        await redisClient.SET(redisId, JSON.stringify(final), { EX: parseInt(process.env.REDIS_EXP_SECONDS_MEDIA) })

        return { headers, data: final };
    } catch (e) {
        console.error(e);
    }
}