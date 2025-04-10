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
                                ? <TbX color={redColorShade} size={24} />
                                : isStepWithEmptyInputs
                                ? (
                                    <TbAlertCircle
                                        color={activeStep === idx
                                            ? themeColorShade
                                            : "gray"}
                                        size={24}
                                    />
                                )
                                : (
                                    <div className="stepper-circle">
                                        <Text>{idx + 1}</Text>
                                    </div>
                                )}
                        </div>
                    );

                    const title = (
                        <Title
                            order={4}
                            size={16}
                            color={isStepInError ? redColorShade : "dimmed"}
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
                                align="center"
                                w="100%"
                                justify="flex-start"
                                columnGap="md"
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

export { returnRegisterStepperCard };
