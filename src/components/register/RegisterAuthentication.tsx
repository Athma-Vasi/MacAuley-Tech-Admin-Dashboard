import { Card, Loader, Text } from "@mantine/core";
import { useEffect, useRef } from "react";
import { TbExclamationCircle } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { AccessiblePasswordInput } from "../accessibleInputs/AccessiblePasswordInput";
import { AccessibleTextInput } from "../accessibleInputs/AccessibleTextInput";
import { registerAction } from "./actions";
import { RegisterDispatch } from "./schemas";

type RegisterAuthenticationProps = {
    confirmPassword: string;
    email: string;
    isEmailExists: boolean;
    isEmailExistsSubmitting: boolean;
    isUsernameExists: boolean;
    isUsernameExistsSubmitting: boolean;
    password: string;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    username: string;
};

function RegisterAuthentication({
    confirmPassword,
    email,
    isEmailExists,
    isEmailExistsSubmitting,
    isUsernameExists,
    isUsernameExistsSubmitting,
    password,
    registerDispatch,
    username,
}: RegisterAuthenticationProps) {
    const {
        globalState: { themeObject },
    } = useGlobalState();

    const { redColorShade } = returnThemeColors({
        colorsSwatches: COLORS_SWATCHES,
        themeObject,
    });

    const usernameInputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        usernameInputRef.current?.focus();
    }, []);

    const usernameTextInput = (
        <AccessibleTextInput
            attributes={{
                icon: isUsernameExistsSubmitting
                    ? <Loader size="xs" />
                    : isUsernameExists && username
                    ? <TbExclamationCircle color={redColorShade} />
                    : null,
                invalidValueAction: registerAction.setIsError,
                name: "username",
                parentDispatch: registerDispatch,
                ref: usernameInputRef as React.RefObject<HTMLInputElement>,
                validValueAction: registerAction.setUsername,
                value: username,
            }}
        />
    );

    const emailTextInput = (
        <AccessibleTextInput
            attributes={{
                icon: isEmailExistsSubmitting
                    ? <Loader size="xs" />
                    : isEmailExists && email
                    ? <TbExclamationCircle color={redColorShade} />
                    : null,
                invalidValueAction: registerAction.setIsError,
                name: "email",
                parentDispatch: registerDispatch,
                validValueAction: registerAction.setEmail,
                value: email,
            }}
        />
    );

    const passwordTextInput = (
        <AccessiblePasswordInput
            attributes={{
                invalidValueAction: registerAction.setIsError,
                name: "password",
                parentDispatch: registerDispatch,
                passwordValue: confirmPassword,
                validValueAction: registerAction.setPassword,
                value: password,
            }}
        />
    );

    const confirmPasswordTextInput = (
        <AccessiblePasswordInput
            attributes={{
                invalidValueAction: registerAction.setIsError,
                name: "confirmPassword",
                parentDispatch: registerDispatch,
                passwordValue: password,
                validValueAction: registerAction.setConfirmPassword,
                value: confirmPassword,
            }}
        />
    );

    const registerAuthentication = (
        <Card className="register-form-card">
            <Text size={24}>Authentication</Text>
            {usernameTextInput}
            {isUsernameExists && username
                ? (
                    <Text color={redColorShade}>
                        Username already exists!
                    </Text>
                )
                : null}
            {emailTextInput}
            {isEmailExists && email
                ? (
                    <Text color={redColorShade}>
                        Email already exists!
                    </Text>
                )
                : null}
            {passwordTextInput}
            {confirmPasswordTextInput}
        </Card>
    );

    return registerAuthentication;
}

export { RegisterAuthentication };
