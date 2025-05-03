import { EImageType } from "image-conversion";
import { SafeBoxResult } from "../../../types";
import {
    createSafeBoxResult,
    GetForageItemSafe,
    ModifyImageSafe,
    SetForageItemSafe,
} from "../../../utils";
import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import { accessibleImageInputAction } from "./actions";
import { ALLOWED_FILE_EXTENSIONS_REGEX } from "./constants";
import { AccessibleImageInputDispatch, SetFilesInErrorPayload } from "./types";
import { createImageInputForageKeys, validateImages } from "./utils";

async function handleResetImageClick(
    {
        accessibleImageInputDispatch,
        getForageItemSafe,
        index,
        isComponentMountedRef,
        storageKey,
    }: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        getForageItemSafe: GetForageItemSafe;
        index: number;
        isComponentMountedRef: React.RefObject<boolean>;
        storageKey: string;
    },
): Promise<SafeBoxResult<boolean>> {
    const isComponentMounted = isComponentMountedRef.current;
    if (!isComponentMounted) {
        return createSafeBoxResult({
            message: "Component is not mounted",
        });
    }

    const {
        originalFilesForageKey,
    } = createImageInputForageKeys(
        storageKey,
    );

    try {
        const originalFilesResult = await getForageItemSafe<
            Array<OriginalFile>
        >(originalFilesForageKey);
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }

        if (originalFilesResult.ok) {
            const originalFiles = originalFilesResult.safeUnwrap().data ?? [];
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

        return createSafeBoxResult({
            kind: "success",
            data: true,
        });
    } catch (error: any) {
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Error: Component is not mounted",
            });
        }
        return createSafeBoxResult({
            message: error.message ?? "Error resetting image",
        });
    }
}

async function handleRemoveImageClick<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    {
        accessibleImageInputDispatch,
        getForageItemSafe,
        index,
        invalidValueAction,
        isComponentMountedRef,
        parentDispatch,
        setForageItemSafe,
        storageKey,
        validValueAction,
    }: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        getForageItemSafe: GetForageItemSafe;
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
        setForageItemSafe: SetForageItemSafe;
        storageKey: string;
        validValueAction: ValidValueAction;
    },
): Promise<SafeBoxResult<boolean>> {
    const isComponentMounted = isComponentMountedRef.current;
    if (!isComponentMounted) {
        return createSafeBoxResult({
            message: "Component is not mounted",
        });
    }

    const {
        modifiedFilesForageKey,
        originalFilesForageKey,
        fileNamesForageKey,
    } = createImageInputForageKeys(
        storageKey,
    );

    try {
        const modifiedFilesResult = await getForageItemSafe<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
        if (modifiedFilesResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }
        const modifiedFiles = modifiedFilesResult.safeUnwrap().data ?? [];
        modifiedFiles?.splice(index, 1);

        const setModifiedFilesResult = await setForageItemSafe(
            modifiedFilesForageKey,
            modifiedFiles,
        );
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
        if (setModifiedFilesResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }

        const originalFilesResult = await getForageItemSafe<
            Array<OriginalFile>
        >(originalFilesForageKey);
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
        if (originalFilesResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }

        const originalFiles = originalFilesResult.safeUnwrap().data ?? [];
        originalFiles?.splice(index, 1);

        await setForageItemSafe(
            originalFilesForageKey,
            originalFiles,
        );
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }

        const fileNamesResult = await getForageItemSafe<Array<string>>(
            fileNamesForageKey,
        );
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
        if (fileNamesResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }

        const fileNames = fileNamesResult.safeUnwrap().data ?? [];
        const existingFileName = fileNames[index];
        fileNames?.splice(index, 1);

        await setForageItemSafe(
            fileNamesForageKey,
            fileNames,
        );
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
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

        return createSafeBoxResult({
            kind: "success",
            data: true,
        });
    } catch (error) {
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Error: Component is not mounted",
            });
        }

        return createSafeBoxResult({
            kind: "error",
            message: "Error removing image",
        });
    }
}

