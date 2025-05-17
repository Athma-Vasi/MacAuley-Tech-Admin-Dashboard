import {
  Box,
  Card,
  Flex,
  Group,
  Loader,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { TbCheck } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_URL, COLORS_SWATCHES } from "../../constants";
import { useMountedRef } from "../../hooks";
import { useGlobalState } from "../../hooks/useGlobalState";
import { FormReview, UserSchema } from "../../types";
import { returnThemeColors } from "../../utils";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import FetchParseWorker from "../../workers/fetchParseWorker?worker";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleTextInput } from "../accessibleInputs/AccessibleTextInput";
import { AccessibleImageInput } from "../accessibleInputs/image";
import { MAX_IMAGES } from "../accessibleInputs/image/constants";
import { registerAction } from "./actions";
import { MAX_REGISTER_STEPS, REGISTER_STEPS, REGISTER_URL } from "./constants";
import {
  handleCheckEmail,
  handleCheckUsername,
  handleMessageEventCheckEmailWorkerToMain,
  handleMessageEventCheckUsernameWorkerToMain,
  handleMessageEventRegisterFetchWorkerToMain,
  handlePrevNextStepClick,
  handleRegisterButtonSubmit,
} from "./handlers";
import { registerReducer } from "./reducers";
import { RegisterAddress } from "./RegisterAddress";
import { RegisterAuthentication } from "./RegisterAuthentication";
import { RegisterPersonal } from "./RegisterPersonal";
import { initialRegisterState } from "./state";
import { StepperFormReview } from "./StepperFormReview";
import {
  createFileSectionInFormReview,
  returnIsRegisterSubmitButtonDisabled,
  returnRegisterStepperCard,
} from "./utils";

