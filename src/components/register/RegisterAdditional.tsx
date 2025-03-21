import { Stack } from "@mantine/core";

import {
  DEPARTMENT_DATA,
  JOB_POSITION_DATA,
  STORE_LOCATION_DATA,
} from "../../constants/data";
import { JobPosition, PhoneNumber, StepperPage, StoreLocation } from "../../types";
import { AccessibleDateTimeInput } from "../accessibleInputs/AccessibleDateTimeInput";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import { Department } from "../survey/types";
import { RegisterAction } from "./actions";

type RegisterAdditionalProps = {
  department: Department;
  emergencyContactName: string;
  emergencyContactNumber: PhoneNumber;
  jobPosition: JobPosition;
  parentAction: RegisterAction;
  parentDispatch: any;
  startDate: string;
  stepperPages: StepperPage[];
  storeLocation: StoreLocation;
};

function RegisterAdditional({
  department,
  emergencyContactName,
  emergencyContactNumber,
  jobPosition,
  parentAction,
  parentDispatch,
  startDate,
  stepperPages,
  storeLocation,
}: RegisterAdditionalProps) {
  const emergencyContactNameTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "emergencyContactName",
        page: 3,
        parentDispatch,
        validValueAction: parentAction.setEmergencyContactName,
        value: emergencyContactName,
      }}
    />
  );

  const emergencyContactNumberTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "emergencyContactNumber",
        page: 3,
        parentDispatch,
        validValueAction: parentAction.setEmergencyContactNumber,
        value: emergencyContactNumber,
      }}
    />
  );

  const jobPositionSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: JOB_POSITION_DATA,
        name: "jobPosition",
        parentDispatch,
        validValueAction: parentAction.setJobPosition,
        value: jobPosition,
      }}
    />
  );

  const departmentSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: DEPARTMENT_DATA,
        name: "department",
        parentDispatch,
        validValueAction: parentAction.setDepartment,
        value: department,
      }}
    />
  );

  const startDateTextInput = (
    <AccessibleDateTimeInput
      attributes={{
        dateKind: "date near future",
        inputKind: "date",
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "startDate",
        page: 3,
        parentDispatch,
        validValueAction: parentAction.setStartDate,
        value: startDate,
      }}
    />
  );

  const storeLocationSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: STORE_LOCATION_DATA,
        name: "storeLocation",
        parentDispatch,
        validValueAction: parentAction.setStoreLocation,
        value: storeLocation,
      }}
    />
  );

  return (
    <Stack>
      {emergencyContactNameTextInput}
      {emergencyContactNumberTextInput}
      {departmentSelectInput}
      {jobPositionSelectInput}
      {storeLocationSelectInput}
      {startDateTextInput}
    </Stack>
  );
}

export { RegisterAdditional };

