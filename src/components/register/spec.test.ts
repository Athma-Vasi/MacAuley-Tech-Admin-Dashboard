import { NavigateFunction } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import {
  ALL_STORE_LOCATIONS_DATA,
  API_URL,
  AUTH_URL,
  COUNTRIES,
  DEPARTMENTS_DATA,
  INVALID_BOOLEANS,
  INVALID_NUMBERS,
  INVALID_STRINGS,
  JOB_POSITIONS_DATA,
  PROVINCES,
  STATES_US,
  VALID_BOOLEANS,
  VALID_PASSWORDS,
  VALID_USERNAMES,
} from "../../constants";
import {
  HttpServerResponse,
  SafeBoxResult,
  UserDocument,
  UserSchema,
} from "../../types";
import {
  createSafeBoxResult,
  fetchSafe,
  responseToJSONSafe,
} from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";
import { DIRECTORY_EMPLOYEE_DATA } from "../directory/data";
import { handleLoginMock, handleLogoutMock } from "../testing/utils";
import { registerAction } from "./actions";
import { REGISTER_URL } from "./constants";
import {
  handleCheckEmailExists,
  handleCheckUsernameExists,
  handleRegisterButtonClick,
} from "./handlers";
import {
  registerReducer_setActiveStep,
  registerReducer_setAddressLine,
  registerReducer_setCity,
  registerReducer_setConfirmPassword,
  registerReducer_setCountry,
  registerReducer_setDepartment,
  registerReducer_setEmail,
  registerReducer_setErrorMessage,
  registerReducer_setFirstName,
  registerReducer_setInputsInError,
  registerReducer_setIsEmailExists,
  registerReducer_setIsEmailExistsSubmitting,
  registerReducer_setIsError,
  registerReducer_setIsSubmitting,
  registerReducer_setIsSuccessful,
  registerReducer_setIsUsernameExists,
  registerReducer_setIsUsernameExistsSubmitting,
  registerReducer_setJobPosition,
  registerReducer_setLastName,
  registerReducer_setPassword,
  registerReducer_setPostalCodeCanada,
  registerReducer_setPostalCodeUS,
  registerReducer_setProfilePictureUrl,
  registerReducer_setProvince,
  registerReducer_setState,
  registerReducer_setStepsInError,
  registerReducer_setStepsWithEmptyInputs,
  registerReducer_setStoreLocation,
  registerReducer_setUsername,
} from "./reducers";
import { RegisterDispatch } from "./schemas";
import { initialRegisterState } from "./state";
import { SAMPLE_USER_DOCUMENT } from "./testData";