async function handleImageQualityOrientationSliderChange<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    {
        accessibleImageInputDispatch,
        currentImageIndex,
        fileNames,
        getForageItemSafe,
        isComponentMountedRef,
        imageFileBlobs,
        invalidValueAction,
        maxImagesAmount,
        maxImageSize,
        modifyImageSafe,
        orientations,
        orientationValue,
        parentDispatch,
        qualities,
        qualityValue,
        setForageItemSafe,
        showBoundary,
        storageKey,
        validValueAction,
    }: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        currentImageIndex: number;
        fileNames: string[];
        getForageItemSafe: GetForageItemSafe;
        isComponentMountedRef: React.RefObject<boolean>;
        imageFileBlobs: Array<ModifiedFile>;
        invalidValueAction: InvalidValueAction;
        maxImagesAmount: number;
        maxImageSize: number;
        modifyImageSafe: ModifyImageSafe;
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
        setForageItemSafe: SetForageItemSafe;
        showBoundary: (error: Error) => void;
        storageKey: string;
        validValueAction: ValidValueAction;
    },
): Promise<SafeBoxResult> {
    const isComponentMounted = isComponentMountedRef.current;
    if (!isComponentMounted) {
        return createSafeBoxResult({
            message: "Component is not mounted",
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

    try {
        const originalFilesResult = await getForageItemSafe<
            Array<OriginalFile>
        >(originalFilesForageKey);
        console.log("isComponentMounted", isComponentMounted);
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
        if (originalFilesResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
                message: originalFilesResult.val.message ??
                    "Unable to retrieve original files",
            });
        }
        const originalFiles = originalFilesResult.safeUnwrap().data ??
            [];
        if (originalFiles.length === 0) {
            return createSafeBoxResult({
                message: "Original files are empty",
            });
        }

        const imageToModify = structuredClone(
            originalFiles[currentImageIndex],
        );
        if (!imageToModify) {
            return createSafeBoxResult({
                message: "Image to modify is undefined",
            });
        }

        const quality = qualityValue
            ? qualityValue / 10
            : qualities[currentImageIndex] / 10;
        const orientation = orientationValue ?? orientations[currentImageIndex];
        const type = imageToModify?.type as EImageType;

        console.log(
            "handleImageQualityOrientationSliderChange",
            {
                currentImageIndex,
                fileNames,
                imageFileBlobs,
                maxImageSize,
                maxImagesAmount,
                modifiedFilesForageKey,
                orientationValue,
                orientations,
                orientationsForageKey,
                originalFiles,
                originalFilesForageKey,
                qualities,
                qualitiesForageKey,
                qualityValue,
                quality,
                orientation,
                type,
            },
        );

        const modifyImageResult = await modifyImageSafe(imageToModify, {
            quality,
            orientation,
            type,
        });
        console.log(
            "handleImageQualityOrientationSliderChange modifyImageResult",
            modifyImageResult,
        );
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
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

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setImageFileBlob,
            payload: {
                fileBlob,
                index: currentImageIndex,
            },
        });

        const modifiedFilesResult = await getForageItemSafe<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
        if (modifiedFilesResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
                message: modifiedFilesResult.val.message ??
                    "Unable to retrieve modified files",
            });
        }
        const modifiedFiles = modifiedFilesResult.safeUnwrap().data ?? [];
        const updatedModifiedFiles = modifiedFiles.map(
            (modifiedFile, index) =>
                index === currentImageIndex ? fileBlob : modifiedFile,
        );

        await setForageItemSafe(
            modifiedFilesForageKey,
            updatedModifiedFiles,
        );
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }

        const { areImagesInvalid } = validateImages({
            allowedFileExtensionsRegex: ALLOWED_FILE_EXTENSIONS_REGEX,
            imageFileBlobs: updatedModifiedFiles,
            maxImagesAmount,
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

            await setForageItemSafe(
                qualitiesForageKey,
                clonedQualities,
            );
            if (!isComponentMounted) {
                return createSafeBoxResult({
                    message: "Component is not mounted",
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

            await setForageItemSafe(
                orientationsForageKey,
                clonedOrientations,
            );
            if (!isComponentMounted) {
                return createSafeBoxResult({
                    message: "Component is not mounted",
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

        return createSafeBoxResult({
            kind: "success",
            data: true,
        });
    } catch (error: any) {
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Error: Component is not mounted",
            });
        }

        showBoundary(error);
        return createSafeBoxResult({
            message: "Unknown error",
        });
    }
}

export {
    handleImageQualityOrientationSliderChange,
    handleRemoveImageClick,
    handleResetImageClick,
};
