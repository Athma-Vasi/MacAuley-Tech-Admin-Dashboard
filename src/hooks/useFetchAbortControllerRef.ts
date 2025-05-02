import { useEffect, useRef } from "react";

function useFetchAbortControllerRef() {
    const fetchAbortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        fetchAbortControllerRef.current?.abort("Previous request cancelled");
        fetchAbortControllerRef.current = new AbortController();

        return () => {
            fetchAbortControllerRef.current?.abort();
        };
    }, []);

    return fetchAbortControllerRef;
}

export { useFetchAbortControllerRef };
