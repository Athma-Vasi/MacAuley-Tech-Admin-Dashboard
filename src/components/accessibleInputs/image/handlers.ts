import { EImageType } from "image-conversion";
import { Some } from "ts-results";
import { ResultSafeBox } from "../../../types";
import {
    createResultSafeBox,
    getCachedItemSafeAsync,
    modifyImageSafe,
    parseSafeSync,
    setCachedItemSafeAsync,
} from "../../../utils";
import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import { accessibleImageInputAction } from "./actions";
import { ALLOWED_FILE_EXTENSIONS_REGEX } from "./constants";
import { MessageEventModifyImagesWorkerToMain } from "./modifyImagesWorker";
import { MessageEventRetrieveImagesWorkerToMain } from "./retrieveImagesWorker";
import {
    handleImageQualityOrientationSliderChangeInputZod,
    handleMessageEventModifyImagesWorkerToMainInputZod,
    handleMessageEventRetrieveImagesWorkerToMainInputZod,
    handleRemoveImageClickInputZod,
    handleResetImageClickInputZod,
} from "./schemas";
import { AccessibleImageInputDispatch, SetFilesInErrorPayload } from "./types";
import { createImageInputForageKeys, validateImages } from "./utils";

async function handleResetImageClick(
    input: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        index: number;
        isComponentMountedRef: React.RefObject<boolean>;
        showBoundary: (error: unknown) => void;
        storageKey: string;
    },
): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSafeSync({
            object: input,
            zSchema: handleResetImageClickInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createResultSafeBox({
                data: parsedInputResult.val.data ?? Some("Error parsing input"),
            });
        }

        const {
            accessibleImageInputDispatch,
            index,
            isComponentMountedRef,
            showBoundary,
            storageKey,
        } = parsedInputResult.val.data.val;

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        const {
            originalFilesForageKey,
        } = createImageInputForageKeys(
            storageKey,
        );

        const originalFilesResult = await getCachedItemSafeAsync<
            Array<OriginalFile>
        >(originalFilesForageKey);
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (originalFilesResult.err) {
            showBoundary(originalFilesResult.val.data);
            return createResultSafeBox({
                data: Some("Original files not found"),
            });
        }

        if (originalFilesResult.val.data.some) {
            const originalFiles = originalFilesResult.val.data.none
                ? []
                : originalFilesResult.val.data.val;
            const originalFile = originalFiles[index];

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.resetImageFileBlob,
                payload: {
                    index,
                    value: originalFile,
                },
            });
        }

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setCurrentImageIndex,
            payload: index,
        });

        return createResultSafeBox({
            data: Some("Image reset successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createResultSafeBox({
            data: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        });
    }
}

