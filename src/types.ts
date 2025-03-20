import {
  ContextStylesParams,
  CSSObject,
  MantineColor,
  MantineTheme,
  MantineThemeOverride,
} from "@mantine/core";
import type { Result } from "ts-results";
import { ValidationKey } from "./validations";

type CheckboxRadioSelectData<Payload extends string = string> = Array<{
  label: string;
  value: Payload;
}>;

type SliderMarksData = Array<{
  label: string;
  value: number;
}>;

type ScreenshotImageType = "image/png" | "image/jpeg" | "image/webp";

type SetPageInErrorPayload = {
  kind: "add" | "delete";
  page: number;
};

type ColorScheme = "light" | "dark";
type Shade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface ThemeComponent {
  defaultProps?:
    | Record<string, any>
    | ((theme: MantineTheme) => Record<string, any>);
  classNames?: Record<string, string>;
  styles?:
    | Record<string, CSSObject>
    | ((
      theme: MantineTheme,
      params: any,
      context: ContextStylesParams,
    ) => Record<string, CSSObject>);
  variants?: Record<
    PropertyKey,
    (
      theme: MantineTheme,
      params: any,
      context: ContextStylesParams,
    ) => Record<string, CSSObject>
  >;
  sizes?: Record<
    PropertyKey,
    (
      theme: MantineTheme,
      params: any,
      context: ContextStylesParams,
    ) => Record<string, CSSObject>
  >;
}

interface ThemeObject extends MantineThemeOverride {
  // Defines color scheme for all components, defaults to "light"
  colorScheme: ColorScheme;

  // Determines whether motion based animations should be disabled for
  // users who prefer to reduce motion in their OS settings
  respectReducedMotion: boolean;

  // White and black colors, defaults to '#fff' and '#000'
  white: string;
  black: string;

  // Key of theme.colors
  primaryColor: string;

  // Index of color from theme.colors that is considered primary
  primaryShade: { light: Shade; dark: Shade };

  // Default gradient used in components that support `variant="gradient"` (Button, ThemeIcon, etc.)
  defaultGradient: { deg: number; from: MantineColor; to: MantineColor };

  fontFamily: string;

  components: {
    [x: string]: ThemeComponent;
  };
}

type ValidationFunctionsTable = Record<ValidationKey, Validation>;

/** input popover error messages are determined by partials tests */
type Validation = [RegExp | ((value: string) => boolean), string][];

type StoreLocation = "Calgary" | "Edmonton" | "Vancouver";

type DecodedToken = {
  userInfo: {
    userId: string;
    username: string;
    roles: ("Admin" | "Employee" | "Manager")[];
  };
  sessionId: string;
  iat: number;
  exp: number;
};

type UserSchema = {
  username: string;
  password: string;
  email: string;

  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  preferredPronouns: PreferredPronouns;
  profilePictureUrl: string;
  dateOfBirth: string;

  contactNumber: PhoneNumber | string;
  address: {
    addressLine: string;
    city: string;
    province?: Province;
    state?: StatesUS;
    postalCode: PostalCode;
    country: Country;
  };
  jobPosition: JobPosition;
  department: Department;
  storeLocation?: StoreLocation;
  emergencyContact: {
    fullName: string;
    contactNumber: PhoneNumber | string;
  };
  startDate: string;
  roles: UserRoles;
  active: boolean;

  completedSurveys: string[];
  isPrefersReducedMotion: boolean;
};

type UserDocument = UserSchema & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type UserRoles = ("Admin" | "Employee" | "Manager")[];

type PreferredPronouns =
  | "He/Him"
  | "She/Her"
  | "They/Them"
  | "Other"
  | "Prefer not to say";

type Province =
  | "Alberta"
  | "British Columbia"
  | "Manitoba"
  | "New Brunswick"
  | "Newfoundland and Labrador"
  | "Northwest Territories"
  | "Nova Scotia"
  | "Nunavut"
  | "Ontario"
  | "Prince Edward Island"
  | "Quebec"
  | "Saskatchewan"
  | "Yukon";

type StatesUS =
  | "Alabama"
  | "Alaska"
  | "Arizona"
  | "Arkansas"
  | "California"
  | "Colorado"
  | "Connecticut"
  | "Delaware"
  | "Florida"
  | "Georgia"
  | "Hawaii"
  | "Idaho"
  | "Illinois"
  | "Indiana"
  | "Iowa"
  | "Kansas"
  | "Kentucky"
  | "Louisiana"
  | "Maine"
  | "Maryland"
  | "Massachusetts"
  | "Michigan"
  | "Minnesota"
  | "Mississippi"
  | "Missouri"
  | "Montana"
  | "Nebraska"
  | "Nevada"
  | "New Hampshire"
  | "New Jersey"
  | "New Mexico"
  | "New York"
  | "North Carolina"
  | "North Dakota"
  | "Ohio"
  | "Oklahoma"
  | "Oregon"
  | "Pennsylvania"
  | "Rhode Island"
  | "South Carolina"
  | "South Dakota"
  | "Tennessee"
  | "Texas"
  | "Utah"
  | "Vermont"
  | "Virginia"
  | "Washington"
  | "West Virginia"
  | "Wisconsin"
  | "Wyoming";

