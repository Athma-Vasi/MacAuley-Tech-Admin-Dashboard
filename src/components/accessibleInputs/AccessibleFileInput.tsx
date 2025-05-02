import { FileInput, MantineNumberSize, MantineSize, Text } from "@mantine/core";
import { Dispatch } from "react";

import {
    getForageItemSafe,
    setForageItemSafe,
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
            payload: string;
        }
    >;
    radius?: MantineNumberSize;
    required?: boolean;
    size?: MantineSize;
    storageKey: string;
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
            disabled={disabled}
            label={label}
            name={name}
            onBlur={onBlur}
            onChange={async (payload: OriginalFile) => {
                parentDispatch({
                    action: validValueAction,
                    payload,
                });

                parentDispatch({
                    action: addFileNameAction,
                    payload: payload?.name ?? "Unknown file name",
                });

                const originalFilesResult = await getForageItemSafe<
                    Array<OriginalFile>
                >(
                    originalFilesForageKey,
                );
                if (originalFilesResult.ok) {
                    const originalFiles =
                        originalFilesResult.safeUnwrap().data ?? [];
                    originalFiles.push(payload);

                    await setForageItemSafe(
                        originalFilesForageKey,
                        originalFiles,
                    );
                }

                const modifiedFilesResult = await getForageItemSafe<
                    Array<ModifiedFile>
                >(
                    modifiedFilesForageKey,
                );
                if (modifiedFilesResult.ok) {
                    const modifiedFiles =
                        modifiedFilesResult.safeUnwrap().data ?? [];
                    modifiedFiles.push(payload);

                    await setForageItemSafe(
                        modifiedFilesForageKey,
                        modifiedFiles,
                    );
                }
                const fileNamesResult = await getForageItemSafe<
                    Array<string>
                >(
                    fileNamesForageKey,
                );
                if (fileNamesResult.ok) {
                    const fileNamesUnwrapped =
                        fileNamesResult.safeUnwrap().data ?? [];
                    fileNamesUnwrapped.push(
                        payload?.name ?? "Unknown file name",
                    );

                    await setForageItemSafe(
                        fileNamesForageKey,
                        fileNamesUnwrapped,
                    );
                }

                onChange?.(payload);
            }}
            onFocus={onFocus}
            radius={radius}
            required={required}
            size={size}
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
