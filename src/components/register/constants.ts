import { UserSchema } from "../../types";
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
    ["profilePictureUrl"],
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

const SAMPLE_USER_SCHEMA: UserSchema = {
  username: "0manager",
  email: "0manager@example.com",
  password: "passwordQ1!",
  addressLine: "123 Main St",
  city: "Calgary",
  country: "Canada",
  department: "Maintenance",
  firstName: "John",
  jobPosition: "Custodian",
  lastName: "Doe",
  orgId: 160,
  postalCodeCanada: "T2A 1A1",
  postalCodeUS: "12345",
  profilePictureUrl: "https://example.com/profile.jpg",
  province: "Alberta",
  state: "Alabama",
  storeLocation: "Edmonton",
  parentOrgId: 76,
  roles: ["Employee"],
};

export {
  MAX_REGISTER_STEPS,
  REGISTER_MAX_STEPPER_POSITION,
  REGISTER_ROLE_ROUTE_PATHS,
  REGISTER_STEPS,
  REGISTER_URL,
  SAMPLE_USER_SCHEMA,
  STEPS_INPUTNAMES_MAP,
};
