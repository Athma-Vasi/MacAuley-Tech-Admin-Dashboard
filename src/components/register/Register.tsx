import {
  Card,
  Center,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { TbCheck, TbExclamationCircle } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import {
  AUTH_URL,
  COLORS_SWATCHES,
  FETCH_REQUEST_TIMEOUT,
} from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessiblePasswordInput } from "../accessibleInputs/AccessiblePasswordInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import { registerAction } from "./actions";
import { REGISTER_URL } from "./constants";
import { registerReducer } from "./reducers";
import { initialRegisterState } from "./state";
import {
  handleCheckEmailExists,
  handleCheckUsernameExists,
  handleRegisterButtonClick,
} from "./utils";

function Register() {
  const [registerState, registerDispatch] = useReducer(
    registerReducer,
    initialRegisterState,
  );

  const {
    confirmPassword,
    email,
    errorMessage,
    isEmailExists,
    isEmailExistsSubmitting,
    isError,
    isSubmitting,
    isSuccessful,
    isUsernameExists,
    isUsernameExistsSubmitting,
    password,
    username,
  } = registerState;

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { showBoundary, resetBoundary } = useErrorBoundary();

  const navigateFn = useNavigate();

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchAbortControllerRef?.current?.abort("Request timed out");
    }, FETCH_REQUEST_TIMEOUT);

    return () => {
      clearTimeout(timerId);
      fetchAbortControllerRef?.current?.abort("Component unmounted");
      isComponentMountedRef.current = false;
    };
  }, []);

  const { bgGradient, redColorShade, greenColorShade, themeColorShade } =
    returnThemeColors({
      colorsSwatches: COLORS_SWATCHES,
      themeObject,
    });

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
          await handleCheckUsernameExists({
            fetchAbortControllerRef,
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
          : isEmailExists
          ? <TbExclamationCircle color={redColorShade} />
          : null,
        invalidValueAction: registerAction.setIsError,
        name: "email",
        onChange: async (event) => {
          await handleCheckEmailExists({
            fetchAbortControllerRef,
            email: event.currentTarget.value,
            isComponentMountedRef,
            registerDispatch,
            showBoundary,
            url: AUTH_URL,
          });
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

  const isButtonDisabled = !username || !email || !password ||
    !confirmPassword || isUsernameExists || isEmailExists ||
    isError;

  const submitButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "All inputs are valid. Click to Register.",
        disabledScreenreaderText: !username || !email || !password ||
            !confirmPassword
          ? "Fields cannot be empty"
          : "Please fix errors before registering.",
        disabled: isButtonDisabled,
        kind: "submit",
        leftIcon: isSubmitting
          ? <Loader size="xs" />
          : isSuccessful
          ? <TbCheck color={themeColorShade} />
          : null,
        name: "submit",
        onClick: async (_event: React.MouseEvent<HTMLButtonElement>) => {
          if (password !== confirmPassword) {
            registerDispatch({
              action: registerAction.setIsError,
              payload: true,
            });
            registerDispatch({
              action: registerAction.setErrorMessage,
              payload: "Passwords do not match",
            });
            return;
          }

          await handleRegisterButtonClick({
            fetchAbortControllerRef,
            isComponentMountedRef,
            navigateFn,
            navigateTo: "/login",
            registerDispatch,
            schema: {
              username,
              email,
              password,
              roles: ["Employee"],
            },
            showBoundary,
            url: REGISTER_URL,
          });
        },
      }}
    />
  );

  const linkToLogin = (
    <Flex align="center" justify="center" columnGap="sm">
      <Text color="dark">Already have an account?</Text>
      <Text>
        <Link to="/login" style={{ color: themeColorShade }}>
          Login!
        </Link>
      </Text>
    </Flex>
  );

  // const logo = (
  //   <Image
  //     alt="Macaulay Tech Logo"
  //     aria-label="Macaulay Tech Logo"
  //     src="src/assets/macauley-tech-logo.png"
  //     height={50}
  //     width={50}
  //     fit="cover"
  //   />
  // );

  const displayTitle = (
    <Group w="100%" position="apart">
      <Group align="flex-start">
        {/* {logo} */}
        <Title order={1} style={{ letterSpacing: "0.30rem" }}>
          MACAULEY
        </Title>

        <Title pl="md" order={1} style={{ letterSpacing: "0.30rem" }}>
          TECH
        </Title>
      </Group>

      <Text size="lg" color="dark">Dashboard</Text>
    </Group>
  );

  const card = (
    <Center h="62%">
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        className="register-card"
      >
        <Stack>
          <Title order={2}>Register</Title>
          <Text size="sm" color="dimmed">
            to continue to MacAuley Tech Dashboard
          </Text>

          <Stack w="100%" align="center">
            {usernameTextInput}
            {isUsernameExists
              ? <Text color={redColorShade}>Username already exists!</Text>
              : null}
            {emailTextInput}
            {isEmailExists
              ? <Text color={redColorShade}>Email already exists!</Text>
              : null}
            {passwordTextInput}
            {confirmPasswordTextInput}
            {submitButton}
            {linkToLogin}
          </Stack>
        </Stack>
      </Card>
    </Center>
  );

  console.log("Register");
  console.log("registerState", registerState);
  console.groupEnd();

  return (
    <Stack
      p="md"
      h="100vh"
      bg={bgGradient}
    >
      {displayTitle}
      {card}
    </Stack>
  );
}

export default Register;
