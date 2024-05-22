import { Tags } from 'exiftool-vendored';

import { RecognizedFace, DetectedFace } from './Faces.types';
import { Branded } from './_brand';

export type ImageTags = {
    dominantColor?: string;
}

export type ScanJsonPath = Branded<string, 'scan_json_path'>;

export const scanJsonPath = (p: string) => p as ScanJsonPath;

export type Scan = {
    id?: number;
    exif: Tags;
    src?: string;
    faces?: {
        recognized?: RecognizedFace[];
        detected?: DetectedFace[];
    };
};
