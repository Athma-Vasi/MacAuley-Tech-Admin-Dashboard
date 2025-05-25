import React from "react";

function useUnload(callback: (event: Event) => void) {
    const cbRef = React.useRef(callback);

    React.useEffect(() => {
        const onUnload = cbRef.current;
        window.addEventListener("beforeunload", onUnload);
        return () => {
            window.removeEventListener("beforeunload", onUnload);
        };
    }, [callback]);
}

export { useUnload };
