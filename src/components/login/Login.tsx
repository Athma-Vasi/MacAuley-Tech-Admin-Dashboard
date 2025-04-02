import {
  Card,
  Center,
  Flex,
  Group,
  Image,
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
} from "../../constants";
import { authAction } from "../../context/authProvider";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import type { HttpServerResponse, UserDocument } from "../../types";
import {
  decodeJWTSafe,
  fetchSafe,
  responseToJSONSafe,
  returnThemeColors,
} from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { loginAction } from "./actions";
import { LOGIN_URL } from "./constants";
import { loginReducer } from "./reducers";
import { initialLoginState } from "./state";

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
    triggerFormSubmit,
    username,
  } = loginState;

  const { authDispatch } = useAuth();
  const {
    globalState: { themeObject },
  } = useGlobalState();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  // const [
  //   openedSubmitFormModal,
  //   {
  //     open: openSubmitFormModal,
  //     close: closeSubmitFormModal,
  //   },
  // ] = useDisclosure(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(false);

  useEffect(() => {
    fetchAbortControllerRef.current?.abort("Previous request cancelled");
    fetchAbortControllerRef.current = new AbortController();
    const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    async function loginFormSubmit() {
      const schema = { username, password };

      const url = LOGIN_URL;

      const requestInit: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ schema }),
        signal: fetchAbortController.signal,
      };

      loginDispatch({
        action: loginAction.setIsSubmitting,
        payload: true,
      });

      try {
        const responseResult = await fetchSafe(url, requestInit);

        if (!isComponentMounted) {
          return;
        }

        if (responseResult.err) {
          showBoundary(responseResult.val.data);
          return;
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
          showBoundary(new Error("No data returned from server"));
          return;
        }

        const jsonResult = await responseToJSONSafe<
          HttpServerResponse<UserDocument>
        >(
          responseUnwrapped,
        );

        if (!isComponentMounted) {
          return;
        }

        if (jsonResult.err) {
          showBoundary(jsonResult.val.data);
          return;
        }

        const serverResponse = jsonResult.safeUnwrap().data;

        if (serverResponse === undefined) {
          showBoundary(new Error("No data returned from server"));
          return;
        }

        const { accessToken } = serverResponse;

        const decodedTokenResult = await decodeJWTSafe(accessToken);

        if (!isComponentMounted) {
          return;
        }

        if (decodedTokenResult.err) {
          showBoundary(decodedTokenResult.val.data);
          return;
        }

        const decodedToken = decodedTokenResult.safeUnwrap().data;
        if (decodedToken === undefined) {
          showBoundary(new Error("Invalid token"));
          return;
        }

        authDispatch({
          action: authAction.setAccessToken,
          payload: accessToken,
        });
        authDispatch({
          action: authAction.setDecodedToken,
          payload: decodedToken,
        });
        authDispatch({
          action: authAction.setIsLoggedIn,
          payload: true,
        });
        authDispatch({
          action: authAction.setUserDocument,
          payload: serverResponse.data[0],
        });

        loginDispatch({
          action: loginAction.setIsSubmitting,
          payload: false,
        });
        loginDispatch({
          action: loginAction.setIsSuccessful,
          payload: true,
        });
        loginDispatch({
          action: loginAction.setTriggerFormSubmit,
          payload: false,
        });

        navigate("/dashboard/customers");
      } catch (error: unknown) {
        if (
          !isComponentMounted || fetchAbortController?.signal.aborted
        ) {
          return;
        }
        showBoundary(error);
      }
    }

    if (triggerFormSubmit) {
      loginFormSubmit();
    }

    const timerId = setTimeout(() => {
      fetchAbortController?.abort("Request timed out");
    }, FETCH_REQUEST_TIMEOUT);

    return () => {
      clearTimeout(timerId);
      fetchAbortController?.abort("Component unmounted");
      isComponentMountedRef.current = false;
    };
  }, [triggerFormSubmit]);

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
        name: "login",
        onClick: () => {
          loginDispatch({
            action: loginAction.setTriggerFormSubmit,
            payload: true,
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

  // const displaySubmitSuccessNotificationModal = (
  //   <NotificationModal
  //     onCloseCallbacks={[closeSubmitFormModal]}
  //     opened={openedSubmitFormModal}
  //     notificationProps={{
  //       isLoading: isSubmitting,
  //       text: "Login successful!",
  //     }}
  //     title={<Title order={4}>Submitting ...</Title>}
  //     withCloseButton={false}
  //   />
  // );

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
      {/* {displaySubmitSuccessNotificationModal} */}
      {displayTitle}
      {card}
    </Stack>
  );

  return login;
}

export default Login;