async function handleRemoveImageClick<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    input: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        index: number;
        invalidValueAction: InvalidValueAction;
        isComponentMountedRef: React.RefObject<boolean>;
        parentDispatch?: React.Dispatch<
            | {
                action: ValidValueAction;
                payload: FormData;
            }
            | {
                action: InvalidValueAction;
                payload: SetFilesInErrorPayload;
            }
        >;
        showBoundary: (error: unknown) => void;
        storageKey: string;
        validValueAction: ValidValueAction;
    },
): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSafeSync({
            object: input,
            zSchema: handleRemoveImageClickInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createResultSafeBox({
                data: parsedInputResult.val.data ?? Some("Error parsing input"),
            });
        }

        const {
            accessibleImageInputDispatch,
            index,
            invalidValueAction,
            isComponentMountedRef,
            parentDispatch,
            showBoundary,
            storageKey,
            validValueAction,
        } = parsedInputResult.val.data.val;

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }

        const {
            modifiedFilesForageKey,
            originalFilesForageKey,
            fileNamesForageKey,
        } = createImageInputForageKeys(
            storageKey,
        );

        const modifiedFilesResult = await getCachedItemSafeAsync<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (modifiedFilesResult.err) {
            showBoundary(modifiedFilesResult.val.data);
            return createResultSafeBox({
                data: modifiedFilesResult.val.data,
                message: modifiedFilesResult.val.message ?? Some("Not found"),
            });
        }

        const modifiedFiles = modifiedFilesResult.val.data.none
            ? []
            : modifiedFilesResult.val.data.val;
        modifiedFiles?.splice(index, 1);

        const setModifiedFilesResult = await setCachedItemSafeAsync(
            modifiedFilesForageKey,
            modifiedFiles,
        );
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (setModifiedFilesResult.err) {
            showBoundary(setModifiedFilesResult.val.data);
            return createResultSafeBox({
                data: setModifiedFilesResult.val.data,
                message: setModifiedFilesResult.val.message ??
                    Some("Not found"),
            });
        }

        const originalFilesResult = await getCachedItemSafeAsync<
            Array<OriginalFile>
        >(originalFilesForageKey);
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (originalFilesResult.err) {
            showBoundary(originalFilesResult.val.data);
            return createResultSafeBox({
                data: originalFilesResult.val.data,
                message: originalFilesResult.val.message ??
                    Some("Unable to retrieve original files"),
            });
        }

        const originalFiles = originalFilesResult.val.data.none
            ? []
            : originalFilesResult.val.data.val;
        originalFiles?.splice(index, 1);

        const setOriginalFilesResult = await setCachedItemSafeAsync(
            originalFilesForageKey,
            originalFiles,
        );
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (setOriginalFilesResult.err) {
            showBoundary(setOriginalFilesResult.val.data);
            return createResultSafeBox({
                data: setOriginalFilesResult.val.data,
                message: setOriginalFilesResult.val.message ??
                    Some("Not found"),
            });
        }

        const fileNamesResult = await getCachedItemSafeAsync<Array<string>>(
            fileNamesForageKey,
        );
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (fileNamesResult.err) {
            showBoundary(fileNamesResult.val.data);
            return createResultSafeBox({
                data: fileNamesResult.val.data,
                message: fileNamesResult.val.message ??
                    Some("Unable to retrieve file names"),
            });
        }

        const fileNames = fileNamesResult.val.data.none
            ? []
            : fileNamesResult.val.data.val;
        const existingFileName = fileNames[index];
        fileNames?.splice(index, 1);

        const setFileNamesResult = await setCachedItemSafeAsync(
            fileNamesForageKey,
            fileNames,
        );
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (setFileNamesResult.err) {
            showBoundary(setFileNamesResult.val.data);
            return createResultSafeBox({
                data: setFileNamesResult.val.data,
                message: setFileNamesResult.val.message ??
                    Some("Not found"),
            });
        }

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.removeImageFileBlob,
            payload: index,
        });
        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setCurrentImageIndex,
            payload: index,
        });
        parentDispatch?.({
            action: validValueAction,
            payload: new FormData(),
        });
        parentDispatch?.({
            action: invalidValueAction,
            payload: {
                kind: "remove",
                name: existingFileName,
            },
        });

        return createResultSafeBox({
            data: Some("Image removed successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createResultSafeBox({
            data: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        });
    }
}

async function handleMessageEventModifyImagesWorkerToMain<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    input: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        event: MessageEventModifyImagesWorkerToMain;
        isComponentMountedRef: React.RefObject<boolean>;
        invalidValueAction: InvalidValueAction;
        parentDispatch?: React.Dispatch<
            | {
                action: ValidValueAction;
                payload: FormData;
            }
            | {
                action: InvalidValueAction;
                payload: SetFilesInErrorPayload;
            }
        >;
        showBoundary: (error: unknown) => void;
        storageKey: string;
        validValueAction: ValidValueAction;
    },
): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSafeSync({
            object: input,
            zSchema: handleMessageEventModifyImagesWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createResultSafeBox({
                data: parsedInputResult.val.data ?? Some("Error parsing input"),
            });
        }

        const {
            accessibleImageInputDispatch,
            event,
            isComponentMountedRef,
            invalidValueAction,
            parentDispatch,
            showBoundary,
            storageKey,
            validValueAction,
        } = parsedInputResult.val.data.val;

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createResultSafeBox({
                data: Some("No data in message event"),
            });
        }

        if (messageEventResult.err || messageEventResult.val.data.none) {
            showBoundary(messageEventResult.val.data);
            return createResultSafeBox({
                data: messageEventResult.val.data,
                message: messageEventResult.val.message,
            });
        }

        const {
            areImagesInvalid,
            currentImageIndex,
            fileBlob,
            fileNames,
            updatedModifiedFiles,
            orientation,
            quality,
        } = messageEventResult.val.data.val;

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setImageFileBlob,
            payload: {
                fileBlob,
                index: currentImageIndex,
            },
        });

        areImagesInvalid.forEach(
            (isImageInvalid, index) => {
                parentDispatch?.({
                    action: invalidValueAction,
                    payload: {
                        kind: isImageInvalid ? "isError" : "notError",
                        name: fileNames[index],
                    },
                });
            },
        );

        const { modifiedFilesForageKey } = createImageInputForageKeys(
            storageKey,
        );

        const formData = updatedModifiedFiles.reduce<FormData>(
            (formDataAcc, modifiedFile, index) => {
                if (modifiedFile) {
                    formDataAcc.append(
                        modifiedFilesForageKey,
                        modifiedFile,
                        fileNames[index],
                    );
                }

                return formDataAcc;
            },
            new FormData(),
        );

        parentDispatch?.({
            action: validValueAction,
            payload: formData,
        });

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setQuality,
            payload: { index: currentImageIndex, value: quality },
        });
        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setOrientation,
            payload: { index: currentImageIndex, value: orientation },
        });
        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setCurrentImageIndex,
            payload: currentImageIndex,
        });
        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setIsLoading,
            payload: false,
        });

        return createResultSafeBox({
            data: Some("Image modified successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createResultSafeBox({
            data: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        });
    }
}

