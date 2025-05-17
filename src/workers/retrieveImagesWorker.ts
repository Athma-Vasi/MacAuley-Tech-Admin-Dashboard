import { Some } from "ts-results";
import {
    ModifiedFile,
} from "../components/accessibleInputs/AccessibleFileInput";
import { MAX_IMAGES } from "../components/accessibleInputs/image/constants";
import { createImageInputForageKeys } from "../components/accessibleInputs/image/utils";
import { SafeBoxResult } from "../types";
import {
    createResultSafeBox,
    createSafeBoxResult,
    getCachedItemSafeAsync,
} from "../utils";

type MessageEventRetrieveImagesWorkerToMain = MessageEvent<
    SafeBoxResult<
        {
            fileNames: Array<string>;
            modifiedFiles: Array<ModifiedFile>;
            qualities: Array<number>;
            orientations: Array<number>;
        }
    >
>;
type MessageEventRetrieveImagesMainToWorker = MessageEvent<
    {
        storageKey: string;
    }
>;

self.onmessage = async (
    event: MessageEventRetrieveImagesMainToWorker,
) => {
    console.log(
        "Retrieve Image Worker received message in self",
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
        const modifiedFilesResult = await getCachedItemSafeAsync<
            Array<ModifiedFile>
        >(
            modifiedFilesForageKey,
        );
        if (modifiedFilesResult.err) {
            self.postMessage(createSafeBoxResult({
                message: modifiedFilesResult.val.message ??
                    "Error getting modified files",
            }));
            return;
        }
        const modifiedFiles = modifiedFilesResult.safeUnwrap().data ?? [];

        const fileNamesResult = await getCachedItemSafeAsync<Array<string>>(
            fileNamesForageKey,
        );
        if (fileNamesResult.err) {
            self.postMessage(createSafeBoxResult({
                message: fileNamesResult.val.message ??
                    "Error getting file names",
            }));
            return;
        }
        const fileNames = fileNamesResult.safeUnwrap().data ?? [];

        const qualitiesResult = await getCachedItemSafeAsync<Array<number>>(
            qualitiesForageKey,
        );
        if (qualitiesResult.err) {
            self.postMessage(createSafeBoxResult({
                message: qualitiesResult.val.message ??
                    "Error getting qualities",
            }));
            return;
        }
        const qualities = qualitiesResult.safeUnwrap().data ?? Array.from(
            { length: MAX_IMAGES },
            () => 10,
        );

        const orientationsResult = await getCachedItemSafeAsync<Array<number>>(
            orientationsForageKey,
        );
        if (orientationsResult.err) {
            self.postMessage(createSafeBoxResult({
                message: orientationsResult.val.message ??
                    "Error getting orientations",
            }));
            return;
        }
        const orientations = orientationsResult.safeUnwrap().data ??
            Array.from(
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
    console.error("Repair Charts Worker error:", event);
    self.postMessage(createResultSafeBox({
        data: Some(event),
        message: Some(
            event instanceof Error
                ? event.message
                : typeof event === "string"
                ? event
                : "Unknown error",
        ),
    }));
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(createResultSafeBox({
        data: Some(event.reason),
        message: Some(
            event.reason instanceof Error
                ? event.reason.message
                : typeof event.reason === "string"
                ? event.reason
                : "Unknown error",
        ),
    }));
});

export type {
    MessageEventRetrieveImagesMainToWorker,
    MessageEventRetrieveImagesWorkerToMain,
};
