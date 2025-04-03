import {
  Card,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { Link, useNavigate } from "react-router-dom";
import { COLORS_SWATCHES, FETCH_REQUEST_TIMEOUT } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessiblePasswordInput } from "../accessibleInputs/AccessiblePasswordInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import { registerAction } from "./actions";
import { REGISTER_URL } from "./constants";
import { registerReducer } from "./reducers";
import { initialRegisterState } from "./state";
import { handleRegisterButtonClick } from "./utils";

function Register() {
  const [registerState, registerDispatch] = useReducer(
    registerReducer,
    initialRegisterState,
  );

  const {
    confirmPassword,
    email,
    errorMessage,
    isError,
    isSubmitting,
    isSuccessful,
    password,
    username,
  } = registerState;

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { showBoundary } = useErrorBoundary();

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

  const usernameTextInput = (
    <AccessibleTextInput
      attributes={{
        invalidValueAction: registerAction.setIsError,
        name: "username",
        parentDispatch: registerDispatch,
        validValueAction: registerAction.setUsername,
        value: username,
      }}
    />
  );

  const emailTextInput = (
    <AccessibleTextInput
      attributes={{
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

  const isButtonDisabled = !username || !email || !password ||
    !confirmPassword ||
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
        leftIcon: isSubmitting ? <Loader size="xs" /> : null,
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

  const {
    themeColorShade,
  } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

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

  const logo = (
    <Image
      alt="Macaulay Tech Logo"
      aria-label="Macaulay Tech Logo"
      src="src/assets/macauley-tech-logo.png"
      height={50}
      width={50}
      fit="cover"
    />
  );

  const displayTitle = (
    <Group w="100%" position="apart">
      <Group align="flex-start">
        {logo}
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
        w="clamp(300px, 400px, 500px)"
      >
        <Stack>
          <Title order={2}>Register</Title>
          <Text size="sm" color="dimmed">
            to continue to MacAuley Tech Dashboard
          </Text>

          <Stack w="100%" align="center">
            {usernameTextInput}
            {emailTextInput}
            {passwordTextInput}
            {confirmPasswordTextInput}
            {submitButton}
            {linkToLogin}
          </Stack>
        </Stack>
      </Card>
    </Center>
  );

  return (
    <Stack
      p="md"
      bg="white"
      h="100vh"
    >
      {displayTitle}
      {card}
    </Stack>
  );
}

export default Register;
