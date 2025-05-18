import { EImageType } from "image-conversion";
import { Some } from "ts-results";
import {
    ModifiedFile,
    OriginalFile,
} from "../components/accessibleInputs/AccessibleFileInput";
import { ALLOWED_FILE_EXTENSIONS_REGEX } from "../components/accessibleInputs/image/constants";
import {
    createImageInputForageKeys,
    validateImages,
} from "../components/accessibleInputs/image/utils";
import { ResultSafeBox } from "../types";
import {
    createResultSafeBox,
    createSafeBoxResult,
    getCachedItemSafeAsync,
    modifyImageSafe,
    setCachedItemSafeAsync,
} from "../utils";

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
        if (originalFilesResult.err || originalFilesResult.val.data.none) {
            self.postMessage(
                createResultSafeBox({
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
        if (modifyImageResult.err || modifyImageResult.val.data.none) {
            self.postMessage(
                createResultSafeBox({
                    data: modifyImageResult.val.data,
                    message: modifyImageResult.val.message ??
                        Some("Error modifying image"),
                }),
            );
            return;
        }
        const fileBlob = modifyImageResult.val.data.val;

        const modifiedFilesResult = await getCachedItemSafeAsync<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);
        console.log(
            "Modified files result",
            modifiedFilesResult,
        );
        if (modifiedFilesResult.err) {
            self.postMessage(
                createResultSafeBox({
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

        const setForageItemSafeResult = await setCachedItemSafeAsync(
            modifiedFilesForageKey,
            updatedModifiedFiles,
        );
        console.log(
            "Set forage item safe result",
            setForageItemSafeResult,
        );
        if (setForageItemSafeResult.err) {
            self.postMessage(
                createResultSafeBox({
                    data: setForageItemSafeResult.val.data,
                    message: setForageItemSafeResult.val.message ??
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

        const setQualitiesResult = await setCachedItemSafeAsync(
            qualitiesForageKey,
            clonedQualities,
        );
        console.log(
            "Set qualities result",
            setQualitiesResult,
        );
        if (setQualitiesResult.err) {
            self.postMessage(
                createResultSafeBox({
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

        const setOrientationsResult = await setCachedItemSafeAsync(
            orientationsForageKey,
            clonedOrientations,
        );
        console.log(
            "Set orientations result",
            setOrientationsResult,
        );
        if (setOrientationsResult.err) {
            self.postMessage(
                createResultSafeBox({
                    data: setOrientationsResult.val.data,
                    message: setOrientationsResult.val.message ??
                        Some("Error setting orientations"),
                }),
            );
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
            self.postMessage(
                createResultSafeBox({
                    data: fileNamesResult.val.data,
                    message: fileNamesResult.val.message ??
                        Some("Error setting file names"),
                }),
            );
            return;
        }

        self.postMessage(createResultSafeBox({
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
    MessageEventModifyImagesMainToWorker,
    MessageEventModifyImagesWorkerToMain,
};