async function handleImageQualityOrientationSliderChange<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    input: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        currentImageIndex: number;
        fileNames: string[];
        isComponentMountedRef: React.RefObject<boolean>;
        invalidValueAction: InvalidValueAction;
        maxImageSize: number;
        orientations: number[];
        orientationValue?: number;
        parentDispatch?: React.Dispatch<
            | {
                action: ValidValueAction;
                payload: FormData;
            }
            | {
                action: InvalidValueAction;
                payload: SetFilesInErrorPayload;
            }
        >;
        qualities: number[];
        qualityValue?: number;
        showBoundary: (error: unknown) => void;
        storageKey: string;
        validValueAction: ValidValueAction;
    },
): Promise<ResultSafeBox<string>> {
    try {
        console.log("handleImageQualityOrientationSliderChange");
        const parsedInputResult = parseSafeSync({
            object: input,
            zSchema: handleImageQualityOrientationSliderChangeInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createResultSafeBox({
                data: parsedInputResult.val.data ?? Some("Error parsing input"),
            });
        }

        const {
            accessibleImageInputDispatch,
            currentImageIndex,
            fileNames,
            isComponentMountedRef,
            invalidValueAction,
            maxImageSize,
            orientations,
            orientationValue,
            parentDispatch,
            showBoundary,
            qualities,
            qualityValue,
            storageKey,
            validValueAction,
        } = parsedInputResult.val.data.val;

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }

        const {
            modifiedFilesForageKey,
            orientationsForageKey,
            originalFilesForageKey,
            qualitiesForageKey,
        } = createImageInputForageKeys(
            storageKey,
        );

        const originalFilesResult = await getCachedItemSafeAsync<
            Array<OriginalFile>
        >(originalFilesForageKey);
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (originalFilesResult.err) {
            return createResultSafeBox({
                data: originalFilesResult.val.data,
                message: originalFilesResult.val.message ??
                    Some("Error getting original files"),
            });
        }
        if (originalFilesResult.val.data.none) {
            return createResultSafeBox({
                data: Some("No original files found"),
            });
        }
        const originalFiles = originalFilesResult.val.data.val;
        if (originalFiles.length === 0) {
            return createResultSafeBox({
                data: Some("No original files found"),
            });
        }

        const imageToModify = structuredClone(
            originalFiles[currentImageIndex],
        );
        if (!imageToModify) {
            return createResultSafeBox({
                data: Some("Image to modify is undefined"),
            });
        }

        const quality = qualityValue
            ? qualityValue / 10
            : qualities[currentImageIndex] / 10;
        const orientation = orientationValue ?? orientations[currentImageIndex];
        const type = imageToModify?.type as EImageType;

        const modifyImageResult = await modifyImageSafe(imageToModify, {
            quality,
            orientation,
            type,
        });
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (modifyImageResult.err || modifyImageResult.val.data.none) {
            showBoundary(modifyImageResult.val.data);
            return createResultSafeBox({
                data: modifyImageResult.val.data,
                message: modifyImageResult.val.message ??
                    Some("Error modifying image"),
            });
        }

        const fileBlob = modifyImageResult.val.data.val;

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setImageFileBlob,
            payload: {
                fileBlob,
                index: currentImageIndex,
            },
        });

        const modifiedFilesResult = await getCachedItemSafeAsync<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (modifiedFilesResult.err) {
            return createResultSafeBox({
                data: modifiedFilesResult.val.data,
                message: modifiedFilesResult.val.message ??
                    Some("Error getting modified files"),
            });
        }
        const modifiedFiles = modifiedFilesResult.val.data.none
            ? []
            : modifiedFilesResult.val.data.val;
        const updatedModifiedFiles = modifiedFiles.map(
            (modifiedFile, index) =>
                index === currentImageIndex ? fileBlob : modifiedFile,
        );

        const setModifiedFilesResult = await setCachedItemSafeAsync(
            modifiedFilesForageKey,
            updatedModifiedFiles,
        );
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component is not mounted"),
            });
        }
        if (setModifiedFilesResult.err) {
            showBoundary(setModifiedFilesResult.val.data);
            return createResultSafeBox({
                data: setModifiedFilesResult.val.data,
                message: setModifiedFilesResult.val.message ??
                    Some("Error setting modified files"),
            });
        }

        const { areImagesInvalid } = validateImages({
            allowedFileExtensionsRegex: ALLOWED_FILE_EXTENSIONS_REGEX,
            imageFileBlobs: updatedModifiedFiles,
            maxImageSize,
        });

        areImagesInvalid.forEach(
            (isImageInvalid, index) => {
                parentDispatch?.({
                    action: invalidValueAction,
                    payload: {
                        kind: isImageInvalid ? "isError" : "notError",
                        name: fileNames[index],
                    },
                });
            },
        );

        const formData = updatedModifiedFiles.reduce<FormData>(
            (formDataAcc, modifiedFile, index) => {
                if (modifiedFile) {
                    formDataAcc.append(
                        modifiedFilesForageKey,
                        modifiedFile,
                        fileNames[index],
                    );
                }

                return formDataAcc;
            },
            new FormData(),
        );

        parentDispatch?.({
            action: validValueAction,
            payload: formData,
        });

        // update qualities
        if (qualityValue !== undefined) {
            const clonedQualities = structuredClone(qualities);
            clonedQualities[currentImageIndex] = qualityValue;

            const setQualitiesResult = await setCachedItemSafeAsync(
                qualitiesForageKey,
                clonedQualities,
            );
            if (!isComponentMountedRef.current) {
                return createResultSafeBox({
                    data: Some("Component is not mounted"),
                });
            }
            if (setQualitiesResult.err) {
                showBoundary(setQualitiesResult.val.data);
                return createResultSafeBox({
                    data: setQualitiesResult.val.data,
                    message: setQualitiesResult.val.message ??
                        Some("Error setting qualities"),
                });
            }

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.setQuality,
                payload: { index: currentImageIndex, value: qualityValue },
            });
        }
        // update orientations
        if (orientationValue !== undefined) {
            const clonedOrientations = structuredClone(orientations);
            clonedOrientations[currentImageIndex] = orientationValue;

            const setOrientationsResult = await setCachedItemSafeAsync(
                orientationsForageKey,
                clonedOrientations,
            );
            if (!isComponentMountedRef.current) {
                return createResultSafeBox({
                    data: Some("Component is not mounted"),
                });
            }
            if (setOrientationsResult.err) {
                showBoundary(setOrientationsResult.val.data);
                return createResultSafeBox({
                    data: setOrientationsResult.val.data,
                    message: setOrientationsResult.val.message ??
                        Some("Error setting orientations"),
                });
            }

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.setOrientation,
                payload: { index: currentImageIndex, value: orientationValue },
            });
        }

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setCurrentImageIndex,
            payload: currentImageIndex,
        });

        return createResultSafeBox({
            data: Some("Image modified successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createResultSafeBox({
            data: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        });
    }
}

