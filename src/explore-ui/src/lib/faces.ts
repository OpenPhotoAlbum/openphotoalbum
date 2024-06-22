import { Tags } from 'exiftool-vendored';

export type SubjectId = string;

export type ImageTags = {
    dominantColor?: string;
}

export enum Mount {
    "foo"
}

export enum Telescope {
    "foo"
}


export type WeatherTags = Pick<Tags,
    | 'AmbientTemperature'
    | 'AmbientTemperatureFahrenheit'
    | 'RelativeHumidity'
    | 'UserComment'
>

export type AstronomyTags = {
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

export type ImageUrl = string;
export type SubjectImage = ImageUrl;
export type DetectedThumbnail = ImageUrl;
export type RecognizedThumbnail = ImageUrl;
export type FaceCrop = ImageUrl;
export type FaceImage<T = DetectedThumbnail | RecognizedThumbnail> = T;

export type Face = {
    image: FaceImage;
    crop: number[];
    age: {
        probability: number;
        high: number;
        low: number
    };
    gender: {
        probability: number;
        value: "male" | "female"
    };
    pose: {
        pitch: number;
        roll: number;
        yaw: number
    };
    box: {
        probability: number;
        x_max: number;
        y_max: number;
        x_min: number;
        y_min: number
    };
    mask: {
        probability: number;
        value: string
    };
    landmarks: [number, number][];
}

export type RecognizedFace = Face & {
    image: FaceImage<RecognizedThumbnail>,
    subjectId: SubjectId;
    similarity: number
    verified?: boolean;
    vendor_image_id?: string;
}

export type DetectedFace = Face & {
    image: FaceImage<DetectedThumbnail>;
}

export type Faces = {
    recognized?: RecognizedFace[];
    detected?: DetectedFace[];
};

export type Scan = {
    exif: Tags;
    image?: ImageTags;
    astronomy?: AstronomyTags
    faces?: Faces
};

