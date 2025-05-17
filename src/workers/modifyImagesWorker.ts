import { EImageType } from "image-conversion";
import {
    ModifiedFile,
    OriginalFile,
} from "../components/accessibleInputs/AccessibleFileInput";
import { ALLOWED_FILE_EXTENSIONS_REGEX } from "../components/accessibleInputs/image/constants";
import {
    createImageInputForageKeys,
    validateImages,
} from "../components/accessibleInputs/image/utils";
import { SafeBoxResult } from "../types";
import {
    createSafeBoxResult,
    getCachedItemSafeAsync,
    modifyImageSafe,
    setCachedItemSafeAsync,
} from "../utils";

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
    console.log(
        "Modify Image Worker received message in self",
        event.data,
    );

    if (!event.data) {
        self.postMessage(createSafeBoxResult({
            data: new Error("No data received"),
            kind: "error",
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
    } = event.data;

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
        const originalFilesResult = await getCachedItemSafeAsync<
            Array<OriginalFile>
        >(originalFilesForageKey);
        console.log(
            "Original files result",
            originalFilesResult,
        );
        if (originalFilesResult.err) {
            self.postMessage(createSafeBoxResult({
                message: originalFilesResult.val.message ??
                    "Error getting original files",
            }));
            return;
        }
        const originalFiles = originalFilesResult.safeUnwrap().data ?? [];
        if (originalFiles.length === 0) {
            self.postMessage(createSafeBoxResult({
                message: "No original files found",
            }));
            return;
        }

        const imageToModify = structuredClone(
            originalFiles[currentImageIndex],
        );
        console.log(
            "Image to modify",
            imageToModify,
        );
        if (!imageToModify) {
            self.postMessage(createSafeBoxResult({
                message: "No image to modify",
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
        if (modifyImageResult.err) {
            return createSafeBoxResult({
                message: modifyImageResult.val.message ??
                    "Unable to modify image",
            });
        }
        const fileBlob = modifyImageResult.safeUnwrap().data;
        if (fileBlob === undefined) {
            return createSafeBoxResult({
                message: "File blob is undefined",
            });
        }

        const modifiedFilesResult = await getCachedItemSafeAsync<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);
        console.log(
            "Modified files result",
            modifiedFilesResult,
        );
        if (modifiedFilesResult.err) {
            self.postMessage(createSafeBoxResult({
                message: modifiedFilesResult.val.message ??
                    "Error getting modified files",
            }));
            return;
        }
        const modifiedFiles = modifiedFilesResult.safeUnwrap().data ?? [];
        const updatedModifiedFiles = modifiedFiles.map(
            (modifiedFile, index) =>
                index === currentImageIndex ? fileBlob : modifiedFile,
        );

        const setForageItemSafeResult = await setCachedItemSafeAsync(
            modifiedFilesForageKey,
            updatedModifiedFiles,
        );
        console.log(
            "Set forage item safe result",
            setForageItemSafeResult,
        );
        if (setForageItemSafeResult.err) {
            self.postMessage(createSafeBoxResult({
                message: setForageItemSafeResult.val.message ??
                    "Error setting modified files",
            }));
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

        const setQualitiesResult = await setCachedItemSafeAsync(
            qualitiesForageKey,
            clonedQualities,
        );
        console.log(
            "Set qualities result",
            setQualitiesResult,
        );
        if (setQualitiesResult.err) {
            self.postMessage(createSafeBoxResult({
                message: setQualitiesResult.val.message ??
                    "Error setting qualities",
            }));
            return;
        }

        // update orientations

        const clonedOrientations = orientations.map((o, index) =>
            index === currentImageIndex ? orientation : o
        );

        const setOrientationsResult = await setCachedItemSafeAsync(
            orientationsForageKey,
            clonedOrientations,
        );
        console.log(
            "Set orientations result",
            setOrientationsResult,
        );
        if (setOrientationsResult.err) {
            self.postMessage(createSafeBoxResult({
                message: setOrientationsResult.val.message ??
                    "Error setting orientations",
            }));
            return;
        }

        const fileNamesResult = await getCachedItemSafeAsync<
            Array<string>
        >(fileNamesForageKey);
        console.log(
            "File names result",
            fileNamesResult,
        );
        if (fileNamesResult.err) {
            self.postMessage(createSafeBoxResult({
                message: fileNamesResult.val.message ??
                    "Error getting file names",
            }));
            return;
        }
        const fileNames = fileNamesResult.safeUnwrap().data ?? [];

        self.postMessage(createSafeBoxResult({
            data: {
                areImagesInvalid,
                currentImageIndex,
                fileBlob,
                fileNames,
                quality,
                updatedModifiedFiles,
                orientation,
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

export type {
    MessageEventModifyImagesMainToWorker,
    MessageEventModifyImagesWorkerToMain,
};