describe("registerReducer", () => {
  describe("registerReducer_setConfirmPassword", () => {
    it("should allow valid string values", () => {
      VALID_PASSWORDS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setConfirmPassword,
          payload: value,
        };
        const state = registerReducer_setConfirmPassword(
          initialRegisterState,
          dispatch,
        );
        expect(state.confirmPassword).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialConfirmPassword = initialRegisterState.confirmPassword;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setConfirmPassword,
          payload: value as any,
        };
        const state = registerReducer_setConfirmPassword(
          initialRegisterState,
          dispatch,
        );
        expect(state.confirmPassword).toBe(initialConfirmPassword);
      });
    });
  });

  describe("registerReducer_setEmail", () => {
    it("should allow valid email values", () => {
      const validEmails = [
        "luna.starfire93@nebula-mail.com",
        "echo_rider21@skybridge.net",
        "piper.blaze777@cloudvault.org",
        "nova.shadow56@brightmail.io",
        "atlas.wave88@silverstream.co",
        "ember.wraith42@frostnet.com",
        "zephyr.haze19@sunflare.net",
        "onyx.drift01@voidlink.org",
        "sienna.quest33@horizonhub.net",
        "crimson.surge44@stormforge.dev",
      ];

      validEmails.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setEmail,
          payload: value,
        };
        const state = registerReducer_setEmail(
          initialRegisterState,
          dispatch,
        );
        expect(state.email).toBe(value);
      });
    });
    it("should not allow invalid email values", () => {
      const initialEmail = initialRegisterState.email;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setEmail,
          payload: value as any,
        };
        const state = registerReducer_setEmail(
          initialRegisterState,
          dispatch,
        );
        expect(state.email).toBe(initialEmail);
      });
    });
  });

  describe("registerReducer_setIsEmailExists", () => {
    it("should allow valid boolean values", () => {
      VALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsEmailExists,
          payload: value,
        };
        const state = registerReducer_setIsEmailExists(
          initialRegisterState,
          dispatch,
        );
        expect(state.isEmailExists).toBe(value);
      });
    });
    it("should not allow invalid boolean values", () => {
      const initialIsEmailExists = initialRegisterState.isEmailExists;

      INVALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsEmailExists,
          payload: value as any,
        };
        const state = registerReducer_setIsEmailExists(
          initialRegisterState,
          dispatch,
        );
        expect(state.isEmailExists).toBe(initialIsEmailExists);
      });
    });
  });

  describe("registerReducer_setIsEmailExistsSubmitting", () => {
    it("should allow valid boolean values", () => {
      VALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsEmailExistsSubmitting,
          payload: value,
        };
        const state = registerReducer_setIsEmailExistsSubmitting(
          initialRegisterState,
          dispatch,
        );
        expect(state.isEmailExistsSubmitting).toBe(value);
      });
    });
    it("should not allow invalid boolean values", () => {
      const initialIsEmailExistsSubmitting =
        initialRegisterState.isEmailExistsSubmitting;
      INVALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsEmailExistsSubmitting,
          payload: value as any,
        };
        const state = registerReducer_setIsEmailExistsSubmitting(
          initialRegisterState,
          dispatch,
        );
        expect(state.isEmailExistsSubmitting).toBe(
          initialIsEmailExistsSubmitting,
        );
      });
    });
  });

  describe("registerReducer_setIsUsernameExists", () => {
    it("should allow valid boolean values", () => {
      VALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsUsernameExists,
          payload: value,
        };
        const state = registerReducer_setIsUsernameExists(
          initialRegisterState,
          dispatch,
        );
        expect(state.isUsernameExists).toBe(value);
      });
    });
    it("should not allow invalid boolean values", () => {
      const initialIsUsernameExists = initialRegisterState.isUsernameExists;

      INVALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsUsernameExists,
          payload: value as any,
        };
        const state = registerReducer_setIsUsernameExists(
          initialRegisterState,
          dispatch,
        );
        expect(state.isUsernameExists).toBe(initialIsUsernameExists);
      });
    });
  });

  describe("registerReducer_setIsUsernameExistsSubmitting", () => {
    it("should allow valid boolean values", () => {
      VALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsUsernameExistsSubmitting,
          payload: value,
        };
        const state = registerReducer_setIsUsernameExistsSubmitting(
          initialRegisterState,
          dispatch,
        );
        expect(state.isUsernameExistsSubmitting).toBe(value);
      });
    });
    it("should not allow invalid boolean values", () => {
      const initialIsUsernameExistsSubmitting =
        initialRegisterState.isUsernameExistsSubmitting;
      INVALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsUsernameExistsSubmitting,
          payload: value as any,
        };
        const state = registerReducer_setIsUsernameExistsSubmitting(
          initialRegisterState,
          dispatch,
        );
        expect(state.isUsernameExistsSubmitting).toBe(
          initialIsUsernameExistsSubmitting,
        );
      });
    });
  });

  describe("registerReducer_setPassword", () => {
    it("should allow valid string values", () => {
      VALID_PASSWORDS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setPassword,
          payload: value,
        };
        const state = registerReducer_setPassword(
          initialRegisterState,
          dispatch,
        );
        expect(state.password).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialPassword = initialRegisterState.password;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setPassword,
          payload: value as any,
        };
        const state = registerReducer_setPassword(
          initialRegisterState,
          dispatch,
        );
        expect(state.password).toBe(initialPassword);
      });
    });
  });

  describe("registerReducer_setUsername", () => {
    it("should allow valid string values", () => {
      VALID_USERNAMES.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setUsername,
          payload: value,
        };
        const state = registerReducer_setUsername(
          initialRegisterState,
          dispatch,
        );
        expect(state.username).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialUsername = initialRegisterState.username;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setUsername,
          payload: value as any,
        };
        const state = registerReducer_setUsername(
          initialRegisterState,
          dispatch,
        );
        expect(state.username).toBe(initialUsername);
      });
    });
  });

  // register address

  describe("registerReducer_setAddressLine", () => {
    it("should allow valid string values", () => {
      const validAddressLines = [
        "123 Main St",
        "456 Elm St Apt 2B",
        "789 Oak St Suite 100",
        "101 Maple Ave",
        "202 Birch Rd",
        "303 Cedar Ln",
        "404 Pine St",
        "505 Spruce Dr",
        "606 Willow Way",
      ];

      validAddressLines.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setAddressLine,
          payload: value,
        };
        const state = registerReducer_setAddressLine(
          initialRegisterState,
          dispatch,
        );
        expect(state.addressLine).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialAddressLine = initialRegisterState.addressLine;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setAddressLine,
          payload: value as any,
        };
        const state = registerReducer_setAddressLine(
          initialRegisterState,
          dispatch,
        );
        expect(state.addressLine).toBe(initialAddressLine);
      });
    });
  });

  describe("registerReducer_setCity", () => {
    it("should allow valid string values", () => {
      const validCities = [
        "Edmonton",
        "Calgary",
        "Vancouver",
        "Camrose",
        "St. Albert",
        "Leduc",
        "Fort Saskatchewan",
        "Spruce Grove",
      ];

      validCities.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setCity,
          payload: value,
        };
        const state = registerReducer_setCity(
          initialRegisterState,
          dispatch,
        );
        expect(state.city).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialCity = initialRegisterState.city;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setCity,
          payload: value as any,
        };
        const state = registerReducer_setCity(
          initialRegisterState,
          dispatch,
        );
        expect(state.city).toBe(initialCity);
      });
    });
  });

  describe("registerReducer_setCountry", () => {
    it("should allow valid string values", () => {
      COUNTRIES.forEach(({ value }) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setCountry,
          payload: value,
        };
        const state = registerReducer_setCountry(
          initialRegisterState,
          dispatch,
        );
        expect(state.country).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialCountry = initialRegisterState.country;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setCountry,
          payload: value as any,
        };
        const state = registerReducer_setCountry(
          initialRegisterState,
          dispatch,
        );
        expect(state.country).toBe(initialCountry);
      });
    });
  });

  describe("registerReducer_setPostalCodeCanada", () => {
    it("should allow valid Canadian postal code values", () => {
      const validPostalCodes = [
        "A1A 1A1",
        "B2B 2B2",
        "C3C 3C3",
        "D4D 4D4",
      ];
      validPostalCodes.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setPostalCodeCanada,
          payload: value,
        };
        const state = registerReducer_setPostalCodeCanada(
          initialRegisterState,
          dispatch,
        );
        expect(state.postalCodeCanada).toBe(value);
      });
    });
    it("should not allow invalid Canadian postal code values", () => {
      const initialPostalCodeCanada = initialRegisterState.postalCodeCanada;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setPostalCodeCanada,
          payload: value as any,
        };
        const state = registerReducer_setPostalCodeCanada(
          initialRegisterState,
          dispatch,
        );
        expect(state.postalCodeCanada).toBe(initialPostalCodeCanada);
      });
    });
  });

  describe("registerReducer_setPostalCodeUS", () => {
    it("should allow valid US postal code values", () => {
      const validPostalCodes = [
        "12345",
        "12345-6789",
        "54321",
        "98765-4321",
      ];
      validPostalCodes.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setPostalCodeUS,
          payload: value,
        };
        const state = registerReducer_setPostalCodeUS(
          initialRegisterState,
          dispatch,
        );
        expect(state.postalCodeUS).toBe(value);
      });
    });
    it("should not allow invalid US postal code values", () => {
      const initialPostalCodeUS = initialRegisterState.postalCodeUS;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setPostalCodeUS,
          payload: value as any,
        };
        const state = registerReducer_setPostalCodeUS(
          initialRegisterState,
          dispatch,
        );
        expect(state.postalCodeUS).toBe(initialPostalCodeUS);
      });
    });
  });

  describe("registerReducer_setProvince", () => {
    it("should allow valid string values", () => {
      PROVINCES.forEach(({ value }) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setProvince,
          payload: value,
        };
        const state = registerReducer_setProvince(
          initialRegisterState,
          dispatch,
        );
        expect(state.province).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialProvince = initialRegisterState.province;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setProvince,
          payload: value as any,
        };
        const state = registerReducer_setProvince(
          initialRegisterState,
          dispatch,
        );
        expect(state.province).toBe(initialProvince);
      });
    });
  });

  describe("registerReducer_setState", () => {
    it("should allow valid string values", () => {
      STATES_US.forEach(({ value }) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setState,
          payload: value,
        };
        const state = registerReducer_setState(
          initialRegisterState,
          dispatch,
        );
        expect(state.state).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialState = initialRegisterState.state;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setState,
          payload: value as any,
        };
        const state = registerReducer_setState(
          initialRegisterState,
          dispatch,
        );
        expect(state.state).toBe(initialState);
      });
    });
  });

  // register additional

  describe("registerReducer_setDepartment", () => {
    it("should allow valid string values", () => {
      DEPARTMENTS_DATA.forEach(({ value }) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setDepartment,
          payload: value,
        };
        const state = registerReducer_setDepartment(
          initialRegisterState,
          dispatch,
        );
        expect(state.department).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialDepartment = initialRegisterState.department;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setDepartment,
          payload: value as any,
        };
        const state = registerReducer_setDepartment(
          initialRegisterState,
          dispatch,
        );
        expect(state.department).toBe(initialDepartment);
      });
    });
  });

  describe("registerReducer_setFirstName", () => {
    it("should allow valid string values", () => {
      const validFirstNames = [
        "Luna",
        "Echo",
        "Piper",
        "Nova",
        "Atlas",
        "Ember",
        "Zephyr",
        "Orion",
        "Lyric",
        "Phoenix",
        "Sage",
        "River",
        "Indigo",
        "Sky",
        "Aria",
        "Onyx",
        "Rain",
        "Cleo",
        "Briar",
        "Storm",
        "Rowan",
        "Vale",
        "Sol",
        "Vesper",
        "Wren",
        "Zion",
        "Aurora",
        "Aspen",
        "Juno",
        "Kai",
        "Meadow",
        "Riven",
        "Sparrow",
        "Sorrel",
        "Valkyrie",
        "Zara",
        "Calypso",
        "Eira",
        "Astra",
      ];
      validFirstNames.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setFirstName,
          payload: value,
        };
        const state = registerReducer_setFirstName(
          initialRegisterState,
          dispatch,
        );
        expect(state.firstName).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialFirstName = initialRegisterState.firstName;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setFirstName,
          payload: value as any,
        };
        const state = registerReducer_setFirstName(
          initialRegisterState,
          dispatch,
        );
        expect(state.firstName).toBe(initialFirstName);
      });
    });
  });

  describe("registerReducer_setJobPosition", () => {
    it("should allow valid string values", () => {
      JOB_POSITIONS_DATA.forEach(({ value }) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setJobPosition,
          payload: value,
        };
        const state = registerReducer_setJobPosition(
          initialRegisterState,
          dispatch,
        );
        expect(state.jobPosition).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialJobPosition = initialRegisterState.jobPosition;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setJobPosition,
          payload: value as any,
        };
        const state = registerReducer_setJobPosition(
          initialRegisterState,
          dispatch,
        );
        expect(state.jobPosition).toBe(initialJobPosition);
      });
    });
  });

  describe("registerReducer_setLastName", () => {
    it("should allow valid string values", () => {
      const validLastNames = [
        "Starfire",
        "Blaze",
        "Shadow",
        "Wraith",
        "Haze",
        "Drift",
        "Surge",
        "Quest",
      ];
      validLastNames.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setLastName,
          payload: value,
        };
        const state = registerReducer_setLastName(
          initialRegisterState,
          dispatch,
        );
        expect(state.lastName).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialLastName = initialRegisterState.lastName;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setLastName,
          payload: value as any,
        };
        const state = registerReducer_setLastName(
          initialRegisterState,
          dispatch,
        );
        expect(state.lastName).toBe(initialLastName);
      });
    });
  });

  describe("registerReducer_setProfilePictureUrl", () => {
    it("should allow valid string values", () => {
      const validUrls = [
        "https://example.com/profile.jpg",
        "https://example.com/image.png",
        "https://example.com/photo.gif",
      ];
      validUrls.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setProfilePictureUrl,
          payload: value,
        };
        const state = registerReducer_setProfilePictureUrl(
          initialRegisterState,
          dispatch,
        );
        expect(state.profilePictureUrl).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialProfilePictureUrl = initialRegisterState.profilePictureUrl;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setProfilePictureUrl,
          payload: value as any,
        };
        const state = registerReducer_setProfilePictureUrl(
          initialRegisterState,
          dispatch,
        );
        expect(state.profilePictureUrl).toBe(initialProfilePictureUrl);
      });
    });
  });

  describe("registerReducer_setStoreLocation", () => {
    it("should allow valid string values", () => {
      ALL_STORE_LOCATIONS_DATA.forEach(({ value }) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setStoreLocation,
          payload: value,
        };
        const state = registerReducer_setStoreLocation(
          initialRegisterState,
          dispatch,
        );
        expect(state.storeLocation).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialStoreLocation = initialRegisterState.storeLocation;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setStoreLocation,
          payload: value as any,
        };
        const state = registerReducer_setStoreLocation(
          initialRegisterState,
          dispatch,
        );
        expect(state.storeLocation).toBe(initialStoreLocation);
      });
    });
  });

  describe("registerReducer_setErrorMessage", () => {
    it("should allow valid string values", () => {
      const validErrorMessages = [
        "Invalid email address",
        "Password must be at least 8 characters",
        "Username already exists",
        "Email already exists",
      ];
      validErrorMessages.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setErrorMessage,
          payload: value,
        };
        const state = registerReducer_setErrorMessage(
          initialRegisterState,
          dispatch,
        );
        expect(state.errorMessage).toBe(value);
      });
    });
    it("should not allow invalid string values", () => {
      const initialErrorMessage = initialRegisterState.errorMessage;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setErrorMessage,
          payload: value as any,
        };
        const state = registerReducer_setErrorMessage(
          initialRegisterState,
          dispatch,
        );
        expect(state.errorMessage).toBe(initialErrorMessage);
      });
    });
  });

  describe("registerReducer_setIsError", () => {
    it("should allow valid boolean values", () => {
      VALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsError,
          payload: value,
        };
        const state = registerReducer_setIsError(
          initialRegisterState,
          dispatch,
        );
        expect(state.isError).toBe(value);
      });
    });
    it("should not allow invalid boolean values", () => {
      const initialIsError = initialRegisterState.isError;
      INVALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsError,
          payload: value as any,
        };
        const state = registerReducer_setIsError(
          initialRegisterState,
          dispatch,
        );
        expect(state.isError).toBe(initialIsError);
      });
    });
  });

  describe("registerReducer_setIsSubmitting", () => {
    it("should allow valid boolean values", () => {
      VALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsSubmitting,
          payload: value,
        };
        const state = registerReducer_setIsSubmitting(
          initialRegisterState,
          dispatch,
        );
        expect(state.isSubmitting).toBe(value);
      });
    });
    it("should not allow invalid boolean values", () => {
      const initialIsSubmitting = initialRegisterState.isSubmitting;
      INVALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsSubmitting,
          payload: value as any,
        };
        const state = registerReducer_setIsSubmitting(
          initialRegisterState,
          dispatch,
        );
        expect(state.isSubmitting).toBe(initialIsSubmitting);
      });
    });
  });

  describe("registerReducer_setIsSuccessful", () => {
    it("should allow valid boolean values", () => {
      VALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsSuccessful,
          payload: value,
        };
        const state = registerReducer_setIsSuccessful(
          initialRegisterState,
          dispatch,
        );
        expect(state.isSuccessful).toBe(value);
      });
    });
    it("should not allow invalid boolean values", () => {
      const initialIsSuccessful = initialRegisterState.isSuccessful;
      INVALID_BOOLEANS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setIsSuccessful,
          payload: value as any,
        };
        const state = registerReducer_setIsSuccessful(
          initialRegisterState,
          dispatch,
        );
        expect(state.isSuccessful).toBe(initialIsSuccessful);
      });
    });
  });

  describe("registerReducer_setActiveStep", () => {
    it("should allow valid number values", () => {
      const validSteps = [0, 1, 2, 3];
      validSteps.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setActiveStep,
          payload: value,
        };
        const state = registerReducer_setActiveStep(
          initialRegisterState,
          dispatch,
        );
        expect(state.activeStep).toBe(value);
      });
    });
    it("should not allow invalid number values", () => {
      const initialActiveStep = initialRegisterState.activeStep;
      INVALID_NUMBERS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setActiveStep,
          payload: value as any,
        };
        const state = registerReducer_setActiveStep(
          initialRegisterState,
          dispatch,
        );
        expect(state.activeStep).toBe(initialActiveStep);
      });
    });
  });

  describe("registerReducer_setStepsInError", () => {
    it("should add valid number values", () => {
      const validSteps = [0, 1, 2, 3];
      validSteps.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setStepsInError,
          payload: { kind: "add", step: value },
        };
        const state = registerReducer_setStepsInError(
          initialRegisterState,
          dispatch,
        );
        expect(state.stepsInError.has(value)).toBe(true);
      });
    });
    it("should delete valid number values", () => {
      const initialStepsInError = new Set([0, 1, 2]);
      const dispatch: RegisterDispatch = {
        action: registerAction.setStepsInError,
        payload: { kind: "delete", step: 1 },
      };
      const state = registerReducer_setStepsInError(
        { ...initialRegisterState, stepsInError: initialStepsInError },
        dispatch,
      );
      expect(state.stepsInError.has(1)).toBe(false);
    });
    it("should not allow invalid number values", () => {
      const initialStepsInError = initialRegisterState.stepsInError;
      INVALID_NUMBERS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setStepsInError,
          payload: { kind: "add", step: value as any },
        };
        const state = registerReducer_setStepsInError(
          initialRegisterState,
          dispatch,
        );
        expect(state.stepsInError).toEqual(initialStepsInError);
      });
    });
  });

  describe("registerReducer_setStepsWithEmptyInputs", () => {
    it("should add valid number values", () => {
      const validSteps = [0, 1, 2, 3];
      validSteps.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setStepsWithEmptyInputs,
          payload: { kind: "add", step: value },
        };
        const state = registerReducer_setStepsWithEmptyInputs(
          initialRegisterState,
          dispatch,
        );
        expect(state.stepsWithEmptyInputs.has(value)).toBe(true);
      });
    });
    it("should delete valid number values", () => {
      const initialStepsWithEmptyInputs = new Set([0, 1, 2]);
      const dispatch: RegisterDispatch = {
        action: registerAction.setStepsWithEmptyInputs,
        payload: { kind: "delete", step: 1 },
      };
      const state = registerReducer_setStepsWithEmptyInputs(
        {
          ...initialRegisterState,
          stepsWithEmptyInputs: initialStepsWithEmptyInputs,
        },
        dispatch,
      );
      expect(state.stepsWithEmptyInputs.has(1)).toBe(false);
    });
    it("should not allow invalid number values", () => {
      const initialStepsWithEmptyInputs =
        initialRegisterState.stepsWithEmptyInputs;
      INVALID_NUMBERS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setStepsWithEmptyInputs,
          payload: { kind: "add", step: value as any },
        };
        const state = registerReducer_setStepsWithEmptyInputs(
          initialRegisterState,
          dispatch,
        );
        expect(state.stepsWithEmptyInputs).toEqual(
          initialStepsWithEmptyInputs,
        );
      });
    });
  });

  describe("registerReducer_setInputsInError", () => {
    it("should add valid string values", () => {
      Object.keys(VALIDATION_FUNCTIONS_TABLE).forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setInputsInError,
          payload: { kind: "add", name: value },
        };
        const state = registerReducer_setInputsInError(
          initialRegisterState,
          dispatch,
        );
        expect(state.inputsInError.has(value as ValidationKey)).toBe(true);
      });
    });
    it("should delete valid string values", () => {
      const initialInputsInError = new Set<ValidationKey>([
        "email",
        "password",
      ]);
      const dispatch: RegisterDispatch = {
        action: registerAction.setInputsInError,
        payload: { kind: "delete", name: "email" },
      };
      const state = registerReducer_setInputsInError(
        { ...initialRegisterState, inputsInError: initialInputsInError },
        dispatch,
      );
      expect(state.inputsInError.has("email")).toBe(false);
    });
    it("should not allow invalid string values", () => {
      const initialInputsInError = initialRegisterState.inputsInError;
      INVALID_STRINGS.forEach((value) => {
        const dispatch: RegisterDispatch = {
          action: registerAction.setInputsInError,
          payload: { kind: "add", name: value as any },
        };
        const state = registerReducer_setInputsInError(
          initialRegisterState,
          dispatch,
        );
        expect(state.inputsInError).toEqual(initialInputsInError);
      });
    });
  });
});

