import { Tags } from 'exiftool-vendored';
import { RecognizedFace, DetectedFace } from './Faces.types';

export type ImageTags = {
    dominantColor?: string;
}

export type Scan = {
    exif: Tags;
    image?: ImageTags;
    faces?: {
        recognized?: RecognizedFace[];
        detected?: DetectedFace[];
    };
};
