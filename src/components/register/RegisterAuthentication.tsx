import { Stack } from "@mantine/core";

import type { StepperPage } from "../../types";
import { AccessiblePasswordInput } from "../accessibleInputs/AccessiblePasswordInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import type { RegisterAction } from "./types";

type RegisterAuthenticationProps = {
  confirmPassword: string;
  email: string;
  parentAction: RegisterAction;
  parentDispatch: any;
  password: string;
  stepperPages: StepperPage[];
  username: string;
};

function RegisterAuthentication({
  confirmPassword,
  email,
  parentAction,
  parentDispatch,
  password,
  stepperPages,
  username,
}: RegisterAuthenticationProps) {
  const confirmPasswordTextInput = (
    <AccessiblePasswordInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "confirmPassword",
        page: 0,
        parentDispatch,
        passwordValue: password,
        validValueAction: parentAction.setConfirmPassword,
        value: confirmPassword,
      }}
    />
  );

  const emailTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "email",
        page: 0,
        parentDispatch,
        validValueAction: parentAction.setEmail,
        value: email,
      }}
    />
  );

  const passwordTextInput = (
    <AccessiblePasswordInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "password",
        page: 0,
        parentDispatch,
        validValueAction: parentAction.setPassword,
        value: password,
      }}
    />
  );

  const usernameTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "username",
        page: 0,
        parentDispatch,
        validValueAction: parentAction.setUsername,
        value: username,
      }}
    />
  );

  return (
    <Stack>
      {emailTextInput}
      {usernameTextInput}
      {passwordTextInput}
      {confirmPasswordTextInput}
    </Stack>
  );
}

export { RegisterAuthentication };

