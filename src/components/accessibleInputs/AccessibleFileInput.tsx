import { Box, FileInput, FileInputProps, Text } from "@mantine/core";
import { Dispatch } from "react";

import { SafeResult } from "../../types";
import {
    catchHandlerErrorSafe,
    createSafeSuccessResult,
    getCachedItemAsyncSafe,
    setCachedItemAsyncSafe,
    splitCamelCase,
} from "../../utils";
import { createImageInputForageKeys } from "./image/utils";

type ModifiedFile = File | Blob | null;
type OriginalFile = File | null;
type FileInputParentDispatch<
    ValidValueAction extends string = string,
    AddFileNameAction extends string = string,
> = Dispatch<
    | { action: ValidValueAction; payload: OriginalFile }
    | {
        action: AddFileNameAction;
        payload: {
            index: number;
            value: string;
        };
    }
>;

type AccessibleFileInputAttributes<
    ValidValueAction extends string = string,
    AddFileNameAction extends string = string,
> = {
    addFileNameAction: AddFileNameAction;
    name: string;
    onChange?: (payload: OriginalFile) => void;
    parentDispatch: FileInputParentDispatch<
        ValidValueAction,
        AddFileNameAction
    >;
    storageKey: string;
    validValueAction: ValidValueAction;
} & FileInputProps;

type AccessibleFileInputProps<
    ValidValueAction extends string = string,
    AddFileNameAction extends string = string,
> = {
    attributes: AccessibleFileInputAttributes<
        ValidValueAction,
        AddFileNameAction
    >;
};

function AccessibleFileInput<
    ValidValueAction extends string = string,
    AddFileNameAction extends string = string,
>(
    { attributes }: AccessibleFileInputProps<
        ValidValueAction,
        AddFileNameAction
    >,
) {
    const {
        addFileNameAction,
        disabled,
        name,
        onChange,
        parentDispatch,
        storageKey,
        style = {},
        validValueAction,
        value,
        ...fileInputProps
    } = attributes;

    const label = (
        <Text color={disabled ? "gray" : void 0}>
            {attributes.label ?? splitCamelCase(name)}
        </Text>
    );

    const { screenreaderTextElement } =
        createAccessibleFileInputScreenreaderTextElements({
            name,
            file: value,
        });

    const fileInput = (
        <FileInput
            aria-describedby={`${name}-fileInput-selected`}
            data-testid={`${name}-fileInput`}
            disabled={disabled}
            label={label}
            name={name}
            onChange={async (payload: OriginalFile) => {
                await handleFileInputChange<
                    ValidValueAction,
                    AddFileNameAction
                >({
                    addFileNameAction,
                    onChange,
                    parentDispatch,
                    payload,
                    storageKey,
                    validValueAction,
                });
            }}
            style={{ ...style, cursor: disabled ? "not-allowed" : "auto" }}
            value={value}
            {...fileInputProps}
        />
    );

    return (
        <Box className="accessible-input">
            {screenreaderTextElement}
            {fileInput}
        </Box>
    );
}

function createAccessibleFileInputScreenreaderTextElements({
    name,
    file,
}: {
    name: string;
    file: OriginalFile | undefined;
}): {
    screenreaderTextElement: React.JSX.Element;
} {
    const screenreaderTextElement = (
        <Text
            aria-live="assertive"
            className="visually-hidden"
            data-testid={`${name}-fileInput-screenreader-text`}
            id={`${name}-fileInput-selected`}
            w="100%"
        >
            {`File ${file?.name ?? ""} is selected for ${
                splitCamelCase(name)
            } input.`}
        </Text>
    );

    return { screenreaderTextElement };
}

async function handleFileInputChange<
    ValidValueAction extends string = string,
    AddFileNameAction extends string = string,
>(
    {
        addFileNameAction,
        onChange,
        parentDispatch,
        payload,
        storageKey,
        validValueAction,
    }: {
        addFileNameAction: AddFileNameAction;
        onChange?: (payload: OriginalFile) => void;
        parentDispatch: FileInputParentDispatch<
            ValidValueAction,
            AddFileNameAction
        >;
        payload: OriginalFile;
        storageKey: string;
        validValueAction: ValidValueAction;
    },
): Promise<SafeResult<string>> {
    try {
        const {
            originalFilesForageKey,
            modifiedFilesForageKey,
            fileNamesForageKey,
        } = createImageInputForageKeys(storageKey);

        const originalFilesResult = await getCachedItemAsyncSafe<
            Array<OriginalFile>
        >(originalFilesForageKey);

        if (originalFilesResult.ok) {
            const originalFiles = originalFilesResult.val.none
                ? []
                : originalFilesResult.val.val;
            originalFiles.push(payload);

            await setCachedItemAsyncSafe(
                originalFilesForageKey,
                originalFiles,
            );
        }

        const modifiedFilesResult = await getCachedItemAsyncSafe<
            Array<ModifiedFile>
        >(modifiedFilesForageKey);

        if (modifiedFilesResult.ok) {
            const modifiedFiles = modifiedFilesResult.val.none
                ? []
                : modifiedFilesResult.val.val;
            modifiedFiles.push(payload);

            await setCachedItemAsyncSafe(
                modifiedFilesForageKey,
                modifiedFiles,
            );
        }
        const fileNamesResult = await getCachedItemAsyncSafe<
            Array<string>
        >(fileNamesForageKey);

        if (fileNamesResult.ok) {
            const fileNamesUnwrapped = fileNamesResult.val.none
                ? []
                : fileNamesResult.val.val;
            fileNamesUnwrapped.push(
                payload?.name ?? "Unknown file name",
            );

            await setCachedItemAsyncSafe(
                fileNamesForageKey,
                fileNamesUnwrapped,
            );
        }

        parentDispatch({
            action: validValueAction,
            payload,
        });
        parentDispatch({
            action: addFileNameAction,
            payload: {
                index: -1, // new file being pushed
                value: payload?.name ?? "Unknown file name",
            },
        });

        onChange?.(payload);

        return createSafeSuccessResult("File input changed successfully");
    } catch (error: unknown) {
        return catchHandlerErrorSafe(error);
    }
}

export { AccessibleFileInput };
export type {
    AccessibleFileInputAttributes,
    AccessibleFileInputProps,
    ModifiedFile,
    OriginalFile,
};
