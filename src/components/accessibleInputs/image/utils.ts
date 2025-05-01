import { EImageType } from "image-conversion";
import { SafeBoxResult } from "../../../types";
import {
    createSafeBoxResult,
    getForageItemSafe,
    modifyImageSafe,
    setForageItemSafe,
} from "../../../utils";
import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import { accessibleImageInputAction } from "./actions";
import { ALLOWED_FILE_EXTENSIONS_REGEX } from "./constants";
import { AccessibleImageInputDispatch } from "./types";

function validateImages({
    allowedFileExtensionsRegex,
    imageFileBlobs,
    maxImageSize,
    maxImagesAmount,
}: {
    allowedFileExtensionsRegex: RegExp;
    imageFileBlobs: Array<ModifiedFile>;
    maxImageSize: number;
    maxImagesAmount: number;
}) {
    const areImagesInvalid = imageFileBlobs.length > maxImagesAmount ||
        imageFileBlobs.reduce((invalidAcc, fileBlob) => {
            if (fileBlob === null) {
                return true;
            }

            const { size, type } = fileBlob;
            if (size > maxImageSize) {
                return true;
            }

            if (!type.length) {
                return true;
            }

            const extension = type.split("/")[1];
            if (!allowedFileExtensionsRegex.test(extension)) {
                return true;
            }

            return invalidAcc;
        }, false);

    return { areImagesInvalid };
}

function createImageInputForageKeys(storageKey: string) {
    return {
        fileNamesForageKey: `${storageKey}/fileNames`,
        modifiedFilesForageKey: `${storageKey}/modifiedFiles`,
        orientationsForageKey: `${storageKey}/orientations`,
        originalFilesForageKey: `${storageKey}/originalFiles`,
        qualitiesForageKey: `${storageKey}/qualities`,
    };
}

async function retrieveStoredImagesValues(
    {
        accessibleImageInputDispatch,
        isComponentMountedRef,
        maxImagesAmount,
        showBoundary,
        storageKey,
    }: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        isComponentMountedRef: React.RefObject<boolean>;
        maxImagesAmount: number;
        showBoundary: (error: Error) => void;
        storageKey: string;
    },
): Promise<SafeBoxResult> {
    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    if (!isComponentMounted) {
        return createSafeBoxResult({
            message: "Component is not mounted",
        });
    }

    const {
        modifiedFilesForageKey,
        fileNamesForageKey,
        qualitiesForageKey,
        orientationsForageKey,
    } = createImageInputForageKeys(storageKey);

    try {
        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setIsLoading,
            payload: true,
        });

        const modifiedFilesResult = await getForageItemSafe<
            Array<ModifiedFile>
        >(
            modifiedFilesForageKey,
        );
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

        const qualitiesResult = await getForageItemSafe<Array<number>>(
            qualitiesForageKey,
        );
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
        if (qualitiesResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }
        const qualities = qualitiesResult.safeUnwrap().data ?? Array.from(
            { length: maxImagesAmount },
            () => 10,
        );

        const orientationsResult = await getForageItemSafe<Array<number>>(
            orientationsForageKey,
        );
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component is not mounted",
            });
        }
        if (orientationsResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }
        const orientations = orientationsResult.safeUnwrap().data ?? Array.from(
            { length: maxImagesAmount },
            () => 1,
        );

        modifiedFiles?.forEach((modifiedFile: ModifiedFile, index) => {
            if (!modifiedFile) {
                return;
            }

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.setImageFileBlobs,
                payload: { fileBlob: modifiedFile, index },
            });

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.addFileName,
                payload: fileNames?.[index] ?? "Unknown file name",
            });

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.setQualities,
                payload: { index, value: qualities[index] },
            });

            accessibleImageInputDispatch({
                action: accessibleImageInputAction.setOrientations,
                payload: { index, value: orientations[index] },
            });
        });

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setIsLoading,
            payload: false,
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

async function modifyImage<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    {
        accessibleImageInputDispatch,
        currentImageIndex,
        fileNames,
        isComponentMountedRef,
        imageFileBlobs,
        invalidValueAction,
        maxImagesAmount,
        maxImageSize,
        orientations,
        parentDispatch,
        qualities,
        showBoundary,
        storageKey,
        validValueAction,
    }: {
        accessibleImageInputDispatch: React.Dispatch<
            AccessibleImageInputDispatch
        >;
        currentImageIndex: number;
        fileNames: string[];
        isComponentMountedRef: React.RefObject<boolean>;
        imageFileBlobs: Array<ModifiedFile>;
        invalidValueAction: InvalidValueAction;
        maxImagesAmount: number;
        maxImageSize: number;
        orientations: number[];
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
        storageKey: string;
        validValueAction: ValidValueAction;
    },
): Promise<SafeBoxResult> {
    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    if (!isComponentMounted) {
        return createSafeBoxResult({
            message: "Component is not mounted",
        });
    }

    const {
        modifiedFilesForageKey,
        originalFilesForageKey,
    } = createImageInputForageKeys(storageKey);

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

        const imageToModify = structuredClone(
            originalFiles[currentImageIndex],
        );
        if (!imageToModify) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }

        const quality = qualities[currentImageIndex] / 10;
        const orientation = orientations[currentImageIndex];
        const type = imageToModify?.type as EImageType;

        const modifyImageResult = await modifyImageSafe(imageToModify, {
            quality,
            orientation,
            type,
        });
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
            action: accessibleImageInputAction.setImageFileBlobs,
            payload: {
                fileBlob,
                index: currentImageIndex,
            },
        });

        const updatedModifiedFiles = originalFiles.map(
            (originalFile, index) => {
                if (index === currentImageIndex) {
                    return fileBlob;
                }
                return originalFile;
            },
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
            imageFileBlobs,
            maxImagesAmount,
            maxImageSize,
        });

        parentDispatch?.({
            action: invalidValueAction,
            payload: areImagesInvalid,
        });

        const formData = imageFileBlobs.reduce<FormData>(
            (formDataAcc, imageFileBlob, index) => {
                if (imageFileBlob) {
                    formDataAcc.append(
                        `${storageKey}-modifiedFiles`,
                        imageFileBlob,
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

export { modifyImage, retrieveStoredImagesValues, validateImages };