/**
 * // used to validate email on every change
  useEffect(() => {
    const isValidMail = EMAIL_REGEX.test(email) && !isEmailExists;

    registerDispatch({
      type: parentAction.setIsValidEmail,
      payload: isValidMail,
    });
  }, [email, isEmailExists, parentAction.setIsValidEmail, registerDispatch]);

  // used to validate username on every change
  useEffect(() => {
    const isValidUsr = USERNAME_REGEX.test(username) && !isUsernameExists;

    registerDispatch({
      type: parentAction.setIsValidUsername,
      payload: isValidUsr,
    });
  }, [isUsernameExists, parentAction.setIsValidUsername, registerDispatch, username]);

  // used to validate password on every change and confirm password on every change
  useEffect(() => {
    const isValidPwd = PASSWORD_REGEX.test(password);

    registerDispatch({
      type: parentAction.setIsValidPassword,
      payload: isValidPwd,
    });

    const matchPassword = password === confirmPassword;
    registerDispatch({
      type: parentAction.setIsValidConfirmPassword,
      payload: matchPassword && password.length > 0,
    });
  }, [
    password,
    confirmPassword,
    registerDispatch,
    parentAction.setIsValidPassword,
    parentAction.setIsValidConfirmPassword,
  ]);

  // update the corresponding pagesInError state if any of the inputs are in error
  useEffect(() => {
    const isStepInError =
      !isValidEmail || !isValidUsername || !isValidPassword || !isValidConfirmPassword;

    registerDispatch({
      type: parentAction.setPageInError,
      payload: {
        kind: isStepInError ? "add" : "delete",
        step: 0,
      },
    });
  }, [
    isValidEmail,
    isValidUsername,
    isValidPassword,
    isValidConfirmPassword,
    registerDispatch,
    parentAction.setPageInError,
  ]);

  // following are the accessible text elements for screen readers to read out based on the state of the input
  const [emailInputErrorText, emailInputValidText] = AccessibleErrorValidTextElements({
    inputElementKind: "email",
    inputText: email,
    isValidInputText: isValidEmail,
    isInputTextFocused: isEmailFocused,
    regexValidationText: `${
      isEmailExists
        ? "Email already exists. Please choose another."
        : `${returnEmailValidationText({
            content: email,
            contentKind: "email",
          })}`
    }`,
  });

  const [usernameInputErrorText, usernameInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "username",
      inputText: username,
      isValidInputText: isValidUsername,
      isInputTextFocused: isUsernameFocused,
      regexValidationText: `${
        isUsernameExists
          ? "Username already exists. Please choose another."
          : `${returnUsernameRegexValidationText({
              content: username,
              contentKind: "username",
            })}`
      } `,
    });

  const passwordRegexValidationText = returnPasswordRegexValidationText({
    content: password,
    contentKind: "password",
  });

  const [passwordInputErrorText, passwordInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "password",
      inputText: password,
      isValidInputText: isValidPassword,
      isInputTextFocused: isPasswordFocused,
      regexValidationText: `${passwordRegexValidationText}${
        passwordRegexValidationText.includes("special") ? " !, @, #, $, %, ^, &, *" : ""
      }`,
    });

  const [confirmPasswordInputErrorText, confirmPasswordInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "confirm password",
      inputText: confirmPassword,
      isValidInputText: isValidConfirmPassword,
      isInputTextFocused: isConfirmPasswordFocused,
      regexValidationText: `${
        isValidPassword && !isValidConfirmPassword ? "Passwords do not match" : ""
      }`,
    });

  const emailTextInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: emailInputErrorText,
      valid: emailInputValidText,
    },
    inputText: email,
    isValidInputText: isValidEmail,
    label: "Email",
    onBlur: () => {
      registerDispatch({
        type: parentAction.setIsEmailFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      registerDispatch({
        type: parentAction.setEmail,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
      registerDispatch({
        type: parentAction.setIsEmailFocused,
        payload: true,
      });
    },
    placeholder: "Enter email address",
    required: true,
    withAsterisk: true,
    semanticName: "email",
  };

  const usernameTextInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: usernameInputErrorText,
      valid: usernameInputValidText,
    },
    inputText: username,
    isValidInputText: isValidUsername,
    label: "Username",
    onBlur: () => {
      registerDispatch({
        type: parentAction.setIsUsernameFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      registerDispatch({
        type: parentAction.setUsername,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
      registerDispatch({
        type: parentAction.setIsUsernameFocused,
        payload: true,
      });
    },
    placeholder: "Enter username",
    required: true,
    withAsterisk: true,
    semanticName: "username",
  };

  const passwordTextInputCreatorInfo: AccessiblePasswordInputCreatorInfo = {
    description: {
      error: passwordInputErrorText,
      valid: passwordInputValidText,
    },
    inputText: password,
    isValidInputText: isValidPassword,
    label: "Password",
    onBlur: () => {
      registerDispatch({
        type: parentAction.setIsPasswordFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      registerDispatch({
        type: parentAction.setPassword,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
      registerDispatch({
        type: parentAction.setIsPasswordFocused,
        payload: true,
      });
    },
    placeholder: "Enter password",
    required: true,
    withAsterisk: true,
    semanticName: "password",
  };

  const confirmPasswordTextInputCreatorInfo: AccessiblePasswordInputCreatorInfo = {
    description: {
      error: confirmPasswordInputErrorText,
      valid: confirmPasswordInputValidText,
    },
    inputText: confirmPassword,
    isValidInputText: isValidConfirmPassword,
    label: "Confirm password",
    onBlur: () => {
      registerDispatch({
        type: parentAction.setIsConfirmPasswordFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      registerDispatch({
        type: parentAction.setConfirmPassword,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
      registerDispatch({
        type: parentAction.setIsConfirmPasswordFocused,
        payload: true,
      });
    },
    placeholder: "Confirm password",
    required: true,
    withAsterisk: true,
    semanticName: "confirm password",
  };

  // following are the created accessible input elements
  const [createdEmailTextInputElement, createdUsernameTextInputElement] =
    returnAccessibleTextInputElements([
      emailTextInputCreatorInfo,
      usernameTextInputCreatorInfo,
    ]);

  const [createdPasswordTextInputElement, createdConfirmPasswordTextInputElement] =
    returnAccessiblePasswordInputElements([
      passwordTextInputCreatorInfo,
      confirmPasswordTextInputCreatorInfo,
    ]);

  const createdAuthenticationPageForm = (
    <FormLayoutWrapper>
      {createdEmailTextInputElement}
      {createdUsernameTextInputElement}
      {createdPasswordTextInputElement}
      {createdConfirmPasswordTextInputElement}
    </FormLayoutWrapper>
  );

  return <>{createdAuthenticationPageForm}</>;
 */
