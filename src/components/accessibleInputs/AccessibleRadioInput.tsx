import { Box, MantineSize, Radio, Text } from "@mantine/core";
import React, { ReactNode } from "react";

import { useGlobalState } from "../../hooks";
import { CheckboxRadioSelectData } from "../../types";
import { splitCamelCase } from "../../utils";
import { createAccessibleRadioScreenreaderTextElements } from "./utils";

type AccessibleRadioInputSingleAttributes<ValidValueAction extends string = string> = {
  checked: boolean;
  description: string;
  disabled?: boolean;
  dynamicIndexes?: number[];
  key?: string;
  label?: ReactNode;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  parentDispatch?: React.Dispatch<{
    action: ValidValueAction;
    payload: string;
  }>;
  parentDynamicDispatch?: React.Dispatch<{
    action: ValidValueAction;
    payload: { dynamicIndexes: number[]; value: string };
  }>;
  ref?: React.RefObject<HTMLInputElement> | null;
  required?: boolean;
  size?: MantineSize;
  validValueAction: ValidValueAction;
  value: string;
};
type AccessibleRadioInputSingleProps<ValidValueAction extends string = string> = {
  attributes: AccessibleRadioInputSingleAttributes<ValidValueAction>;
};

function AccessibleRadioInputSingle<ValidValueAction extends string = string>({
  attributes,
}: AccessibleRadioInputSingleProps<ValidValueAction>) {
  const {
    checked,
    description,
    disabled = false,
    dynamicIndexes,
    name,
    onChange,
    parentDispatch,
    parentDynamicDispatch,
    ref = null,
    required = false,
    size = "sm",
    validValueAction,
    value,
  } = attributes;

  const label = (
    <Text color={disabled ? "gray" : void 0}>
      {attributes.label ?? splitCamelCase(name)}
    </Text>
  );
  const key = attributes.key ?? name + " - radio";

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { screenreaderTextElement } = createAccessibleRadioScreenreaderTextElements({
    name,
    themeObject,
    value,
  });

  return (
    <Box>
      <Radio
        aria-describedby={`${name}-selected`}
        aria-label={name}
        aria-required={required}
        checked={checked}
        description={description}
        disabled={disabled}
        key={key}
        label={label}
        name={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const {
            currentTarget: { value },
          } = event;

          dynamicIndexes === undefined
            ? parentDispatch?.({
                action: validValueAction,
                payload: value,
              })
            : parentDynamicDispatch?.({
                action: validValueAction,
                payload: { dynamicIndexes, value },
              });

          onChange?.(event);
        }}
        ref={ref}
        required={required}
        size={size}
        value={value}
      />

      <Box style={{ display: "hidden" }}>{screenreaderTextElement}</Box>
    </Box>
  );
}

type AccessibleRadioInputGroupAttributes<
  ValidValueAction extends string = string,
  Payload extends string = string
> = {
  // checked: boolean;
  data: CheckboxRadioSelectData<Payload>;
  description?: ReactNode | string;
  dynamicIndexes?: number[];
  key?: string;
  label: ReactNode;
  name: string;
  onChange?: (value: string) => void;
  parentDispatch?: React.Dispatch<{
    action: ValidValueAction;
    payload: Payload;
  }>;
  parentDynamicDispatch?: React.Dispatch<{
    action: ValidValueAction;
    payload: { dynamicIndexes: number[]; value: Payload };
  }>;
  ref?: React.RefObject<HTMLInputElement> | null;
  required?: boolean;
  size?: MantineSize;
  value: Payload;
  validValueAction: ValidValueAction;
  withAsterisk?: boolean;
};

type AccessibleRadioInputGroupProps<
  ValidValueAction extends string = string,
  Payload extends string = string
> = {
  attributes: AccessibleRadioInputGroupAttributes<ValidValueAction, Payload>;
};

function AccessibleRadioInputGroup<
  ValidValueAction extends string = string,
  Payload extends string = string
>({ attributes }: AccessibleRadioInputGroupProps<ValidValueAction, Payload>) {
  const {
    data,
    description,
    dynamicIndexes,
    name,
    key = name + " - radio group",
    label,
    onChange,
    parentDispatch,
    parentDynamicDispatch,
    ref = null,
    required = false,
    size = "sm",
    validValueAction,
    value,
    withAsterisk = required,
  } = attributes;

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { screenreaderTextElement } = createAccessibleRadioScreenreaderTextElements({
    name,
    themeObject,
    value,
  });

  const createdRadioGroupInputs = (
    <Box>
      <Radio.Group
        aria-describedby={`${name}-selected`}
        aria-label={name}
        aria-required={required}
        description={description}
        id={name}
        key={key}
        label={label}
        name={name}
        onChange={(value: Payload) => {
          dynamicIndexes === undefined
            ? parentDispatch?.({
                action: validValueAction,
                payload: value,
              })
            : parentDynamicDispatch?.({
                action: validValueAction,
                payload: { dynamicIndexes, value },
              });

          onChange?.(value);
        }}
        ref={ref}
        required={required}
        size={size}
        value={value}
        withAsterisk={withAsterisk}
      >
        {data?.map(({ label, value }, idx) => {
          return <Radio value={value} label={label} key={`${label}-${idx}`} />;
        })}
      </Radio.Group>

      <Box
        style={
          // This is an invisible element that is used to provide screen reader users with additional information
          // @see https://webaim.org/techniques/css/invisiblecontent/
          {
            height: "1px",
            left: "-9999px",
            position: "absolute",
            top: "auto",
            width: "1px",
          }
        }
      >
        {screenreaderTextElement}
      </Box>
    </Box>
  );

  return createdRadioGroupInputs;
}

export { AccessibleRadioInputGroup, AccessibleRadioInputSingle };

export type { AccessibleRadioInputGroupAttributes, AccessibleRadioInputSingleAttributes };
