import {
  Box,
  Card,
  Flex,
  Group,
  Loader,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { TbCheck } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { COLORS_SWATCHES, FETCH_REQUEST_TIMEOUT } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { FormReview } from "../../types";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { registerAction } from "./actions";
import { MAX_REGISTER_STEPS, REGISTER_STEPS, REGISTER_URL } from "./constants";
import { handlePrevNextStepClick, handleRegisterButtonClick } from "./handlers";
import { registerReducer } from "./reducers";
import { RegisterAddress } from "./RegisterAddress";
import { RegisterAuthentication } from "./RegisterAuthentication";
import { RegisterPersonal } from "./RegisterPersonal";
import { initialRegisterState } from "./state";
import { StepperFormReview } from "./StepperFormReview";
import { returnRegisterStepperCard } from "./utils";

function Register() {
  const [registerState, registerDispatch] = useReducer(
    registerReducer,
    initialRegisterState,
  );

  const {
    activeStep,
    addressLine,
    city,
    confirmPassword,
    country,
    department,
    email,
    errorMessage,
    firstName,
    inputsInError,
    isEmailExists,
    isEmailExistsSubmitting,
    isError,
    isSubmitting,
    isSuccessful,
    isUsernameExists,
    isUsernameExistsSubmitting,
    jobPosition,
    lastName,
    password,
    postalCodeCanada,
    postalCodeUS,
    profilePictureUrl,
    province,
    state,
    stepsInError,
    stepsWithEmptyInputs,
    storeLocation,
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

  const {
    bgGradient,
    cardBgGradient,
    redColorShade,
    grayColorShade,
    greenColorShade,
    themeColorShade,
    textColor,
  } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const nextStepButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: `Click to proceed to ${
          REGISTER_STEPS[activeStep + 1]
        }`,
        disabled: activeStep + 1 === MAX_REGISTER_STEPS,
        disabledScreenreaderText: activeStep === MAX_REGISTER_STEPS
          ? "You are at the last step"
          : "",
        kind: "next",
        onClick: async (_event: React.MouseEvent<HTMLButtonElement>) => {
          handlePrevNextStepClick({
            activeStep,
            kind: "next",
            registerDispatch,
            registerState,
          });
        },
      }}
    />
  );

  const prevStepButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: `Click to go back to ${
          REGISTER_STEPS[activeStep - 1]
        }`,
        disabled: activeStep === 0,
        disabledScreenreaderText: activeStep === 0
          ? "You are at the first step"
          : "",
        kind: "previous",
        onClick: async (_event: React.MouseEvent<HTMLButtonElement>) => {
          handlePrevNextStepClick({
            activeStep,
            kind: "previous",
            registerDispatch,
            registerState,
          });
        },
      }}
    />
  );

  const isSubmitButtonDisabled = !username || !email || !password ||
    !confirmPassword || isUsernameExists || isEmailExists ||
    isError || stepsInError.size > 0 || inputsInError.size > 0;

  const submitButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "All inputs are valid. Click to Register.",
        disabledScreenreaderText: !username || !email || !password ||
            !confirmPassword
          ? "Fields cannot be empty"
          : "Please fix errors before registering.",
        disabled: isSubmitButtonDisabled,
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

          const randomNum = () => Math.floor(Math.random() * 10);

          const randomOrgId =
            `${randomNum()}${randomNum()}${randomNum()}${randomNum()}${randomNum()}${randomNum()}${randomNum()}`;

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
              addressLine,
              city,
              country,
              department,
              firstName,
              jobPosition,
              lastName,
              orgId: parseInt(randomOrgId),
              parentOrgId: 1,
              postalCodeCanada,
              postalCodeUS,
              profilePictureUrl,
              province,
              state,
              storeLocation,
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

  const formHeader = (
    <section className="register-form-header">
      {prevStepButton}
      {activeStep + 1 === MAX_REGISTER_STEPS ? submitButton : nextStepButton}
    </section>
  );

  const formFooter = (
    <section className="register-form-footer">
      {linkToLogin}
    </section>
  );

  const registerFormReview: FormReview = {
    "Authentication": {
      username,
      email,
      password,
      confirmPassword,
    },
    "Personal": {
      firstName,
      lastName,
      profilePictureUrl,
      jobPosition,
      department,
      storeLocation,
    },
    "Address": country === "Canada"
      ? {
        addressLine,
        city,
        province,
        country,
        postalCodeCanada,
      }
      : {
        addressLine,
        city,
        state,
        country,
        postalCodeUS,
      },
  };

  const reviewStep = (
    <StepperFormReview
      formReview={registerFormReview}
      inputsInError={inputsInError}
      stepsInError={stepsInError}
    />
  );

  const registerStep = activeStep === 0
    ? (
      <RegisterAuthentication
        confirmPassword={confirmPassword}
        email={email}
        fetchAbortControllerRef={fetchAbortControllerRef}
        isComponentMountedRef={isComponentMountedRef}
        isEmailExists={isEmailExists}
        isEmailExistsSubmitting={isEmailExistsSubmitting}
        isError={isError}
        isUsernameExists={isUsernameExists}
        isUsernameExistsSubmitting={isUsernameExistsSubmitting}
        password={password}
        registerDispatch={registerDispatch}
        showBoundary={showBoundary}
        username={username}
      />
    )
    : activeStep === 1
    ? (
      <RegisterPersonal
        department={department}
        firstName={firstName}
        jobPosition={jobPosition}
        lastName={lastName}
        parentAction={registerAction}
        parentDispatch={registerDispatch}
        profilePictureUrl={profilePictureUrl}
        storeLocation={storeLocation}
      />
    )
    : activeStep === 2
    ? (
      <RegisterAddress
        addressLine={addressLine}
        city={city}
        country={country}
        parentAction={registerAction}
        parentDispatch={registerDispatch}
        postalCodeCanada={postalCodeCanada}
        postalCodeUS={postalCodeUS}
        province={province}
        state={state}
      />
    )
    : reviewStep;

  const stepperCard = returnRegisterStepperCard({
    activeStep,
    cardBgGradient,
    grayColorShade,
    redColorShade,
    stepsInError,
    stepsWithEmptyInputs,
    textColor,
    themeColorShade,
  });

  const registerCard = (
    <Card shadow="sm" p="lg" radius="md" withBorder className="register-card">
      {stepperCard}
      <div className="register-form-container">
        {formHeader}
        {registerStep}
        {formFooter}
      </div>
    </Card>
  );

  console.log("Register");
  console.log("registerState", registerState);
  console.groupEnd();

  return (
    <Box
      className="register-container"
      bg={bgGradient}
    >
      {displayTitle}
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      {registerCard}
    </Box>
  );
}

export default Register;
