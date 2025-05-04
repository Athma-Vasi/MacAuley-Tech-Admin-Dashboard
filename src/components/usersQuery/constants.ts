import {
    ALL_STORE_LOCATIONS_DATA,
    COUNTRIES,
    DEPARTMENTS_DATA,
    JOB_POSITIONS_DATA,
    PROVINCES,
    STATES_US,
} from "../../constants";
import { UserDocument } from "../../types";
import { AccessibleDateTimeInputAttributes } from "../accessibleInputs/AccessibleDateTimeInput";
import { AccessibleSelectInputAttributes } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInputAttributes } from "../accessibleInputs/AccessibleTextInput";
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
        comparisonOperators: new Set([
            "equal to",
            "greater than or equal to",
            "greater than",
            "less than or equal to",
            "less than",
        ]),
        kind: "number",
        name: "orgId",
    },
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set([
            "equal to",
            "greater than or equal to",
            "greater than",
            "less than or equal to",
            "less than",
        ]),
        kind: "number",
        name: "parentOrgId",
    },
    {
        attributes: {} as AccessibleSelectInputAttributes,
        comparisonOperators: new Set(["equal to"]),
        data: ALL_STORE_LOCATIONS_DATA,
        kind: "select",
        name: "storeLocation",
    },
    {
        attributes: {} as AccessibleTextInputAttributes,
        comparisonOperators: new Set(["in"]),
        kind: "text",
        name: "roles",
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

const SAMPLE_USER_DOCUMENT = {
    _id: "6801a9426f9c9056d944398e",
    username: "manager",
    email: "manager@example.com",
    addressLine: "6662 Ocean Avenue",
    city: "Vancouver",
    country: "Canada",
    postalCodeCanada: "Q7A 5E3",
    postalCodeUS: "00000",
    province: "British Columbia",
    state: "Not Applicable",
    department: "Information Technology",
    fileUploadId: "1234567890abcdef",
    firstName: "Miles",
    jobPosition: "Web Developer",
    lastName: "Vorkosigan",
    profilePictureUrl:
        "https://images.pexels.com/photos/4777025/pexels-photo-4777025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    storeLocation: "All Locations",
    orgId: 161,
    parentOrgId: 76,
    roles: [
        "Manager",
    ],
    createdAt: "2025-04-18T01:22:10.726Z",
    updatedAt: "2025-04-18T01:22:10.726Z",
    __v: 0,
} as Omit<UserDocument, "password">;

export { SAMPLE_USER_DOCUMENT, USER_QUERY_TEMPLATES };
