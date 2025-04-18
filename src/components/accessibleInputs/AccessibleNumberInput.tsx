import {
    Box,
    NumberInput,
    NumberInputProps,
    Popover,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChangeEvent, Dispatch, ReactNode, RefObject } from "react";
import { useGlobalState } from "../../hooks/useGlobalState";
import { ValidationFunctionsTable } from "../../types";
import { splitCamelCase } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";

type AccessibleNumberInputAttributes<
    ValidValueAction extends string = string,
> = NumberInputProps & {
    hideLabel?: boolean;
    // must correspond to name in validationFunctionsTable
    name: ValidationKey;
    onBlur?: () => void;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onKeyDown?: () => void;
    parentDispatch: Dispatch<
        {
            action: ValidValueAction;
            payload: number | "";
        }
    >;
    placeholder?: string;
    ref?: RefObject<HTMLInputElement | null> | null;
    required?: boolean;
    rightSection?: boolean;
    rightSectionIcon?: ReactNode;
    rightSectionOnClick?: () => void;
    validationFunctionsTable?: ValidationFunctionsTable;
    validValueAction: ValidValueAction;
};

type AccessibleNumberInputProps<
    ValidValueAction extends string = string,
> = {
    attributes: AccessibleNumberInputAttributes<
        ValidValueAction
    >;
    uniqueId?: string;
};

function AccessibleNumberInput<
    ValidValueAction extends string = string,
>(
    { attributes, uniqueId }: AccessibleNumberInputProps<
        ValidValueAction
    >,
) {
    const {
        autoComplete = "off",
        disabled = false,
        hideLabel = false,
        icon = null,
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

    const [isPopoverOpened, { open: openPopover, close: closePopover }] =
        useDisclosure(false);

    const {
        globalState: { themeObject },
    } = useGlobalState();

    // const {
    //     greenColorShade,
    //     grayColorShade,
    //     redColorShade,
    //     cardBgGradient,
    // } = returnThemeColors({ themeObject, colorsSwatches: COLORS_SWATCHES });

    const rightIcon = rightSection ? rightSectionIcon : null;

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
                    <NumberInput
                        aria-label={name}
                        aria-required={required}
                        autoComplete={autoComplete}
                        // color={grayColorShade}
                        disabled={disabled}
                        icon={icon}
                        label={hideLabel ? null : label}
                        maxLength={maxLength}
                        minLength={minLength}
                        name={name}
                        onBlur={() => {
                            parentDispatch({
                                action: validValueAction,
                                payload: value ?? "",
                            });

                            onBlur?.();
                            closePopover();
                        }}
                        onChange={(event) => {
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
                        value={value}
                        withAsterisk={withAsterisk}
                    />
                </Popover.Target>
            </Popover>
        </Box>
    );
}

export { AccessibleNumberInput };

export type { AccessibleNumberInputAttributes };
