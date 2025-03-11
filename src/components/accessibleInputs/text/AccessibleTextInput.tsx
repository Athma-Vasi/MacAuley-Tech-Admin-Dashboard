import {
  Container,
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
  useEffect,
  useState,
} from "react";
import { TbCheck, TbRefresh, TbX } from "react-icons/tb";

import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import type {
  SetPageInErrorPayload,
  ValidationFunctionsTable,
} from "../../../types";
import { returnThemeColors, splitCamelCase } from "../../../utils";
import { createAccessibleValueValidationTextElements } from "../utils";

type AccessibleTextInputAttributes<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  ariaAutoComplete?: "both" | "list" | "none" | "inline";
  autoComplete?: "on" | "off";
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
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  parentDispatch?: Dispatch<
    | {
      action: ValidValueAction;
      payload: string;
    }
    | {
      action: InvalidValueAction;
      payload: SetPageInErrorPayload;
    }
  >;
  page?: number;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement> | null;
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
    disabled = false,
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
    page = 0,
    parentDispatch,
    placeholder = "",
    ref = null,
    required = false,
    rightSection = false,
    rightSectionIcon = null,
    rightSectionOnClick = () => {},
    size = "sm",
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

  // prevents stale value as input placeholder in dynamically created inputs
  useEffect(() => {
    setValueBuffer(value);
  }, [value]);

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const {
    generalColors: { greenColorShade, grayColorShade, redColorShade },
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

  function returnValidationTexts(
    valueBuffer: string,
  ) {
    const initialAcc = {
      isValids: [] as boolean[],
      validationTexts: {
        valueInvalidText: "",
        valueValidText: "",
      },
    };

    const validations: Array<[RegExp, string]> = [
      [
        /^(?=.*[A-Za-z0-9])/,
        "Must contain at least one alphanumeric character.",
      ],
      [
        /^[A-Za-z0-9\s.,#-]+$/,
        "Must contain only letters, numbers, spaces, and special characters: . , # -",
      ],
      [/^.{2,75}$/, "Must be between 2 and 75 characters length."],
    ];

    return valueBuffer.length > 0
      ? validations.reduce((acc, tuple) => {
        const [regex, text] = tuple;
        const { isValids, validationTexts } = acc;

        const isValid = regex.test(valueBuffer);
        const validationText = isValid ? "" : text;
        isValids.push(isValid);
        validationTexts.valueInvalidText += validationText;

        return acc;
      }, initialAcc)
      : initialAcc;
  }

  const { isValids, validationTexts } = returnValidationTexts(valueBuffer);
  const isValueBufferValid = isValids.every((isValid) => isValid);

  const leftIcon = icon ??
    (isValueBufferValid
      ? <TbCheck color={greenColorShade} size={18} />
      : valueBuffer.length === 0
      ? null
      : <TbX color={redColorShade} size={18} />);

  // const validationTexts = returnValidationTexts({
  //   name,
  //   stepperPages,
  //   validationFunctionsTable,
  //   valueBuffer,
  // });

  const { invalidValueTextElement } =
    createAccessibleValueValidationTextElements({
      isPopoverOpened,
      isValueBufferValid,
      name,
      themeObject,
      validationTexts,
      valueBuffer,
    });

  // console.group(`AccessibleTextInput: ${name}`);
  // console.log("name:", name);
  // console.log("stepperPages:", stepperPages);
  // console.log("validationFunctionsTable:", validationFunctionsTable);
  // console.log("partials:", partials);
  // console.log("valueBuffer:", valueBuffer);
  // console.log("isValueBufferValid:", isValueBufferValid);
  // console.log("validationTexts:", validationTexts);
  // console.groupEnd();

  return (
    <Container
      key={`${name}-${value}-${uniqueId ?? ""}`}
      w="100%"
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
            disabled={disabled}
            error={!isValueBufferValid && valueBuffer !== initialInputValue}
            icon={leftIcon}
            label={label}
            maxLength={maxLength}
            minLength={minLength}
            name={name}
            onBlur={() => {
              // standard dispatch
              if (parentDispatch) {
                parentDispatch({
                  action: invalidValueAction,
                  payload: {
                    kind: isValueBufferValid ? "delete" : "add",
                    page,
                  },
                });

                parentDispatch({
                  action: validValueAction,
                  payload: valueBuffer,
                });
              }

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
            width={300}
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

export { AccessibleTextInput };

export type { AccessibleTextInputAttributes };
