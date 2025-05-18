import { Some } from "ts-results";
import {
    ModifiedFile,
} from "../components/accessibleInputs/AccessibleFileInput";
import { MAX_IMAGES } from "../components/accessibleInputs/image/constants";
import { createImageInputForageKeys } from "../components/accessibleInputs/image/utils";
import { ResultSafeBox } from "../types";
import { createResultSafeBox, getCachedItemSafeAsync } from "../utils";

type MessageEventRetrieveImagesWorkerToMain = MessageEvent<
    ResultSafeBox<
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
        self.postMessage(createResultSafeBox({
            data: Some(new Error("No data received")),
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
            self.postMessage(
                createResultSafeBox({
                    data: modifiedFilesResult.val.data,
                    message: Some("Error getting modified files"),
                }),
            );
            return;
        }
        const modifiedFiles = modifiedFilesResult.val.data.none
            ? []
            : modifiedFilesResult.val.data.val;

        const fileNamesResult = await getCachedItemSafeAsync<Array<string>>(
            fileNamesForageKey,
        );
        if (fileNamesResult.err) {
            self.postMessage(
                createResultSafeBox({
                    data: fileNamesResult.val.data,
                    message: Some("Error setting file names"),
                }),
            );
            return;
        }
        const fileNames = fileNamesResult.val.data.none
            ? []
            : fileNamesResult.val.data.val;

        const getQualitiesResult = await getCachedItemSafeAsync<Array<number>>(
            qualitiesForageKey,
        );
        if (getQualitiesResult.err) {
            self.postMessage(
                createResultSafeBox({
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

        const getOrientationsResult = await getCachedItemSafeAsync<
            Array<number>
        >(
            orientationsForageKey,
        );
        if (getOrientationsResult.err) {
            self.postMessage(
                createResultSafeBox({
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

        self.postMessage(createResultSafeBox({
            data: Some({
                fileNames,
                modifiedFiles,
                qualities,
                orientations,
            }),
            kind: "success",
        }));
    } catch (error: unknown) {
        self.postMessage(createResultSafeBox({
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
