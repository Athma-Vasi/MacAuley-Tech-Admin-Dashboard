import { Flex, Stack, Text } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { Link, useNavigate } from "react-router-dom";
import { COLORS_SWATCHES, FETCH_REQUEST_TIMEOUT } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessiblePasswordInput } from "../accessibleInputs/AccessiblePasswordInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import { registerAction } from "./actions";
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

  const {
    authState,
    authDispatch,
  } = useAuth();

  const {
    accessToken,
    decodedToken,
  } = authState;

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
      if (!decodedToken) {
        return;
      }

      const {
        // userInfo: { userId, username: authUsername, roles },
        sessionId,
      } = decodedToken;

      // const userSchema: UserSchema = {
      //   active: true,
      //   address: country === "Canada"
      //     ? {
      //       addressLine,
      //       city,
      //       country,
      //       postalCode,
      //       province,
      //     }
      //     : {
      //       addressLine,
      //       city,
      //       country,
      //       postalCode,
      //       state,
      //     },
      //   completedSurveys: [],
      //   contactNumber,
      //   dateOfBirth,
      //   department,
      //   email,
      //   emergencyContact: {
      //     contactNumber: emergencyContactNumber,
      //     fullName: emergencyContactName,
      //   },
      //   firstName,
      //   isPrefersReducedMotion: false,
      //   jobPosition,
      //   lastName,
      //   middleName,
      //   password,
      //   preferredName,
      //   preferredPronouns,
      //   profilePictureUrl,
      //   roles: ["Employee"],
      //   startDate,
      //   storeLocation,
      //   username,
      // };

      try {
        // const registerResult = await fetchRequestPOSTSafe({
        //   accessToken,
        //   authAction,
        //   authDispatch,
        //   closeSubmitFormModal,
        //   dispatch: registerDispatch,
        //   fetchAbortController,
        //   isComponentMounted,
        //   isSubmittingAction: registerAction.setIsSubmitting,
        //   isSuccessfulAction: registerAction.setIsSuccessful,
        //   navigateFn,
        //   openSubmitFormModal,
        //   requestBody: JSON.stringify({ schema: userSchema }),
        //   roles: ["Employee"],
        //   triggerFormSubmitAction: registerAction.setTriggerFormSubmit,
        // });

        // if (registerResult.err) {
        //   showBoundary(registerResult.val.data);
        //   return;
        // }

        // const unwrappedResult = registerResult.safeUnwrap();

        // if (unwrappedResult.kind === "error") {
        //   registerDispatch({
        //     action: registerAction.setIsError,
        //     payload: true,
        //   });
        //   registerDispatch({
        //     action: registerAction.setErrorMessage,
        //     payload: unwrappedResult.message ?? "Unknown error occurred",
        //   });

        //   openErrorModal();
        //   return;
        // }

        // const serverResponse = unwrappedResult.data;
        // if (serverResponse === undefined) {
        //   registerDispatch({
        //     action: registerAction.setIsError,
        //     payload: true,
        //   });
        //   registerDispatch({
        //     action: registerAction.setErrorMessage,
        //     payload: "Network error",
        //   });

        //   openErrorModal();
        //   return;
        // }
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

  const submitButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "All inputs are valid. Click to Register.",
        disabledScreenreaderText: "Please fix errors before registering.",
        disabled: !username || !email || !password ||
          !confirmPassword ||
          isError || triggerFormSubmit,
        kind: "submit",
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

  return (
    <Stack>
      {usernameTextInput}
      {emailTextInput}
      {passwordTextInput}
      {confirmPasswordTextInput}
      {submitButton}
      {linkToLogin}
    </Stack>
  );
}

export default Register;
