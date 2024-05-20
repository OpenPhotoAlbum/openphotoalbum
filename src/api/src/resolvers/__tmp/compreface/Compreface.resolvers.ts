import request from 'request-promise';
import fs from 'fs';
import { RECOGNITION_HEADERS, RECOGNITION_URL } from './config';

export const getSubjects = async (): Promise<{ subjects: string[] }> => {
    const options = {
        method: "GET",
        url: `${RECOGNITION_URL}/subjects`,
        headers: RECOGNITION_HEADERS,
        json: true
    };

    return await request(options);
}

export const addSubject = async (id: string): Promise<any> => {
    let options: any = {
        method: "POST",
        url: `${RECOGNITION_URL}/subjects`,
        headers: RECOGNITION_HEADERS,
        body: { subject: id },
        json: true
    };

    return await request(options);
}

export const addSubjectExample = async (subjectId: string, filename: string): Promise<any> => {
    let options: any = {
        method: "POST",
        url: `${RECOGNITION_URL}/faces?subject=${subjectId}`,
        headers: RECOGNITION_HEADERS,
        formData: { "file": fs.createReadStream(filename) },
        json: true
    };
    return await request(options);
}
