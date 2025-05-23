import { EImageType } from "image-conversion";
import { SafeResult } from "../../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    getCachedItemAsyncSafe,
    modifyImageSafe,
    parseSyncSafe,
    setCachedItemAsyncSafe,
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
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleResetImageClickInputZod,
        });
        if (parsedInputResult.err) {
            input?.showBoundary?.(parsedInputResult);
            return parsedInputResult;
        }
        if (parsedInputResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing input",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
        }

        const {
            accessibleImageInputDispatch,
            index,
            isComponentMountedRef,
            showBoundary,
            storageKey,
        } = parsedInputResult.val.val;

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }

        const {
            originalFilesForageKey,
        } = createImageInputForageKeys(
            storageKey,
        );

        const originalFilesResult = await getCachedItemAsyncSafe<
            Array<OriginalFile>
        >(originalFilesForageKey);
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }
        if (originalFilesResult.err) {
            showBoundary(originalFilesResult);
            return originalFilesResult;
        }

        if (originalFilesResult.val.some) {
            const originalFiles = originalFilesResult.val.none
                ? []
                : originalFilesResult.val.val;
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

        return createSafeSuccessResult(
            "Image reset successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
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
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleRemoveImageClickInputZod,
        });
        if (parsedInputResult.err) {
            input?.showBoundary?.(parsedInputResult);
            return parsedInputResult;
        }
        if (parsedInputResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing input",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
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
        } = parsedInputResult.val.val;

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }

        const {
            modifiedFilesForageKey,
            originalFilesForageKey,
            fileNamesForageKey,
        } = createImageInputForageKeys(
            storageKey,
        );

        const modifiedFilesResult = await getCachedItemAsyncSafe<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }
        if (modifiedFilesResult.err) {
            showBoundary(modifiedFilesResult);
            return modifiedFilesResult;
        }

        const modifiedFiles = modifiedFilesResult.val.none
            ? []
            : modifiedFilesResult.val.val;
        modifiedFiles?.splice(index, 1);

        const setModifiedFilesResult = await setCachedItemAsyncSafe(
            modifiedFilesForageKey,
            modifiedFiles,
        );
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }
        if (setModifiedFilesResult.err) {
            showBoundary(setModifiedFilesResult);
            return setModifiedFilesResult;
        }

        const originalFilesResult = await getCachedItemAsyncSafe<
            Array<OriginalFile>
        >(originalFilesForageKey);
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }
        if (originalFilesResult.err) {
            showBoundary(originalFilesResult);
            return originalFilesResult;
        }

        const originalFiles = originalFilesResult.val.none
            ? []
            : originalFilesResult.val.val;
        originalFiles?.splice(index, 1);

        const setOriginalFilesResult = await setCachedItemAsyncSafe(
            originalFilesForageKey,
            originalFiles,
        );
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }
        if (setOriginalFilesResult.err) {
            showBoundary(setOriginalFilesResult);
            return createSafeErrorResult(
                "Unable to set original files",
            );
        }

        const fileNamesResult = await getCachedItemAsyncSafe<Array<string>>(
            fileNamesForageKey,
        );
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }
        if (fileNamesResult.err) {
            showBoundary(fileNamesResult);
            return createSafeErrorResult(
                "Unable to retrieve file names",
            );
        }

        const fileNames = fileNamesResult.val.none
            ? []
            : fileNamesResult.val.val;
        const existingFileName = fileNames[index];
        fileNames?.splice(index, 1);

        const setFileNamesResult = await setCachedItemAsyncSafe(
            fileNamesForageKey,
            fileNames,
        );
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }
        if (setFileNamesResult.err) {
            showBoundary(setFileNamesResult);
            return createSafeErrorResult(
                "Unable to set file names",
            );
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

        return createSafeSuccessResult(
            "Image removed successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
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
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventModifyImagesWorkerToMainInputZod,
        });
        if (parsedInputResult.err) {
            input?.showBoundary?.(parsedInputResult);
            return parsedInputResult;
        }
        if (parsedInputResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing input",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
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
        } = parsedInputResult.val.val;

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component unmounted",
            );
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createSafeErrorResult(
                "No data in message event",
            );
        }
        if (messageEventResult.err) {
            showBoundary(messageEventResult);
            return messageEventResult;
        }
        if (messageEventResult.val.none) {
            showBoundary(messageEventResult);
            return createSafeErrorResult(
                "No data in message event",
            );
        }

        const {
            areImagesInvalid,
            currentImageIndex,
            fileBlob,
            fileNames,
            updatedModifiedFiles,
            orientation,
            quality,
        } = messageEventResult.val.val;

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

        return createSafeSuccessResult(
            "Image modified successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
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
): Promise<SafeResult<string>> {
    try {
        console.log("handleImageQualityOrientationSliderChange");
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleImageQualityOrientationSliderChangeInputZod,
        });
        if (parsedInputResult.err) {
            input?.showBoundary?.(parsedInputResult);
            return parsedInputResult;
        }
        if (parsedInputResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing input",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
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
        } = parsedInputResult.val.val;

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }

        const {
            modifiedFilesForageKey,
            orientationsForageKey,
            originalFilesForageKey,
            qualitiesForageKey,
        } = createImageInputForageKeys(
            storageKey,
        );

        const originalFilesResult = await getCachedItemAsyncSafe<
            Array<OriginalFile>
        >(originalFilesForageKey);
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult("Component is not mounted");
        }
        if (originalFilesResult.err) {
            showBoundary(originalFilesResult);
            return originalFilesResult;
        }
        if (originalFilesResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "No original files found",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }
        const originalFiles = originalFilesResult.val.val;
        if (originalFiles.length === 0) {
            const safeErrorResult = createSafeErrorResult(
                "No original files found",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const imageToModify = structuredClone(
            originalFiles[currentImageIndex],
        );
        if (!imageToModify) {
            return createSafeErrorResult(
                "Image to modify is undefined",
            );
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
            return createSafeErrorResult("Component is not mounted");
        }
        if (modifyImageResult.err) {
            showBoundary(modifyImageResult.val);
            return modifyImageResult;
        }
        if (modifyImageResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "No modified image found",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const fileBlob = modifyImageResult.val.val;

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setImageFileBlob,
            payload: {
                fileBlob,
                index: currentImageIndex,
            },
        });

        const modifiedFilesResult = await getCachedItemAsyncSafe<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }
        if (modifiedFilesResult.err) {
            showBoundary(modifiedFilesResult);
            return modifiedFilesResult;
        }
        const modifiedFiles = modifiedFilesResult.val.none
            ? []
            : modifiedFilesResult.val.val;
        const updatedModifiedFiles = modifiedFiles.map(
            (modifiedFile, index) =>
                index === currentImageIndex ? fileBlob : modifiedFile,
        );

        const setModifiedFilesResult = await setCachedItemAsyncSafe(
            modifiedFilesForageKey,
            updatedModifiedFiles,
        );
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component is not mounted",
            );
        }
        if (setModifiedFilesResult.err) {
            showBoundary(setModifiedFilesResult);
            return setModifiedFilesResult;
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

            const setQualitiesResult = await setCachedItemAsyncSafe(
                qualitiesForageKey,
                clonedQualities,
            );
            if (!isComponentMountedRef.current) {
                return createSafeErrorResult(
                    "Component is not mounted",
                );
            }
            if (setQualitiesResult.err) {
                showBoundary(setQualitiesResult);
                return setQualitiesResult;
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

            const setOrientationsResult = await setCachedItemAsyncSafe(
                orientationsForageKey,
                clonedOrientations,
            );
            if (!isComponentMountedRef.current) {
                return createSafeErrorResult(
                    "Component is not mounted",
                );
            }
            if (setOrientationsResult.err) {
                showBoundary(setOrientationsResult);
                return createSafeErrorResult(
                    "Error setting orientations",
                );
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

        return createSafeSuccessResult(
            "Image modified successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
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
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventRetrieveImagesWorkerToMainInputZod,
        });
        if (parsedInputResult.err) {
            input?.showBoundary?.(parsedInputResult);
            return parsedInputResult;
        }
        if (parsedInputResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing input",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
        }

        const {
            event,
            accessibleImageInputDispatch,
            isComponentMountedRef,
            showBoundary,
        } = parsedInputResult.val.val;

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component unmounted",
            );
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createSafeErrorResult(
                "No data in message event",
            );
        }

        if (messageEventResult.err) {
            showBoundary(messageEventResult);
            return messageEventResult;
        }
        if (messageEventResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "No data in message event",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const { fileNames, modifiedFiles, orientations, qualities } =
            messageEventResult.val.val;

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component unmounted",
            );
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

        return createSafeSuccessResult(
            "Images retrieved successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

export {
    handleImageQualityOrientationSliderChange,
    handleMessageEventModifyImagesWorkerToMain,
    handleMessageEventRetrieveImagesWorkerToMain,
    handleRemoveImageClick,
    handleResetImageClick,
};
