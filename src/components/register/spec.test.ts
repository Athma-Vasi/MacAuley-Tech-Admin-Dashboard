import { describe, expect, it } from "vitest";
import { registerAction } from "./actions";
import { registerReducer_setConfirmPassword } from "./reducers";
import { RegisterDispatch } from "./schemas";
import { initialRegisterState } from "./state";

describe("registerReducer_setConfirmPassword", () => {
    it("should allow valid string values", () => {
        const validValues = ["password123Q!", "asdasdasdQ1!", "abcdefgQ1!"];
        validValues.forEach((value) => {
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
        const invalidValues = [
            null,
            undefined,
            0,
            1,
            {},
            [],
        ];
        const initialConfirmPassword = initialRegisterState.confirmPassword;
        invalidValues.forEach((value) => {
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

/**
 * type RegisterState = {
  // register personal
  confirmPassword: string;
  email: string;
  isEmailExists: boolean;
  isEmailExistsSubmitting: boolean;
  isUsernameExists: boolean;
  isUsernameExistsSubmitting: boolean;
  password: string;
  username: string;

  // register address
  addressLine: string;
  city: string;
  country: Country;
  postalCodeCanada: CanadianPostalCode;
  postalCodeUS: USPostalCode;
  province: Province;
  state: StatesUS;

  // register additional
  department: Department;
  firstName: string;
  jobPosition: JobPosition;
  lastName: string;
  profilePictureUrl: string;
  storeLocation: AllStoreLocations;

  errorMessage: string;
  isError: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  activeStep: number;
  stepsInError: Set<number>;
  stepsWithEmptyInputs: Set<number>;
  inputsInError: Set<ValidationKey>;
};
 */

/**
 * registerReducer_setActiveStep,
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
  registerReducer_setPostalCode,
  registerReducer_setPostalCodeCanada,
  registerReducer_setProfilePictureUrl,
  registerReducer_setProvince,
  registerReducer_setState,
  registerReducer_setStepsInError,
  registerReducer_setStepsWithEmptyInputs,
  registerReducer_setStoreLocation,
  registerReducer_setUsername,
 */
