import dotenv from "dotenv";
import { Tags } from 'exiftool-vendored';
import { Sharp, Logger, MediaExifTool, Fs } from './lib'
import pathlib from 'path';
import Compreface, { RecognitionService, VerificationService, DetectionService, DetectType, RecognizeType } from '/home/openphoto/@photogate/compreface-sdk'
import exifremove from "exifremove";

import sharp, { OutputInfo } from 'sharp';
import { WriteFileOptions, stat } from 'fs';
import { Crop, CropBox, Resize } from './lib/Sharp';
import { inspect } from "util";
import mime from "mime";

dotenv.config({ path: '/home/openphoto/config/.env.local' });

const RECOGNITION_KEY = process.env.COMPREFACE_RECOGNITION_KEY;
const DETECTION_KEY = process.env.COMPREFACE_DETECTION_KEY;
const VERIFCATION_KEY = process.env.COMPREFACE_VERIFCATION_KEY;
const API_URL = process.env.COMPREFACE_API_URL;
const RECOGNITION_URI = process.env.COMPREFACE_RECOGNITION_URI;
const VERIFICATION_URI = process.env.COMPREFACE_VERIFICATION_URI;
const DETECTION_URI = process.env.COMPREFACE_DETECTION_URI;

interface MediaType {
    path: string
}

type WeatherType = {
    moonday: number,
    moonphase: number,
    wind: string,
    precipitation: string,
    zenith: string,
    humidity: string,
    temperature: string,
};

type WeatherTags = Pick<Tags,
    | 'AmbientTemperature'
    | 'AmbientTemperatureFahrenheit'
    | 'RelativeHumidity'
    | 'UserComment'
>;

// = {
//     AmbientTemperature: string;
//     Humidity: string;
//     UserComment
// }

enum Mount {
    "foo",
}

enum Telescope {
    "foo",
}

type ImageTags = {
    dominantColor?: string;
}
/*

 PERHAPS MAKE THIGNS LIKE WEATHER
 ASRONOMY
 ETC..    PLUGINS instead of built in

*/
type AstronomyTags = {
    weather?: WeatherTags;
    mount?: Mount;
    telescope?: Telescope;
    tracking?: boolean;
    target?: {
        ra: string;
        dec: string;
        name: string;
    }
}

type FacesTags = {
    recognized?: RecognizeType[];
    detected?: DetectType[];
};

type CropOptions = {
    postfix?: string;
    dir?: string;
}

type ExtractedFace = {
    image: string,
    crop: string,
}

type ExtractedRecognizedFace = {
    subject: unknown;
    subject_id: string;
} & ExtractedFace;

type ExtractedDetectedFace = ExtractedFace

type ExtractFaces = {
    detected?: ExtractedDetectedFace[],
    recognized?: ExtractedRecognizedFace[]
}

type AllMediaData = {
    exif: Tags;
    image?: ImageTags,
    astronomy?: AstronomyTags
    faces?: FacesTags
};

const GLOBAL_SIMILARITY_THRESHOLD = .97;

class Media extends Fs {
    config: MediaType;
    logger = new Logger('Media');

    private _exif: MediaExifTool;
    private _sharp: Sharp;
    private _Recognition: RecognitionService;
    private _Detection: DetectionService;
    private _tags: Tags;
    private _dominantColor: string;

    constructor(c: MediaType) {
        super();
        this.config = c;
        const Compre = new Compreface({
            api_url: API_URL,
            recognition_key: RECOGNITION_KEY,
            verification_key: VERIFCATION_KEY,
            detection_key: DETECTION_KEY,
            recognition_uri: RECOGNITION_URI,
            verification_uri: VERIFICATION_URI,
            detection_uri: DETECTION_URI
        });
        this._exif = new MediaExifTool(c);
        this._Recognition = Compre.initRecognitionService();
        this._Detection = Compre.initDetectionService();
    }

    private sharp(): Sharp | undefined {
        if (!this._sharp) {
            this._sharp = new Sharp(this.config)
        }
        return this._sharp;
    }

    private stripMetadata(b: Buffer): Buffer {
        return exifremove.remove(b);
    }

    public async toFile(args: { name: string, options: WriteFileOptions } | undefined): Promise<string> {
        const data = await this.toBuffer()

        const _dest = args?.name
            ? args.name
            : `${this._exif.dir}/${this._exif.name}-copy${this._exif.ext}`;

        try {
            this.writeFile({ dest: _dest, data, options: args?.options || {} })
            return _dest;

        } catch (e) {
            this.logger.error(e)
        }
    }

    public async toBuffer(): Promise<Buffer> {
        return await this.getBuffer(this.config.path)
    }

    public async getExifTags() {
        try {
            if (this._tags) return this._tags;
            this._tags = await this._exif.readTags()
            return this._tags;
        } catch (e) {
            this.logger.error(e)
        }
    }

    public async exportAllData({ dir, jsonfile, extractFaces = false }: { dir?: string, jsonfile?: string, extractFaces: boolean }): Promise<AllMediaData> {
        const data = await this.getAllData();
        const filename = jsonfile || `${dir || this._exif.dir}/${this._exif.name}.json`;
        if (extractFaces) {
            const faces = await this.extractFaces({ dir });
            data.faces = faces;
        }
        this.dataToFile(filename, data)

        return data;
    }

