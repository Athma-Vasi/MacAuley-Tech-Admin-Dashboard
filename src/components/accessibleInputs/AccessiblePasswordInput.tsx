import { Box, PasswordInput, PasswordInputProps, Text } from "@mantine/core";

import React from "react";
import { TbCheck, TbX } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks";
import { ThemeObject } from "../../types";
import { returnThemeColors, splitCamelCase } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";

type AccessiblePasswordInputAttributes<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
> = PasswordInputProps & {
    dataTestId?: string;
    hideLabel?: boolean;
    invalidValueAction: InvalidValueAction;
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
    passwordValue: string; // to match passwords
    ref?: React.RefObject<HTMLInputElement | null>;
    validValueAction: ValidValueAction;
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
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    const {
        dataTestId = `${attributes.name}-passwordInput`,
        hideLabel = false,
        icon,
        invalidValueAction,
        name,
        onChange,
        parentDispatch,
        passwordValue,
        ref,
        validValueAction,
        ...passwordInputProps
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
    // empty string is valid
    let isValueValid = value.length === 0 || regexesArray.every(
        ([regexOrFunc, _validationText]: [any, any]) =>
            typeof regexOrFunc === "function"
                ? regexOrFunc(value)
                : regexOrFunc.test(value),
    );
    if (value.length > 0 && passwordValue.length > 0) {
        isValueValid = value === passwordValue;
    }

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
        createAccessiblePasswordInputValidationTextElements({
            isInputFocused,
            isValueValid,
            name,
            passwordValue,
            themeObject,
            validationTexts,
            value,
        });

    const passwordInput = (
        <PasswordInput
            aria-describedby={`${name}-empty-text ${name}-invalid-text ${name}-valid-text`}
            aria-errormessage={`${name}-invalid-text`}
            aria-invalid={!isValueValid}
            aria-label={name}
            data-testid={dataTestId}
            error={!isValueValid}
            icon={leftIcon}
            label={hideLabel ? null : label}
            name={name}
            onBlur={() => {
                setIsInputFocused(false);
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                parentDispatch({
                    action: invalidValueAction,
                    payload: !isValueValid,
                });
                parentDispatch({
                    action: validValueAction,
                    payload: event.currentTarget.value,
                });

                onChange?.(event);
            }}
            onFocus={() => {
                setIsInputFocused(true);
            }}
            ref={ref}
            value={value}
            {...passwordInputProps}
        />
    );

    return (
        <Box className="accessible-input">
            {passwordInput}
            {screenreaderTextElement}
        </Box>
    );
}

function returnValidationTexts(
    { name, value }: {
        name: ValidationKey;
        value: string;
    },
): {
    valueEmptyText: string;
    valueInvalidText: string;
    valueValidText: string;
} {
    const initialValidationTexts = {
        valueValidText: "",
        valueInvalidText: "",
        valueEmptyText: "",
    };
    const regexesArray = VALIDATION_FUNCTIONS_TABLE[name];
    const regexes = regexesArray.map(([regexOrFunc, errorMessage]) => {
        if (typeof regexOrFunc === "function") {
            return regexOrFunc(value) ? "" : errorMessage;
        }
        return regexOrFunc.test(value) ? "" : errorMessage;
    });
    const splitName = splitCamelCase(name);
    const partialInvalidText = regexes.join(" ");
    const valueInvalidText = `${splitName} is invalid. ${partialInvalidText}`;

    return {
        ...initialValidationTexts,
        valueInvalidText,
        valueValidText: `${splitName} is valid.`,
        valueEmptyText: `${splitName} is empty.`,
    };
}

function createAccessiblePasswordInputValidationTextElements({
    isInputFocused,
    isValueValid,
    name,
    themeObject,
    validationTexts: { valueEmptyText, valueInvalidText, valueValidText },
    passwordValue,
    value,
}: {
    isInputFocused: boolean;
    isValueValid: boolean;
    name: string;
    themeObject: ThemeObject;
    validationTexts: {
        valueEmptyText: string;
        valueInvalidText: string;
        valueValidText: string;
    };
    passwordValue: string;
    value: string;
}): {
    screenreaderTextElement: React.ReactNode;
} {
    const { greenColorShade, redColorShade } = returnThemeColors({
        themeObject,
        colorsSwatches: COLORS_SWATCHES,
    });

    const arePasswordsDifferent = passwordValue.length > 0 &&
        value.length > 0 &&
        passwordValue !== value;

    const shouldShowInvalidValueText = isInputFocused &&
        (!isValueValid || arePasswordsDifferent) &&
        value.length > 0;
    const invalidValueTextElement = (
        <Text
            aria-live="polite"
            className={shouldShowInvalidValueText ? "" : "visually-hidden"}
            color={redColorShade}
            id={`${name}-invalid-text`}
            pt={2}
            w="100%"
        >
            {`${
                arePasswordsDifferent
                    ? "Passwords do not match."
                    : ""
            } ${valueInvalidText}`}
        </Text>
    );

    const shouldShowValidValueText = isInputFocused &&
        isValueValid && !arePasswordsDifferent &&
        value.length > 0;
    const validValueTextElement = (
        <Text
            aria-live="polite"
            className={shouldShowValidValueText ? "" : "visually-hidden"}
            color={greenColorShade}
            id={`${name}-valid-text`}
            pt={2}
            w="100%"
        >
            {valueValidText}
        </Text>
    );

    const shouldShowEmptyValueText = isInputFocused && value.length === 0;
    const emptyValueTextElement = (
        <Text
            aria-live="polite"
            className={"visually-hidden"} // always hidden
            id={`${name}-empty-text`}
        >
            {valueEmptyText}
        </Text>
    );

    return {
        screenreaderTextElement: shouldShowInvalidValueText
            ? invalidValueTextElement
            : shouldShowEmptyValueText
            ? emptyValueTextElement
            : validValueTextElement,
    };
}

export { AccessiblePasswordInput };
export type { AccessiblePasswordInputAttributes, AccessiblePasswordInputProps };
