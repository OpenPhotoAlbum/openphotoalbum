import { useState, useCallback } from 'react';
import axios from 'axios';

export default function usePost(url: string) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [data, setData] = useState<unknown | null>(null);

    const makeRequest = useCallback(async (requestData: unknown) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(url, requestData);
            console.log(response)
            setStatus(response.status);
            setData(response.data);
            setIsLoading(false);
            return {
                status: response.status,
                data: response.data
            };
        } catch (err) {
            setError(err);
        }
        setIsLoading(false);
        return {}
    }, [url]);

    return { makeRequest, status, data, isLoading, error };
}