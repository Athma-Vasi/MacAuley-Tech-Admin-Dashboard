import { Text } from "@mantine/core";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { FormReview } from "../../types";
import { returnThemeColors, splitCamelCase } from "../../utils";
import { ValidationKey } from "../../validations";

type StepperFormReviewProps = {
    formReview: FormReview;
    inputsInError: Set<ValidationKey>;
    stepsInError: Set<number>;
};

function StepperFormReview(
    { formReview, inputsInError, stepsInError }: StepperFormReviewProps,
) {
    const { globalState: { themeObject } } = useGlobalState();

    const { grayColorShade, redColorShade, textColor } = returnThemeColors({
        colorsSwatches: COLORS_SWATCHES,
        themeObject,
    });

    const formReviewElem = Object.entries(formReview).map(
        ([sectionKey, section], sectionIdx) => {
            const isStepInError = stepsInError.has(sectionIdx);

            const sectionTitle = (
                <Text
                    size={20}
                    color={isStepInError ? redColorShade : textColor}
                    key={`${sectionKey}-${sectionIdx}-title`}
                >
                    {sectionKey}
                </Text>
            );

            const stepInputsSection = (
                <div className="step-inputs-container">
                    {Object.entries(section).map(
                        ([inputName, inputValue], inputIdx) => {
                            const isInputInError = inputsInError.has(
                                inputName as ValidationKey,
                            );
                            const isInputEmpty = typeof inputValue === "string"
                                ? inputValue.trim() === ""
                                : inputValue === undefined;

                            const inputNameElem = (
                                <Text
                                    size={15}
                                    color={isInputEmpty
                                        ? grayColorShade
                                        : isInputInError
                                        ? redColorShade
                                        : textColor}
                                >
                                    {splitCamelCase(inputName)}
                                </Text>
                            );
                            const inputValueElem = (
                                <Text
                                    size={15}
                                    color={isInputInError
                                        ? redColorShade
                                        : textColor}
                                >
                                    {inputValue?.toString() ?? ""}
                                </Text>
                            );

                            const inputSection = (
                                <div
                                    className={`input-section ${
                                        inputIdx % 2 === 0 ? "isEven" : "isOdd"
                                    }`}
                                    key={`${sectionKey}-${sectionIdx}-${inputName}-${inputIdx}`}
                                >
                                    {inputNameElem}
                                    {inputValueElem}
                                </div>
                            );

                            return inputSection;
                        },
                    )}
                </div>
            );

            return (
                <div
                    className="review-section-container"
                    key={`${sectionKey}-${sectionIdx}`}
                >
                    {sectionTitle}
                    {stepInputsSection}
                </div>
            );
        },
        [],
    );

    return (
        <div className="form-review">
            <Text size={24}>Review</Text>
            {formReviewElem}
        </div>
    );
}

export { StepperFormReview };
