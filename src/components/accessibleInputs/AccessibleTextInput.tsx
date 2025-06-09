import { Box, Text, TextInput, TextInputProps } from "@mantine/core";

import React from "react";
import { TbCheck, TbX } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks";
import { returnThemeColors, splitCamelCase } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";
import {
    createAccessibleValueValidationTextElements,
    returnValidationTexts,
} from "./utils";

type AccessibleTextInputAttributes<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
> = TextInputProps & {
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

type AccessibleTextInputProps<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
> = {
    attributes: AccessibleTextInputAttributes<
        ValidValueAction,
        InvalidValueAction
    >;
};

function AccessibleTextInput<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    { attributes }: AccessibleTextInputProps<
        ValidValueAction,
        InvalidValueAction
    >,
) {
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    const {
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

    const { validValueTextElement, invalidValueTextElement } =
        createAccessibleValueValidationTextElements({
            isInputFocused,
            isNameExists,
            isValueValid,
            name,
            themeObject,
            validationTexts,
            value,
        });

    const textInput = (
        <TextInput
            // aria-describedby={!isValueValid || isNameExists
            //     ? `${name}-invalid-text`
            //     : `${name}-valid-text`}
            aria-describedby={`${name}-invalid-text ${name}-valid-text`}
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
            value={value}
            {...textInputProps}
        />
    );

    return (
        <Box className="accessible-input">
            {textInput}
            {validValueTextElement}
            {invalidValueTextElement}
        </Box>
    );
}

export { AccessibleTextInput };
export type { AccessibleTextInputAttributes, AccessibleTextInputProps };
