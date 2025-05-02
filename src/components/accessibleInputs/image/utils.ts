import { SafeBoxResult } from "../../../types";
import { createSafeBoxResult, getForageItemSafe } from "../../../utils";
import { ModifiedFile } from "../AccessibleFileInput";
import { accessibleImageInputAction } from "./actions";
import { ALLOWED_FILE_EXTENSIONS_REGEX } from "./constants";
import { AccessibleImageInputDispatch } from "./types";

function validateImages({
    allowedFileExtensionsRegex,
    imageFileBlobs,
    maxImageSize,
    maxImagesAmount = 1,
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
    const isComponentMounted = isComponentMountedRef.current;
    if (!isComponentMounted) {
        return createSafeBoxResult({
            message: "Component is not mounted",
        });
    }

    const {
        fileNamesForageKey,
        modifiedFilesForageKey,
        orientationsForageKey,
        qualitiesForageKey,
    } = createImageInputForageKeys(
        storageKey,
    );

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

function checkImageFileBlobs<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    {
        fileNames,
        imageFileBlobs,
        invalidValueAction,
        maxImageSize,
        parentDispatch,
        storageKey,
        validValueAction,
    }: {
        fileNames: string[];
        imageFileBlobs: Array<ModifiedFile>;
        invalidValueAction: InvalidValueAction;
        maxImageSize: number;
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
        storageKey: string;
        validValueAction: ValidValueAction;
    },
): SafeBoxResult<boolean> {
    if (imageFileBlobs.length === 0) {
        return createSafeBoxResult({
            message: "No images to process",
        });
    }

    const {
        modifiedFilesForageKey,
    } = createImageInputForageKeys(
        storageKey,
    );

    imageFileBlobs.forEach((imageFileBlob) => {
        if (imageFileBlob !== null) {
            const { size, type } = imageFileBlob;

            const isImageSizeInvalid = size > maxImageSize;
            const isImageTypeInvalid = !ALLOWED_FILE_EXTENSIONS_REGEX
                .test(
                    type.split("/")[1],
                );
            const isImageInvalid = isImageSizeInvalid ||
                isImageTypeInvalid;

            parentDispatch?.({
                action: invalidValueAction,
                payload: isImageInvalid,
            });
        }
    });

    const value = imageFileBlobs.reduce<FormData>(
        (formDataAcc, imageFileBlob, index) => {
            if (imageFileBlob) {
                formDataAcc.append(
                    modifiedFilesForageKey,
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
        payload: value,
    });

    return createSafeBoxResult({
        kind: "success",
        data: true,
    });
}

export {
    checkImageFileBlobs,
    createImageInputForageKeys,
    retrieveStoredImagesValues,
    validateImages,
};
