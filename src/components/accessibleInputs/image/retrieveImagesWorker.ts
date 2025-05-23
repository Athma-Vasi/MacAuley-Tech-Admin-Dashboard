import { SafeResult } from "../../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    getCachedItemAsyncSafe,
    parseSyncSafe,
} from "../../../utils";
import { ModifiedFile } from "../AccessibleFileInput";
import { MAX_IMAGES } from "./constants";
import { messageEventRetrieveImagesMainToWorkerInputZod } from "./schemas";
import { createImageInputForageKeys } from "./utils";

type MessageEventRetrieveImagesWorkerToMain = MessageEvent<
    SafeResult<
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
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventRetrieveImagesMainToWorkerInputZod,
    });
    if (parsedMessageResult.err) {
        self.postMessage(
            parsedMessageResult,
        );
        return;
    }
    if (parsedMessageResult.val.none) {
        self.postMessage(
            createSafeErrorResult("Error parsing message"),
        );
        return;
    }

    const { storageKey } = parsedMessageResult.val.val;

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
            self.postMessage(modifiedFilesResult);
            return;
        }
        const modifiedFiles = modifiedFilesResult.val.none
            ? []
            : modifiedFilesResult.val.val;

        const fileNamesResult = await getCachedItemAsyncSafe<Array<string>>(
            fileNamesForageKey,
        );
        if (fileNamesResult.err) {
            self.postMessage(fileNamesResult);
            return;
        }
        const fileNames = fileNamesResult.val.none
            ? []
            : fileNamesResult.val.val;

        const getQualitiesResult = await getCachedItemAsyncSafe<Array<number>>(
            qualitiesForageKey,
        );
        if (getQualitiesResult.err) {
            self.postMessage(getQualitiesResult);
            return;
        }
        const qualities = getQualitiesResult.val.none
            ? Array.from(
                { length: MAX_IMAGES },
                () => 10,
            )
            : getQualitiesResult.val.val;

        const getOrientationsResult = await getCachedItemAsyncSafe<
            Array<number>
        >(
            orientationsForageKey,
        );
        if (getOrientationsResult.err) {
            self.postMessage(getOrientationsResult);
            return;
        }
        const orientations = getOrientationsResult.val.none
            ? Array.from(
                { length: MAX_IMAGES },
                () => 1,
            )
            : getOrientationsResult.val.val;

        self.postMessage(
            createSafeSuccessResult({
                fileNames,
                modifiedFiles,
                qualities,
                orientations,
            }),
        );
    } catch (error: unknown) {
        self.postMessage(
            createSafeErrorResult(error),
        );
    }
};

self.onerror = (event: string | Event) => {
    console.error("Repair Charts Worker error:", event);
    self.postMessage(
        createSafeErrorResult(event),
    );
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(
        createSafeErrorResult(event),
    );
});

export type {
    MessageEventRetrieveImagesMainToWorker,
    MessageEventRetrieveImagesWorkerToMain,
};
