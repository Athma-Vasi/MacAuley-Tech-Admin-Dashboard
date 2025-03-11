import {
  Container,
  type MantineSize,
  Popover,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type React from "react";
import {
  type ChangeEvent,
  type Dispatch,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { TbCheck, TbRefresh, TbX } from "react-icons/tb";

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
import type { ProductCategory } from "../dashboard/types";
import type {
  AdditionalFieldsOperation,
  AdditionalFieldsPayload,
} from "../product/dispatch";
import {
  createAccessibleValueValidationTextElements,
  returnPartialValidations,
  returnValidationTexts,
} from "./utils";

type AccessibleTextAreaInputAttributes<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  ariaAutoComplete?: "both" | "list" | "none" | "inline";
  autoComplete?: "on" | "off";
  disabled?: boolean;
  /** [pageIndex, pagePositionIndex, ...] */
  dynamicIndexes?: number[];
  icon?: ReactNode;
  initialInputValue?: string;
  invalidValueAction: InvalidValueAction;
  label?: ReactNode;
  maxLength?: number;
  maxRows?: number;
  minLength?: number;
  minRows?: number;
  name: string;
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
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
  /** default for inputs created by user */
  parentDynamicDispatch?: Dispatch<
    | {
      action: ValidValueAction;
      payload: {
        dynamicIndexes: number[];
        value: string;
      };
    }
    | {
      action: InvalidValueAction;
      payload: SetPageInErrorPayload;
    }
  >;
  /** for product */
  productDispatchInfo?: {
    kind: "fieldName" | "fieldValue";
    operation: AdditionalFieldsOperation;
    productCategory: ProductCategory;
    productDispatch: Dispatch<
      | {
        action: ValidValueAction;
        payload: AdditionalFieldsPayload;
      }
      | {
        action: InvalidValueAction;
        payload: SetPageInErrorPayload;
      }
    >;
  };
  placeholder?: string;
  ref?: React.RefObject<HTMLTextAreaElement> | null;
  required?: boolean;
  rightSection?: boolean;
  rightSectionIcon?: ReactNode;
  rightSectionOnClick?: () => void;
  size?: MantineSize;
  stepperPages: StepperPage[];
  validationFunctionsTable?: ValidationFunctionsTable;
  validValueAction: ValidValueAction;
  value: string;
  withAsterisk?: boolean;
};

type AccessibleTextAreaInputProps<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  attributes: AccessibleTextAreaInputAttributes<
    ValidValueAction,
    InvalidValueAction
  >;
  uniqueId?: string;
};

function AccessibleTextAreaInput<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  { attributes, uniqueId }: AccessibleTextAreaInputProps<
    ValidValueAction,
    InvalidValueAction
  >,
) {
  const {
    ariaAutoComplete = "none",
    autoComplete = "off",
    disabled = false,
    dynamicIndexes,
    icon = null,
    initialInputValue = "",
    invalidValueAction,
    maxLength = 2000,
    maxRows = 7,
    minLength = 2,
    minRows = 3,
    name,
    onBlur,
    onChange,
    onFocus,
    onKeyDown,
    page = 0,
    parentDispatch,
    parentDynamicDispatch,
    placeholder = "",
    productDispatchInfo,
    ref = null,
    required = false,
    rightSection = false,
    rightSectionIcon = null,
    rightSectionOnClick = () => {},
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
      rightSectionIcon ? rightSectionIcon : (
        <TbRefresh
          aria-label={`Reset ${name} value to ${initialInputValue}`}
          color={grayColorShade}
          size={18}
          onClick={rightSectionOnClick}
        />
      )
    )
    : null;

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

  // console.group(`AccessibleTextAreaInput: ${name}`);
  // console.log("name:", name);
  // console.log("stepperPages:", stepperPages);
  // console.log("validationFunctionsTable:", validationFunctionsTable);
  // console.log("partials:", partials);
  // console.log("valueBuffer:", valueBuffer);
  // console.log("isValueBufferValid:", isValueBufferValid);
  // console.log("validationTexts:", validationTexts);
  // console.groupEnd();

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
    <Container
      key={`${name}-${uniqueId ?? ""}`}
      style={{ minWidth: INPUT_MIN_WIDTH, maxWidth: INPUT_MAX_WIDTH }}
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
          <Textarea
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
            color={grayColorShade}
            disabled={disabled}
            error={!isValueBufferValid && value !== initialInputValue}
            icon={leftIcon}
            label={label}
            maxLength={maxLength}
            maxRows={maxRows}
            minLength={minLength}
            minRows={minRows}
            name={name}
            onBlur={(event: FocusEvent<HTMLTextAreaElement>) => {
              // regular inputs
              if (parentDispatch) {
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
              }

              // dynamic inputs
              if (parentDynamicDispatch) {
                if (!dynamicIndexes?.length) {
                  return;
                }

                parentDynamicDispatch?.({
                  action: invalidValueAction,
                  payload: {
                    kind: isValueBufferValid ? "delete" : "add",
                    page,
                  },
                });

                parentDynamicDispatch?.({
                  action: validValueAction,
                  payload: { dynamicIndexes, value: valueBuffer },
                });
              }

              // product dynamic inputs
              if (productDispatchInfo) {
                const { kind, operation, productCategory, productDispatch } =
                  productDispatchInfo;

                productDispatch?.({
                  action: invalidValueAction,
                  payload: {
                    kind: isValueBufferValid ? "delete" : "add",
                    page,
                  },
                });

                productDispatch?.({
                  action: validValueAction,
                  payload: {
                    dynamicIndexes: dynamicIndexes ?? [],
                    kind,
                    operation,
                    productCategory,
                    value: valueBuffer,
                  },
                });
              }

              onBlur?.(event);
              closePopover();
            }}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setValueBuffer(event.currentTarget.value);
              onChange?.(event);
            }}
            onFocus={(event: FocusEvent<HTMLTextAreaElement>) => {
              openPopover();
              onFocus?.(event);
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
    </Container>
  );
}

export { AccessibleTextAreaInput };

export type { AccessibleTextAreaInputAttributes };
