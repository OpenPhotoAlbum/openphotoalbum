import dotenv from "dotenv";
import { Tags } from 'exiftool-vendored';
import mime from 'mime';

import { Sharp, MediaExifTool, Fs } from './src'
import Logger from '../Logger';
import Compreface, { RecognitionService, DetectionService } from '../compreface'
import { image, type Image } from '../types/Image.types';

import { WriteFileOptions } from 'fs';
import { Crop, CropBox } from './src/Sharp';
import { DetectedFace, RecognizedFace } from 'src/types/Faces.types';
import { Scan } from "src/types/Scans.types";

dotenv.config({ path: '/home/openphoto/config/.env' });

const UPLOADS_DIR = process.env.UPLOADS_DIR;
const RECOGNITION_KEY = process.env.COMPREFACE_RECOGNITION_KEY;
const DETECTION_KEY = process.env.COMPREFACE_DETECTION_KEY;
const VERIFCATION_KEY = process.env.COMPREFACE_VERIFCATION_KEY;
const API_URL = process.env.COMPREFACE_API_URL;
const RECOGNITION_URI = process.env.COMPREFACE_RECOGNITION_URI;
const VERIFICATION_URI = process.env.COMPREFACE_VERIFICATION_URI;
const DETECTION_URI = process.env.COMPREFACE_DETECTION_URI;

interface MediaType {
    path: Image
}

type CropOptions = {
    postfix?: string;
    dir?: string;
};

type ExtractFaces = {
    recognized?: RecognizedFace[];
    detected?: DetectedFace[];
};

const GLOBAL_SIMILARITY_THRESHOLD = .97;

class Media extends Fs {
    config: MediaType;
    logger = new Logger('Media');

    filename: string;
    mimetype: string;
    scan_directory: string;
    json_scan_file: string;
    isImage: boolean;

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
        this.filename = `${UPLOADS_DIR}${this.config.path}`;
        this._exif = new MediaExifTool({ path: this.filename });
        this.mimetype = mime.getType(this.filename);
        this._Recognition = Compre.initRecognitionService();
        this._Detection = Compre.initDetectionService();
        this.scan_directory = `${this._exif.dir}/scans`;
        this.json_scan_file = `${this.scan_directory}/${this._exif.name}.json`;
        this.isImage = this.mimetype.includes('image');
    }

    sharp(): Sharp | undefined {
        if (this.isImage) {
            if (!this._sharp) {
                this._sharp = new Sharp({ path: this.filename })
            }
            return this._sharp;
        }
    }

    public async toFile(args: { name: Image, options: WriteFileOptions } | undefined): Promise<Image> {
        const data = await this.toBuffer({ strip: false })

        const _dest = args?.name
            ? args.name
            : image(`${this._exif.dir}/${this._exif.name}-copy${this._exif.ext}`);

        try {
            this.writeFile({ dest: _dest, data, options: args?.options || {} })
            return _dest;

        } catch (e) {
            this.logger.error(e)
        }
    }

    public async toBuffer({ strip = false }: { strip?: boolean } | undefined): Promise<Buffer> {
        console.log({ strip })
        const s = await this.sharp().toBuffer({ strip });
        return s.data;
    }

    public async getExifTags(): Promise<Tags> {
        try {
            if (this._tags) return this._tags;
            this._tags = await this._exif.readTags()
            return this._tags;
        } catch (e) {
            this.logger.error(e)
        }
    }

    public async exportAllData({ extractFaces = false }: { extractFaces?: boolean }): Promise<string> {
        const data = await this.getAllData();

        if (extractFaces && this.isImage) {
            const faces = await this.extractFaces({ dir: this.scan_directory });
            data.faces = faces;
        }

        this.dataToFile(this.json_scan_file, data)
        return this.json_scan_file;
    }

    public async getAllData(): Promise<Scan> {
        let dominantColor: string | undefined;

        if (this.isImage) {
            try {
                dominantColor = await this.getDominantColor();
            } catch (e) {
                this.logger.warn(e)
            }
        }

        const data = {
            exif: await this.getExifTags(),
            image: { dominantColor },
            astronomy: {}
        }

        data.exif.Directory = data.exif.Directory.replace(UPLOADS_DIR, '');
        data.exif.SourceFile = data.exif.SourceFile.replace(UPLOADS_DIR, '');

        return data
    }

    public async detectFaces(): Promise<DetectedFace[]> {
        const { result, status } = await this._Detection.detect(this.filename, {
            face_plugins: ["age", "embedding", "gender", "landmarks", "pose", "mask"],
            limit: 8,
            det_prob_threshold: ".8",
        });
        if (status === 200) return result;
    }

    public async recognizeFaces(): Promise<RecognizedFace[]> {
        const { result, status } = await this._Recognition.recognize(this.filename, {
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
                const { box, subject, similarity } = recognized;

                const c = [box.x_max, box.x_min, box.y_max, box.y_min] as CropBox;
                const dir = _dir ? `${_dir}/subjects/${subject}` : undefined;
                this.mkdirSync(dir);
                const { subject: _, ...rest } = recognized;
                try {
                    if (similarity > GLOBAL_SIMILARITY_THRESHOLD) {
                        return {
                            image: await this.crop(c, { dir, postfix: `___crop${i.toString()}` }),
                            crop: c,
                            similarity,
                            subject,
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
        return filename.replace(UPLOADS_DIR, '');
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