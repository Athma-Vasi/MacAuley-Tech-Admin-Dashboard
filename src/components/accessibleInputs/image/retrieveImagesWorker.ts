import { Some } from "ts-results";
import { SafeBoxResult } from "../../../types";
import {
    createSafeBoxResult,
    getCachedItemAsyncSafe,
    parseSyncSafe,
} from "../../../utils";
import { ModifiedFile } from "../AccessibleFileInput";
import { MAX_IMAGES } from "./constants";
import { messageEventRetrieveImagesMainToWorkerInputZod } from "./schemas";
import { createImageInputForageKeys } from "./utils";

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
    if (!event.data) {
        self.postMessage(createSafeBoxResult({
            data: Some(new Error("No data received")),
            message: Some("No data received"),
        }));
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventRetrieveImagesMainToWorkerInputZod,
    });
    if (parsedMessageResult.err || parsedMessageResult.val.data.none) {
        self.postMessage(createSafeBoxResult({
            data: parsedMessageResult.val.data,
            message: Some("Error parsing message"),
        }));
        return;
    }

    const { storageKey } = parsedMessageResult.val.data.val;

    const {
        fileNamesForageKey,
        modifiedFilesForageKey,
        orientationsForageKey,
        qualitiesForageKey,
    } = createImageInputForageKeys(
        storageKey,
    );

    try {
        const modifiedFilesResult = await getCachedItemAsyncSafe<
            Array<ModifiedFile>
        >(
            modifiedFilesForageKey,
        );
        if (modifiedFilesResult.err) {
            self.postMessage(
                createSafeBoxResult({
                    data: modifiedFilesResult.val.data,
                    message: Some("Error getting modified files"),
                }),
            );
            return;
        }
        const modifiedFiles = modifiedFilesResult.val.data.none
            ? []
            : modifiedFilesResult.val.data.val;

        const fileNamesResult = await getCachedItemAsyncSafe<Array<string>>(
            fileNamesForageKey,
        );
        if (fileNamesResult.err) {
            self.postMessage(
                createSafeBoxResult({
                    data: fileNamesResult.val.data,
                    message: Some("Error setting file names"),
                }),
            );
            return;
        }
        const fileNames = fileNamesResult.val.data.none
            ? []
            : fileNamesResult.val.data.val;

        const getQualitiesResult = await getCachedItemAsyncSafe<Array<number>>(
            qualitiesForageKey,
        );
        if (getQualitiesResult.err) {
            self.postMessage(
                createSafeBoxResult({
                    data: getQualitiesResult.val.data,
                    message: Some("Error getting qualities"),
                }),
            );
            return;
        }
        const qualities = getQualitiesResult.val.data.none
            ? Array.from(
                { length: MAX_IMAGES },
                () => 10,
            )
            : getQualitiesResult.val.data.val;

        const getOrientationsResult = await getCachedItemAsyncSafe<
            Array<number>
        >(
            orientationsForageKey,
        );
        if (getOrientationsResult.err) {
            self.postMessage(
                createSafeBoxResult({
                    data: getOrientationsResult.val.data,
                    message: Some("Error getting orientations"),
                }),
            );
            return;
        }
        const orientations = getOrientationsResult.val.data.none
            ? Array.from(
                { length: MAX_IMAGES },
                () => 1,
            )
            : getOrientationsResult.val.data.val;

        self.postMessage(createSafeBoxResult({
            data: Some({
                fileNames,
                modifiedFiles,
                qualities,
                orientations,
            }),
            kind: "success",
        }));
    } catch (error: unknown) {
        self.postMessage(createSafeBoxResult({
            data: Some(error),
            message: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        }));
    }
};

self.onerror = (event: string | Event) => {
    console.error("Repair Charts Worker error:", event);
    self.postMessage(createSafeBoxResult({
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
    self.postMessage(createSafeBoxResult({
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
