import mime from "mime-types";

import Media from "src/media-exif";
import { Image } from "src/types";

export const getImageBuffer = async (image: Image, query) => {
    const { strip: _strip } = query as { strip?: string };
    const strip = _strip === 'true' ? true : false;

    const mimetype = mime.lookup(image);
    const expiry_time = Date.now() + parseInt(process.env.REDIS_EXP_SECONDS_MEDIA) * 1000;

    let headers = {
        "Content-Type": mimetype,
        "Cache-Control": `public, max-age=${process.env.REDIS_EXP_SECONDS_MEDIA}`,
        Expires: new Date(expiry_time).toUTCString(),
    };

    try {
        const img = new Media({ path: image });
        const buffer = await img.toBuffer({ strip });

        headers["Content-Length"] = buffer.length;
        return { buffer, headers };

    } catch (e) {
        throw new Error(e);
    }
}