/**
 * // used to validate emergency contact full name on every change
  useEffect(() => {
    const isValidEmergencyName = FULL_NAME_REGEX.test(fullName);

({
      type: parentAction.setIsValidEmergencyContactFullName,
      payload: isValidEmergencyName,
    });
  }, [fullName, parentAction.setIsValidEmergencyContactFullName]);

  // used to validate emergency contact phone number on every change
  useEffect(() => {
    const isValidEmergencyNumber = PHONE_NUMBER_REGEX.test(phoneNumber);

    const phoneNumberLength = phoneNumber.length;
    if (isPhoneNumberFocused) {
      switch (phoneNumberLength) {
        case 4: {
      ({
            type: parentAction.setEmergencyContactNumber,
            payload: `${phoneNumber}(`,
          });
          break;
        }
        case 8: {
      ({
            type: parentAction.setEmergencyContactNumber,
            payload: `${phoneNumber}) `,
          });
          break;
        }
        case 13: {
      ({
            type: parentAction.setEmergencyContactNumber,
            payload: `${phoneNumber}-`,
          });
          break;
        }

        default:
          break;
      }
    }

({
      type: parentAction.setIsValidEmergencyContactPhoneNumber,
      payload: isValidEmergencyNumber,
    });
  }, [
    phoneNumber,
    isPhoneNumberFocused,
,
    parentAction.setIsValidEmergencyContactPhoneNumber,
    parentAction.setEmergencyContactNumber,
  ]);

  // used to validate start date on every change
  useEffect(() => {
    const isValidDate = DATE_REGEX.test(startDate);

({
      type: parentAction.setIsValidStartDate,
      payload: isValidDate,
    });
  }, [parentAction.setIsValidStartDate, startDate]);

  // update the corresponding pagesInError state if any of the inputs are in error
  useEffect(() => {
    const isStepInError = !isValidFullName || !isValidPhoneNumber || !isValidStartDate;

({
      type: parentAction.setPageInError,
      payload: {
        kind: isStepInError ? "add" : "delete",
        step: 3,
      },
    });
  }, [
    isValidFullName,
    isValidPhoneNumber,
    isValidStartDate,
    parentAction.setPageInError,
,
  ]);

  const [emergencyContactFullNameInputErrorText, emergencyContactFullNameInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "full name",
      inputText: fullName,
      isInputTextFocused: isFullNameFocused,
      isValidInputText: isValidFullName,
      regexValidationText: returnNameValidationText({
        content: fullName,
        contentKind: "full name",
        minLength: 2,
        maxLength: 100,
      }),
    });

  const [emergencyPhoneNumberInputErrorText, emergencyPhoneNumberInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "phone number",
      inputText: phoneNumber,
      isInputTextFocused: isPhoneNumberFocused,
      isValidInputText: isValidPhoneNumber,
      regexValidationText: returnPhoneNumberValidationText({
        content: phoneNumber,
        contentKind: "phone number",
      }),
    });

  const [startDateInputErrorText, startDateInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "start date",
      inputText: startDate,
      isInputTextFocused: isStartDateFocused,
      isValidInputText: isValidStartDate,
      regexValidationText: returnDateValidationText({
        content: startDate,
        contentKind: "start date",
      }),
    });

  const departmentSelectInputCreatorInfo: AccessibleSelectInputCreatorInfo = {
    data: DEPARTMENT_DATA,
    description: "Select your department",
    label: "Department",
    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
  ({
        type: parentAction.setDepartment,
        payload: event.currentTarget.value as Department,
      });
    },
    required: true,
    value: department,
    withAsterisk: true,
  };

  const jobPositionSelectInputCreatorInfo: AccessibleSelectInputCreatorInfo = {
    data: DEPARTMENT_JOB_POSITION_MAP.get(department) ?? [],
    description: "Select your job position",
    label: "Job position",
    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
  ({
        type: parentAction.setJobPosition,
        payload: event.currentTarget.value as JobPosition,
      });
    },
    required: true,
    value: jobPosition,
    withAsterisk: true,
  };

  const isStoreLocationSelectInputDisabled = [
    "Executive Management",
    "Accounting",
    "Sales",
    "Marketing",
    "Human Resources",
    "Information Technology",
  ].includes(department);

  const storeLocationSelectInputCreatorInfo: AccessibleSelectInputCreatorInfo = {
    data: STORE_LOCATION_DATA,
    disabled: isStoreLocationSelectInputDisabled,
    description: "Select your store location",
    label: "Store location",
    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
  ({
        type: parentAction.setStoreLocation,
        payload: event.currentTarget.value as StoreLocation,
      });
    },
    required: true,
    value: storeLocation,
    withAsterisk: true,
  };

  const emergencyContactFullNameInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: emergencyContactFullNameInputErrorText,
      valid: emergencyContactFullNameInputValidText,
    },
    inputText: fullName,
    isValidInputText: isValidFullName,
    label: "Full name",
    onBlur: () => {
  ({
        type: parentAction.setIsEmergencyContactFullNameFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
  ({
        type: parentAction.setEmergencyContactName,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
  ({
        type: parentAction.setIsEmergencyContactFullNameFocused,
        payload: true,
      });
    },
    placeholder: "Enter contact's full name",
    required: true,
    withAsterisk: true,
    semanticName: "full name",
  };

  const emergencyPhoneNumberInputCreatorInfo: AccessiblePhoneNumberTextInputCreatorInfo =
    {
      description: {
        error: emergencyPhoneNumberInputErrorText,
        valid: emergencyPhoneNumberInputValidText,
      },
      inputText: phoneNumber,
      isValidInputText: isValidPhoneNumber,
      label: "Emergency contact number",
      onBlur: () => {
    ({
          type: parentAction.setIsEmergencyContactPhoneNumberFocused,
          payload: false,
        });
      },
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
    ({
          type: parentAction.setEmergencyContactNumber,
          payload: event.currentTarget.value,
        });
      },
      onFocus: () => {
    ({
          type: parentAction.setIsEmergencyContactPhoneNumberFocused,
          payload: true,
        });
      },
      placeholder: "Enter your contact's number",
      rightSection: true,
      rightSectionOnClick: () => {
    ({
          type: parentAction.setEmergencyContactNumber,
          payload: "+(1)",
        });
      },
      required: true,
      withAsterisk: true,
      semanticName: "phone number",
      onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
          if (phoneNumber.length === 14 || phoneNumber.length === 9) {
        ({
              type: parentAction.setEmergencyContactNumber,
              payload: phoneNumber.slice(0, -1),
            });
          }
        }
      },
    };

  const startDateInputCreatorInfo: AccessibleDateTimeInputCreatorInfo = {
    description: {
      error: startDateInputErrorText,
      valid: startDateInputValidText,
    },
    inputText: startDate,
    isValidInputText: isValidStartDate,
    label: "Start date",
    onBlur: () => {
  ({
        type: parentAction.setIsStartDateFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
  ({
        type: parentAction.setStartDate,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
  ({
        type: parentAction.setIsStartDateFocused,
        payload: true,
      });
    },
    placeholder: "Enter your start date",
    required: true,
    withAsterisk: true,
    semanticName: "start date",
    inputKind: "date",
    dateKind: "full date",
  };

  const [
    createdJobPositionSelectInput,
    createdDepartmentSelectInput,
    createdStoreLocationSelectInput,
  ] = returnAccessibleSelectInputElements([
    jobPositionSelectInputCreatorInfo,
    departmentSelectInputCreatorInfo,
    storeLocationSelectInputCreatorInfo,
  ]);

  const [createdEmergencyContactFullNameInput] = returnAccessibleTextInputElements([
    emergencyContactFullNameInputCreatorInfo,
  ]);

  const [createdEmergencyPhoneNumberInput] = returnAccessiblePhoneNumberTextInputElements(
    [emergencyPhoneNumberInputCreatorInfo]
  );

  const [createdStartDateInput] = returnAccessibleDateTimeElements([
    startDateInputCreatorInfo,
  ]);

  const displayRegisterAdditional = (
    <FormLayoutWrapper>
      {createdDepartmentSelectInput}
      {createdJobPositionSelectInput}
      {createdStoreLocationSelectInput}
      {createdEmergencyContactFullNameInput}
      {createdEmergencyPhoneNumberInput}
      {createdStartDateInput}
    </FormLayoutWrapper>
  );

  return <>{displayRegisterAdditional}</>;

 */
