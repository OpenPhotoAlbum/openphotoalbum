import { Branded } from './_brand';

export type Image = Branded<string, 'image'>;
export type Thumbnail = Branded<Image, 'thumbnail_image'>;
export type SubjectImage = Branded<Image, 'subject_image'>;

export const image = (p: string) => p as Image;
export const thumbnail = (p: string) => p as Thumbnail;
export const subjectImage = (p: string) => p as SubjectImage;
