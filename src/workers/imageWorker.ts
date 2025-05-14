import { ModifiedFile } from "../components/accessibleInputs/AccessibleFileInput";
import { MAX_IMAGES } from "../components/accessibleInputs/image/constants";
import { createImageInputForageKeys } from "../components/accessibleInputs/image/utils";
import { SafeBoxResult } from "../types";
import { createSafeBoxResult, getForageItemSafe } from "../utils";

type MessageEventImageWorkerToMain = MessageEvent<
    SafeBoxResult<
        {
            fileNames: Array<string>;
            modifiedFiles: Array<ModifiedFile>;
            qualities: Array<number>;
            orientations: Array<number>;
        }
    >
>;
type MessageEventImageMainToWorker = MessageEvent<
    {
        storageKey: string;
    }
>;

self.onmessage = async (
    event: MessageEventImageMainToWorker,
) => {
    console.log(
        "Image Worker received message in self",
    );

    if (!event.data) {
        self.postMessage(createSafeBoxResult({
            data: new Error("No data received"),
            kind: "error",
        }));
        return;
    }

    const { storageKey } = event.data;

    const {
        fileNamesForageKey,
        modifiedFilesForageKey,
        orientationsForageKey,
        qualitiesForageKey,
    } = createImageInputForageKeys(
        storageKey,
    );

    try {
        const modifiedFilesResult = await getForageItemSafe<
            Array<ModifiedFile>
        >(
            modifiedFilesForageKey,
        );
        if (modifiedFilesResult.err) {
            return self.postMessage(createSafeBoxResult({
                message: modifiedFilesResult.val.message ??
                    "Error getting modified files",
            }));
        }
        const modifiedFiles = modifiedFilesResult.safeUnwrap().data ?? [];

        const fileNamesResult = await getForageItemSafe<Array<string>>(
            fileNamesForageKey,
        );
        if (fileNamesResult.err) {
            return self.postMessage(createSafeBoxResult({
                message: fileNamesResult.val.message ??
                    "Error getting file names",
            }));
        }
        const fileNames = fileNamesResult.safeUnwrap().data ?? [];

        const qualitiesResult = await getForageItemSafe<Array<number>>(
            qualitiesForageKey,
        );
        if (qualitiesResult.err) {
            return self.postMessage(createSafeBoxResult({
                message: qualitiesResult.val.message ??
                    "Error getting qualities",
            }));
        }
        const qualities = qualitiesResult.safeUnwrap().data ?? Array.from(
            { length: MAX_IMAGES },
            () => 10,
        );

        const orientationsResult = await getForageItemSafe<Array<number>>(
            orientationsForageKey,
        );
        if (orientationsResult.err) {
            return self.postMessage(createSafeBoxResult({
                message: orientationsResult.val.message ??
                    "Error getting orientations",
            }));
        }
        const orientations = orientationsResult.safeUnwrap().data ?? Array.from(
            { length: MAX_IMAGES },
            () => 1,
        );

        self.postMessage(createSafeBoxResult({
            data: {
                fileNames,
                modifiedFiles,
                qualities,
                orientations,
            },
            kind: "success",
        }));
    } catch (error) {
        console.error("Worker error:", error);
        self.postMessage(createSafeBoxResult({
            data: error,
            kind: "error",
        }));
    }
};

self.onerror = (event: string | Event) => {
    console.error("Worker error:", event);
    self.postMessage(createSafeBoxResult({
        data: event,
        kind: "error",
    }));
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(createSafeBoxResult({
        kind: "error",
        message: `Promise error: ${event.reason?.message || event.reason}`,
    }));
});

export type { MessageEventImageMainToWorker, MessageEventImageWorkerToMain };
