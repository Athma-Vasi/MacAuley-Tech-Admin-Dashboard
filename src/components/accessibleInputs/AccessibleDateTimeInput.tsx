import {
    Box,
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

import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { ValidationFunctionsTable } from "../../types";
import { returnThemeColors, splitCamelCase } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";
import {
    createAccessibleValueValidationTextElements,
    returnValidationTexts,
} from "./utils";

type AccessibleDateTimeInputAttributes<
    ValidValueAction extends string = string,
> = {
    ariaAutoComplete?: "both" | "list" | "none" | "inline";
    autoComplete?: "on" | "off";
    disabled?: boolean;
    icon?: ReactNode;
    initialInputValue?: string;
    inputKind: "date" | "time";
    label?: ReactNode;
    max?: string;
    maxLength?: number;
    min?: string;
    minLength?: number;
    name: ValidationKey;
    onBlur?: () => void;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    parentDispatch?: Dispatch<
        {
            action: ValidValueAction;
            payload: string;
        }
    >;
    placeholder?: string;
    ref?: RefObject<HTMLInputElement>;
    required?: boolean;
    size?: MantineSize;
    style?: React.CSSProperties;
    validValueAction: ValidValueAction;
    validationFunctionsTable?: ValidationFunctionsTable;
    value: string;
    withAsterisk?: boolean;
};

type AccessibleDateTimeInputProps<
    ValidValueAction extends string = string,
> = {
    attributes: AccessibleDateTimeInputAttributes<
        ValidValueAction
    >;
};

function AccessibleDateTimeInput<
    ValidValueAction extends string = string,
>(
    { attributes }: AccessibleDateTimeInputProps<
        ValidValueAction
    >,
) {
    const {
        ariaAutoComplete = "none",
        autoComplete = "off",
        disabled = false,
        icon = null,
        initialInputValue = "",
        inputKind,
        max = new Date().toISOString().split("T")[0], // current date
        maxLength = inputKind === "date" ? 10 : 5,
        min = new Date(2013, 0, 1).toISOString().split("T")[0], // 2013-01-01 - date of founding
        minLength = inputKind === "date" ? 10 : 5,
        name,
        onBlur,
        onChange,
        onFocus,
        parentDispatch,
        placeholder = "",
        ref = null,
        required = false,
        size = "sm",
        style,
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
        greenColorShade,
        redColorShade,
    } = returnThemeColors({ colorsSwatches: COLORS_SWATCHES, themeObject });

    const regexesArray = validationFunctionsTable[name];
    const isValueBufferValid = valueBuffer.length > 0 && regexesArray.every(
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
            : <TbX color={redColorShade} size={18} />);

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
            valueBuffer,
            validationTexts,
        });

    const ariaLabel = `Please enter ${name} in format "${
        inputKind === "date"
            ? "on Chromium browsers: date-date-month-month-year-year-year-year, or in other browsers year-year-year-year-month-month-date-date"
            : "hour-hour-minute-minute"
    }`;

    return (
        <Box className="accessible-input">
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
                        error={!isValueBufferValid &&
                            valueBuffer !== initialInputValue}
                        icon={leftIcon}
                        label={label}
                        max={max}
                        maxLength={inputKind === "date"
                            ? 10
                            : inputKind === "time"
                            ? 5
                            : maxLength}
                        min={min}
                        minLength={inputKind === "date"
                            ? 10
                            : inputKind === "time"
                            ? 5
                            : minLength}
                        name={name}
                        onBlur={() => {
                            parentDispatch?.({
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
                        style={style}
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
        </Box>
    );
}

export { AccessibleDateTimeInput };

export type { AccessibleDateTimeInputAttributes };
