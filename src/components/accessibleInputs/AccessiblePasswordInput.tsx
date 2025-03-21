import {
  Container,
  type MantineSize,
  PasswordInput,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  type ChangeEvent,
  type Dispatch,
  type ReactNode,
  type RefObject,
  useState,
} from "react";
import { TbCheck, TbExclamationCircle } from "react-icons/tb";

import { COLORS_SWATCHES } from "../../constants";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";
import { useGlobalState } from "../../hooks/useGlobalState";
import type {
  SetPageInErrorPayload,
  StepperPage,
  ValidationFunctionsTable,
} from "../../types";
import { returnThemeColors, splitCamelCase } from "../../utils";
import {
  createAccessibleValueValidationTextElements,
  returnPartialValidations,
  returnValidationTexts,
} from "./utils";

type AccessiblePasswordInputAttributes<
  ValidValueAction extends string = string,
  InvalidValueAction extends boolean = boolean,
> = {
  disabled?: boolean;
  icon?: ReactNode;
  initialInputValue?: string;
  invalidValueAction: InvalidValueAction;
  label?: ReactNode;
  maxLength?: number;
  minLength?: number;
  name: ValidationKey;
  onBlur?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
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
  passwordValue?: string;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement>;
  required?: boolean;
  size?: MantineSize;
  validationFunctionsTable?: ValidationFunctionsTable;
  validValueAction: ValidValueAction;
  value: string;
  withAsterisk?: boolean;
};

type AccessiblePasswordInputProps<
  ValidValueAction extends string = string,
  InvalidValueAction extends boolean = boolean,
> = {
  attributes: AccessiblePasswordInputAttributes<
    ValidValueAction,
    InvalidValueAction
  >;
};

function AccessiblePasswordInput<
  ValidValueAction extends string = string,
  InvalidValueAction extends boolean = boolean,
>(
  { attributes }: AccessiblePasswordInputProps<
    ValidValueAction,
    InvalidValueAction
  >,
) {
  const {
    disabled = false,
    icon = null,
    initialInputValue = "",
    invalidValueAction,
    maxLength = 32,
    minLength = 8,
    name,
    onBlur,
    onChange,
    onFocus,
    parentDispatch,
    passwordValue,
    placeholder,
    ref = null,
    required = false,
    size = "sm",
    validationFunctionsTable = VALIDATION_FUNCTIONS_TABLE,
    validValueAction,
    value,
    withAsterisk = false,
  } = attributes;

  const label = (
    <Text color={disabled ? "gray" : void 0}>
      {attributes.label ?? splitCamelCase(name)}
    </Text>
  );

  const [valueBuffer, setValueBuffer] = useState(value);
  const [isPopoverOpened, { open: openPopover, close: closePopover }] =
    useDisclosure(false);

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const {
    greenColorShade,
    redColorShade,
  } = returnThemeColors({ themeObject, colorsSwatches: COLORS_SWATCHES });

  const regexesArray = validationFunctionsTable[name];
  const isValueBufferValid = regexesArray.every(
    ([regexOrFunc, _validationText]: [any, any]) =>
      typeof regexOrFunc === "function"
        ? regexOrFunc(valueBuffer)
        : regexOrFunc.test(valueBuffer),
  );

  const leftIcon = icon ??
    (isValueBufferValid
      ? <TbCheck color={greenColorShade} size={18} />
      : valueBuffer.length === 0
      ? null
      : <TbExclamationCircle color={redColorShade} size={18} />);

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
    <Container>
      <Popover
        opened={isPopoverOpened}
        position="bottom"
        shadow="md"
        transitionProps={{ transition: "pop" }}
        width="target"
        withArrow
      >
        <Popover.Target>
          <PasswordInput
            aria-describedby={isValueBufferValid
              // id of validValueTextElement
              ? `${name}-valid`
              // id of invalidValueTextElement
              : `${name}-invalid`}
            aria-invalid={!isValueBufferValid}
            aria-label={name}
            aria-required={required}
            error={!isValueBufferValid && value !== initialInputValue}
            icon={leftIcon}
            label={label}
            maxLength={maxLength}
            minLength={minLength}
            name={name}
            onBlur={() => {
              // const kind = passwordValue
              //   ? passwordValue === valueBuffer || !isValueBufferValid
              //     ? "add"
              //     : "delete"
              //   : isValueBufferValid
              //   ? "delete"
              //   : "add";

              // console.log("kind", kind);

              parentDispatch({
                action: invalidValueAction,
                payload: isValueBufferValid,
              });

              parentDispatch({
                action: validValueAction,
                payload: valueBuffer,
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
            placeholder={placeholder}
            ref={ref}
            required={required}
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
    </Container>
  );
}

export { AccessiblePasswordInput };

export type { AccessiblePasswordInputAttributes };
