import {
  Box,
  Group,
  type MantineSize,
  Popover,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  type ChangeEvent,
  type Dispatch,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useState,
} from "react";
import { TbCheck, TbRefresh, TbX } from "react-icons/tb";

import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import type { ValidationFunctionsTable } from "../../types";
import { returnThemeColors, splitCamelCase } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";
import {
  createAccessibleValueValidationTextElements,
  returnValidationTexts,
} from "./utils";

type AccessibleTextInputAttributes<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  ariaAutoComplete?: "both" | "list" | "none" | "inline";
  autoComplete?: "on" | "off";
  dataTestId?: string;
  disabled?: boolean;
  // if different from parentDispatch which sets value
  errorDispatch?: Dispatch<{
    action: InvalidValueAction;
    payload: boolean;
  }>;
  hideLabel?: boolean;
  icon?: ReactNode;
  initialInputValue?: string;
  invalidValueAction: InvalidValueAction;
  label?: ReactNode;
  maxLength?: number;
  minLength?: number;
  // must correspond to name in validationFunctionsTable
  name: ValidationKey;
  onBlur?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  parentDispatch: Dispatch<
    | {
      action: ValidValueAction;
      payload: string;
    }
    | {
      action: InvalidValueAction;
      payload: boolean;
    }
  >;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement | null> | null;
  required?: boolean;
  rightSection?: boolean;
  rightSectionIcon?: ReactNode;
  rightSectionOnClick?: () => void;
  size?: MantineSize;
  validationFunctionsTable?: ValidationFunctionsTable;
  validValueAction: ValidValueAction;
  value: string;
  withAsterisk?: boolean;
};

type AccessibleTextInputProps<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  attributes: AccessibleTextInputAttributes<
    ValidValueAction,
    InvalidValueAction
  >;
  uniqueId?: string;
};

function AccessibleTextInput<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  { attributes, uniqueId }: AccessibleTextInputProps<
    ValidValueAction,
    InvalidValueAction
  >,
) {
  const {
    ariaAutoComplete = "none",
    autoComplete = "off",
    dataTestId = `${attributes.name}-textInput`,
    disabled = false,
    errorDispatch,
    hideLabel = false,
    icon = null,
    initialInputValue = "",
    invalidValueAction,
    maxLength = 75,
    minLength = 2,
    name,
    onBlur,
    onChange,
    onFocus,
    onKeyDown,
    parentDispatch,
    placeholder = "",
    ref = null,
    required = false,
    rightSection = false,
    rightSectionIcon = null,
    rightSectionOnClick = () => {},
    size = "sm",
    validationFunctionsTable = VALIDATION_FUNCTIONS_TABLE,
    validValueAction,
    value,
    withAsterisk = required,
  } = attributes;

  const label = (
    <Text color={disabled ? "gray" : void 0}>
      {attributes.label ?? splitCamelCase(name)}
    </Text>
  );

  const [valueBuffer, setValueBuffer] = useState<string>(value);
  const [isPopoverOpened, { open: openPopover, close: closePopover }] =
    useDisclosure(false);

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const {
    greenColorShade,
    grayColorShade,
    redColorShade,
  } = returnThemeColors({ themeObject, colorsSwatches: COLORS_SWATCHES });

  const rightIcon = rightSection
    ? (
      rightSectionIcon
        ? rightSectionIcon
        : (
          <Tooltip label={`Reset ${name} to ${initialInputValue}`}>
            <Group style={{ cursor: "pointer" }}>
              <TbRefresh
                aria-label={`Reset ${name} value to ${initialInputValue}`}
                color={grayColorShade}
                size={18}
                onClick={rightSectionOnClick}
              />
            </Group>
          </Tooltip>
        )
    )
    : null;

  const regexesArray = validationFunctionsTable[name];
  const isValueBufferValid = valueBuffer.length === 0 || regexesArray.every(
    ([regexOrFunc, _validationText]: [any, any]) =>
      typeof regexOrFunc === "function"
        ? regexOrFunc(valueBuffer)
        : regexOrFunc.test(valueBuffer),
  );

  const leftIcon = icon ??
    (isValueBufferValid && valueBuffer.length > 0
      ? (
        <TbCheck
          aria-label={`Valid ${name} input`}
          color={greenColorShade}
          data-testid={`${name}-input-valid-icon`}
          size={18}
        />
      )
      : valueBuffer.length === 0
      ? null
      : (
        <TbX
          aria-hidden={true}
          color={redColorShade}
          data-testid={`${name}-input-invalid-icon`}
          size={18}
        />
      ));

  const validationTexts = returnValidationTexts({
    name,
    validationFunctionsTable,
    valueBuffer,
  });

  const { invalidValueTextElement } =
    createAccessibleValueValidationTextElements({
      isPopoverOpened,
      isValueBufferValid,
      name,
      themeObject,
      validationTexts,
      valueBuffer,
    });

  return (
    <Box
      key={`${name}-${value}-${uniqueId ?? ""}`}
      className="accessible-input"
    >
      <Popover
        opened={isPopoverOpened}
        position="bottom"
        shadow="md"
        transitionProps={{ transition: "pop" }}
        width="target"
        withArrow
      >
        <Popover.Target>
          <TextInput
            aria-autocomplete={ariaAutoComplete}
            aria-describedby={isValueBufferValid
              // id of validValueTextElement
              ? `${name}-valid`
              // id of invalidValueTextElement
              : `${name}-invalid`}
            aria-invalid={!isValueBufferValid}
            aria-label={name}
            aria-required={required}
            autoComplete={autoComplete}
            // color={grayColorShade}
            data-testid={dataTestId}
            disabled={disabled}
            error={!isValueBufferValid && valueBuffer !== initialInputValue}
            icon={leftIcon}
            label={hideLabel ? null : label}
            maxLength={maxLength}
            minLength={minLength}
            name={name}
            onBlur={() => {
              parentDispatch({
                action: invalidValueAction,
                payload: !isValueBufferValid,
              });

              parentDispatch({
                action: validValueAction,
                payload: valueBuffer,
              });

              errorDispatch?.({
                action: invalidValueAction,
                payload: !isValueBufferValid,
              });

              onBlur?.();
              closePopover();
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setValueBuffer(event.currentTarget.value);

              onChange?.(event);
            }}
            onFocus={() => {
              openPopover();
              onFocus?.();
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            ref={ref}
            required={required}
            rightSection={rightIcon}
            size={size}
            value={valueBuffer}
            withAsterisk={withAsterisk}
          />
        </Popover.Target>

        {isPopoverOpened && valueBuffer.length && !isValueBufferValid
          ? (
            <Popover.Dropdown>
              <Stack>
                {invalidValueTextElement}
              </Stack>
            </Popover.Dropdown>
          )
          : null}
      </Popover>
    </Box>
  );
}

export { AccessibleTextInput };

export type { AccessibleTextInputAttributes };
