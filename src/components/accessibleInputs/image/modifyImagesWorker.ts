import { EImageType } from "image-conversion";
import { ResultSafeBox } from "../../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
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
    ResultSafeBox<
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
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventModifyImagesMainToWorkerInputZod,
    });
    if (parsedMessageResult.err || parsedMessageResult.val.none) {
        self.postMessage(
            createSafeErrorResult("Error parsing message"),
        );
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
    } = parsedMessageResult.val.safeUnwrap();

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
        if (originalFilesResult.err || originalFilesResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error getting original files"),
            );
            return;
        }

        const imageToModify = structuredClone(
            originalFilesResult.val.safeUnwrap()[currentImageIndex],
        );
        if (!imageToModify) {
            self.postMessage(
                createSafeErrorResult("No image to modify"),
            );
            return;
        }

        const type = imageToModify?.type as EImageType;
        const modifyImageResult = await modifyImageSafe(imageToModify, {
            quality,
            orientation,
            type,
        });
        if (modifyImageResult.err || modifyImageResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error modifying image"),
            );
            return;
        }
        const fileBlob = modifyImageResult.val.safeUnwrap();

        const modifiedFilesResult = await getCachedItemAsyncSafe<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);
        if (modifiedFilesResult.err) {
            self.postMessage(
                createSafeErrorResult("Error getting modified files"),
            );
            return;
        }
        const updatedModifiedFiles = modifiedFilesResult.val.none
            ? []
            : modifiedFilesResult.val.safeUnwrap().map(
                (modifiedFile, index) =>
                    index === currentImageIndex ? fileBlob : modifiedFile,
            );

        const setCachedItemSafeResult = await setCachedItemAsyncSafe(
            modifiedFilesForageKey,
            updatedModifiedFiles,
        );
        if (setCachedItemSafeResult.err) {
            self.postMessage(
                createSafeErrorResult("Error setting modified files"),
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
        if (setQualitiesResult.err) {
            self.postMessage(
                createSafeErrorResult("Error setting qualities"),
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
        if (setOrientationsResult.err) {
            self.postMessage(
                createSafeErrorResult("Error setting orientations"),
            );
            return;
        }

        const fileNamesResult = await getCachedItemAsyncSafe<
            Array<string>
        >(fileNamesForageKey);
        if (fileNamesResult.err) {
            self.postMessage(
                createSafeErrorResult("Error getting file names"),
            );
            return;
        }
        const fileNames = fileNamesResult.val.none
            ? []
            : fileNamesResult.val.safeUnwrap();

        self.postMessage(
            createSafeSuccessResult(
                {
                    areImagesInvalid,
                    currentImageIndex,
                    fileBlob,
                    fileNames,
                    quality,
                    updatedModifiedFiles,
                    orientation,
                },
            ),
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
        createSafeErrorResult(event.reason),
    );
});

export type {
    MessageEventModifyImagesMainToWorker,
    MessageEventModifyImagesWorkerToMain,
};