async function handleCheckEmailExistsTestMock(
  email: string,
  testKind: "success" | "error" = "success",
) {
  const fetchAbortControllerRef = {
    current: null,
  } as React.RefObject<AbortController | null>;
  const isComponentMountedRef = {
    current: true,
  } as React.RefObject<boolean>;
  const registerDispatch = vi.fn() as React.Dispatch<any>;
  const showBoundary = vi.fn() as (error: unknown) => void;
  const url = AUTH_URL;

  try {
    const checkEmailExistsResult = await handleCheckEmailExists({
      email,
      fetchAbortControllerRef,
      isComponentMountedRef,
      registerDispatch,
      showBoundary,
      url,
    });

    if (
      checkEmailExistsResult.err
    ) {
      return createSafeBoxResult({
        message: "Error checking email existence",
      });
    }

    const checkEmailExists = checkEmailExistsResult.safeUnwrap().data;
    if (checkEmailExists === undefined) {
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    describe(
      `given:
        ${testKind === "success" ? "valid" : "invalid"} email: ${email}
      `,
      () => {
        if (testKind === "success") {
          it("should return true", () => {
            expect(checkEmailExists).toBe(true);
          });
        }

        if (testKind === "error") {
          it("should return false", () => {
            expect(checkEmailExists).toBe(false);
          });
        }
      },
    );

    return createSafeBoxResult({
      data: checkEmailExists,
      kind: "success",
    });
  } catch (error) {
    return createSafeBoxResult({ message: "Login error" });
  }
}

const EXISTING_EMAILS = DIRECTORY_EMPLOYEE_DATA.map(
  (employee) => employee.email,
);
await Promise.all(
  EXISTING_EMAILS.map(async (email) =>
    await handleCheckEmailExistsTestMock(email, "success")
  ),
);

const NON_EXISTING_EMAILS = DIRECTORY_EMPLOYEE_DATA.map(
  (employee, idx) => `${idx}${employee.email}`,
);
await Promise.all(
  NON_EXISTING_EMAILS.map(async (email) =>
    await handleCheckEmailExistsTestMock(email, "error")
  ),
);

async function handleCheckUsernameExistsTestMock(
  username: string,
  testKind: "success" | "error" = "success",
) {
  const fetchAbortControllerRef = {
    current: null,
  } as React.RefObject<AbortController | null>;
  const isComponentMountedRef = {
    current: true,
  } as React.RefObject<boolean>;
  const registerDispatch = vi.fn() as React.Dispatch<any>;
  const showBoundary = vi.fn() as (error: unknown) => void;
  const url = AUTH_URL;

  try {
    const checkUsernameExistsResult = await handleCheckUsernameExists({
      username,
      fetchAbortControllerRef,
      isComponentMountedRef,
      registerDispatch,
      showBoundary,
      url,
    });

    if (
      checkUsernameExistsResult.err
    ) {
      return createSafeBoxResult({
        message: "Error checking username existence",
      });
    }

    const checkUsernameExists = checkUsernameExistsResult.safeUnwrap().data;
    if (checkUsernameExists === undefined) {
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    describe(
      `given:
        ${testKind === "success" ? "valid" : "invalid"} username: ${username}
      `,
      () => {
        if (testKind === "success") {
          it("should return true", () => {
            expect(checkUsernameExists).toBe(true);
          });
        }

        if (testKind === "error") {
          it("should return false", () => {
            expect(checkUsernameExists).toBe(false);
          });
        }
      },
    );

    return createSafeBoxResult({
      data: checkUsernameExists,
      kind: "success",
    });
  } catch (error) {
    return createSafeBoxResult({ message: "Login error" });
  }
}

const EXISTING_USERNAMES = DIRECTORY_EMPLOYEE_DATA.map(
  (employee) => employee.username,
);

await Promise.all(
  EXISTING_USERNAMES.map(async (username) =>
    await handleCheckUsernameExistsTestMock(username, "success")
  ),
);

const NON_EXISTING_USERNAMES = DIRECTORY_EMPLOYEE_DATA.map(
  (employee, idx) => `${idx}${employee.username}`,
);
await Promise.all(
  NON_EXISTING_USERNAMES.map(async (username) =>
    await handleCheckUsernameExistsTestMock(username, "error")
  ),
);

async function handleRegisterButtonClickTestMock(
  schema: UserSchema,
): Promise<SafeBoxResult<UserDocument>> {
  const fetchAbortControllerRef = {
    current: null,
  } as React.RefObject<AbortController | null>;
  const isComponentMountedRef = {
    current: true,
  } as React.RefObject<boolean>;
  const registerDispatch = vi.fn() as React.Dispatch<any>;
  const navigateFn = vi.fn() as NavigateFunction;
  const showBoundary = vi.fn() as (error: unknown) => void;

  try {
    const handleRegisterButtonClickResult = await handleRegisterButtonClick(
      {
        fetchAbortControllerRef,
        isComponentMountedRef,
        navigateFn,
        navigateTo: "/register",
        registerDispatch,
        schema,
        showBoundary,
        url: REGISTER_URL,
      },
    );

    if (
      handleRegisterButtonClickResult.err
    ) {
      return createSafeBoxResult({
        message: handleRegisterButtonClickResult.val.message ??
          "Error registering",
      });
    }

    const userDocumentUnwrapped =
      handleRegisterButtonClickResult.safeUnwrap().data;
    if (userDocumentUnwrapped === undefined) {
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const loginResult = await handleLoginMock({});
    if (loginResult.err) {
      return createSafeBoxResult({
        message: loginResult.val.message ?? "Login failed",
      });
    }

    const loginUnwrapped = loginResult.safeUnwrap().data;
    if (loginUnwrapped === undefined) {
      return createSafeBoxResult({ message: "Login data is undefined" });
    }

    const { accessToken } = loginUnwrapped[0];
    const [userDocument] = userDocumentUnwrapped;

    const url = new URL(`${API_URL}/user/${userDocument._id}`);
    const requestInit: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "DELETE",
      mode: "cors",
    };

    const deleteUserResult = await fetchSafe(url, requestInit);

    if (deleteUserResult.err) {
      return createSafeBoxResult({
        message: deleteUserResult.val.message ?? "Unable to delete user",
      });
    }

    const responseUnwrapped = deleteUserResult.safeUnwrap().data;
    if (responseUnwrapped === undefined) {
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const jsonResult = await responseToJSONSafe<
      HttpServerResponse<boolean>
    >(
      responseUnwrapped,
    );

    if (jsonResult.err) {
      return createSafeBoxResult({
        message: jsonResult.val.message ?? "Error parsing response",
      });
    }

    const serverResponse = jsonResult.safeUnwrap().data;
    if (serverResponse === undefined) {
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const { accessToken: newAccessToken } = serverResponse;

    const logoutResult = await handleLogoutMock({
      newAccessToken,
    });

    if (logoutResult.err) {
      return createSafeBoxResult({
        message: logoutResult.val.message ?? "Logout failed",
      });
    }

    describe("userDocument", () => {
      Object.entries(schema).forEach(([key, value]) => {
        if (key === "password") {
          return;
        }

        it(
          `should check successfully
                        given:
                        ${key}: ${value.toString()?.slice(0, 19)} ...
                        `,
          () => {
            expect(userDocument[key as keyof UserSchema]).toStrictEqual(
              value,
            );
          },
        );
      });
    });

    return createSafeBoxResult({
      data: userDocument,
      kind: "success",
    });
  } catch (error) {
    return createSafeBoxResult({ message: "Registration error" });
  }
}

function generateUserSchemas(amount = 1): UserSchema[] {
  return Array.from({ length: amount }, (_, idx) => {
    const EXCLUDED_KEYS = new Set([
      "_id",
      "createdAt",
      "updatedAt",
      "__v",
    ]);
    const sampleUserSchema = Object.entries(SAMPLE_USER_DOCUMENT).reduce(
      (acc, [key, value]) => {
        if (EXCLUDED_KEYS.has(key)) {
          return acc;
        }

        acc[key as keyof UserSchema] = value;
        return acc;
      },
      Object.create(null),
    );
    const { email, username } = sampleUserSchema;

    return {
      ...sampleUserSchema,
      email: `${idx}${email}`,
      username: `${idx}${username}`,
      password: "passwordQ1!",
    };
  });
}

const userSchemas = generateUserSchemas(1);
await Promise.all(
  userSchemas.map(async (schema) =>
    await handleRegisterButtonClickTestMock(schema)
  ),
);
