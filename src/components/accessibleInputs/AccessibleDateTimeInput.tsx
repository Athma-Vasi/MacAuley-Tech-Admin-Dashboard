import {
  Container,
  type MantineSize,
  Popover,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  type ChangeEvent,
  type Dispatch,
  type ReactNode,
  type RefObject,
  useEffect,
  useState,
} from "react";
import { TbCheck, TbX } from "react-icons/tb";

import { COLORS_SWATCHES } from "../../constants/data";
import { VALIDATION_FUNCTIONS_TABLE } from "../../constants/validations";
import { useGlobalState } from "../../hooks";
import type {
  SetPageInErrorPayload,
  StepperPage,
  ValidationFunctionsTable,
} from "../../types";
import { returnThemeColors, splitCamelCase } from "../../utils";
import type { SetFilterInputValuesDispatchData } from "../query/QueryFilter";
import {
  createAccessibleValueValidationTextElements,
  returnPartialValidations,
  returnValidationTexts,
} from "./utils";

type AccessibleDateTimeInputAttributes<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  ariaAutoComplete?: "both" | "list" | "none" | "inline";
  autoComplete?: "on" | "off";
  dateKind?: "date near future" | "date near past" | "full date";
  disabled?: boolean;
  icon?: ReactNode;
  initialInputValue?: string;
  inputKind: "date" | "time";
  invalidValueAction: InvalidValueAction;
  label?: ReactNode;
  max?: string;
  maxLength?: number;
  min?: string;
  minLength?: number;
  name: string;
  onBlur?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  /** stepper page location of input. default 0 = first page = step 0 */
  page?: number;
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
  placeholder?: string;
  setFilterInputValuesDispatchData?: SetFilterInputValuesDispatchData<
    ValidValueAction,
    InvalidValueAction
  >;
  ref?: RefObject<HTMLInputElement>;
  required?: boolean;
  size?: MantineSize;
  stepperPages: StepperPage[];
  validValueAction: ValidValueAction;
  validationFunctionsTable?: ValidationFunctionsTable;
  value: string;
  withAsterisk?: boolean;
};

type AccessibleDateTimeInputProps<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  attributes: AccessibleDateTimeInputAttributes<
    ValidValueAction,
    InvalidValueAction
  >;
};

function AccessibleDateTimeInput<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  { attributes }: AccessibleDateTimeInputProps<
    ValidValueAction,
    InvalidValueAction
  >,
) {
  const {
    ariaAutoComplete = "none",
    autoComplete = "off",
    dateKind = "full date",
    disabled = false,
    icon = null,
    initialInputValue = "",
    inputKind,
    invalidValueAction,
    max = new Date(2024, 11, 31).toISOString().split("T")[0], // 31.12.2024
    maxLength = inputKind === "date" ? 10 : 5,
    min = new Date().toISOString().split("T")[0], // current date
    minLength = inputKind === "date" ? 10 : 5,
    name,
    onBlur,
    onChange,
    onFocus,
    page = 0,
    parentDispatch,
    placeholder = "",
    setFilterInputValuesDispatchData,
    ref = null,
    required = false,
    size = "sm",
    stepperPages,
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

  const [valueBuffer, setValueBuffer] = useState(value);
  const [isPopoverOpened, { open: openPopover, close: closePopover }] =
    useDisclosure(false);

  // prevents stale values when inputs are dynamically created
  useEffect(() => {
    setValueBuffer(value);
  }, [value]);

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const {
    generalColors: { greenColorShade, redColorShade },
  } = returnThemeColors({ colorsSwatches: COLORS_SWATCHES, themeObject });

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
      : <TbX color={redColorShade} size={18} />);

  const validationTexts = returnValidationTexts({
    name,
    stepperPages,
    validationFunctionsTable,
    valueBuffer,
  });

  // console.group("AccessibleDateTimeInput");
  // console.log("name:", name);
  // console.log("valueBuffer:", valueBuffer);
  // console.log("partials:", partials);
  // console.log("stepperPages", stepperPages);
  // console.log("validationTexts:", validationTexts);
  // console.groupEnd();

  const { invalidValueTextElement } =
    createAccessibleValueValidationTextElements({
      isPopoverOpened,
      isValueBufferValid,
      name,
      themeObject,
      valueBuffer,
      validationTexts,
    });

  const ariaLabel = `Please enter ${name} in format "${
    inputKind === "date"
      ? "on Chromium browsers: date-date-month-month-year-year-year-year, or in other browsers year-year-year-year-month-month-date-date"
      : "hour-hour-minute-minute"
  } ${
    dateKind === "date near future"
      ? " from today to 2026"
      : dateKind === "date near past"
      ? " from 2020 to today"
      : " from 1900 to 2024"
  }`;

  const min_ = dateKind === "full date"
    ? new Date(1900, 0, 1).toISOString().split("T")[0]
    : dateKind === "date near past"
    ? new Date(2020, 0, 1).toISOString().split("T")[0]
    : dateKind === "date near future"
    ? new Date().toISOString().split("T")[0]
    : min;

  const max_ = dateKind === "full date"
    ? new Date(2024, 11, 31).toISOString().split("T")[0]
    : dateKind === "date near past"
    ? new Date().toISOString().split("T")[0]
    : dateKind === "date near future"
    ? new Date(2026, 11, 31).toISOString().split("T")[0]
    : max;

  return (
    <Container w={350}>
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
            aria-label={ariaLabel}
            aria-required={required}
            autoComplete={autoComplete}
            color="dark"
            error={!isValueBufferValid && valueBuffer !== initialInputValue}
            icon={leftIcon}
            label={label}
            max={max_}
            maxLength={inputKind === "date"
              ? 10
              : inputKind === "time"
              ? 5
              : maxLength}
            min={min_}
            minLength={inputKind === "date"
              ? 10
              : inputKind === "time"
              ? 5
              : minLength}
            name={name}
            onBlur={() => {
              parentDispatch?.({
                action: invalidValueAction,
                payload: {
                  kind: isValueBufferValid ? "delete" : "add",
                  page,
                },
              });

              parentDispatch?.({
                action: validValueAction,
                payload: valueBuffer,
              });

              if (setFilterInputValuesDispatchData) {
                const {
                  fieldNamesOperatorsTypesMap,
                  searchFieldSelectInputData,
                  selectInputsDataMap,
                  setFilterInputValuesDispatch,
                } = setFilterInputValuesDispatchData;

                setFilterInputValuesDispatch({
                  action: validValueAction,
                  payload: {
                    fieldNamesOperatorsTypesMap,
                    searchFieldSelectInputData,
                    selectInputsDataMap,
                    value: valueBuffer,
                  },
                });

                setFilterInputValuesDispatch({
                  action: invalidValueAction,
                  payload: {
                    kind: isValueBufferValid ? "delete" : "add",
                    page,
                  },
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
            placeholder={placeholder}
            ref={ref}
            required={required}
            size={size}
            type={inputKind}
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

export { AccessibleDateTimeInput };

export type { AccessibleDateTimeInputAttributes };
