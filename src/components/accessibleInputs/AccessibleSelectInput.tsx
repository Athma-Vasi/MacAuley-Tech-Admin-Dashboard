import {
  Box,
  MantineColor,
  type MantineSize,
  NativeSelect,
} from "@mantine/core";

import { useGlobalState } from "../../hooks/useGlobalState";
import type { CheckboxRadioSelectData } from "../../types";
import { splitCamelCase } from "../../utils";

type AccessibleSelectInputAttributes<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = {
  color?: MantineColor;
  data: CheckboxRadioSelectData<Payload>;
  describedBy?: string;
  description?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  label?: React.ReactNode;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  /** default generic dispatch */
  parentDispatch?: React.Dispatch<{
    action: ValidValueAction;
    payload: Payload;
  }>;
  ref?: React.RefObject<HTMLSelectElement>;
  required?: boolean;
  size?: MantineSize;
  validValueAction: ValidValueAction;
  value: string;
  withAsterisk?: boolean;
};

type AccessibleSelectInputProps<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = {
  attributes: AccessibleSelectInputAttributes<ValidValueAction, Payload>;
  uniqueId?: string;
};

function AccessibleSelectInput<
  ValidValueAction extends string = string,
  Payload extends string = string,
>(
  { attributes, uniqueId }: AccessibleSelectInputProps<
    ValidValueAction,
    Payload
  >,
) {
  const { globalState: { themeObject: { primaryColor } } } = useGlobalState();

  const {
    color = primaryColor,
    data,
    describedBy = "",
    description,
    disabled = false,
    hideLabel = false,
    name,
    onChange,
    parentDispatch,
    ref = null,
    required = false,
    size = "sm",
    validValueAction,
    value,
    withAsterisk = required,
  } = attributes;

  const label = attributes.label ?? splitCamelCase(name);

  return (
    <Box
      key={`container-${name}-${uniqueId}`}
      className="accessible-input"
    >
      <NativeSelect
        aria-describedby={describedBy}
        aria-label={`${description}. Currently selected ${value}`}
        aria-required={required}
        color={color}
        data={data}
        disabled={disabled}
        label={hideLabel ? null : label}
        name={name}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          parentDispatch?.({
            action: validValueAction,
            payload: event.currentTarget.value as Payload,
          });

          onChange?.(event);
        }}
        ref={ref}
        required={required}
        size={size}
        value={value}
        withAsterisk={withAsterisk}
        w="100%"
      />
    </Box>
  );
}

export { AccessibleSelectInput };

export type { AccessibleSelectInputAttributes };
