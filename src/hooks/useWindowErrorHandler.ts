import { useEffect } from "react";
import { createSafeErrorResult } from "../utils";

function useWindowErrorHandler(showBoundary: (error: unknown) => void) {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            // Handle the error event
            const safeErrorResult = createSafeErrorResult(event, {
                columnNumber: event.colno,
                fileName: event.filename,
                lineNumber: event.lineno,
            });
            showBoundary(safeErrorResult);
            return true; // Prevent the default error handling
        };

        window.addEventListener("error", handleError);

        return () => {
            window.removeEventListener("error", handleError);
        };
    }, []);
}

export { useWindowErrorHandler };