function Register() {
  const [registerState, registerDispatch] = useReducer(
    registerReducer,
    initialRegisterState,
  );

  const {
    activeStep,
    addressLine,
    checkEmailWorker,
    checkUsernameWorker,
    city,
    confirmPassword,
    country,
    department,
    email,
    errorMessage,
    filesInError,
    firstName,
    formData,
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
    registerWorker,
    state,
    stepsInError,
    stepsWithEmptyInputs,
    storeLocation,
    username,
  } = registerState;

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { showBoundary } = useErrorBoundary();
  const isComponentMountedRef = useMountedRef();
  const navigate = useNavigate();

  useEffect(() => {
    const newRegisterWorker = new FetchParseWorker();
    registerDispatch({
      action: registerAction.setRegisterWorker,
      payload: newRegisterWorker,
    });
    newRegisterWorker.onmessage = async (
      event: MessageEventFetchWorkerToMain<boolean>,
    ) => {
      await handleMessageEventRegisterFetchWorkerToMain({
        event,
        isComponentMountedRef,
        navigate,
        registerDispatch,
        showBoundary,
        toLocation: "/login",
      });
    };

    const newCheckUsernameWorker = new FetchParseWorker();
    registerDispatch({
      action: registerAction.setCheckUsernameWorker,
      payload: newCheckUsernameWorker,
    });
    newCheckUsernameWorker.onmessage = async (
      event: MessageEventFetchWorkerToMain<boolean>,
    ) => {
      await handleMessageEventCheckUsernameWorkerToMain({
        event,
        isComponentMountedRef,
        registerDispatch,
        showBoundary,
      });
    };

    const newCheckEmailWorker = new FetchParseWorker();
    registerDispatch({
      action: registerAction.setCheckEmailWorker,
      payload: newCheckEmailWorker,
    });
    newCheckEmailWorker.onmessage = async (
      event: MessageEventFetchWorkerToMain<boolean>,
    ) => {
      await handleMessageEventCheckEmailWorkerToMain({
        event,
        isComponentMountedRef,
        registerDispatch,
        showBoundary,
      });
    };

    return () => {
      isComponentMountedRef.current = false;
      newCheckUsernameWorker.terminate();
      newCheckEmailWorker.terminate();
      newRegisterWorker.terminate();
    };
  }, []);

  useEffect(() => {
    handleCheckUsername({
      checkUsernameWorker,
      registerDispatch,
      url: AUTH_URL,
      username,
    });
  }, [username]);

  useEffect(() => {
    handleCheckEmail({
      checkEmailWorker,
      registerDispatch,
      url: AUTH_URL,
      email,
    });
  }, [email]);

  console.log("registerState", registerState);

  const {
    bgGradient,
    cardBgGradient,
    redColorShade,
    grayColorShade,
    themeColorShade,
    textColor,
  } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const nextStepButton = (
    <AccessibleButton
      attributes={{
        dataTestId: "next-step-button",
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
        dataTestId: "prev-step-button",
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

  const isSubmitButtonDisabled = returnIsRegisterSubmitButtonDisabled({
    confirmPassword,
    email,
    filesInError,
    inputsInError,
    isEmailExists,
    isEmailExistsSubmitting,
    isError,
    isSubmitting,
    isUsernameExists,
    isUsernameExistsSubmitting,
    password,
    stepsInError,
    username,
  });

  const submitButton = (
    <AccessibleButton
      attributes={{
        dataTestId: `register-submit-button-${
          isSubmitButtonDisabled ? "disabled" : "enabled"
        }`,
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

          const schema: UserSchema = {
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
            parentOrgId: 76,
            postalCodeCanada,
            postalCodeUS,
            profilePictureUrl,
            province,
            state,
            storeLocation,
            roles: ["Employee"],
          };

          formData.append(
            "schema",
            JSON.stringify({ schema }),
          );

          await handleRegisterButtonSubmit({
            formData,
            registerDispatch,
            registerWorker,
            url: REGISTER_URL,
          });
        },
      }}
    />
  );

  const linkToLogin = (
    <Flex align="center" justify="center" columnGap="sm">
      <Text>Already have an account?</Text>
      <Text>
        <Link
          to="/login"
          style={{ color: themeColorShade }}
          data-testid="login-link"
        >
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
    "File": {
      profilePictureUrl,
      ...createFileSectionInFormReview(filesInError),
    },
  };

  const reviewStep = (
    <StepperFormReview
      filesInError={filesInError}
      formReview={registerFormReview}
      inputsInError={inputsInError}
      stepsInError={stepsInError}
    />
  );

  const profilePictureUrlTextInput = (
    <AccessibleTextInput
      attributes={{
        disabled: filesInError.size > 0,
        invalidValueAction: registerAction.setIsError,
        name: "profilePictureUrl",
        parentDispatch: registerDispatch,
        validValueAction: registerAction.setProfilePictureUrl,
        value: profilePictureUrl,
      }}
    />
  );

  const isMaxFilesReached = Object.keys(Object.fromEntries(formData)).length ===
    MAX_IMAGES;
  const isProfilePictureUrlNotEmpty = profilePictureUrl.length > 0;

  const filesSection = (
    <Stack w="100%" align="center">
      {profilePictureUrlTextInput}
      <Text size="xl">or</Text>
      <AccessibleImageInput
        attributes={{
          disabled: isMaxFilesReached ||
            isProfilePictureUrlNotEmpty,
          disabledScreenreaderText: isMaxFilesReached
            ? "You have reached the maximum number of files"
            : isProfilePictureUrlNotEmpty
            ? "You have already provided a profile picture URL"
            : "",
          invalidValueAction: registerAction.setFilesInError,
          maxImagesAmount: 1,
          parentDispatch: registerDispatch,
          storageKey: "profilePicture",
          validValueAction: registerAction.setFormData,
        }}
      />
    </Stack>
  );

  const registerStep = activeStep === 0
    ? (
      <RegisterAuthentication
        confirmPassword={confirmPassword}
        email={email}
        isEmailExists={isEmailExists}
        isEmailExistsSubmitting={isEmailExistsSubmitting}
        isUsernameExists={isUsernameExists}
        isUsernameExistsSubmitting={isUsernameExistsSubmitting}
        password={password}
        registerDispatch={registerDispatch}
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
        registerAction={registerAction}
        registerDispatch={registerDispatch}
        storeLocation={storeLocation}
      />
    )
    : activeStep === 2
    ? (
      <RegisterAddress
        addressLine={addressLine}
        city={city}
        country={country}
        registerAction={registerAction}
        registerDispatch={registerDispatch}
        postalCodeCanada={postalCodeCanada}
        postalCodeUS={postalCodeUS}
        province={province}
        state={state}
      />
    )
    : activeStep === 3
    ? filesSection
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
