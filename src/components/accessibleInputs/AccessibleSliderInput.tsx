import { Box, Slider, SliderProps, Text } from "@mantine/core";
import { INPUT_WIDTH } from "../../constants";
import { useGlobalState } from "../../hooks";
import { splitCamelCase } from "../../utils";

type AccessibleSliderInputAttributes<
    ValidValueAction extends string = string,
    Payload extends number = number,
> = SliderProps & {
    dataTestId?: string;
    name: string;
    onChange?: (value: number) => void;
    parentDispatch: React.Dispatch<{
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
        dataTestId = `${attributes.name}-sliderInput`,
        disabled,
        marks,
        max,
        min,
        name,
        onChange,
        parentDispatch,
        precision = 1,
        validValueAction,
        value,
        ...sliderProps
    } = attributes;

    const sliderMarks = marks
        ? marks
        : disabled
        ? void 0
        : returnSliderMarks({ max, min });

    const { screenreaderTextElement } =
        createAccessibleSliderScreenreaderTextElements({
            name,
            value,
        });

    const sliderInput = (
        <Slider
            aria-describedby={`${name}-slider-selected`}
            aria-label={name}
            color={themeObject.primaryColor}
            data-testid={dataTestId}
            max={max}
            marks={sliderMarks}
            min={min}
            onChange={(value: Payload) => {
                parentDispatch({
                    action: validValueAction,
                    payload: value,
                });

                onChange?.(value);
            }}
            precision={precision}
            w={INPUT_WIDTH}
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
    name,
    value = 0,
}: {
    name: string;
    value?: number;
}): {
    screenreaderTextElement: React.JSX.Element;
} {
    const screenreaderTextElement = (
        <Text
            aria-live="assertive"
            className="visually-hidden"
            data-testid={`${name}-slider-screenreader-text`}
            id={`${name}-slider-selected`}
            w="100%"
        >
            {`${value} is selected for ${splitCamelCase(name)} slider.`}
        </Text>
    );

    return { screenreaderTextElement };
}

export { AccessibleSliderInput };
