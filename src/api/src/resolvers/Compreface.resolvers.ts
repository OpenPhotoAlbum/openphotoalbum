import request, { Options } from 'request-promise';
import fs from 'fs';
import { RECOGNITION_HEADERS, RECOGNITION_URL } from './__tmp/compreface/config';

export const getSubjects = async (): Promise<{ subjects: string[] }> => {
    const options: Options = {
        method: "GET",
        url: `${RECOGNITION_URL}/subjects`,
        headers: RECOGNITION_HEADERS,
        json: true
    };

    return await request(options);
}

export const addSubject = async (id: string): Promise<any> => {
    const options: Options = {
        method: "POST",
        url: `${RECOGNITION_URL}/subjects`,
        headers: RECOGNITION_HEADERS,
        body: { subject: id },
        json: true
    };

    return await request(options);
}

export const addSubjectExample = async (subjectId: string, filename: string): Promise<any> => {
    const options: Options = {
        method: "POST",
        url: `${RECOGNITION_URL}/faces?subject=${subjectId}`,
        headers: RECOGNITION_HEADERS,
        formData: { "file": fs.createReadStream(filename) },
        json: true
    };
    return await request(options);
}

export const renameSubject = async (subjectId: string, newSubjectId: number): Promise<any> => {
    const options: Options = {
        method: "PUT",
        url: `${RECOGNITION_URL}/subjects/${subjectId}`,
        headers: RECOGNITION_HEADERS,
        body: { subject: newSubjectId },
        json: true
    };
    return await request(options);
}