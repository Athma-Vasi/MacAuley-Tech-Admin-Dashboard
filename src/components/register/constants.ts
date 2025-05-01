import { ValidationKey } from "../../validations";

const REGISTER_ROLE_ROUTE_PATHS = {
  admin: "/user",
  manager: "/user",
  employee: "/user",
};

const REGISTER_URL = "http://localhost:5000/auth/register";

const REGISTER_MAX_STEPPER_POSITION = 5;

// inputs that are user provided are validated
const STEPS_INPUTNAMES_MAP: Map<number, Array<ValidationKey>> = new Map([
  [
    0,
    [
      "username",
      "email",
      "password",
      "confirmPassword",
    ],
  ],
  [
    1,
    [
      "firstName",
      "lastName",
      "profilePictureUrl",
    ],
  ],
  [
    2,
    [
      "addressLine",
      "city",
      "postalCodeCanada",
      "postalCodeUS",
    ],
  ],
  [
    3,
    [],
  ],
]);

const REGISTER_STEPS = [
  "Authentication",
  "Personal",
  "Address",
  "File",
  "Review",
];
const MAX_REGISTER_STEPS = REGISTER_STEPS.length;

export {
  MAX_REGISTER_STEPS,
  REGISTER_MAX_STEPPER_POSITION,
  REGISTER_ROLE_ROUTE_PATHS,
  REGISTER_STEPS,
  REGISTER_URL,
  STEPS_INPUTNAMES_MAP,
};