type CanadianPostalCode =
  `${string}${string}${string} ${string}${string}${string}`;
type USPostalCode = `${string}${string}${string}${string}${string}`;
type PostalCode = CanadianPostalCode | USPostalCode;

type PhoneNumber = string;

type Country = "Canada" | "United States";

type Department =
  | "Executive Management"
  | "Store Administration"
  | "Office Administration"
  | "Accounting"
  | "Human Resources"
  | "Sales"
  | "Marketing"
  | "Information Technology"
  | "Repair Technicians"
  | "Field Service Technicians"
  | "Logistics and Inventory"
  | "Customer Service"
  | "Maintenance";

type ExecutiveManagement =
  | "Chief Executive Officer"
  | "Chief Operations Officer"
  | "Chief Financial Officer"
  | "Chief Technology Officer"
  | "Chief Marketing Officer"
  | "Chief Sales Officer"
  | "Chief Human Resources Officer";

type HumanResources =
  | "Human Resources Manager"
  | "Compensation and Benefits Specialist"
  | "Health and Safety Specialist"
  | "Training Specialist"
  | "Recruiting Specialist";

type StoreAdministration =
  | "Store Manager"
  | "Shift Supervisor"
  | "Office Manager";

type OfficeAdministration =
  | "Office Administrator"
  | "Receptionist"
  | "Data Entry Specialist";

type Accounting =
  | "Accounting Manager"
  | "Accounts Payable Clerk"
  | "Accounts Receivable Clerk"
  | "Financial Analyst";

type Sales =
  | "Sales Manager"
  | "Sales Representative"
  | "Business Development Specialist"
  | "Sales Support Specialist"
  | "Sales Operations Analyst";

type Marketing =
  | "Marketing Manager"
  | "Digital Marketing Specialist"
  | "Graphic Designer"
  | "Public Relations Specialist"
  | "Marketing Analyst";

type InformationTechnology =
  | "IT Manager"
  | "Systems Administrator"
  | "IT Support Specialist"
  | "Database Administrator"
  | "Web Developer"
  | "Software Developer"
  | "Software Engineer";

type RepairTechnicians =
  | "Repair Technicians Supervisor"
  | "Electronics Technician"
  | "Computer Technician"
  | "Smartphone Technician"
  | "Tablet Technician"
  | "Audio/Video Equipment Technician";

type FieldServiceTechnicians =
  | "Field Service Supervisor"
  | "On-Site Technician";

type LogisticsAndInventory =
  | "Warehouse Supervisor"
  | "Inventory Clerk"
  | "Delivery Driver"
  | "Parts and Materials Handler"
  | "Shipper/Receiver";

type CustomerService =
  | "Customer Service Supervisor"
  | "Customer Service Representative"
  | "Technical Support Specialist";

type Maintenance =
  | "Maintenance Supervisor"
  | "Maintenance Worker"
  | "Custodian";

type JobPosition =
  | ExecutiveManagement
  | StoreAdministration
  | OfficeAdministration
  | Sales
  | Marketing
  | InformationTechnology
  | RepairTechnicians
  | FieldServiceTechnicians
  | LogisticsAndInventory
  | CustomerService
  | HumanResources
  | Accounting
  | Maintenance;

type HttpServerResponse<Data = unknown> = {
  accessToken: string;
  data: Array<Data>;
  kind: "error" | "success";
  message: string;
  pages: number;
  status: number;
  totalDocuments: number;
  triggerLogout: boolean;
};

type SafeBox<Data = unknown> = {
  data?: Data;
  kind: "error" | "notFound" | "success";
  message?: string;
};

type SafeBoxResult<Data = unknown> = Result<SafeBox<Data>, SafeBox>;

export type {
  Accounting,
  CanadianPostalCode,
  CheckboxRadioSelectData,
  ColorScheme,
  Country,
  CustomerService,
  Department,
  ExecutiveManagement,
  FieldServiceTechnicians,
  HttpServerResponse,
  HumanResources,
  InformationTechnology,
  JobPosition,
  LogisticsAndInventory,
  Maintenance,
  Marketing,
  OfficeAdministration,
  PhoneNumber,
  PostalCode,
  PreferredPronouns,
  Province,
  RepairTechnicians,
  SafeBox,
  SafeBoxResult,
  Sales,
  ScreenshotImageType,
  SetPageInErrorPayload,
  Shade,
  SliderMarksData,
  StatesUS,
  StoreAdministration,
  StoreLocation,
  ThemeComponent,
  ThemeObject,
  UserDocument,
  UserRoles,
  UserSchema,
  USPostalCode,
  Validation,
  ValidationFunctionsTable,
};
