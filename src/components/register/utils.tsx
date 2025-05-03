import { Card, Flex, Stack, Text, Title } from "@mantine/core";
import { TbAlertCircle, TbX } from "react-icons/tb";
import { TEXT_SHADOW } from "../../constants";
import { REGISTER_STEPS } from "./constants";

function returnRegisterStepperCard(
    {
        activeStep,
        cardBgGradient,
        redColorShade,
        grayColorShade,
        stepsInError,
        stepsWithEmptyInputs,
        textColor,
        themeColorShade,
    }: {
        activeStep: number;
        cardBgGradient: string;
        grayColorShade: string;
        redColorShade: string;
        stepsInError: Set<number>;
        stepsWithEmptyInputs: Set<number>;
        textColor: string;
        themeColorShade: string;
    },
) {
    return (
        <div className="register-stepper-container">
            <div className="register-stepper-header">
                <Title order={2}>Register</Title>
                <Text size="sm" color="dimmed">
                    to continue to MacAuley Tech Dashboard
                </Text>
            </div>
            <div className="register-stepper-cards">
                {REGISTER_STEPS.map((value, idx) => {
                    const isStepInError = stepsInError.has(idx);
                    const isStepWithEmptyInputs = stepsWithEmptyInputs.has(idx);

                    const icon = (
                        <div
                            className={`stepper-circle-section ${
                                idx === activeStep ? "active" : ""
                            }`}
                        >
                            {isStepInError
                                ? <TbX color={redColorShade} size={26} />
                                : isStepWithEmptyInputs
                                ? (
                                    <TbAlertCircle
                                        color={activeStep === idx
                                            ? themeColorShade
                                            : "gray"}
                                        size={26}
                                    />
                                )
                                : (
                                    <div className="stepper-circle">
                                        <Text
                                            size="md"
                                            color={activeStep === idx
                                                ? themeColorShade
                                                : "dimmed"}
                                        >
                                            {idx + 1}
                                        </Text>
                                    </div>
                                )}
                        </div>
                    );

                    const title = (
                        <Title
                            order={4}
                            size={16}
                            color={isStepInError
                                ? redColorShade
                                : activeStep === idx
                                ? textColor
                                : "dimmed"}
                        >
                            {`Step ${idx + 1}`}
                        </Title>
                    );
                    const stepName = (
                        <Text
                            size={22}
                            color={isStepInError
                                ? redColorShade
                                : activeStep === idx
                                ? textColor
                                : "dimmed"}
                            style={activeStep === idx
                                ? { textShadow: TEXT_SHADOW }
                                : {}}
                        >
                            {value}
                        </Text>
                    );

                    return (
                        <Card
                            withBorder
                            bg={cardBgGradient}
                            key={`${idx}-${value}`}
                            className={`stepper-card ${
                                idx === activeStep ? "active" : "hidden"
                            }`}
                        >
                            <Flex
                                align="flex-start"
                                w="100%"
                                justify="flex-start"
                                gap="md"
                            >
                                {icon}
                                <Stack spacing={2}>
                                    {title}
                                    {stepName}
                                </Stack>
                            </Flex>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

function createFilesSectionInFormReview(filesInError: Map<string, boolean>) {
    return Array.from(filesInError).reduce((acc, fileInError, idx) => {
        const [fileName, _isFileInError] = fileInError;
        Object.defineProperty(acc, `File ${idx + 1}`, {
            value: fileName,
            enumerable: true,
        });

        return acc;
    }, Object.create(null));
}

export { createFilesSectionInFormReview, returnRegisterStepperCard };
