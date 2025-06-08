import { Card, Loader, Text } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { TbExclamationCircle } from "react-icons/tb";
import { AUTH_URL, COLORS_SWATCHES } from "../../constants";
import { useMountedRef } from "../../hooks";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { AccessiblePasswordInput } from "../accessibleInputs/AccessiblePasswordInput";
import { AccessibleTextInput } from "../accessibleInputs/AccessibleTextInput";
import { NewTextInput } from "../accessibleInputs/NewTextInput";
import { registerAction } from "./actions";
import { handleCheckUsername } from "./handlers";
import { RegisterDispatch } from "./schemas";

type RegisterAuthenticationProps = {
    checkUsernameWorker?: Worker | null;
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
    checkUsernameWorker,
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
    const { showBoundary } = useErrorBoundary();
    const isComponentMountedRef = useMountedRef();

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
    const newUsernameTextInput = (
        <NewTextInput
            attributes={{
                icon: isUsernameExistsSubmitting
                    ? <Loader size="xs" />
                    : isUsernameExists && username
                    ? <TbExclamationCircle color={redColorShade} />
                    : null,
                isNameExists: isUsernameExists,
                invalidValueAction: registerAction.setIsError,
                name: "username",
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                    if (
                        !username || username.length === 0 ||
                        checkUsernameWorker == null
                    ) {
                        return;
                    }

                    handleCheckUsername({
                        checkUsernameWorker,
                        isComponentMountedRef,
                        registerDispatch,
                        showBoundary,
                        url: AUTH_URL,
                        username: event.currentTarget.value,
                    });
                },
                parentDispatch: registerDispatch,
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
            {newUsernameTextInput}
            {/* {usernameTextInput} */}
            {
                /* {isUsernameExists && username
                ? (
                    <Text
                        aria-live="polite"
                        color={redColorShade}
                        data-testid="username-exists-text"
                        id="username-exists-text"
                    >
                        Username already exists!
                    </Text>
                )
                : null} */
            }
            {emailTextInput}
            {isEmailExists && email
                ? (
                    <Text
                        aria-live="polite"
                        color={redColorShade}
                        data-testid="email-exists-text"
                    >
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
