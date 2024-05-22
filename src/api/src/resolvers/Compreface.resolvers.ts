import request, { Options } from 'request-promise';
import fs from 'fs';

export const API_URL = 'http://10.0.0.15:7000/api/v1'
export const RECOGNITION_API_KEY = 'b8ed9cce-edbb-449a-9fa4-7be06fa72f34';

export const RECOGNITION_HEADERS = {
    "x-api-key": RECOGNITION_API_KEY,
    "Content-Type": "application/json",
};

export const RECOGNITION_URL = `${API_URL}/recognition`;
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