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

export type Subject = {
    image: string;
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

export type Recognition = Subject & {
    subject: {
        subject: string;
        similarity: number
    };
    subject_id?: SubjectId;
    verified?: boolean;
    vendor_image_id?: string;
}

export type Detection = Subject & {}

export type Faces = {
    recognized?: Recognition[];
    detected?: Detection[];
};

export type Scan = {
    exif: Tags;
    image?: ImageTags;
    astronomy?: AstronomyTags
    faces?: Faces
};

