import {
  COUNTRIES_DATA,
  DEPARTMENT_DATA,
  JOB_POSITION_DATA,
  PROVINCES,
  STATES_US,
  STORE_LOCATION_DATA,
} from "../../constants";
import type {
  CheckboxRadioSelectData,
  Country,
  PreferredPronouns,
  StepperChild,
  StepperPage,
} from "../../types";

function returnRegisterperPages(country: Country): StepperPage[] {
  const addressLine: StepperChild = {
    inputType: "text",
    name: "addressLine",
    validationKey: "addressLine",
  };

  const city: StepperChild = {
    inputType: "text",
    name: "city",
    validationKey: "city",
  };

  const confirmPassword: StepperChild = {
    inputType: "text",
    name: "confirmPassword",
    validationKey: "password",
  };

  const contactNumber: StepperChild = {
    inputType: "text",
    name: "contactNumber",
    validationKey: "phoneNumber",
  };

  const countryChild: StepperChild = {
    inputType: "select",
    name: "country",
    selectInputData: COUNTRIES_DATA,
  };

  const dateOfBirth: StepperChild = {
    inputType: "date",
    name: "dateOfBirth",
    validationKey: "dateOfBirth",
  };

  const department: StepperChild = {
    inputType: "select",
    name: "department",
    selectInputData: DEPARTMENT_DATA,
  };

  const email: StepperChild = {
    inputType: "text",
    name: "email",
    validationKey: "email",
  };

  const emergencyContactName: StepperChild = {
    inputType: "text",
    name: "emergencyContactName",
    validationKey: "fullName",
  };

  const emergencyContactNumber: StepperChild = {
    inputType: "text",
    name: "emergencyContactNumber",
    validationKey: "phoneNumber",
  };

  const firstName: StepperChild = {
    inputType: "text",
    name: "firstName",
    validationKey: "name",
  };

  const jobPosition: StepperChild = {
    inputType: "select",
    name: "jobPosition",
    selectInputData: JOB_POSITION_DATA,
  };

  const lastName: StepperChild = {
    inputType: "text",
    name: "lastName",
    validationKey: "name",
  };

  const middleName: StepperChild = {
    inputType: "text",
    name: "middleName",
    validationKey: "name",
  };

  const password: StepperChild = {
    inputType: "text",
    name: "password",
    validationKey: "password",
  };

  const postalCode: StepperChild = country === "Canada"
    ? {
      inputType: "text",
      name: "postalCode",
      validationKey: "postalCodeCanada",
    }
    : {
      inputType: "text",
      name: "postalCode",
      validationKey: "postalCodeUS",
    };

  const preferredName: StepperChild = {
    inputType: "text",
    name: "preferredName",
    validationKey: "fullName",
  };

  const preferredPronouns: StepperChild = {
    inputType: "select",
    name: "preferredPronouns",
    selectInputData: PREFERRED_PRONOUNS_DATA,
  };

  const profilePictureUrl: StepperChild = {
    inputType: "text",
    name: "profilePictureUrl",
    validationKey: "url",
  };

  const province: StepperChild = {
    inputType: "select",
    name: "province",
    selectInputData: PROVINCES,
  };

  const startDate: StepperChild = {
    inputType: "date",
    name: "startDate",
    validationKey: "date",
  };

  const state: StepperChild = {
    inputType: "select",
    name: "state",
    selectInputData: STATES_US,
  };

  const storeLocation: StepperChild = {
    inputType: "select",
    name: "storeLocation",
    selectInputData: STORE_LOCATION_DATA,
  };

  const username: StepperChild = {
    inputType: "text",
    name: "username",
    validationKey: "username",
  };

  return [
    {
      children: [username, email, password, confirmPassword],
      description: "Authentication",
    },

    {
      children: [
        firstName,
        middleName,
        lastName,
        preferredName,
        preferredPronouns,
        dateOfBirth,
        profilePictureUrl,
      ],
      description: "Personal information",
    },

    {
      children: [
        countryChild,
        addressLine,
        city,
        province,
        state,
        postalCode,
        contactNumber,
      ],
      description: "Contact details",
    },

    {
      children: [
        jobPosition,
        department,
        storeLocation,
        emergencyContactName,
        emergencyContactNumber,
        startDate,
      ],
      description: "Additional information",
    },

    {
      children: [],
      description: "Review and proceed",
      kind: "review",
    },
  ];
}

const REGISTER_ROLE_ROUTE_PATHS = {
  admin: "/user",
  manager: "/user",
  employee: "/user",
};

const REGISTER_URL = "http://localhost:5500/api/v1/user";

const REGISTER_MAX_STEPPER_POSITION = 5;

const PREFERRED_PRONOUNS_DATA: CheckboxRadioSelectData<PreferredPronouns> = [
  { label: "Prefer not to say", value: "Prefer not to say" },
  { label: "He/Him", value: "He/Him" },
  { label: "She/Her", value: "She/Her" },
  { label: "They/Them", value: "They/Them" },
  { label: "Other", value: "Other" },
];

export {
  PREFERRED_PRONOUNS_DATA,
  REGISTER_MAX_STEPPER_POSITION,
  REGISTER_ROLE_ROUTE_PATHS,
  REGISTER_URL,
  returnRegisterperPages,
};
