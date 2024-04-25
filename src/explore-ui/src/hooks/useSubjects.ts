import { useState, useCallback } from 'react';
import axios from 'axios';
import * as api from '../util/api-routes'
import { Scan, SubjectId } from '../lib/Scans';

export type UseSubjectsReturn<T> = {
    data: T;
    status: number;
}

export type AddSubject = { subject_id: string; image: string; };
export type AddSubjectBody = { subjectId: string };
export type AddSubjectResponse = UseSubjectsReturn<AddSubject | null>;

export default function useSubjects() {
    // Add Subject
    const [addSubjectIsLoading, setAddSubjectIsLoading] = useState<boolean>(false);
    const [addSubjectError, setAddSubjectError] = useState<unknown | null>(null);
    const [addSubjectStatus, setAddSubjectStatus] = useState<number | null>(null);
    const [addSubjectData, setAddSubjectData] = useState<AddSubject | null>(null);

    const addSubject = useCallback(
        async (body: AddSubjectBody): Promise<AddSubjectResponse> => {
            setAddSubjectIsLoading(true);
            setAddSubjectError(null);

            try {
                const response = await axios
                    .post<any, AddSubjectResponse>(
                        `${api.API_URL}${api.API_ADD_SUBJECT_EXAMPLE_URI}`,
                        body
                    );
                setAddSubjectStatus(response.status);
                setAddSubjectData(response.data);
                setAddSubjectIsLoading(false);

                return {
                    status: response.status,
                    data: response.data,
                }

            } catch (err) {
                setAddSubjectError(err);
                setAddSubjectIsLoading(false);

                return {
                    status: 400,
                    data: null,
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );

    // Add Subject Example
    const [addSubjectExampleIsLoading, setAddSubjectExampleIsLoading] = useState(false);
    const [addSubjectExampleError, setAddSubjectExampleError] = useState<unknown | null>(null);
    const [addSubjectExampleStatus, setAddSubjectExampleStatus] = useState<number | null>(null);
    const [addSubjectExampleData, setAddSubjectExampleData] = useState<unknown | null>(null);

    const addSubjectExample = useCallback(async (subjectId: string, body: unknown) => {
        setAddSubjectExampleIsLoading(true);
        setAddSubjectExampleError(null);

        try {
            const response = await axios.post(`${api.API_URL}${api.API_ADD_SUBJECT_EXAMPLE_URI(subjectId)}`, body);
            setAddSubjectExampleStatus(response.status);
            setAddSubjectExampleData(response.data);
            setAddSubjectExampleIsLoading(false);

            return {
                status: response.status,
                data: response.data,
            }

        } catch (err) {
            setAddSubjectExampleError(err);
            setAddSubjectExampleIsLoading(false);

            return {
                status: 400,
                data: null,
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get All Subjects
    const [getSubjectsIsLoading, setGetSubjectsIsLoading] = useState(false);
    const [getSubjectsError, setGetSubjectsError] = useState<unknown | null>(null);
    const [getSubjectsStatus, setGetSubjectsStatus] = useState<number | null>(null);
    const [subjects, setSubjects] = useState<unknown | null>(null);

    const getSubjects = useCallback(
        async (): Promise<{ status: number, data: SubjectId[] | null }> => {
            setGetSubjectsIsLoading(true);
            setGetSubjectsError(null);

            try {
                const response = await axios.get(
                    `${api.API_URL}${api.API_GET_SUBJECTS_URI}`
                );
                console.log(response)
                setGetSubjectsStatus(response.status);
                setSubjects(response.data);
                setGetSubjectsIsLoading(false);

                return {
                    status: response.status,
                    data: response.data,
                }

            } catch (err) {
                setGetSubjectsError(err);
                setGetSubjectsIsLoading(false);

                return {
                    status: 400,
                    data: null,
                }
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [])

    // Delete Subject Example
    const [deleteSubjectExampleIsLoading, setDeleteSubjectExampleIsLoading] = useState(false);
    const [deleteSubjectExampleError, setDeleteSubjectExampleError] = useState<unknown | null>(null);
    const [deleteSubjectExampleStatus, setDeleteSubjectExampleStatus] = useState<number | null>(null);
    const [deleteSubjectExampleData, setDeleteSubjectExampleData] = useState<unknown | null>(null);

    const deleteSubjectExample = useCallback(async (subjectId: string, body: unknown) => {
        setDeleteSubjectExampleIsLoading(true);
        setDeleteSubjectExampleError(null);

        try {
            const response = await axios.post(`${api.API_URL}${api.API_DELETE_SUBJECT_EXAMPLE_URI(subjectId)}`, body);
            setDeleteSubjectExampleStatus(response.status);
            setDeleteSubjectExampleData(response.data);
            setDeleteSubjectExampleIsLoading(false);

            return {
                status: response.status,
                data: response.data,
            }

        } catch (err) {
            setDeleteSubjectExampleError(err);
            setDeleteSubjectExampleIsLoading(false);

            return {
                status: 400,
                data: null,
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        add: {
            subject: addSubject,
            isLoading: addSubjectIsLoading,
            error: addSubjectError,
            status: addSubjectStatus,
            data: addSubjectData
        },
        getAll: {
            subjects: getSubjects,
            isLoading: getSubjectsIsLoading,
            error: getSubjectsError,
            status: getSubjectsStatus,
            data: subjects
        },
        addSubjectExample: {
            example: addSubjectExample,
            isLoading: addSubjectExampleIsLoading,
            error: addSubjectExampleError,
            status: addSubjectExampleStatus,
            data: addSubjectExampleData
        },
        removeSubjectExample: {
            example: deleteSubjectExample,
            isLoading: deleteSubjectExampleIsLoading,
            error: deleteSubjectExampleError,
            status: deleteSubjectExampleStatus,
            data: deleteSubjectExampleData
        },
    };
}
