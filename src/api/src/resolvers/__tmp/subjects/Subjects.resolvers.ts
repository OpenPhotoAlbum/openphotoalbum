import fs from 'fs';
import path from 'path';
import { findJsonFromImagePath } from 'src/util/media.json';
import { addSubjectExample } from '../compreface';
import { ImagePath, imagePath } from "src/lib/media.types";
import { DetectedFace, RecognizedFace } from 'src/lib/Scans.types';

type AddSubjectExampleById = { id: string, image: ImagePath };

export const addSubjectExampleById = async (args: AddSubjectExampleById): Promise<ImagePath> => {
    const { id, image } = args;

    const jsonfile = findJsonFromImagePath(image);
    const jsondata = JSON.parse(fs.readFileSync(jsonfile, 'utf8'))

    const detections: DetectedFace[] = jsondata.faces.detected;
    const detectedMatch = detections.findIndex(d => d.image === image)
    if (!detections[detectedMatch]) return;
    let newjsondata = jsondata;

    let updatedSubject = detections[detectedMatch] as RecognizedFace;

    const new_subject_sample_image = imagePath(image.replace('/detected', `/subjects/${id}`));

    // updatedSubject.subject = {
    //     subject: id,
    //     similarity: 1,
    // }

    // image: FaceImage<RecognizedThumbnail>,
    // subjectId: SubjectId;
    // similarity: number
    // verified?: boolean;
    // vendor_image_id?: string;

    updatedSubject.image = new_subject_sample_image;
    updatedSubject.verified = true;
    updatedSubject.vendor_image_id = id;
    newjsondata.faces.detected.splice(detectedMatch, 1)
    newjsondata.faces.recognized.push(updatedSubject);

    const { image_id, subject: _subject } = await addSubjectExample(id, image)
    fs.writeFileSync(jsonfile, JSON.stringify(newjsondata));

    if (!fs.existsSync(path.parse(new_subject_sample_image).dir)) {
        fs.mkdirSync(path.parse(new_subject_sample_image).dir, { recursive: true })
    }

    fs.renameSync(image, new_subject_sample_image);

    return imagePath(new_subject_sample_image);
}