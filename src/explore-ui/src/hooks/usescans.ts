import { useState, useCallback } from 'react';
import axios from 'axios';
import * as api from '../util/api-routes'
import qs from 'query-string';
import { DetectedFace, RecognizedFace, Scan } from '../lib/Scans';
import { inspect } from 'util';

export type Scans = {
    data: Scan[];
    total: number;
};

export type GetScansResponse = {
    data: {
        data: Scan[];
        total: number;
    } | null;
    status: number;
};

export type GetScansQuery = {
    limit?: number;
    withDetections?: boolean;
    withRecognitions?: boolean;
}

export type GetScansReturn = {
    data?: Scan[];
    total?: number;
    status: number;
    error?: unknown;
}

export type GetFacesResponse = {
    data: {
        data?: {
            [key: string]: ((RecognizedFace & { jsonFile: string })[] | (DetectedFace & { jsonFile: string })[])
        };
        total: number;
    };
    status: number;
};

export type GetFacesReturn = {
    data?: {
        [key: string]: ((RecognizedFace | DetectedFace) & { jsonFile: string })
    },
    total?: number;
    status: number;
    error?: unknown;
}

export default function useScans() {
    // Get All Scans
    const [getScansIsLoading, setGetScansIsLoading] = useState<boolean>(false);
    const [getScansError, setGetScansError] = useState<unknown | null>(null);
    const [getScansStatus, setGetScansStatus] = useState<number | null>(null);
    const [scans, setScans] = useState<Scans | null>();

    const getScans = async (query?: GetScansQuery): Promise<GetScansReturn> => {
        setGetScansIsLoading(true);
        setGetScansError(null);
        const _query = query ? `?${qs.stringify(query)}` : '';

        try {
            const response = await axios
                .get<any, GetScansResponse>(api.API_GET_SCANS_URI + _query);

            setGetScansStatus(response.status);
            setScans(response.data);
            console.log(response.data, 'bang');
            setGetScansIsLoading(false);

            return {
                status: response.status,
                data: response.data?.data,
                total: response.data?.total,
            }

        } catch (err) {
            setGetScansError(err);
            setGetScansIsLoading(false);

            return {
                status: 400,
                error: err,
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    // Get All Scans
    const [getFacesIsLoading, setGetFacesIsLoading] = useState<boolean>(false);
    const [getFacesError, setGetFacesError] = useState<unknown | null>(null);
    const [getFacesStatus, setGetFacesStatus] = useState<number | null>(null);
    const [faces, setFaces] = useState<{
        data?: any;
        total: number;
    }>();

    const getFaces = async (type: 'detected' | 'recognized', query?: { limit?: number }): Promise<GetFacesReturn> => {
        setGetFacesIsLoading(true);
        setGetFacesError(null);

        try {
            const _query = query ? `?${qs.stringify(query)}` : '';
            const response = await axios
                .get<any, GetFacesResponse>(api.API_GET_FACES_TYPE_URI(type) + _query);
            console.log({ response });
            setGetFacesStatus(response.status);
            setFaces(response.data);
            setGetFacesIsLoading(false);

            return {
                status: response.status,
                //  @ts-ignore
                data: response.data?.data,
                total: response.data?.total,
            }

        } catch (err) {
            setGetFacesError(err);
            setGetFacesIsLoading(false);

            return {
                status: 400,
                error: err,
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    return {
        getAll: {
            scans: getScans,
            isLoading: getScansIsLoading,
            error: getScansError,
            status: getScansStatus,
            data: scans
        },
        faces: {
            get: getFaces,
            isLoading: getFacesIsLoading,
            error: getFacesError,
            status: getFacesStatus,
            data: faces
        },
    };
}
