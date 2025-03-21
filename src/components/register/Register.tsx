import { Flex, Stack, Text } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import { COLORS_SWATCHES, FETCH_REQUEST_TIMEOUT } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import type { UserSchema } from "../../types";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleStepper } from "../accessibleInputs/AccessibleStepper";
// import { NotificationModal } from "../notificationModal";
import { RegisterAdditional } from "./RegisterAdditional";
import { RegisterAddress } from "./RegisterAddress";
import { RegisterAuthentication } from "./RegisterAuthentication";
import { RegisterPersonal } from "./RegisterPersonal";
import { registerAction } from "./actions";
import { returnRegisterperPages } from "./constants";
import { registerReducer } from "./reducers";
import { initialRegisterState } from "./state";

function Register() {
  const [registerState, registerDispatch] = useReducer(
    registerReducer,
    initialRegisterState,
  );

  const {
    addressLine,
    city,
    confirmPassword,
    contactNumber,
    country,
    dateOfBirth,
    department,
    email,
    emergencyContactName,
    emergencyContactNumber,
    errorMessage,
    firstName,
    isError,
    isSubmitting,
    isSuccessful,
    jobPosition,
    lastName,
    middleName,
    pagesInError,
    password,
    postalCode,
    preferredName,
    preferredPronouns,
    profilePictureUrl,
    province,
    startDate,
    state,
    storeLocation,
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

      const userSchema: UserSchema = {
        active: true,
        address: country === "Canada"
          ? {
            addressLine,
            city,
            country,
            postalCode,
            province,
          }
          : {
            addressLine,
            city,
            country,
            postalCode,
            state,
          },
        completedSurveys: [],
        contactNumber,
        dateOfBirth,
        department,
        email,
        emergencyContact: {
          contactNumber: emergencyContactNumber,
          fullName: emergencyContactName,
        },
        firstName,
        isPrefersReducedMotion: false,
        jobPosition,
        lastName,
        middleName,
        password,
        preferredName,
        preferredPronouns,
        profilePictureUrl,
        roles: ["Employee"],
        startDate,
        storeLocation,
        username,
      };

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
        if (!isComponentMounted || fetchAbortController.signal.aborted) {
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

  const registerStepperPages = returnRegisterperPages(country);

  const authenticationPage = (
    <RegisterAuthentication
      confirmPassword={confirmPassword}
      email={email}
      parentAction={registerAction}
      parentDispatch={registerDispatch}
      password={password}
      stepperPages={registerStepperPages}
      username={username}
    />
  );

  const personalPage = (
    <RegisterPersonal
      dateOfBirth={dateOfBirth}
      firstName={firstName}
      middleName={middleName}
      lastName={lastName}
      parentAction={registerAction}
      parentDispatch={registerDispatch}
      preferredName={preferredName}
      preferredPronouns={preferredPronouns}
      profilePictureUrl={profilePictureUrl}
      stepperPages={registerStepperPages}
    />
  );

  const addressPage = (
    <RegisterAddress
      addressLine={addressLine}
      city={city}
      contactNumber={contactNumber}
      country={country}
      parentAction={registerAction}
      parentDispatch={registerDispatch}
      postalCode={postalCode}
      province={province}
      state={state}
      stepperPages={registerStepperPages}
    />
  );

  const additionalPage = (
    <RegisterAdditional
      department={department}
      emergencyContactName={emergencyContactName}
      emergencyContactNumber={emergencyContactNumber}
      jobPosition={jobPosition}
      parentAction={registerAction}
      parentDispatch={registerDispatch}
      startDate={startDate}
      stepperPages={registerStepperPages}
      storeLocation={storeLocation}
    />
  );

  const submitButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "All inputs are valid. Click to Register.",
        disabledScreenreaderText: "Please fix errors before registering.",
        disabled: pagesInError.size > 0 || triggerFormSubmit,
        kind: "submit",
        name: "submit",
        onClick: (_event: React.MouseEvent<HTMLButtonElement>) => {
          registerDispatch({
            action: registerAction.setTriggerFormSubmit,
            payload: true,
          });
        },
      }}
    />
  );

  const stepper = (
    <AccessibleStepper
      attributes={{
        componentState: registerState,
        invalidValueAction: registerAction.setPageInError,
        pageElements: [
          authenticationPage,
          personalPage,
          addressPage,
          additionalPage,
        ],
        parentDispatch: registerDispatch,
        stepperPages: registerStepperPages,
        stepsInError: pagesInError,
        submitButton,
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
        <Link to="/" style={{ color: themeColorShade }}>
          Login!
        </Link>
      </Text>
    </Flex>
  );

  return (
    <Stack>
      {stepper}
      {linkToLogin}
    </Stack>
  );
}

export default Register;

/**
 * const {
    email,
    isValidEmail,
    isEmailFocused,
    isEmailExists,

    username,
    isValidUsername,
    isUsernameFocused,
    isUsernameExists,

    password,
    isValidPassword,
    isPasswordFocused,

    confirmPassword,
    isValidConfirmPassword,
    isConfirmPasswordFocused,

    firstName,
    isValidFirstName,
    isFirstNameFocused,

    middleName,
    isValidMiddleName,
    isMiddleNameFocused,

    lastName,
    isValidLastName,
    isLastNameFocused,

    preferredName,
    isValidPreferredName,
    isPreferredNameFocused,

    preferredPronouns,
    profilePictureUrl,
    isValidProfilePictureUrl,
    isProfilePictureUrlFocused,

    dateOfBirth,
    isValidDateOfBirth,
    isDateOfBirthFocused,

    address,
    contactNumber,
    isValidContactNumber,
    isContactNumberFocused,

    jobPosition,
    department,
    storeLocation,
    emergencyContact,

    startDate,
    isValidStartDate,
    isStartDateFocused,

    triggerFormSubmit,
    currentStepperPosition,
    pagesInError,

    isSuccessful,
    successMessage,
    isSubmitting,
    submitMessage,
  } = registerState;
  const {
    addressLine,
    isValidAddressLine,
    isAddressLineFocused,
    city,
    isValidCity,
    isCityFocused,
    province,
    state,
    country,
    postalCode,
    isValidPostalCode,
    isPostalCodeFocused,
  } = address;
  const {
    fullName,
    isValidFullName,
    isFullNameFocused,
    phoneNumber,
    isValidPhoneNumber,
    isPhoneNumberFocused,
  } = emergencyContact;

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let isMounted = true;
    // before submitting form, abort any previous requests
    abortControllerRef.current?.abort();
    // create new abort controller for current request
    abortControllerRef.current = new AbortController();

    async function handleRegisterFormSubmit() {
      registerDispatch({
        type: registerAction.setIsSubmitting,
        payload: true,
      });
      openSubmitSuccessNotificationModal();

      const newUserObj: UserSchema = {
        email,
        username,
        password,
        firstName,
        middleName,
        lastName,
        preferredName,
        preferredPronouns,
        profilePictureUrl,
        dateOfBirth,
        contactNumber,
        address: { addressLine, city, province, state, postalCode, country },
        jobPosition,
        department,
        storeLocation,
        emergencyContact: { fullName, contactNumber },
        startDate,
        roles: ["Employee"],
        active: true,
        completedSurveys: [],
        isPrefersReducedMotion: false,
      };

      const url: URL = urlBuilder({
        path: "user",
      });

      const requestInit: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userSchema: newUserObj,
        }),
        signal: abortControllerRef.current?.signal,
      };

      try {
        const request: Request = new Request(url.toString(), requestInit);
        const response: Response = await fetch(request);

        const data: ResourceRequestServerResponse<UserDocument> = await response.json();

        if (!isMounted) {
          return;
        }
        if (!response.ok) {
          throw new Error(data.message);
        }

        registerDispatch({
          type: registerAction.setIsSuccessful,
          payload: true,
        });

        registerDispatch({
          type: registerAction.setSuccessMessage,
          payload: data.message ?? "User created successfully!",
        });
      } catch (error: any) {
        if (!isMounted || error.name === "AbortError") {
          return;
        }

        const errorMessage =
          error instanceof InvalidTokenError
            ? "Invalid token. Please login again."
            : !error.response
            ? "Network error. Please try again."
            : error?.message ?? "Unknown error occurred. Please try again.";

        globalDispatch({
          type: globalAction.setErrorState,
          payload: {
            isError: true,
            errorMessage,
            errorCallback: () => {
              navigate("/register");

              globalDispatch({
                type: globalAction.setErrorState,
                payload: {
                  isError: false,
                  errorMessage: "",
                  errorCallback: () => {},
                },
              });
            },
          },
        });

        showBoundary(error);
      } finally {
        if (isMounted) {
          registerDispatch({
            type: registerAction.setIsSubmitting,
            payload: false,
          });
          registerDispatch({
            type: registerAction.setSubmitMessage,
            payload: "",
          });
          registerDispatch({
            type: registerAction.setTriggerFormSubmit,
            payload: false,
          });
        }
      }
    }

    if (triggerFormSubmit) {
      handleRegisterFormSubmit();
    }

    return () => {
      isMounted = false;
      abortControllerRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerFormSubmit]);

  // check if username exists on every valid state change
  useEffect(() => {
    let isMounted = true;
    // before submitting form, abort any previous requests
    abortControllerRef.current?.abort();
    // create new abort controller for current request
    abortControllerRef.current = new AbortController();

    async function handleCheckUsernameExists() {
      registerDispatch({
        type: registerAction.setIsSubmitting,
        payload: true,
      });

      const url: URL = urlBuilder({
        path: "username-email-set/check",
      });

      const requestInit: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: { username },
        }),
        signal: abortControllerRef.current?.signal,
      };

      try {
        const request: Request = new Request(url.toString(), requestInit);
        const response: Response = await fetch(request);

        const data: { status: "error" | "success"; message: string } =
          await response.json();

        if (!isMounted) {
          return;
        }
        if (!response.ok) {
          throw new Error(data.message);
        }

        data.status === "error"
          ? registerDispatch({
              type: registerAction.setIsUsernameExists,
              payload: true,
            })
          : registerDispatch({
              type: registerAction.setIsUsernameExists,
              payload: false,
            });
      } catch (error: any) {
        if (!isMounted || error.name === "AbortError") {
          return;
        }

        const errorMessage = !error.response
          ? "Network error. Please try again."
          : error?.message ?? "Unknown error occurred. Please try again.";

        globalDispatch({
          type: globalAction.setErrorState,
          payload: {
            isError: true,
            errorMessage,
            errorCallback: () => {
              navigate("/register");

              globalDispatch({
                type: globalAction.setErrorState,
                payload: {
                  isError: false,
                  errorMessage: "",
                  errorCallback: () => {},
                },
              });
            },
          },
        });

        showBoundary(error);
      } finally {
        if (isMounted) {
          registerDispatch({
            type: registerAction.setIsSubmitting,
            payload: false,
          });
        }
      }
    }

    if (USERNAME_REGEX.test(username) && username.length > 0) {
      handleCheckUsernameExists();
    }

    return () => {
      isMounted = false;
      abortControllerRef.current?.abort();
    };
  }, [username, isValidUsername, globalDispatch, showBoundary, navigate]);

  // check if email exists on every valid state change
  useEffect(() => {
    let isMounted = true;
    // before submitting form, abort any previous requests
    abortControllerRef.current?.abort();
    // create new abort controller for current request
    abortControllerRef.current = new AbortController();

    async function handleCheckEmailExists() {
      registerDispatch({
        type: registerAction.setIsSubmitting,
        payload: true,
      });

      const url: URL = urlBuilder({
        path: "username-email-set/check",
      });

      const requestInit: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: { email },
        }),
        signal: abortControllerRef.current?.signal,
      };

      try {
        const request: Request = new Request(url.toString(), requestInit);
        const response: Response = await fetch(request);

        const data: { status: "error" | "success"; message: string } =
          await response.json();

        if (!isMounted) {
          return;
        }
        if (!response.ok) {
          throw new Error(data.message);
        }

        data.status === "error"
          ? registerDispatch({
              type: registerAction.setIsEmailExists,
              payload: true,
            })
          : registerDispatch({
              type: registerAction.setIsEmailExists,
              payload: false,
            });
      } catch (error: any) {
        if (!isMounted || error.name === "AbortError") {
          return;
        }

        const errorMessage = !error.response
          ? "Network error. Please try again."
          : error?.message ?? "Unknown error occurred. Please try again.";

        globalDispatch({
          type: globalAction.setErrorState,
          payload: {
            isError: true,
            errorMessage,
            errorCallback: () => {
              navigate("/register");

              globalDispatch({
                type: globalAction.setErrorState,
                payload: {
                  isError: false,
                  errorMessage: "",
                  errorCallback: () => {},
                },
              });
            },
          },
        });

        showBoundary(error);
      } finally {
        if (isMounted) {
          registerDispatch({
            type: registerAction.setIsSubmitting,
            payload: false,
          });
        }
      }
    }

    if (EMAIL_REGEX.test(email) && email.length > 0) {
      handleCheckEmailExists();
    }

    return () => {
      isMounted = false;
      abortControllerRef.current?.abort();
    };
  }, [email, isValidEmail, globalDispatch, showBoundary, navigate]);

  useEffect(() => {
    logState({
      state: registerState,
      groupLabel: "Register State",
    });
  }, [registerState]);

  const submitButtonCreatorInfo: AccessibleButtonCreatorInfo = {
    buttonLabel: "Submit",
    semanticDescription: "register form submit button",
    semanticName: "submit button",
    leftIcon: <TbUpload />,
    buttonOnClick: (event: MouseEvent<HTMLButtonElement>) => {
      registerDispatch({
        type: registerAction.setTriggerFormSubmit,
        payload: true,
      });
    },
    // ensures form submit happens only once
    buttonDisabled: pagesInError.size > 0 || triggerFormSubmit,
  };

  const [createdSubmitButton] = returnAccessibleButtonElements([submitButtonCreatorInfo]);
  const displaySubmitButton =
    currentStepperPosition === REGISTER_MAX_STEPPER_POSITION ? (
      <Flex align="center" justify="center" w="100%">
        {createdSubmitButton}
      </Flex>
    ) : null;

  const displaySubmitSuccessNotificationModal = (
    <NotificationModal
      onCloseCallbacks={[
        closeSubmitSuccessNotificationModal,
        () => {
          navigate("/login");
        },
      ]}
      opened={openedSubmitSuccessNotificationModal}
      notificationProps={{
        loading: isSubmitting,
        text: isSubmitting ? submitMessage : successMessage,
      }}
      title={<Title order={4}>{isSuccessful ? "Success!" : "Submitting ..."}</Title>}
    />
  );

  const displayRegisterComponentPage =
    currentStepperPosition === 0 ? (
      <RegisterAuthentication
        email={email}
        isValidEmail={isValidEmail}
        isEmailFocused={isEmailFocused}
        isEmailExists={isEmailExists}
        username={username}
        isValidUsername={isValidUsername}
        isUsernameFocused={isUsernameFocused}
        isUsernameExists={isUsernameExists}
        password={password}
        isValidPassword={isValidPassword}
        isPasswordFocused={isPasswordFocused}
        confirmPassword={confirmPassword}
        isValidConfirmPassword={isValidConfirmPassword}
        isConfirmPasswordFocused={isConfirmPasswordFocused}
        registerAction={registerAction}
        registerDispatch={registerDispatch}
      />
    ) : currentStepperPosition === 1 ? (
      <RegisterPersonal
        firstName={firstName}
        isValidFirstName={isValidFirstName}
        isFirstNameFocused={isFirstNameFocused}
        middleName={middleName}
        isValidMiddleName={isValidMiddleName}
        isMiddleNameFocused={isMiddleNameFocused}
        lastName={lastName}
        isValidLastName={isValidLastName}
        isLastNameFocused={isLastNameFocused}
        preferredName={preferredName}
        isValidPreferredName={isValidPreferredName}
        isPreferredNameFocused={isPreferredNameFocused}
        preferredPronouns={preferredPronouns}
        profilePictureUrl={profilePictureUrl}
        isValidProfilePictureUrl={isValidProfilePictureUrl}
        isProfilePictureUrlFocused={isProfilePictureUrlFocused}
        dateOfBirth={dateOfBirth}
        isValidDateOfBirth={isValidDateOfBirth}
        isDateOfBirthFocused={isDateOfBirthFocused}
        registerAction={registerAction}
        registerDispatch={registerDispatch}
      />
    ) : currentStepperPosition === 2 ? (
      <RegisterAddress
        contactNumber={contactNumber}
        isValidContactNumber={isValidContactNumber}
        isContactNumberFocused={isContactNumberFocused}
        addressLine={addressLine}
        isValidAddressLine={isValidAddressLine}
        isAddressLineFocused={isAddressLineFocused}
        city={city}
        isValidCity={isValidCity}
        isCityFocused={isCityFocused}
        state={state}
        province={province}
        country={country}
        postalCode={postalCode}
        isValidPostalCode={isValidPostalCode}
        isPostalCodeFocused={isPostalCodeFocused}
        registerAction={registerAction}
        registerDispatch={registerDispatch}
      />
    ) : currentStepperPosition === 3 ? (
      <RegisterAdditional
        jobPosition={jobPosition}
        department={department}
        storeLocation={storeLocation}
        fullName={fullName}
        isValidFullName={isValidFullName}
        isFullNameFocused={isFullNameFocused}
        phoneNumber={phoneNumber}
        isValidPhoneNumber={isValidPhoneNumber}
        isPhoneNumberFocused={isPhoneNumberFocused}
        startDate={startDate}
        isValidStartDate={isValidStartDate}
        isStartDateFocused={isStartDateFocused}
        registerAction={registerAction}
        registerDispatch={registerDispatch}
      />
    ) : currentStepperPosition === 4 ? (
      <RegisterReview
        email={email}
        username={username}
        firstName={firstName}
        middleName={middleName}
        lastName={lastName}
        preferredName={preferredName}
        preferredPronouns={preferredPronouns}
        profilePictureUrl={profilePictureUrl}
        contactNumber={contactNumber}
        addressLine={addressLine}
        city={city}
        state={state}
        province={province}
        country={country}
        postalCode={postalCode}
        jobPosition={jobPosition}
        department={department}
        fullName={fullName}
        phoneNumber={phoneNumber}
        startDate={startDate}
      />
    ) : (
      displaySubmitButton
    );

  const displayRegisterForm = (
    <StepperWrapper
      childrenTitle="Register"
      pagesInError={pagesInError}
      descriptionObjectsArray={REGISTER_DESCRIPTION_OBJECTS}
      maxStepperPosition={REGISTER_MAX_STEPPER_POSITION}
      currentStepperPosition={currentStepperPosition}
      setCurrentStepperPosition={registerAction.setCurrentStepperPosition}
      parentComponentDispatch={registerDispatch}
    >
      {displayRegisterComponentPage}
      {displaySubmitSuccessNotificationModal}
    </StepperWrapper>
  );

  const displayRegisterComponent = (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      rowGap="lg"
      w="100%"
      h="100%"
    >
      {displayRegisterForm}

      <Flex align="center" justify="center" columnGap="sm" w="100%">
        <Text color="dark">Already have an account?</Text>
        <Text color="blue">
          <Link to="/login">Login</Link>
        </Text>
      </Flex>
    </Flex>
  );

  return displayRegisterComponent;

 */
