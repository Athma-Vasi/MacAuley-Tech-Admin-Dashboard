import { FileInput, MantineNumberSize, MantineSize, Text } from "@mantine/core";
import localforage from "localforage";
import { Dispatch } from "react";

import { splitCamelCase } from "../../utils";

type ModifiedFile = File | Blob | null;
type OriginalFile = File | null;

type AccessibleFileInputAttributes<
  ValidValueAction extends string = string,
  AddFileNameAction extends string = string
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
  placeholder?: string;
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
  AddFileNameAction extends string = string
> = {
  attributes: AccessibleFileInputAttributes<ValidValueAction, AddFileNameAction>;
};

function AccessibleFileInput<
  ValidValueAction extends string = string,
  AddFileNameAction extends string = string
>({ attributes }: AccessibleFileInputProps<ValidValueAction, AddFileNameAction>) {
  const {
    addFileNameAction,
    disabled = false,
    name,
    onBlur,
    onChange,
    onFocus,
    parentDispatch,
    placeholder = "",
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

        const originalFiles =
          (await localforage.getItem<Array<OriginalFile>>(
            `${storageKey}-originalFiles`
          )) ?? [];
        originalFiles.push(payload);
        await localforage.setItem<Array<OriginalFile>>(
          `${storageKey}-originalFiles`,
          originalFiles
        );

        const modifiedFiles =
          (await localforage.getItem<Array<ModifiedFile>>(
            `${storageKey}-modifiedFiles`
          )) ?? [];
        modifiedFiles.push(payload);
        await localforage.setItem<Array<ModifiedFile>>(
          `${storageKey}-modifiedFiles`,
          modifiedFiles
        );

        const fileNames =
          (await localforage.getItem<Array<string>>(`${storageKey}-fileNames`)) ?? [];
        fileNames.push(payload?.name ?? "Unknown file name");
        await localforage.setItem<Array<string>>(`${storageKey}-fileNames`, fileNames);

        onChange?.(payload);
      }}
      onFocus={onFocus}
      placeholder={placeholder}
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
