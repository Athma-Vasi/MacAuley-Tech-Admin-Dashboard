import { FileInput, MantineNumberSize, MantineSize, Text } from "@mantine/core";
import { Dispatch } from "react";

import {
    getCachedItemAsyncSafe,
    setCachedItemAsyncSafe,
    splitCamelCase,
} from "../../utils";
import { createImageInputForageKeys } from "./image/utils";

type ModifiedFile = File | Blob | null;
type OriginalFile = File | null;

type AccessibleFileInputAttributes<
    ValidValueAction extends string = string,
    AddFileNameAction extends string = string,
> = {
    addFileNameAction: AddFileNameAction;
    disabled?: boolean;
    label?: string;
    name: string;
    onBlur?: () => void;
    onChange?: (payload: OriginalFile) => void;
    onFocus?: () => void;
    parentDispatch: Dispatch<
        | { action: ValidValueAction; payload: OriginalFile }
        | {
            action: AddFileNameAction;
            payload: {
                index: number;
                value: string;
            };
        }
    >;
    radius?: MantineNumberSize;
    required?: boolean;
    size?: MantineSize;
    storageKey: string;
    style?: React.CSSProperties;
    value?: OriginalFile;
    validValueAction: ValidValueAction;
    variant?: "default" | "filled" | "unstyled";
};

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
        disabled = false,
        name,
        onBlur,
        onChange,
        onFocus,
        parentDispatch,
        radius,
        required = false,
        size = "sm",
        storageKey,
        style,
        validValueAction,
        value = null,
        variant = "default",
    } = attributes;

    const label = (
        <Text color={disabled ? "gray" : void 0}>
            {attributes.label ?? splitCamelCase(name)}
        </Text>
    );

    const {
        originalFilesForageKey,
        modifiedFilesForageKey,
        fileNamesForageKey,
    } = createImageInputForageKeys(storageKey);

    return (
        <FileInput
            aria-disabled={disabled}
            aria-label={splitCamelCase(name)}
            aria-required={required}
            data-testid={`${name}-fileInput`}
            disabled={disabled}
            label={label}
            name={name}
            onBlur={onBlur}
            onChange={async (payload: OriginalFile) => {
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
            }}
            onFocus={onFocus}
            radius={radius}
            required={required}
            size={size}
            style={{ ...style, cursor: disabled ? "not-allowed" : "auto" }}
            value={value}
            variant={variant}
            withAsterisk={required}
        />
    );
}

export { AccessibleFileInput };
export type {
    AccessibleFileInputAttributes,
    AccessibleFileInputProps,
    ModifiedFile,
    OriginalFile,
};
