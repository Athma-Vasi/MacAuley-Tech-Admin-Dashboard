import { SafeBoxResult } from "../../../types";
import { createSafeBoxResult, getForageItemSafe } from "../../../utils";
import { ModifiedFile } from "../AccessibleFileInput";
import { accessibleImageInputAction } from "./actions";
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
        modifiedFilesForageKey: `${storageKey}/modifiedFiles`,
        fileNamesForageKey: `${storageKey}/fileNames`,
        qualitiesForageKey: `${storageKey}/qualities`,
        orientationsForageKey: `${storageKey}/orientations`,
    };
}

async function retrieveStoredValues(
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
        if (modifiedFilesResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }
        const modifiedFiles = modifiedFilesResult.safeUnwrap().data ?? [];

        const fileNamesResult = await getForageItemSafe<Array<string>>(
            fileNamesForageKey,
        );
        if (fileNamesResult.err) {
            return createSafeBoxResult({
                kind: "notFound",
            });
        }
        const fileNames = fileNamesResult.safeUnwrap().data ?? [];

        const qualitiesResult = await getForageItemSafe<Array<number>>(
            qualitiesForageKey,
        );
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

export { retrieveStoredValues, validateImages };
