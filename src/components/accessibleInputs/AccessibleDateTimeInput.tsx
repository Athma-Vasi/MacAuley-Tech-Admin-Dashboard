import { Box, Text, TextInput, TextInputProps } from "@mantine/core";
import React from "react";
import { TbCheck, TbX } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks";
import { formatDate, returnThemeColors, splitCamelCase } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";
import { returnValidationTexts } from "./utils";

type AccessibleDateTimeInputAttributes<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
> = TextInputProps & {
    // connects query chain links to this input
    additionalScreenreaderIds?: string[];
    dataTestId?: string;
    errorDispatch?: React.Dispatch<{
        action: InvalidValueAction;
        payload: boolean;
    }>;
    hideLabel?: boolean;
    // for username and email inputs
    isNameExists?: boolean;
    invalidValueAction: InvalidValueAction;
    // must correspond to name in validationFunctionsTable
    name: ValidationKey;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    parentDispatch: React.Dispatch<
        | {
            action: ValidValueAction;
            payload: string;
        }
        | {
            action: InvalidValueAction;
            payload: boolean;
        }
    >;
    ref?: React.RefObject<HTMLInputElement | null>;
    validValueAction: ValidValueAction;
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
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    const {
        additionalScreenreaderIds = [],
        dataTestId = `${attributes.name}-textInput`,
        errorDispatch,
        hideLabel = false,
        icon,
        invalidValueAction,
        isNameExists = false,
        name,
        onChange,
        parentDispatch,
        ref,
        type = "date",
        validValueAction,
        ...textInputProps
    } = attributes;
    const value = attributes.value?.toString() ?? "";
    const label = (
        <Text color={attributes.disabled ? "gray" : void 0}>
            {attributes.label ?? splitCamelCase(attributes.name)}
        </Text>
    );

    const {
        globalState: { themeObject },
    } = useGlobalState();

    const {
        greenColorShade,
        redColorShade,
    } = returnThemeColors({ themeObject, colorsSwatches: COLORS_SWATCHES });

    const regexesArray = VALIDATION_FUNCTIONS_TABLE[name];
    const isValueValid = value.length === 0 || regexesArray.every(
        ([regexOrFunc, _validationText]: [any, any]) =>
            typeof regexOrFunc === "function"
                ? regexOrFunc(value)
                : regexOrFunc.test(value),
    );

    const leftIcon = icon ??
        (isValueValid && value.length > 0
            ? (
                <TbCheck
                    aria-label={`Valid ${name} input`}
                    color={greenColorShade}
                    data-testid={`${name}-input-valid-icon`}
                    size={18}
                />
            )
            : value.length === 0
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
        value,
    });

    const { screenreaderTextElement } =
        createAccessibleDateTimeScreenreaderTextElements({
            isInputFocused,
            isValueValid,
            name,
            validationTexts,
            value,
        });

    const textInput = (
        <TextInput
            aria-describedby={`${name}-empty-text ${name}-invalid-text ${name}-valid-text ${
                additionalScreenreaderIds.join(" ")
            }`}
            aria-errormessage={`${name}-invalid-text`}
            aria-invalid={!isValueValid || isNameExists}
            aria-label={name}
            data-testid={dataTestId}
            error={!isValueValid || isNameExists}
            icon={leftIcon}
            label={hideLabel ? null : label}
            name={name}
            onBlur={() => {
                setIsInputFocused(false);
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                parentDispatch({
                    action: invalidValueAction,
                    payload: !isValueValid || isNameExists,
                });
                parentDispatch({
                    action: validValueAction,
                    payload: event.currentTarget.value,
                });

                errorDispatch?.({
                    action: invalidValueAction,
                    payload: !isValueValid,
                });

                onChange?.(event);
            }}
            onFocus={() => {
                setIsInputFocused(true);
            }}
            ref={ref}
            type={type}
            value={value}
            {...textInputProps}
        />
    );

    return (
        <Box className="accessible-input">
            {textInput}
            {screenreaderTextElement}
        </Box>
    );
}

function createAccessibleDateTimeScreenreaderTextElements(
    {
        isInputFocused,
        isValueValid,
        name,
        validationTexts: { valueEmptyText, valueInvalidText },
        value,
    }: {
        isInputFocused: boolean;
        isValueValid: boolean;
        name: string;
        validationTexts: {
            valueEmptyText: string;
            valueInvalidText: string;
            valueValidText: string;
        };
        value: string;
    },
): {
    screenreaderTextElement: React.JSX.Element;
} {
    const announceInvalid = isInputFocused && !isValueValid && value.length > 0;
    const invalidTextElement = (
        <Text
            aria-live="polite"
            className="visually-hidden"
            data-testid={`${name}-dateTime-invalid-text`}
            id={`${name}-invalid-text`}
            w="100%"
        >
            {valueInvalidText}
        </Text>
    );

    const announceValid = isInputFocused && isValueValid && value.length > 0;
    const validTextElement = (
        <Text
            aria-live="polite"
            className="visually-hidden"
            data-testid={`${name}-dateTime-screenreader-text`}
            id={`${name}-valid-text`}
            w="100%"
        >
            {`${formatDate({ date: value })} is selected for ${
                splitCamelCase(name)
            } input.`}
        </Text>
    );

    const emptyTextElement = (
        <Text
            aria-live="polite"
            className="visually-hidden"
            data-testid={`${name}-dateTime-empty-text`}
            id={`${name}-empty-text`}
        >
            {valueEmptyText}
        </Text>
    );

    return {
        screenreaderTextElement: announceInvalid
            ? invalidTextElement
            : announceValid
            ? validTextElement
            : emptyTextElement,
    };
}

export { AccessibleDateTimeInput };
export type { AccessibleDateTimeInputAttributes, AccessibleDateTimeInputProps };
