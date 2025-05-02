import { useEffect, useRef } from "react";

function useMountedRef() {
    let mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    return mounted;
}

export { useMountedRef };
