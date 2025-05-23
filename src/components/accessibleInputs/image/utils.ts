import { Some } from "ts-results";
import { ResultSafeBox } from "../../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
} from "../../../utils";
import { ModifiedFile } from "../AccessibleFileInput";
import { ALLOWED_FILE_EXTENSIONS_REGEX } from "./constants";
import { SetFilesInErrorPayload } from "./types";

function validateImages({
    allowedFileExtensionsRegex,
    imageFileBlobs,
    maxImageSize,
}: {
    allowedFileExtensionsRegex: RegExp;
    imageFileBlobs: Array<ModifiedFile>;
    maxImageSize: number;
}) {
    const areImagesInvalid = imageFileBlobs.reduce<Array<boolean>>(
        (invalidAcc, fileBlob, idx) => {
            if (fileBlob === null) {
                invalidAcc[idx] = true;
                return invalidAcc;
            }

            const { size, type } = fileBlob;
            if (size > maxImageSize) {
                invalidAcc[idx] = true;
                return invalidAcc;
            }

            if (!type.length) {
                invalidAcc[idx] = true;
                return invalidAcc;
            }

            const extension = type.split("/")[1];
            if (!allowedFileExtensionsRegex.test(extension)) {
                invalidAcc[idx] = true;
                return invalidAcc;
            }

            return invalidAcc;
        },
        Array.from({ length: imageFileBlobs.length }, () => false),
    );

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
                payload: SetFilesInErrorPayload;
            }
        >;
        storageKey: string;
        validValueAction: ValidValueAction;
    },
): ResultSafeBox<string> {
    try {
        if (imageFileBlobs.length === 0) {
            return createSafeErrorResult(
                "No image files provided",
            );
        }

        const {
            modifiedFilesForageKey,
        } = createImageInputForageKeys(
            storageKey,
        );

        imageFileBlobs.forEach((imageFileBlob, idx) => {
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
                    payload: {
                        kind: isImageInvalid ? "isError" : "notError",
                        name: fileNames[idx],
                    },
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

        return createSafeSuccessResult(
            "Image files validated",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
        );
    }
}

export { checkImageFileBlobs, createImageInputForageKeys, validateImages };
