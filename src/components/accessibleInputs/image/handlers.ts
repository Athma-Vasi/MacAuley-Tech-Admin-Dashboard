import { SafeBoxResult } from "../../../types";
import {
    createSafeBoxResult,
    getForageItemSafe,
    setForageItemSafe,
} from "../../../utils";
import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import { accessibleImageInputAction } from "./actions";
import { AccessibleImageInputDispatch } from "./types";
import { modifyImage } from "./utils";

async function handleResetImageClick(
    {
        accessibleImageInputDispatch,
        index,
        isComponentMountedRef,
        originalFilesForageKey,
    }: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        index: number;
        isComponentMountedRef: React.RefObject<boolean>;
        originalFilesForageKey: string;
    },
): Promise<SafeBoxResult<boolean>> {
    const isComponentMounted = isComponentMountedRef.current;
    if (!isComponentMounted) {
        return createSafeBoxResult({
            message: "Component is not mounted",
        });
    }

    try {
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
        if (originalFiles.length === 0) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }

        const originalFile = originalFiles[index];
        accessibleImageInputDispatch({
            action: accessibleImageInputAction.resetImageFileBlob,
            payload: {
                index,
                value: originalFile,
            },
        });
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
            message: "Error resetting image",
        });
    }
}

async function handleRemoveImageClick(
    {
        accessibleImageInputDispatch,
        index,
        isComponentMountedRef,
        modifiedFilesForageKey,
        originalFilesForageKey,
    }: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        index: number;
        isComponentMountedRef: React.RefObject<boolean>;
        modifiedFilesForageKey: string;
        originalFilesForageKey: string;
    },
): Promise<SafeBoxResult<boolean>> {
    const isComponentMounted = isComponentMountedRef.current;
    if (!isComponentMounted) {
        return createSafeBoxResult({
            message: "Component is not mounted",
        });
    }

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

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.removeImageFileBlob,
            payload: index,
        });
        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setCurrentImageIndex,
            payload: index,
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

async function handleImageQualitySliderChange<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    {
        accessibleImageInputDispatch,
        fileNames,
        imageFileBlobs,
        index,
        invalidValueAction,
        isComponentMountedRef,
        maxImageSize,
        maxImagesAmount,
        modifiedFilesForageKey,
        orientations,
        originalFilesForageKey,
        parentDispatch,
        qualities,
        qualitiesForageKey,
        showBoundary,
        validValueAction,
        value,
    }: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        fileNames: string[];
        imageFileBlobs: Array<ModifiedFile>;
        index: number;
        invalidValueAction: InvalidValueAction;
        isComponentMountedRef: React.RefObject<boolean>;
        maxImageSize: number;
        maxImagesAmount: number;
        modifiedFilesForageKey: string;
        orientations: number[];
        originalFilesForageKey: string;
        parentDispatch?: React.Dispatch<
            | {
                action: ValidValueAction;
                payload: FormData;
            }
            | {
                action: InvalidValueAction;
                payload: boolean;
            }
        >;
        qualities: number[];
        qualitiesForageKey: string;
        showBoundary: (error: Error) => void;
        validValueAction: ValidValueAction;
        value: number;
    },
): Promise<SafeBoxResult<boolean>> {
    const isComponentMounted = isComponentMountedRef.current;
    if (!isComponentMounted) {
        return createSafeBoxResult({
            message: "Component is not mounted",
        });
    }

    try {
        const clonedQualities = structuredClone(qualities);
        clonedQualities[index] = value;

        await setForageItemSafe(
            qualitiesForageKey,
            clonedQualities,
        );
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }

        const modifyImageResult = await modifyImage({
            accessibleImageInputDispatch,
            currentImageIndex: index,
            fileNames,
            isComponentMountedRef,
            imageFileBlobs,
            invalidValueAction,
            maxImagesAmount,
            maxImageSize,
            modifiedFilesForageKey,
            orientations,
            originalFilesForageKey,
            parentDispatch,
            qualities: clonedQualities,
            showBoundary,
            validValueAction,
        });

        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
        if (modifyImageResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setQualities,
            payload: { index, value },
        });
        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setCurrentImageIndex,
            payload: index,
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
            message: "Error setting image quality",
        });
    }
}

async function handleImageOrientationSliderChange<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    {
        accessibleImageInputDispatch,
        fileNames,
        imageFileBlobs,
        index,
        invalidValueAction,
        isComponentMountedRef,
        maxImageSize,
        maxImagesAmount,
        modifiedFilesForageKey,
        orientations,
        orientationsForageKey,
        originalFilesForageKey,
        parentDispatch,
        qualities,
        showBoundary,
        validValueAction,
        value,
    }: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        fileNames: string[];
        imageFileBlobs: Array<ModifiedFile>;
        index: number;
        invalidValueAction: InvalidValueAction;
        isComponentMountedRef: React.RefObject<boolean>;
        maxImageSize: number;
        maxImagesAmount: number;
        modifiedFilesForageKey: string;
        orientations: number[];
        orientationsForageKey: string;
        originalFilesForageKey: string;
        parentDispatch?: React.Dispatch<
            | {
                action: ValidValueAction;
                payload: FormData;
            }
            | {
                action: InvalidValueAction;
                payload: boolean;
            }
        >;
        qualities: number[];
        showBoundary: (error: Error) => void;
        validValueAction: ValidValueAction;
        value: number;
    },
) {
    const isComponentMounted = isComponentMountedRef.current;
    if (!isComponentMounted) {
        return createSafeBoxResult({
            message: "Component is not mounted",
        });
    }

    try {
        const clonedOrientations = structuredClone(orientations);
        clonedOrientations[index] = value;

        await setForageItemSafe(
            orientationsForageKey,
            clonedOrientations,
        );
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }

        const modifyImageResult = await modifyImage({
            accessibleImageInputDispatch,
            currentImageIndex: index,
            fileNames,
            isComponentMountedRef,
            imageFileBlobs,
            invalidValueAction,
            maxImagesAmount,
            maxImageSize,
            modifiedFilesForageKey,
            orientations: clonedOrientations,
            originalFilesForageKey,
            parentDispatch,
            qualities,
            showBoundary,
            validValueAction,
        });

        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
        if (modifyImageResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setOrientations,
            payload: { index, value },
        });
        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setCurrentImageIndex,
            payload: index,
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
            message: "Error setting image orientation",
        });
    }
}

export {
    handleImageOrientationSliderChange,
    handleImageQualitySliderChange,
    handleRemoveImageClick,
    handleResetImageClick,
};
