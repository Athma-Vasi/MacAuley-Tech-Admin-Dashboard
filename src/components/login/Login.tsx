import {
  Box,
  Card,
  Center,
  Flex,
  Group,
  Loader,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Link, useNavigate } from "react-router-dom";

import { TbCheck } from "react-icons/tb";
import {
  COLORS_SWATCHES,
  FETCH_REQUEST_TIMEOUT,
  LOGIN_URL,
} from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { loginAction } from "./actions";
import { loginReducer } from "./reducers";
import { initialLoginState } from "./state";
import { handleLoginButtonClick } from "./handlers";

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
    // (async function wrapper() {
    //   const businessMetrics = await createRandomBusinessMetrics({
    //     daysPerMonth: DAYS_PER_MONTH,
    //     months: MONTHS,
    //     productCategories: PRODUCT_CATEGORIES,
    //     repairCategories: REPAIR_CATEGORIES,
    //     storeLocations: STORE_LOCATIONS.map((location) => location.value),
    //   });

    //   console.log("Business Metrics: ", businessMetrics);
    // })();

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
      className="accessible-input"
      label="Username"
      placeholder="Enter your username"
      value={username}
      onChange={(event) => {
        loginDispatch({
          action: loginAction.setUsername,
          payload: event.currentTarget.value,
        });
      }}
      ref={usernameRef}
      required
    />
  );

  const passwordTextInput = (
    <PasswordInput
      className="accessible-input"
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
    />
  );

  const { bgGradient, themeColorShade, grayColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const loginButton = (
    <AccessibleButton
      attributes={{
        kind: "submit",
        leftIcon: isSubmitting
          ? <Loader size="xs" color="white" />
          : isSuccessful
          ? <TbCheck color="white" />
          : null,
        name: "login",
        onClick: async (
          event:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.PointerEvent<HTMLButtonElement>,
        ) => {
          event.preventDefault();

          if (isLoading || isSubmitting || isSuccessful) {
            return;
          }

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
        style: {
          cursor: isLoading || isSubmitting || isSuccessful
            ? "not-allowed"
            : "pointer",
        },
      }}
    />
  );

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
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      className="login-card"
    >
      <Title order={2}>Sign in</Title>
      <Text size="sm" color="dimmed">
        to continue to MacAuley Tech Dashboard
      </Text>

      {displayInputs}

      <Group w="100%" position="center">{displayLoginButton}</Group>
      <Group w="100%" position="center">{displayLinkToRegister}</Group>
    </Card>
  );

  const login = (
    <Box
      bg={bgGradient}
      className="login-container"
    >
      {displayTitle}
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      {card}
    </Box>
  );

  return login;
}

export default Login;
