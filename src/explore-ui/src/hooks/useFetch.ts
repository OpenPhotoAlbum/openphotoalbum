import { useState, useEffect } from "react";
import qs from 'query-string';

type FetchResult<T> = {
    data: T | null;
    isPending: boolean;
    error: string | null;
    refetch: () => void;
}

export const useFetch = <T>(url: string, query?: { [key: string]: string | number | boolean }): FetchResult<T> => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [_refetch, setRefetch] = useState<boolean>(true);

    const refetch = () => {
        setRefetch(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);
            const _query = query ? `?${qs.stringify(query)}` : '';
            try {
                const response = await fetch(url + _query, {
                    mode: 'cors'
                });
                if (!response.ok) throw new Error(response.statusText);
                const json = await response.json();
                setIsPending(false);
                setData(json);
                setError(null);
            } catch (error) {
                setError(`${error} Could not Fetch Data `);
                setIsPending(false);
            }
            if (_refetch === true) {
                setRefetch(false)
            }
        };
        if (_refetch && !isPending) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, _refetch]);
    return { data, isPending, error, refetch };
};