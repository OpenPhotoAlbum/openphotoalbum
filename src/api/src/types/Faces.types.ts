import { Thumbnail } from "./Image.types";
import { Subject } from "./Subjects.types";

export type DetectedThumbnail = Thumbnail;
export type RecognizedThumbnail = Thumbnail;

export type FaceImage<T = DetectedThumbnail | RecognizedThumbnail> = T;
export type FaceAge = {
    probability: number;
    high: number;
    low: number
};

export type FaceGender = {
    probability: number;
    value: "male" | "female"
};

export type FacePose = {
    pitch: number;
    roll: number;
    yaw: number
}

export type FaceBox = {
    probability: number;
    x_max: number;
    y_max: number;
    x_min: number;
    y_min: number
};

export type FaceMask = {
    probability: number;
    value: string
};

export type FaceLandmarks = [number, number][];

export type Face = {
    crop: number[];
    age: FaceAge;
    gender: FaceGender;
    pose: FacePose;
    box: FaceBox;
    mask: FaceMask;
    landmarks: FaceLandmarks;
}

export type RecognizedFace = Face & {
    image: FaceImage<RecognizedThumbnail>,
    subject: Subject;
    similarity: number
    verified?: boolean;
}

export type DetectedFace = Face & {
    image: FaceImage<DetectedThumbnail>;
}
