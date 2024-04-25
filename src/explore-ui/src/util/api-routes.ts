
export const API_URL = 'http://10.0.0.15:9447';

export const API_SUBJECTS_URI = '/subjects';

export const API_GET_SUBJECTS_URI = API_SUBJECTS_URI;

export const API_ADD_SUBJECT_URI = API_SUBJECTS_URI;

export const API_ADD_SUBJECT_EXAMPLE_URI = (subjectId: string) => (
    `${API_SUBJECTS_URI}/${subjectId}/examples`
);

export const API_DELETE_SUBJECT_EXAMPLE_URI = (subjectId: string) => (
    `${API_SUBJECTS_URI}/${subjectId}/examples`
);