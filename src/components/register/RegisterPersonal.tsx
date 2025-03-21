import { Stack } from "@mantine/core";

import type { PreferredPronouns, StepperPage } from "../../types";
import { AccessibleDateTimeInput } from "../accessibleInputs/AccessibleDateTimeInput";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import type { RegisterAction } from "./actions";
import { PREFERRED_PRONOUNS_DATA } from "./constants";

type RegisterPersonalProps = {
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  middleName: string;
  parentAction: RegisterAction;
  parentDispatch: any;
  preferredName: string;
  preferredPronouns: PreferredPronouns;
  profilePictureUrl: string;
  stepperPages: StepperPage[];
};

function RegisterPersonal({
  dateOfBirth,
  firstName,
  lastName,
  middleName,
  parentAction,
  parentDispatch,
  preferredName,
  preferredPronouns,
  profilePictureUrl,
  stepperPages,
}: RegisterPersonalProps) {
  const dateOfBirthTextInput = (
    <AccessibleDateTimeInput
      attributes={{
        dateKind: "full date",
        inputKind: "date",
        invalidValueAction: parentAction.setPageInError,
        name: "dateOfBirth",
        page: 1,
        parentDispatch,
        stepperPages,
        validValueAction: parentAction.setDateOfBirth,
        value: dateOfBirth,
      }}
    />
  );

  const firstNameTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "firstName",
        page: 1,
        parentDispatch,
        validValueAction: parentAction.setFirstName,
        value: firstName,
      }}
    />
  );

  const lastNameTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "lastName",
        page: 1,
        parentDispatch,
        validValueAction: parentAction.setLastName,
        value: lastName,
      }}
    />
  );

  const middleNameTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "middleName",
        page: 1,
        parentDispatch,
        validValueAction: parentAction.setMiddleName,
        value: middleName,
      }}
    />
  );

  const preferredNameTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "preferredName",
        page: 1,
        parentDispatch,
        validValueAction: parentAction.setPreferredName,
        value: preferredName,
      }}
    />
  );

  const preferredPronounsSelectInput = (
    <AccessibleSelectInput<
      RegisterAction["setPreferredPronouns"],
      PreferredPronouns
    >
      attributes={{
        data: PREFERRED_PRONOUNS_DATA,
        name: "preferredPronouns",
        parentDispatch,
        validValueAction: parentAction.setPreferredPronouns,
        value: preferredPronouns,
      }}
    />
  );

  const profilePictureUrlTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "profilePictureUrl",
        page: 1,
        parentDispatch,
        validValueAction: parentAction.setProfilePictureUrl,
        value: profilePictureUrl,
      }}
    />
  );

  return (
    <Stack>
      {dateOfBirthTextInput}
      {firstNameTextInput}
      {lastNameTextInput}
      {middleNameTextInput}
      {preferredNameTextInput}
      {preferredPronounsSelectInput}
      {profilePictureUrlTextInput}
    </Stack>
  );
}

export { RegisterPersonal };
