import { Box, Switch, SwitchProps, Text } from "@mantine/core";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks";
import { ThemeObject } from "../../types";
import { returnThemeColors, splitCamelCase } from "../../utils";

type AccessibleSwitchInputAttributes<
    ValidValueAction extends string = string,
> = SwitchProps & {
    dataTestId?: string;
    name: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    parentDispatch: React.Dispatch<{
        action: ValidValueAction;
        payload: boolean;
    }>;
    ref?: React.RefObject<HTMLInputElement | null>;
    switchOffDescription?: string;
    switchOnDescription?: string;
    validValueAction: ValidValueAction;
};

type AccessibleSwitchInputProps<
    ValidValueAction extends string = string,
> = { attributes: AccessibleSwitchInputAttributes<ValidValueAction> };

function AccessibleSwitchInput<
    ValidValueAction extends string = string,
>({ attributes }: AccessibleSwitchInputProps<ValidValueAction>) {
    const {
        globalState: {
            themeObject,
        },
    } = useGlobalState();

    const {
        checked,
        dataTestId = `${attributes.name}-switchInput`,
        onChange,
        parentDispatch,
        ref,
        switchOffDescription,
        switchOnDescription,
        validValueAction,
        ...switchProps
    } = attributes;
    const name = splitCamelCase(attributes.name);
    const label = attributes.label ?? name;

    const { switchOnTextElement, switchOffTextElement } =
        createAccessibleSwitchOnOffTextElements({
            name,
            switchOffDescription,
            switchOnDescription,
            themeObject,
        });

    const switchInput = (
        <Switch
            aria-label={name}
            aria-describedby={`${name}-switch-${checked ? "on" : "off"}`}
            checked={checked}
            color={themeObject.primaryColor}
            data-testid={dataTestId}
            description={checked ? switchOnTextElement : switchOffTextElement}
            label={label}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                parentDispatch({
                    action: validValueAction,
                    payload: event.currentTarget.checked,
                });

                onChange?.(event);
            }}
            ref={ref}
            {...switchProps}
        />
    );

    return (
        <Box className="accessible-input">
            {switchInput}
            {switchOnTextElement}
            {switchOffTextElement}
        </Box>
    );
}

function createAccessibleSwitchOnOffTextElements({
    name,
    switchOffDescription,
    switchOnDescription,
    themeObject,
}: {
    name: string;
    switchOffDescription?: string;
    switchOnDescription?: string;
    themeObject: ThemeObject;
}): {
    switchOnTextElement: React.JSX.Element;
    switchOffTextElement: React.JSX.Element;
} {
    const {
        grayColorShade,
        redColorShade,
    } = returnThemeColors({
        themeObject,
        colorsSwatches: COLORS_SWATCHES,
    });

    const switchOnText = switchOnDescription ??
        `${name} is on.`;
    const switchOnTextElement = (
        <Text
            aria-live="polite"
            className="visually-hidden"
            color={grayColorShade}
            data-testid={`${name}-switch-on-screenreader-text`}
            id={`${name}-switch-on`}
            w="100%"
        >
            {switchOnText}
        </Text>
    );

    const switchOffText = switchOffDescription ??
        `${name} is off.`;
    const switchOffTextElement = (
        <Text
            aria-live="polite"
            className="visually-hidden"
            color={redColorShade}
            data-testid={`${name}-switch-off-screenreader-text`}
            id={`${name}-switch-off`}
            w="100%"
        >
            {switchOffText}
        </Text>
    );

    return { switchOnTextElement, switchOffTextElement };
}

export { AccessibleSwitchInput };
export type { AccessibleSwitchInputAttributes, AccessibleSwitchInputProps };
