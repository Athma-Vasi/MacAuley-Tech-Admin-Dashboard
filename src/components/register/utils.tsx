import { Card, Flex, Stack, Text, Title } from "@mantine/core";
import { TbAlertCircle, TbX } from "react-icons/tb";
import { TEXT_SHADOW } from "../../constants";
import { UserSchema } from "../../types";
import { ValidationKey } from "../../validations";
import { REGISTER_STEPS } from "./constants";
import { SAMPLE_USER_DOCUMENT } from "./testData";

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
                                            size="xl"
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
                                gap="xs"
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

function createFileSectionInFormReview(filesInError: Map<string, boolean>) {
    return Array.from(filesInError).reduce((acc, fileInError, idx) => {
        const [fileName, _isFileInError] = fileInError;
        Object.defineProperty(acc, `File ${idx === 0 ? "" : idx + 1}`, {
            value: fileName,
            enumerable: true,
        });

        return acc;
    }, Object.create(null));
}

function generateUserSchemas(amount = 20): UserSchema[] {
    return Array.from({ length: amount }, (_, idx) => {
        const EXCLUDED_KEYS = new Set([
            "_id",
            "createdAt",
            "updatedAt",
            "__v",
        ]);
        const sampleUserSchema = Object.entries(SAMPLE_USER_DOCUMENT).reduce(
            (acc, [key, value]) => {
                if (EXCLUDED_KEYS.has(key)) {
                    return acc;
                }

                acc[key as keyof UserSchema] = value;
                return acc;
            },
            Object.create(null),
        );
        const { email, username } = sampleUserSchema;

        return {
            ...sampleUserSchema,
            email: `${idx}${email}`,
            username: `${idx}${username}`,
            password: "passwordQ1!",
        };
    });
}

function returnIsRegisterSubmitButtonDisabled(
    {
        confirmPassword,
        email,
        filesInError,
        inputsInError,
        isEmailExists,
        isEmailExistsSubmitting,
        isError,
        isSubmitting,
        isUsernameExists,
        isUsernameExistsSubmitting,
        password,
        stepsInError,
        username,
    }: {
        confirmPassword: string;
        email: string;
        password: string;
        username: string;
        filesInError: Map<string, boolean>;
        inputsInError: Set<ValidationKey>;
        isEmailExists: boolean;
        isEmailExistsSubmitting: boolean;
        isError: boolean;
        isSubmitting: boolean;
        isUsernameExists: boolean;
        isUsernameExistsSubmitting: boolean;
        stepsInError: Set<number>;
    },
) {
    return !username || !email || !password ||
        !confirmPassword || isUsernameExists || isEmailExists ||
        isError || stepsInError.size > 0 || inputsInError.size > 0 ||
        isEmailExistsSubmitting || isUsernameExistsSubmitting ||
        isSubmitting ||
        Array.from(filesInError).reduce((acc, curr) => {
            const [_fileName, isFileInError] = curr;
            acc.add(isFileInError);

            return acc;
        }, new Set()).has(true);
}

export {
    createFileSectionInFormReview,
    generateUserSchemas,
    returnIsRegisterSubmitButtonDisabled,
    returnRegisterStepperCard,
};
