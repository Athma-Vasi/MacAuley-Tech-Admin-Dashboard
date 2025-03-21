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

/**
 * // used to validate first name on every change
  useEffect(() => {
    const isValidFirst = NAME_REGEX.test(firstName);

    registerDispatch({
      type: parentAction.setIsValidFirstName,
      payload: isValidFirst,
    });
  }, [firstName, parentAction.setIsValidFirstName, registerDispatch]);

  // used to validate middle name on every change
  useEffect(() => {
    const isValidMiddle = NAME_REGEX.test(middleName);

    registerDispatch({
      type: parentAction.setIsValidMiddleName,
      payload: isValidMiddle,
    });
  }, [middleName, parentAction.setIsValidMiddleName, registerDispatch]);

  // used to validate last name on every change
  useEffect(() => {
    const isValidLast = NAME_REGEX.test(lastName);

    registerDispatch({
      type: parentAction.setIsValidLastName,
      payload: isValidLast,
    });
  }, [lastName, parentAction.setIsValidLastName, registerDispatch]);

  // used to validate profile picture url on every change
  useEffect(() => {
    const isValidPfp = URL_REGEX.test(profilePictureUrl);

    registerDispatch({
      type: parentAction.setIsValidProfilePictureUrl,
      payload: isValidPfp,
    });
  }, [profilePictureUrl, parentAction.setIsValidProfilePictureUrl, registerDispatch]);

  // used to validate preferred name on every change
  useEffect(() => {
    const isValidPreferred = NAME_REGEX.test(preferredName);

    registerDispatch({
      type: parentAction.setIsValidPreferredName,
      payload: isValidPreferred,
    });
  }, [preferredName, parentAction.setIsValidPreferredName, registerDispatch]);

  // used to validate date of birth on every change
  useEffect(() => {
    const isValidDob = DATE_OF_BIRTH_REGEX.test(dateOfBirth) && isAgeOver18(dateOfBirth);

    registerDispatch({
      type: parentAction.setIsValidDateOfBirth,
      payload: isValidDob,
    });
  }, [dateOfBirth, parentAction.setIsValidDateOfBirth, registerDispatch]);

  // update the corresponding pagesInError state if any of the inputs are in error
  useEffect(() => {
    const areOptionalInputsInError =
      (!isValidMiddleName && middleName.length > 0) ||
      (!isValidPreferredName && preferredName.length > 0) ||
      (!isValidProfilePictureUrl && profilePictureUrl.length > 0);
    const areRequiredInputsInError =
      !isValidFirstName || !isValidLastName || !isValidDateOfBirth;
    const isStepInError = areOptionalInputsInError || areRequiredInputsInError;

    registerDispatch({
      type: parentAction.setPageInError,
      payload: {
        kind: isStepInError ? "add" : "delete",
        step: 1,
      },
    });
  }, [
    isValidFirstName,
    isValidLastName,
    isValidMiddleName,
    isValidPreferredName,
    isValidProfilePictureUrl,
    isValidDateOfBirth,
    middleName.length,
    preferredName.length,
    profilePictureUrl.length,
    parentAction.setPageInError,
    registerDispatch,
  ]);

  // following are the accessible text elements for screen readers to read out based on the state of the input
  const [firstNameInputErrorText, firstNameInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "first name",
      inputText: firstName,
      isValidInputText: isValidFirstName,
      isInputTextFocused: isFirstNameFocused,
      regexValidationText: returnNameValidationText({
        content: firstName,
        contentKind: "first name",
        minLength: 2,
        maxLength: 30,
      }),
    });

  const [middleNameInputErrorText, middleNameInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "middle name",
      inputText: middleName,
      isValidInputText: isValidMiddleName,
      isInputTextFocused: isMiddleNameFocused,
      regexValidationText: returnNameValidationText({
        content: middleName,
        contentKind: "middle name",
        minLength: 2,
        maxLength: 30,
      }),
    });

  const [lastNameInputErrorText, lastNameInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "last name",
      inputText: lastName,
      isValidInputText: isValidLastName,
      isInputTextFocused: isLastNameFocused,
      regexValidationText: returnNameValidationText({
        content: lastName,
        contentKind: "last name",
        minLength: 2,
        maxLength: 30,
      }),
    });

  const [preferredNameInputErrorText, preferredNameInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "preferred name",
      inputText: preferredName,
      isValidInputText: isValidPreferredName,
      isInputTextFocused: isPreferredNameFocused,
      regexValidationText: returnNameValidationText({
        content: preferredName,
        contentKind: "preferred name",
        minLength: 2,
        maxLength: 30,
      }),
    });

  const [profilePictureUrlInputErrorText, profilePictureUrlInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "profile picture url",
      inputText: profilePictureUrl,
      isValidInputText: isValidProfilePictureUrl,
      isInputTextFocused: isProfilePictureUrlFocused,
      regexValidationText: returnUrlValidationText({
        content: profilePictureUrl,
        contentKind: "profile picture url",
      }),
    });

  // useCallback function of isAgeOver18

  const isLegalAdultMessage =
    isAgeOver18(dateOfBirth) || dateOfBirth === ""
      ? ""
      : "You must be 18 years or older to register.";

  const [dateOfBirthInputErrorText, dateOfBirthInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "date of birth",
      inputText: dateOfBirth,
      isValidInputText: isValidDateOfBirth,
      isInputTextFocused: isDateOfBirthFocused,
      regexValidationText: `${isLegalAdultMessage} ${returnDateOfBirthValidationText({
        content: dateOfBirth,
        contentKind: "date of birth",
      })}`,
    });

  const firstNameTextInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: firstNameInputErrorText,
      valid: firstNameInputValidText,
    },
    inputText: firstName,
    isValidInputText: isValidFirstName,
    label: "First name",
    onBlur: () => {
      registerDispatch({
        type: parentAction.setIsFirstNameFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      registerDispatch({
        type: parentAction.setFirstName,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
      registerDispatch({
        type: parentAction.setIsFirstNameFocused,
        payload: true,
      });
    },
    placeholder: "Enter first name",
    required: true,
    withAsterisk: true,
    semanticName: "first name",
  };

  const middleNameTextInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: middleNameInputErrorText,
      valid: middleNameInputValidText,
    },
    inputText: middleName,
    isValidInputText: isValidMiddleName,
    label: "Middle name",
    onBlur: () => {
      registerDispatch({
        type: parentAction.setIsMiddleNameFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      registerDispatch({
        type: parentAction.setMiddleName,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
      registerDispatch({
        type: parentAction.setIsMiddleNameFocused,
        payload: true,
      });
    },
    placeholder: "Enter middle name",
    semanticName: "middle name",
  };

  const lastNameTextInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: lastNameInputErrorText,
      valid: lastNameInputValidText,
    },
    inputText: lastName,
    isValidInputText: isValidLastName,
    label: "Last name",
    onBlur: () => {
      registerDispatch({
        type: parentAction.setIsLastNameFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      registerDispatch({
        type: parentAction.setLastName,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
      registerDispatch({
        type: parentAction.setIsLastNameFocused,
        payload: true,
      });
    },
    placeholder: "Enter last name",
    required: true,
    withAsterisk: true,
    semanticName: "last name",
  };

  const preferredNameTextInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: preferredNameInputErrorText,
      valid: preferredNameInputValidText,
    },
    inputText: preferredName,
    isValidInputText: isValidPreferredName,
    label: "Preferred name",
    onBlur: () => {
      registerDispatch({
        type: parentAction.setIsPreferredNameFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      registerDispatch({
        type: parentAction.setPreferredName,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
      registerDispatch({
        type: parentAction.setIsPreferredNameFocused,
        payload: true,
      });
    },
    placeholder: "Enter preferred name",
    semanticName: "preferred name",
  };

  const profilePictureUrlTextInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: profilePictureUrlInputErrorText,
      valid: profilePictureUrlInputValidText,
    },
    inputText: profilePictureUrl,
    isValidInputText: isValidProfilePictureUrl,
    label: "Profile picture url",
    onBlur: () => {
      registerDispatch({
        type: parentAction.setIsProfilePictureUrlFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      registerDispatch({
        type: parentAction.setProfilePictureUrl,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
      registerDispatch({
        type: parentAction.setIsProfilePictureUrlFocused,
        payload: true,
      });
    },
    placeholder: "Enter profile picture url",
    semanticName: "profile picture url",
  };

  const preferredPronounsSelectInputCreatorInfo: AccessibleSelectInputCreatorInfo = {
    description: "Select your preferred pronouns",
    label: "Preferred pronouns",
    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
      registerDispatch({
        type: parentAction.setPreferredPronouns,
        payload: event.currentTarget.value as PreferredPronouns,
      });
    },
    data: PREFERRED_PRONOUNS_DATA,
    value: preferredPronouns,
  };

  const dateOfBirthInputCreatorInfo: AccessibleDateTimeInputCreatorInfo = {
    dateKind: "full date",
    description: {
      error: dateOfBirthInputErrorText,
      valid: dateOfBirthInputValidText,
    },
    inputKind: "date",
    inputText: dateOfBirth,
    isValidInputText: isValidDateOfBirth,
    label: "Date of birth",
    onBlur: () => {
      registerDispatch({
        type: parentAction.setIsDateOfBirthFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      registerDispatch({
        type: parentAction.setDateOfBirth,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
      registerDispatch({
        type: parentAction.setIsDateOfBirthFocused,
        payload: true,
      });
    },
    placeholder: "Enter date of birth",
    required: true,
    semanticName: "date of birth",
  };

  const [
    createdFirstNameTextInput,
    createdMiddleNameTextInput,
    createdLastNameTextInput,
    createdPreferredNameTextInput,
    createdProfilePictureUrlTextInput,
  ] = returnAccessibleTextInputElements([
    firstNameTextInputCreatorInfo,
    middleNameTextInputCreatorInfo,
    lastNameTextInputCreatorInfo,
    preferredNameTextInputCreatorInfo,
    profilePictureUrlTextInputCreatorInfo,
  ]);

  const [createdPreferredPronounsSelectInput] = returnAccessibleSelectInputElements([
    preferredPronounsSelectInputCreatorInfo,
  ]);

  const [createdDateOfBirthInput] = returnAccessibleDateTimeElements([
    dateOfBirthInputCreatorInfo,
  ]);

  const createdPersonalInfoForm = (
    <FormLayoutWrapper>
      {createdFirstNameTextInput}
      {createdMiddleNameTextInput}
      {createdLastNameTextInput}
      {createdPreferredNameTextInput}
      {createdProfilePictureUrlTextInput}
      {createdPreferredPronounsSelectInput}
      {createdDateOfBirthInput}
    </FormLayoutWrapper>
  );

  return <>{createdPersonalInfoForm}</>;

 */
