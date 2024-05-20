import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import mime from "mime-types";
import Media from "src/media-exif";
import { commandOptions } from 'redis';
import { redisClient } from 'src';
import { Image } from "src/types/Image.types";

export const getImageBuffer = async (image: Image, query) => {
    const { strip: _strip } = query as { strip?: string };
    const strip = _strip === 'true' ? true : false;

    const mimetype = mime.lookup(image);

    let headers = {
        "Content-Type": mimetype,
        "Cache-Control": "public, max-age=86400",
        Expires: new Date(Date.now() + 86400000).toUTCString(),
    };

    const redisId = `media:${image}:${query}`;

    try {
        const { buffer } = await redisClient.hGetAll(
            commandOptions({ returnBuffers: true }),
            redisId
        );

        if (buffer) {
            headers["Content-Length"] = buffer.length;
            return { buffer, headers }
        }
    } catch (e) {
        console.log(e);
    }

    console.log({ postredis: true });
    try {
        const img = new Media({ path: image });
        const buffer = await img.toBuffer({ strip });

        await redisClient.hSet(redisId, "buffer", buffer);
        await redisClient.expire(redisId, parseInt(process.env.REDIS_EXPIRATION_MEDIA));

        headers["Content-Length"] = buffer.length;
        return { buffer, headers };

    } catch (e) {
        throw new Error(e);
    }
}