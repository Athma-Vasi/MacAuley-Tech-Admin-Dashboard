import {
    COUNTRIES,
    DEPARTMENTS_DATA,
    JOB_POSITIONS_DATA,
    PROVINCES,
    STATES_US,
} from "../../constants";
import { AccessibleDateTimeInputAttributes } from "../accessibleInputs/AccessibleDateTimeInput";
import { AccessibleSelectInputAttributes } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInputAttributes } from "../accessibleInputs/text/AccessibleTextInput";
import { QueryTemplate } from "../query/types";

/**
 * type UserSchema = {
  addressLine: string;
  city: string;
  country: Country;
  department: Department;
  email: string;
  firstName: string;
  jobPosition: JobPosition;
  lastName: string;
  orgId: number;
  parentOrgId: number;
  password: string;
  postalCodeCanada: CanadianPostalCode;
  postalCodeUS: USPostalCode;
  profilePictureUrl: string;
  province: Province;
  roles: UserRoles;
  state: StatesUS;
  storeLocation: AllStoreLocations;
  username: string;
};
 */
const USER_QUERY_TEMPLATES: QueryTemplate[] = [
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set(["in"]),
        kind: "text",
        name: "addressLine",
    },
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set(["in"]),
        kind: "text",
        name: "city",
    },
    {
        attributes: {} as AccessibleSelectInputAttributes,
        comparisonOperators: new Set(["equal to"]),
        data: COUNTRIES,
        kind: "select",
        name: "country",
    },
    {
        attributes: {} as AccessibleSelectInputAttributes,
        comparisonOperators: new Set(["equal to"]),
        data: DEPARTMENTS_DATA,
        kind: "select",
        name: "department",
    },
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set(["in"]),
        kind: "text",
        name: "firstName",
    },
    {
        attributes: {} as AccessibleSelectInputAttributes,
        comparisonOperators: new Set(["equal to"]),
        data: JOB_POSITIONS_DATA,
        kind: "select",
        name: "jobPosition",
    },
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set(["in"]),
        kind: "text",
        name: "lastName",
    },
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set(["in"]),
        kind: "text",
        name: "profilePictureUrl",
    },
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set(["in"]),
        kind: "text",
        name: "username",
    },
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set(["in"]),
        kind: "text",
        name: "email",
    },
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set(["in"]),
        kind: "text",
        name: "postalCodeCanada",
    },
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set(["in"]),
        kind: "text",
        name: "postalCodeUS",
    },
    {
        attributes: {} as AccessibleSelectInputAttributes,
        comparisonOperators: new Set(["equal to"]),
        data: PROVINCES,
        kind: "select",
        name: "province",
    },
    {
        attributes: {} as AccessibleSelectInputAttributes,
        comparisonOperators: new Set(["equal to"]),
        data: STATES_US,
        kind: "select",
        name: "state",
    },
    {
        attributes: { inputKind: "date" } as AccessibleDateTimeInputAttributes,
        comparisonOperators: new Set([
            "equal to",
            "greater than or equal to",
            "greater than",
            "less than or equal to",
            "less than",
        ]),
        kind: "date",
        name: "createdAt",
    },
    {
        attributes: { inputKind: "date" } as AccessibleDateTimeInputAttributes,
        comparisonOperators: new Set([
            "equal to",
            "greater than or equal to",
            "greater than",
            "less than or equal to",
            "less than",
        ]),
        kind: "date",
        name: "updatedAt",
    },
];

export { USER_QUERY_TEMPLATES };
