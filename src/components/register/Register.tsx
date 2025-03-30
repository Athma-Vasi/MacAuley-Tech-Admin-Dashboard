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
import { HttpServerResponse, UserDocument, UserSchema } from "../../types";
import { fetchSafe, responseToJSONSafe, returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessiblePasswordInput } from "../accessibleInputs/AccessiblePasswordInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import { registerAction } from "./actions";
import { REGISTER_URL } from "./constants";
import { registerReducer } from "./reducers";
import { initialRegisterState } from "./state";

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
    triggerFormSubmit,
    username,
  } = registerState;

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { showBoundary } = useErrorBoundary();

  // const [
  //   openedSubmitFormModal,
  //   { open: openSubmitFormModal, close: closeSubmitFormModal },
  // ] = useDisclosure(false);

  // const [openedErrorModal, { open: openErrorModal, close: closeErrorModal }] =
  //   useDisclosure(false);

  const navigateFn = useNavigate();

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(false);

  useEffect(() => {
    fetchAbortControllerRef.current?.abort("Previous request cancelled");
    fetchAbortControllerRef.current = new AbortController();
    const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    async function handleRegisterFormSubmit() {
      const schema: UserSchema = {
        email,
        password,
        roles: ["Employee"],
        username,
      };

      const url = REGISTER_URL;

      const requestInit: RequestInit = {
        body: JSON.stringify({ schema }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        mode: "cors",
        signal: fetchAbortController.signal,
      };

      registerDispatch({
        action: registerAction.setIsSubmitting,
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

        registerDispatch({
          action: registerAction.setIsSubmitting,
          payload: false,
        });
        registerDispatch({
          action: registerAction.setIsSuccessful,
          payload: true,
        });
        registerDispatch({
          action: registerAction.setIsError,
          payload: false,
        });
        registerDispatch({
          action: registerAction.setErrorMessage,
          payload: "",
        });
        registerDispatch({
          action: registerAction.setTriggerFormSubmit,
          payload: false,
        });

        navigateFn("/dashboard");
      } catch (error: unknown) {
        if (
          !isComponentMounted || fetchAbortController.signal.aborted
        ) {
          return;
        }
        showBoundary(error);
      }
    }

    if (triggerFormSubmit) {
      handleRegisterFormSubmit();
    }

    const timerId = setTimeout(() => {
      fetchAbortController?.abort("Request timed out");
    }, FETCH_REQUEST_TIMEOUT);

    return () => {
      clearTimeout(timerId);
      fetchAbortController?.abort("Component unmounted");
      isComponentMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerFormSubmit]);

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
    isError || triggerFormSubmit;

  console.log("registerState", registerState);

  console.log("isButtonDisabled", isButtonDisabled);

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
        leftIcon: isSubmitting ? <Loader /> : null,
        name: "submit",
        onClick: (_event: React.MouseEvent<HTMLButtonElement>) => {
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

          registerDispatch({
            action: registerAction.setTriggerFormSubmit,
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

  // const submitSuccessModal = (
  //   <NotificationModal
  //     onCloseCallbacks={[closeSubmitFormModal]}
  //     opened={openedSubmitFormModal}
  //     notificationProps={{ isLoading: isSubmitting }}
  //     withCloseButton={false}
  //   />
  // );

  // const errorNotificationModal = (
  //   <NotificationModal
  //     onCloseCallbacks={[closeErrorModal]}
  //     opened={openedErrorModal}
  //     notificationProps={{ isLoading: isError, text: errorMessage }}
  //   />
  // );

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
        w="clamp(300px, 50vw, 500px)"
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

      {/* {submitSuccessModal} */}
      {/* {errorNotificationModal} */}
    </Stack>
  );
}

export default Register;
