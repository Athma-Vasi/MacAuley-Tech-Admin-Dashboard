import {
  Card,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Link, useNavigate } from "react-router-dom";

import {
  COLORS_SWATCHES,
  FETCH_REQUEST_TIMEOUT,
  INPUT_WIDTH,
  LOGIN_URL,
} from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { loginAction } from "./actions";
import { loginReducer } from "./reducers";
import { initialLoginState } from "./state";
import { handleLoginButtonClick } from "./utils";

function Login() {
  const [loginState, loginDispatch] = useReducer(
    loginReducer,
    initialLoginState,
  );
  const {
    isLoading,
    isSubmitting,
    isSuccessful,
    password,
    username,
  } = loginState;

  const { authDispatch } = useAuth();
  const {
    globalState: { themeObject },
    globalDispatch,
  } = useGlobalState();
  const navigateFn = useNavigate();
  const { showBoundary } = useErrorBoundary();

  const usernameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

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
    <TextInput
      label="Username"
      placeholder="Enter your username"
      value={username}
      onChange={(event) => {
        loginDispatch({
          action: loginAction.setUsername,
          payload: event.currentTarget.value,
        });
      }}
      required
      w={INPUT_WIDTH}
    />
  );

  const passwordTextInput = (
    <PasswordInput
      label="Password"
      placeholder="Enter your password"
      value={password}
      onChange={(event) => {
        loginDispatch({
          action: loginAction.setPassword,
          payload: event.currentTarget.value,
        });
      }}
      required
      w={INPUT_WIDTH}
    />
  );

  const loginButton = (
    <AccessibleButton
      attributes={{
        kind: "submit",
        leftIcon: isSubmitting ? <Loader size="xs" /> : null,
        name: "login",
        onClick: async (
          event:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.PointerEvent<HTMLButtonElement>,
        ) => {
          event.preventDefault();

          await handleLoginButtonClick({
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            loginDispatch,
            navigateFn,
            navigateTo: "/dashboard/financials",
            schema: { username, password },
            showBoundary,
            url: LOGIN_URL,
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

  const displayInputs = (
    <Stack align="center" w="100%">
      {usernameTextInput}
      {passwordTextInput}
    </Stack>
  );

  const displayLoginButton = (
    <Center>
      {loginButton}
    </Center>
  );

  const displayLinkToRegister = (
    <Flex align="center" justify="center" columnGap="sm">
      <Text color="dark">Don&apos;t have an account?</Text>
      <Text>
        <Link to="/register" style={{ color: themeColorShade }}>
          Create one!
        </Link>
      </Text>
    </Flex>
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
          <Title order={2}>Sign in</Title>
          <Text size="sm" color="dimmed">
            to continue to MacAuley Tech Dashboard
          </Text>

          {displayInputs}
          {displayLoginButton}
          {displayLinkToRegister}
        </Stack>
      </Card>
    </Center>
  );

  const login = (
    <Stack
      bg="white"
      h="100vh"
      p="md"
      w="100%"
    >
      {displayTitle}
      {card}
    </Stack>
  );

  return login;
}

export default Login;