    public async getAllData(): Promise<AllMediaData> {
        let dominantColor = '#d4d4d4';

        try {
            dominantColor = await this.getDominantColor();
        } catch (e) {
            this.logger.warn(e)
        }

        const data = {
            exif: await this.getExifTags(),
            image: { dominantColor },
            astronomy: {},
            faces: {
                recognized: await this.recognizeFaces(),
                detected: await this.detectFaces()
            }
        }
        return data
    }

    public async detectFaces() {
        const { result, status } = await this._Detection.detect(this.config.path, {
            face_plugins: ["age", "embedding", "gender", "landmarks", "pose", "mask"],
            limit: 8,
            det_prob_threshold: ".8",
        });
        if (status === 200) return result;
    }

    public async recognizeFaces() {
        const { result, status } = await this._Recognition.recognize(this.config.path, {
            face_plugins: ["age", "embedding", "gender", "landmarks", "pose", "mask"],
            limit: 8,
            det_prob_threshold: "0.9",
        })
        if (status === 200) return result;
    }

    public async extractFaces({ dir: _dir }: { dir: string }): Promise<ExtractFaces> {
        const recognizedFaces = await this.recognizeFaces() || [];
        const detectedFaces = await this.detectFaces() || [];

        const recognizedRes = recognizedFaces ?
            await Promise.all(recognizedFaces.map(async (recognized, i) => {
                const { box, subjects } = recognized;

                const c = [box.x_max, box.x_min, box.y_max, box.y_min] as CropBox;
                const dir = _dir ? `${_dir}/subjects/${subjects[0].subject}` : undefined;
                this.mkdirSync(dir);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { subjects: _, ...rest } = recognized;
                try {
                    if (subjects[0].similarity > GLOBAL_SIMILARITY_THRESHOLD) {
                        return {
                            image: await this.crop(c, { dir, postfix: `___crop${i.toString()}` }),
                            crop: c,
                            subject: subjects[0],
                            subject_id: subjects[0].subject,
                            ...rest,
                        }
                    } else {
                        // throw new Error('Recognized face not close enough')
                    }
                } catch (e) {
                    this.logger.error(e)
                }
            }))
            : []

        const detectedRes = detectedFaces ?
            await Promise.all(detectedFaces?.map(async (detected, i) => {
                const { box } = detected;
                const c = [box.x_max, box.x_min, box.y_max, box.y_min] as CropBox;
                const wasRecognized = recognizedRes?.filter(a => a)
                    .map(r => r.crop.join('')).includes(c.join('')) || false;

                if (!wasRecognized) {
                    const dir = _dir ? `${_dir}/detected/` : undefined;
                    this.mkdirSync(dir);

                    try {
                        return {
                            image: await this.crop(c, { dir, postfix: `___crop${i.toString()}` }),
                            crop: c,
                            ...detected
                        }
                    } catch (e) {
                        this.logger.error(e)
                    }
                }
            }))
            : [];

        return {
            detected: detectedRes.filter(a => a),
            recognized: recognizedRes.filter(a => a),
        };
    }

    public async getDominantColor() {
        try {
            if (this._dominantColor) return this._dominantColor;

            const s = this.sharp()
            this._dominantColor = await s.getDominantColor()
            return this._dominantColor;
        } catch (e) {
            this.logger.error(e)
        }
    }

    public async crop(crop: Crop | CropBox, options: CropOptions = {}): Promise<string> {
        const { postfix, dir } = options;
        const filename = `${dir || this._exif.dir}/${this._exif.name}${postfix ? postfix : dir ? '' : '-crop'}.jpg`.replace('//', '/');
        const cropBuffer = await this.sharp().crop(crop);
        this.writeFile({ dest: filename, data: cropBuffer, options: {} })
        return filename
    }
}

export default Media;



// '-Title=' + str(title),
//             '-AmbientTemperature=' + str((float(weather.get('temperature').replace('°F', ''))-32)*(5/9)) if weather.get('temperature') else "",
//             '-Humidity=' + str(float(weather.get('humidity').replace('%', ''))/100) if weather.get('humidity') else '',
//             '-UserComment={\
//                 "title": "' + str(title) + '", \
//                 "luminance": "' + str(lum_val) + '", \
//                 "target": { \
//                     "id": "' + target_id + '", \
//                     "name": "' + target_name + '", \
//                     "ra": "' + target_ra + '", \
//                     "dec": "' + target_dec + '" \
//                 }, \
//                 "moonday": "' + weather.get('moonday') + '", \
//                 "moonphase": "' + weather.get('moonphase') + '", \
//                 "wind": "' + weather.get('wind') + '", \
//                 "precipitation": "' + weather.get('precipitation') + '", \
//                 "zenith": "' + weather.get('zenith') + '", \
//                 "condition": "' + weather.get('condition') + '", \
//                 "humidity": "' + weather.get('humidity') + '", \
//                 "temperature": "' + weather.get('') + '", \
//                 "ra": "' + ra + '", \
//                 "dec": "' + dec + '" \
//             }',