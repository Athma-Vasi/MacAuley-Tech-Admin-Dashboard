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

import localforage from "localforage";
import { TbCheck } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../constants";
import { useMountedRef } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { MessageEventLoginWorkerToMain } from "../../workers/fetchParseWorker";
import FetchParseWorker from "../../workers/fetchParseWorker?worker";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { loginAction } from "./actions";
import { handleLoginClick, loginOnmessageCallback } from "./handlers";
import { loginReducer } from "./reducers";
import { initialLoginState } from "./state";

function Login() {
  const [loginState, loginDispatch] = useReducer(
    loginReducer,
    initialLoginState,
  );
  const {
    errorMessage,
    isLoading,
    isSubmitting,
    isSuccessful,
    loginFetchWorker,
    password,
    username,
  } = loginState;

  const { authDispatch } = useAuth();
  const {
    globalState: { themeObject },
    globalDispatch,
  } = useGlobalState();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  const usernameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const isComponentMountedRef = useMountedRef();

  useEffect(() => {
    // (async function wrapper() {
    //   const businessMetrics = await createRandomBusinessMetrics({
    //     daysPerMonth: DAYS_PER_MONTH,
    //     months: MONTHS,
    //     productCategories: PRODUCT_CATEGORIES,
    //     repairCategories: REPAIR_CATEGORIES,
    //     storeLocations: STORE_LOCATIONS.map((location) => location.value),
    //   });

    // })();

    const newFetchParseWorker = new FetchParseWorker();

    loginDispatch({
      action: loginAction.setLoginFetchWorker,
      payload: newFetchParseWorker,
    });

    newFetchParseWorker.onmessage = async (
      event: MessageEventLoginWorkerToMain,
    ) => {
      await loginOnmessageCallback({
        event,
        authDispatch,
        globalDispatch,
        isComponentMountedRef,
        localforage,
        loginDispatch,
        navigate,
        showBoundary,
      });
    };

    return () => {
      newFetchParseWorker.terminate();
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
        loginDispatch({
          action: loginAction.setErrorMessage,
          payload: "",
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
        loginDispatch({
          action: loginAction.setErrorMessage,
          payload: "",
        });
      }}
      required
    />
  );

  const { redColorShade, bgGradient, themeColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const loginButton = (
    <AccessibleButton
      attributes={{
        dataTestId: "login-button",
        kind: "submit",
        leftIcon: isSubmitting
          ? (
            <Loader
              size="xs"
              color={themeObject.colorScheme === "light" ? "white" : ""}
            />
          )
          : isSuccessful
          ? (
            <TbCheck
              color={themeObject.colorScheme === "light" ? "white" : ""}
            />
          )
          : null,
        name: "login",
        onClick: (
          event:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.PointerEvent<HTMLButtonElement>,
        ) => {
          event.preventDefault();

          handleLoginClick({
            loginState,
            loginDispatch,
            loginFetchWorker,
            schema: { username, password },
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
      <Text>Don&apos;t have an account?</Text>
      <Text>
        <Link
          to="/register"
          style={{ color: themeColorShade }}
          data-testid="register-link"
        >
          Create one!
        </Link>
      </Text>
    </Flex>
  );

  const errorMessageElem = errorMessage
    ? (
      <Text
        color={redColorShade}
        data-testid="login-error-message"
        truncate
        w="100%"
        pl="md"
      >
        Invalid credentials
      </Text>
    )
    : null;

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

      {errorMessageElem}

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
