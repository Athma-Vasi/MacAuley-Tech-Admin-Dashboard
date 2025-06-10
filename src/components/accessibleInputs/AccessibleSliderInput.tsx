import { Box, Slider, SliderProps, Text } from "@mantine/core";
import { INPUT_WIDTH } from "../../constants";
import { useGlobalState } from "../../hooks";
import { splitCamelCase } from "../../utils";
import { displayOrientationLabel } from "./image/constants";

type AccessibleSliderInputAttributes<
    ValidValueAction extends string = string,
    Payload extends number = number,
> = SliderProps & {
    announceOrientation?: boolean;
    dataTestId?: string;
    name: string;
    onChange?: (value: number) => void;
    parentDispatch?: React.Dispatch<{
        action: ValidValueAction;
        payload: Payload;
    }>;
    validValueAction: ValidValueAction;
};

type AccessibleSliderInputProps<
    ValidValueAction extends string = string,
    Payload extends number = number,
> = {
    attributes: AccessibleSliderInputAttributes<ValidValueAction, Payload>;
};

function AccessibleSliderInput<
    ValidValueAction extends string = string,
    Payload extends number = number,
>({ attributes }: AccessibleSliderInputProps<ValidValueAction, Payload>) {
    const {
        globalState: {
            themeObject,
        },
    } = useGlobalState();

    const {
        announceOrientation = false,
        dataTestId = `${attributes.name}-sliderInput`,
        disabled = false,
        marks,
        max,
        min,
        name,
        onChange,
        parentDispatch,
        precision = 1,
        validValueAction,
        value,
        w = INPUT_WIDTH,
        ...sliderProps
    } = attributes;

    const sliderMarks = marks
        ? marks
        : disabled
        ? void 0
        : returnSliderMarks({ max, min });

    const { screenreaderTextElement } =
        createAccessibleSliderScreenreaderTextElements({
            announceOrientation,
            marks: sliderMarks,
            name,
            value,
        });

    const sliderInput = (
        <Slider
            aria-describedby={`${name}-slider-selected`}
            aria-label={name}
            color={themeObject.primaryColor}
            disabled={disabled}
            data-testid={dataTestId}
            max={max}
            marks={sliderMarks}
            min={min}
            onChange={(value: Payload) => {
                parentDispatch?.({
                    action: validValueAction,
                    payload: value,
                });

                onChange?.(value);
            }}
            precision={precision}
            value={value}
            w={w}
            {...sliderProps}
        />
    );

    return (
        <Box className="accessible-input">
            {sliderInput}
            {screenreaderTextElement}
        </Box>
    );
}

/**
 * @description creates marks for slider wrapper component
 */
function returnSliderMarks({
    max = 10,
    min = 0,
    precision = 0,
    steps = 2,
    symbol = "",
}: {
    max: number | undefined;
    min: number | undefined;
    steps?: number;
    precision?: number;
    symbol?: string;
}): { value: number; label: string }[] {
    const step = (max - min) / steps;

    return Array.from({ length: steps + 1 }, (_, i) => {
        const value = min + step * i;
        const valueFormatted = value.toFixed(precision);

        return {
            value: Number.parseInt(valueFormatted),
            label: `${valueFormatted}${symbol}`,
        };
    });
}

function createAccessibleSliderScreenreaderTextElements({
    announceOrientation,
    marks = [],
    name,
    value = 0,
}: {
    announceOrientation: boolean;
    marks: { value: number; label?: React.ReactNode }[] | undefined;
    name: string;
    value?: number;
}): {
    screenreaderTextElement: React.JSX.Element;
} {
    const label = marks?.find((mark) => mark.value === value)?.label;
    const screenreaderTextElement = (
        <Text
            aria-live="polite"
            className="visually-hidden"
            data-testid={`${name}-slider-screenreader-text`}
            id={`${name}-slider-selected`}
            w="100%"
        >
            {`${
                label == null
                    ? splitCamelCase(name)
                    : `${label} is selected for ${splitCamelCase(name)}`
            } slider ${
                announceOrientation
                    ? `which is ${displayOrientationLabel(value)}`
                    : ""
            }`}
        </Text>
    );

    return { screenreaderTextElement };
}

export { AccessibleSliderInput };
