import { EImageType } from "image-conversion";
import { Some } from "ts-results";
import { SafeBoxResult } from "../../../types";
import {
    createSafeBoxResult,
    getCachedItemAsyncSafe,
    modifyImageSafe,
    parseSyncSafe,
    setCachedItemAsyncSafe,
} from "../../../utils";
import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import { ALLOWED_FILE_EXTENSIONS_REGEX } from "./constants";
import { messageEventModifyImagesMainToWorkerInputZod } from "./schemas";
import { createImageInputForageKeys, validateImages } from "./utils";

type MessageEventModifyImagesWorkerToMain = MessageEvent<
    SafeBoxResult<
        {
            areImagesInvalid: Array<boolean>;
            currentImageIndex: number;
            fileBlob: ModifiedFile;
            fileNames: Array<string>;
            quality: number;
            updatedModifiedFiles: Array<ModifiedFile>;
            orientation: number;
        }
    >
>;
type MessageEventModifyImagesMainToWorker = MessageEvent<
    {
        currentImageIndex: number;
        maxImagesAmount: number;
        maxImageSize: number;
        orientation: number;
        orientations: number[];
        qualities: number[];
        quality: number;
        storageKey: string;
    }
>;

self.onmessage = async (
    event: MessageEventModifyImagesMainToWorker,
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
        zSchema: messageEventModifyImagesMainToWorkerInputZod,
    });
    if (parsedMessageResult.err || parsedMessageResult.val.data.none) {
        self.postMessage(createSafeBoxResult({
            data: parsedMessageResult.val.data,
            message: Some("Error parsing message"),
        }));
        return;
    }

    const {
        currentImageIndex,
        maxImagesAmount,
        maxImageSize,
        orientation,
        orientations,
        qualities,
        quality,
        storageKey,
    } = parsedMessageResult.val.data.val;

    const {
        fileNamesForageKey,
        modifiedFilesForageKey,
        orientationsForageKey,
        qualitiesForageKey,
        originalFilesForageKey,
    } = createImageInputForageKeys(
        storageKey,
    );

    try {
        const originalFilesResult = await getCachedItemAsyncSafe<
            Array<OriginalFile>
        >(originalFilesForageKey);
        if (originalFilesResult.err || originalFilesResult.val.data.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: originalFilesResult.val.data,
                    message: originalFilesResult.val.message ??
                        Some("Error getting original files"),
                }),
            );
            return;
        }

        const imageToModify = structuredClone(
            originalFilesResult.val.data.val[currentImageIndex],
        );
        console.log(
            "Image to modify",
            imageToModify,
        );
        if (!imageToModify) {
            self.postMessage(createSafeBoxResult({
                data: Some(new Error("No image to modify")),
            }));
            return;
        }

        const type = imageToModify?.type as EImageType;
        const modifyImageResult = await modifyImageSafe(imageToModify, {
            quality,
            orientation,
            type,
        });
        console.log(
            "Modify image result",
            modifyImageResult,
        );
        if (modifyImageResult.err || modifyImageResult.val.data.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: modifyImageResult.val.data,
                    message: modifyImageResult.val.message ??
                        Some("Error modifying image"),
                }),
            );
            return;
        }
        const fileBlob = modifyImageResult.val.data.val;

        const modifiedFilesResult = await getCachedItemAsyncSafe<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);
        console.log(
            "Modified files result",
            modifiedFilesResult,
        );
        if (modifiedFilesResult.err) {
            self.postMessage(
                createSafeBoxResult({
                    data: modifiedFilesResult.val.data,
                    message: modifiedFilesResult.val.message ??
                        Some("Error getting modified files"),
                }),
            );
            return;
        }
        const updatedModifiedFiles = modifiedFilesResult.val.data.none
            ? []
            : modifiedFilesResult.val.data.val.map(
                (modifiedFile, index) =>
                    index === currentImageIndex ? fileBlob : modifiedFile,
            );

        const setCachedItemSafeResult = await setCachedItemAsyncSafe(
            modifiedFilesForageKey,
            updatedModifiedFiles,
        );
        console.log(
            "Set cached item safe result",
            setCachedItemSafeResult,
        );
        if (setCachedItemSafeResult.err) {
            self.postMessage(
                createSafeBoxResult({
                    data: setCachedItemSafeResult.val.data,
                    message: setCachedItemSafeResult.val.message ??
                        Some("Error setting modified files"),
                }),
            );
            return;
        }

        const { areImagesInvalid } = validateImages({
            allowedFileExtensionsRegex: ALLOWED_FILE_EXTENSIONS_REGEX,
            imageFileBlobs: updatedModifiedFiles,
            maxImageSize,
        });

        // update qualities
        const clonedQualities = qualities.map((q, index) =>
            index === currentImageIndex ? quality : q
        );

        const setQualitiesResult = await setCachedItemAsyncSafe(
            qualitiesForageKey,
            clonedQualities,
        );
        console.log(
            "Set qualities result",
            setQualitiesResult,
        );
        if (setQualitiesResult.err) {
            self.postMessage(
                createSafeBoxResult({
                    data: setQualitiesResult.val.data,
                    message: setQualitiesResult.val.message ??
                        Some("Error setting qualities"),
                }),
            );
            return;
        }

        // update orientations

        const clonedOrientations = orientations.map((o, index) =>
            index === currentImageIndex ? orientation : o
        );

        const setOrientationsResult = await setCachedItemAsyncSafe(
            orientationsForageKey,
            clonedOrientations,
        );
        console.log(
            "Set orientations result",
            setOrientationsResult,
        );
        if (setOrientationsResult.err) {
            self.postMessage(
                createSafeBoxResult({
                    data: setOrientationsResult.val.data,
                    message: setOrientationsResult.val.message ??
                        Some("Error setting orientations"),
                }),
            );
            return;
        }

        const fileNamesResult = await getCachedItemAsyncSafe<
            Array<string>
        >(fileNamesForageKey);
        console.log(
            "File names result",
            fileNamesResult,
        );
        if (fileNamesResult.err) {
            self.postMessage(
                createSafeBoxResult({
                    data: fileNamesResult.val.data,
                    message: fileNamesResult.val.message ??
                        Some("Error setting file names"),
                }),
            );
            return;
        }

        self.postMessage(createSafeBoxResult({
            data: Some({
                areImagesInvalid,
                currentImageIndex,
                fileBlob,
                fileNames: fileNamesResult.val.data.none
                    ? []
                    : fileNamesResult.val.data.val,
                quality,
                updatedModifiedFiles,
                orientation,
            }),
            kind: "success",
        }));
    } catch (error) {
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
    MessageEventModifyImagesMainToWorker,
    MessageEventModifyImagesWorkerToMain,
};
