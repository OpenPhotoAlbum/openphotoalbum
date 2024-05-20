
export const API_URL = 'http://10.0.0.15:9447';

export const API_SUBJECTS_URI = '/subjects';
export const API_SCANS_URI = '/scans';
export const API_IMAGES_URI = '/img';

export const API_GET_IMAGE_FILE_URI = (path: string) => (
    `${API_URL}${API_IMAGES_URI}${path}`
);

export const API_GET_SCANS_URI = API_URL + API_SCANS_URI;

export const API_GET_SUBJECTS_URI = API_URL + API_SUBJECTS_URI;

export const API_ADD_SUBJECT_URI = API_URL + API_SUBJECTS_URI;

export const API_ADD_SUBJECT_EXAMPLE_URI = (subjectId: string) => (
    `${API_URL}${API_SUBJECTS_URI}/${subjectId}/examples`
);

export const API_DELETE_SUBJECT_EXAMPLES_URI = (subjectId: string) => (
    `${API_URL}${API_SUBJECTS_URI}/${subjectId}/examples`
);

export const API_GET_FACES_TYPE_URI = (type: 'detected' | 'recognized') => (
    `${API_URL}${API_SCANS_URI}/faces/${type}`
);