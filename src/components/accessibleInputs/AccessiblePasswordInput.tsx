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

import {
  COLORS_SWATCHES,
  INPUT_MAX_WIDTH,
  INPUT_MIN_WIDTH,
} from "../../constants/data";
import { VALIDATION_FUNCTIONS_TABLE } from "../../constants/validations";
import { useGlobalState } from "../../hooks";
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
  InvalidValueAction extends string = string,
> = {
  disabled?: boolean;
  icon?: ReactNode;
  initialInputValue?: string;
  invalidValueAction: InvalidValueAction;
  label?: ReactNode;
  maxLength?: number;
  minLength?: number;
  name: string;
  onBlur?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  /** stepper page location of input. default 0 = first page = step 0 */
  page?: number;
  parentDispatch: Dispatch<
    | {
      action: ValidValueAction;
      payload: string;
    }
    | {
      action: InvalidValueAction;
      payload: SetPageInErrorPayload;
    }
  >;
  passwordValue?: string;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement>;
  required?: boolean;
  size?: MantineSize;
  stepperPages: StepperPage[];
  validationFunctionsTable?: ValidationFunctionsTable;
  validValueAction: ValidValueAction;
  value: string;
  withAsterisk?: boolean;
};

type AccessiblePasswordInputProps<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  attributes: AccessiblePasswordInputAttributes<
    ValidValueAction,
    InvalidValueAction
  >;
};

function AccessiblePasswordInput<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
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
    page = 0,
    parentDispatch,
    passwordValue,
    placeholder,
    ref = null,
    required = false,
    size = "sm",
    stepperPages,
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
    generalColors: { greenColorShade, redColorShade },
  } = returnThemeColors({ themeObject, colorsSwatches: COLORS_SWATCHES });

  const { partials } = returnPartialValidations({
    name,
    stepperPages,
    validationFunctionsTable,
  });

  const isValueBufferValid = partials.every(([regexOrFunc, _validationText]) =>
    typeof regexOrFunc === "function"
      ? regexOrFunc(valueBuffer)
      : regexOrFunc.test(valueBuffer)
  );

  const leftIcon = icon ??
    (isValueBufferValid
      ? <TbCheck color={greenColorShade} size={18} />
      : valueBuffer.length === 0
      ? null
      : <TbExclamationCircle color={redColorShade} size={18} />);

  const validationTexts = returnValidationTexts({
    name,
    stepperPages,
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
    <Container style={{ minWidth: INPUT_MIN_WIDTH, maxWidth: INPUT_MAX_WIDTH }}>
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
              const kind = passwordValue
                ? passwordValue === valueBuffer || !isValueBufferValid
                  ? "add"
                  : "delete"
                : isValueBufferValid
                ? "delete"
                : "add";

              console.log("kind", kind);

              parentDispatch({
                action: invalidValueAction,
                payload: { kind, page },
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
