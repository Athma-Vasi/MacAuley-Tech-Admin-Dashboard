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
