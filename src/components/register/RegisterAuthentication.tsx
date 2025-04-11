import { Card, Loader, Text } from "@mantine/core";
import { useEffect, useRef } from "react";
import { TbExclamationCircle } from "react-icons/tb";
import { AUTH_URL, COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { AccessiblePasswordInput } from "../accessibleInputs/AccessiblePasswordInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import { registerAction } from "./actions";
import { handleCheckEmailExists, handleCheckUsernameExists } from "./handlers";
import { RegisterDispatch } from "./types";

type RegisterAuthenticationProps = {
    confirmPassword: string;
    email: string;
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    isComponentMountedRef: React.RefObject<boolean>;
    isEmailExists: boolean;
    isEmailExistsSubmitting: boolean;
    isError: boolean;
    isUsernameExists: boolean;
    isUsernameExistsSubmitting: boolean;
    password: string;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
    username: string;
};

function RegisterAuthentication({
    confirmPassword,
    email,
    fetchAbortControllerRef,
    isComponentMountedRef,
    isEmailExists,
    isEmailExistsSubmitting,
    isError,
    isUsernameExists,
    isUsernameExistsSubmitting,
    password,
    registerDispatch,
    showBoundary,
    username,
}: RegisterAuthenticationProps) {
    const {
        globalState: { themeObject },
    } = useGlobalState();

    const { bgGradient, redColorShade, greenColorShade, themeColorShade } =
        returnThemeColors({
            colorsSwatches: COLORS_SWATCHES,
            themeObject,
        });

    const usernameInputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        usernameInputRef.current?.focus();
    }, []);

    useEffect(() => {
        handleCheckUsernameExists({
            fetchAbortControllerRef,
            isComponentMountedRef,
            registerDispatch,
            showBoundary,
            url: AUTH_URL,
            username,
        });
    }, [username]);

    useEffect(() => {
        handleCheckEmailExists({
            fetchAbortControllerRef,
            isComponentMountedRef,
            registerDispatch,
            showBoundary,
            url: AUTH_URL,
            email,
        });
    }, [email]);

    const usernameTextInput = (
        <AccessibleTextInput
            attributes={{
                icon: isUsernameExistsSubmitting
                    ? <Loader size="xs" />
                    : isUsernameExists
                    ? <TbExclamationCircle color={redColorShade} />
                    : null,
                invalidValueAction: registerAction.setIsError,
                name: "username",
                onChange: async (event) => {
                    // await handleCheckUsernameExists({
                    //   fetchAbortControllerRef,
                    //   isComponentMountedRef,
                    //   registerDispatch,
                    //   showBoundary,
                    //   url: AUTH_URL,
                    //   username: event.currentTarget.value,
                    // });
                },
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
                    : isEmailExists
                    ? <TbExclamationCircle color={redColorShade} />
                    : null,
                invalidValueAction: registerAction.setIsError,
                name: "email",
                onChange: async (event) => {
                    // await handleCheckEmailExists({
                    //   fetchAbortControllerRef,
                    //   email: event.currentTarget.value,
                    //   isComponentMountedRef,
                    //   registerDispatch,
                    //   showBoundary,
                    //   url: AUTH_URL,
                    // });
                },
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
            {isUsernameExists
                ? (
                    <Text color={redColorShade}>
                        Username already exists!
                    </Text>
                )
                : null}
            {emailTextInput}
            {isEmailExists
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
