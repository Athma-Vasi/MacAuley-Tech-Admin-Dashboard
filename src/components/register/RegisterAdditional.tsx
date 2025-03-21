import { Stack } from "@mantine/core";

import {
  DEPARTMENT_DATA,
  JOB_POSITION_DATA,
  STORE_LOCATION_DATA,
} from "../../constants";
import {
  Department,
  JobPosition,
  PhoneNumber,
  StepperPage,
  StoreLocation,
} from "../../types";
import { AccessibleDateTimeInput } from "../accessibleInputs/AccessibleDateTimeInput";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";

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
