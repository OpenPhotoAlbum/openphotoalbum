import { useState, useCallback } from 'react';
import axios from 'axios';
import * as api from '../util/api-routes'
import { SubjectId } from '../lib/Scans';

export type UseSubjectsReturn<T> = {
    data: T;
    status: number;
    error?: unknown
}

export type Subjects = SubjectId[];
export type GetSubjectsResponse = UseSubjectsReturn<Subjects | null>;

export type AddSubject = { subjectId: SubjectId; };
export type AddSubjectBody = { subjectId: SubjectId };
export type AddSubjectResponse = UseSubjectsReturn<AddSubject | null>;

export type AddSubjectExample = { subjectId: string; };
export type AddSubjectExampleBody = { subjectId: SubjectId, examples: { jsonfile: string, image: string }[] };
export type AddSubjectExampleResponse = UseSubjectsReturn<AddSubjectExample | null>;

export type DeleteSubjectExamples = SubjectId[];
export type DeleteSubjectExamplesBody = { subjectId: SubjectId, examples: { jsonfile: string, image: string }[] };
export type DeleteSubjectExamplesResponse = UseSubjectsReturn<DeleteSubjectExamples | null>;

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
                        api.API_ADD_SUBJECT_URI,
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
                    error: err
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );

    // Add Subject Example
    const [addSubjectExampleIsLoading, setAddSubjectExampleIsLoading] = useState<boolean>(false);
    const [addSubjectExampleError, setAddSubjectExampleError] = useState<unknown | null>(null);
    const [addSubjectExampleStatus, setAddSubjectExampleStatus] = useState<number | null>(null);
    const [addSubjectExampleData, setAddSubjectExampleData] = useState<unknown | null>(null);

    const addSubjectExample = useCallback(
        async (
            subjectId: SubjectId,
            body: AddSubjectExampleBody
        ): Promise<AddSubjectExampleResponse> => {
            setAddSubjectExampleIsLoading(true);
            setAddSubjectExampleError(null);

            try {
                const response = await axios
                    .post<any, AddSubjectExampleResponse>(
                        api.API_ADD_SUBJECT_EXAMPLE_URI(subjectId),
                        body
                    );
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
        },
        []
    );

    // Get All Subjects
    const [getSubjectsIsLoading, setGetSubjectsIsLoading] = useState(false);
    const [getSubjectsError, setGetSubjectsError] = useState<unknown | null>(null);
    const [getSubjectsStatus, setGetSubjectsStatus] = useState<number | null>(null);
    const [subjects, setSubjects] = useState<Subjects | null>(null);

    const getSubjects = useCallback(
        async (): Promise<GetSubjectsResponse> => {
            setGetSubjectsIsLoading(true);
            setGetSubjectsError(null);

            try {
                const response = await axios
                    .get<any, GetSubjectsResponse>(
                        api.API_GET_SUBJECTS_URI
                    );

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
        }, []
    )

    // Delete Subject Example
    const [deleteSubjectExamplesIsLoading, setDeleteSubjectExamplesIsLoading] = useState(false);
    const [deleteSubjectExamplesError, setDeleteSubjectExamplesError] = useState<unknown | null>(null);
    const [deleteSubjectExamplesStatus, setDeleteSubjectExamplesStatus] = useState<number | null>(null);
    const [deleteSubjectExamplesData, setDeleteSubjectExamplesData] = useState<unknown | null>(null);

    const deleteSubjectExamples = useCallback(
        async (
            subjectId: SubjectId,
            body: DeleteSubjectExamplesBody
        ): Promise<DeleteSubjectExamplesResponse> => {
            setDeleteSubjectExamplesIsLoading(true);
            setDeleteSubjectExamplesError(null);

            try {
                const response = await axios
                    .post<
                        DeleteSubjectExamplesBody,
                        DeleteSubjectExamplesResponse
                    >(api.API_DELETE_SUBJECT_EXAMPLES_URI(subjectId), body);
                setDeleteSubjectExamplesStatus(response.status);
                setDeleteSubjectExamplesData(response.data);
                setDeleteSubjectExamplesIsLoading(false);

                return {
                    status: response.status,
                    data: response.data,
                }

            } catch (err) {
                setDeleteSubjectExamplesError(err);
                setDeleteSubjectExamplesIsLoading(false);

                return {
                    status: 400,
                    data: null,
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );

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
        deleteSubjectExamples: {
            example: deleteSubjectExamples,
            isLoading: deleteSubjectExamplesIsLoading,
            error: deleteSubjectExamplesError,
            status: deleteSubjectExamplesStatus,
            data: deleteSubjectExamplesData
        },
    };
}