async function handleMessageEventRetrieveImagesWorkerToMain(
    input: {
        event: MessageEventRetrieveImagesWorkerToMain;
        isComponentMountedRef: React.RefObject<boolean>;
        showBoundary: (error: unknown) => void;
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
    },
): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSafeSync({
            object: input,
            zSchema: handleMessageEventRetrieveImagesWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createResultSafeBox({
                data: parsedInputResult.val.data ?? Some("Error parsing input"),
            });
        }

        const {
            event,
            accessibleImageInputDispatch,
            isComponentMountedRef,
            showBoundary,
        } = parsedInputResult.val.data.val;

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createResultSafeBox({
                data: Some("No data in message event"),
            });
        }

        if (messageEventResult.err || messageEventResult.val.data.none) {
            showBoundary(messageEventResult.val.data);
            return createResultSafeBox({
                data: messageEventResult.val.data,
                message: messageEventResult.val.message,
            });
        }

        const { fileNames, modifiedFiles, orientations, qualities } =
            messageEventResult.val.data.val;

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        modifiedFiles?.forEach((modifiedFile: ModifiedFile, index) => {
            if (!modifiedFile) {
                return;
            }

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.setImageFileBlob,
                payload: { fileBlob: modifiedFile, index },
            });

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.addFileName,
                payload: {
                    index,
                    value: fileNames[index],
                },
            });

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.setQuality,
                payload: { index, value: qualities[index] },
            });

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.setOrientation,
                payload: { index, value: orientations[index] },
            });
        });

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setIsLoading,
            payload: false,
        });

        return createResultSafeBox({
            data: Some("Images retrieved successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createResultSafeBox({
            data: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        });
    }
}

export {
    handleImageQualityOrientationSliderChange,
    handleMessageEventModifyImagesWorkerToMain,
    handleMessageEventRetrieveImagesWorkerToMain,
    handleRemoveImageClick,
    handleResetImageClick,
};
