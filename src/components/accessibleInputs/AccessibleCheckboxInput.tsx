import {
  Checkbox,
  Container,
  type MantineSize,
  Stack,
  Text,
} from "@mantine/core";
import type { ChangeEvent, ReactNode, RefObject } from "react";

import { INPUT_MAX_WIDTH, INPUT_MIN_WIDTH } from "../../constants/data";
import { useGlobalState } from "../../hooks";
import type {
  CheckboxRadioSelectData,
  SetPageInErrorPayload,
} from "../../types";
import { splitCamelCase } from "../../utils";
import { createAccessibleCheckboxSelectionsTextElements } from "./utils";

type AccessibleCheckboxInputSingleAttributes<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  checked: boolean;
  deselectedDescription?: string;
  disabled?: boolean;
  invalidValueAction: InvalidValueAction;
  key?: string;
  label?: ReactNode;
  name: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  parentDispatch: React.Dispatch<
    | {
      action: ValidValueAction;
      payload: boolean;
    }
    | {
      action: InvalidValueAction;
      payload: SetPageInErrorPayload;
    }
  >;
  ref?: RefObject<HTMLInputElement> | null;
  required?: boolean;
  selectedDescription?: string;
  size?: MantineSize;
  /** stepper page location of input. default 0 */ page?: number;
  validValueAction: ValidValueAction;
  value: string;
};

type AccessibleCheckboxInputSingleProps<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  attributes: AccessibleCheckboxInputSingleAttributes<
    ValidValueAction,
    InvalidValueAction
  >;
  uniqueId?: string;
};

function AccessibleCheckboxInputSingle<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>({
  attributes,
  uniqueId,
}: AccessibleCheckboxInputSingleProps<ValidValueAction, InvalidValueAction>) {
  const {
    checked,
    deselectedDescription,
    disabled = false,
    invalidValueAction,
    onChange,
    name,
    parentDispatch,
    ref = null,
    required = false,
    selectedDescription,
    size = "sm",
    page = 0,
    validValueAction,
    value,
  } = attributes;

  const key = attributes.key ?? `${name} - key`;
  const label = (
    <Text color={disabled ? "gray" : void 0}>
      {attributes.label ?? splitCamelCase(name)}
    </Text>
  );

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { selectedTextElement, deselectedTextElement } =
    createAccessibleCheckboxSelectionsTextElements({
      checked,
      deselectedDescription,
      kind: "single",
      name,
      selectedDescription,
      themeObject,
      value,
    });

  return (
    <Container
      key={`container-${name}-${uniqueId}`}
      style={{
        minWidth: INPUT_MIN_WIDTH,
        maxWidth: INPUT_MAX_WIDTH,
      }}
      w="100%"
    >
      <Checkbox
        aria-describedby={checked
          // id of selectedTextElement
          ? `${name}-selected`
          // id of deselectedTextElement
          : `${name}-deselected`}
        aria-label={name}
        aria-required={required}
        checked={checked}
        description={checked ? selectedTextElement : deselectedTextElement}
        disabled={disabled}
        key={key}
        label={label}
        name={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          parentDispatch({
            action: validValueAction,
            payload: event.currentTarget.checked,
          });

          parentDispatch({
            action: invalidValueAction,
            payload: {
              page,
              kind: checked ? "add" : "delete",
            },
          });

          if (onChange) {
            onChange(event);
          }
        }}
        ref={ref}
        required={required}
        size={size}
        style={{ minWidth: INPUT_MIN_WIDTH, maxWidth: INPUT_MAX_WIDTH }}
        value={value}
      />
    </Container>
  );
}

type AccessibleCheckboxInputGroupAttributes<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = {
  /**
   * Set of values that should be disabled. Used by QueryBuilder component to disable values from projection exclusion if they have already been queued for inclusion (by Filter, Sort, or Search).
   */
  disabledValuesSet?: Set<string>;
  inputData: CheckboxRadioSelectData<Payload>;
  key?: string;
  label?: ReactNode;
  onChange?: (value: string[]) => void;
  parentDispatch: React.Dispatch<{
    action: ValidValueAction;
    payload: Payload[];
  }>;
  ref?: RefObject<HTMLInputElement> | null;
  required?: boolean;
  name: string;
  size?: MantineSize;
  validValueAction: ValidValueAction;
  value: string[];
  withAsterisk?: boolean;
};

type AccessibleCheckboxInputGroupProps<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = {
  attributes: AccessibleCheckboxInputGroupAttributes<ValidValueAction, Payload>;
  uniqueId?: string;
};

function AccessibleCheckboxInputGroup<
  ValidValueAction extends string = string,
  Payload extends string = string,
>(
  { attributes, uniqueId }: AccessibleCheckboxInputGroupProps<
    ValidValueAction,
    Payload
  >,
) {
  const {
    disabledValuesSet = new Set(),
    inputData,
    name,
    key = `${name} - key`,
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

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { selectedTextElement, deselectedTextElement } =
    createAccessibleCheckboxSelectionsTextElements({
      checked: value.length > 0,
      name,
      kind: "group",
      value,
      themeObject,
    });

  return (
    <Container
      key={`container-${name}-${uniqueId}`}
      style={{
        minWidth: INPUT_MIN_WIDTH,
        maxWidth: INPUT_MAX_WIDTH,
      }}
      w="100%"
    >
      <Checkbox.Group
        aria-describedby={value.length > 0
          // id of selectedTextElement
          ? `${name}-selected`
          // id of deselectedTextElement
          : `${name}-deselected`}
        aria-label={name}
        aria-required={required}
        description={value.length > 0
          ? selectedTextElement
          : deselectedTextElement}
        key={key}
        label={label}
        onChange={(value: Payload[]) => {
          parentDispatch({
            action: validValueAction,
            payload: value,
          });

          onChange?.(value);
        }}
        ref={ref}
        required={required}
        size={size}
        value={value}
        withAsterisk={withAsterisk}
      >
        <Stack>
          {inputData?.map(({ value, label }, idx) => (
            <Checkbox
              disabled={disabledValuesSet.has(value) ||
                disabledValuesSet.has(label)}
              key={`${value}-${idx.toString()}`}
              label={<Text>{label}</Text>}
              name={value}
              value={value}
            />
          ))}
        </Stack>
      </Checkbox.Group>
    </Container>
  );
}

export { AccessibleCheckboxInputGroup, AccessibleCheckboxInputSingle };

export type {
  AccessibleCheckboxInputGroupAttributes,
  AccessibleCheckboxInputSingleAttributes,
};
