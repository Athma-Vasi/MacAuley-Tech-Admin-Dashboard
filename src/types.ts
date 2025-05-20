import {
  ContextStylesParams,
  CSSObject,
  MantineColor,
  MantineTheme,
  MantineThemeOverride,
} from "@mantine/core";
import type { Option, Result } from "ts-results";
import { ProductMetricCategory } from "./components/dashboard/product/types";
import { RepairMetricCategory } from "./components/dashboard/repair/types";
import {
  AllStoreLocations,
  CustomerMetrics,
  DashboardMetricsView,
  ProductCategory,
  ProductYearlyMetric,
  RepairCategory,
  RepairYearlyMetric,
  YearlyFinancialMetric,
} from "./components/dashboard/types";
import { ValidationKey } from "./validations";

type NonNullableObject<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: T[K] extends
    object ? NonNullableObject<T[K]>
    : T[K];
};

// gives the final flattened type after mapping, intersecting, or conditional logic
type Prettify<T> =
  & {
    [K in keyof T]: T[K];
  }
  & {};

type CheckboxRadioSelectData<Payload extends string = string> = Array<{
  label: string;
  value: Payload;
}>;

type SliderMarksData = Array<{
  label: string;
  value: number;
}>;

type ScreenshotImageType = "image/png" | "image/jpeg" | "image/webp";

type SliderInputData = {
  marks?: SliderMarksData;
  max: number;
  min: number;
};

type SetStepInErrorPayload = {
  kind: "add" | "delete";
  step: number;
};

type SetStepWithEmptyInputsPayload = {
  kind: "add" | "delete";
  step: number;
};

type SetInputsInErrorPayload = {
  kind: "add" | "delete";
  name: ValidationKey;
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
  userId: string;
  username: string;
  roles: UserRoles;
  sessionId: string;
  iat: number;
  exp: number;
};

type UserSchema = {
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
  profilePictureUrl?: string;
  province: Province;
  roles: UserRoles;
  state: StatesUS;
  storeLocation: AllStoreLocations;
  username: string;
};

type UserDocument = UserSchema & {
  _id: string;
  createdAt: string;
  fileUploadId: string;
  updatedAt: string;
  __v: number;
};

type FileExtension = "jpeg" | "png" | "jpg" | "webp";

type FileUploadSchema = {
  // empty string is used as a placeholder for the model name
  associatedDocumentId: string;
  userId: string;
  uploadedFile: Buffer;
  username: string;
  fileExtension: FileExtension;
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  fileEncoding: string;
};

type FileUploadDocument = FileUploadSchema & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type RepairMetricsSchema = {
  metricCategory: RepairCategory | "All Repairs";
  storeLocation: AllStoreLocations;
  yearlyMetrics: RepairYearlyMetric[];
};

type RepairMetricsDocument = RepairMetricsSchema & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ProductMetricsSchema = {
  metricCategory: ProductCategory | "All Products";
  storeLocation: AllStoreLocations;
  yearlyMetrics: ProductYearlyMetric[];
};

type ProductMetricsDocument = ProductMetricsSchema & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type FinancialMetricsSchema = {
  storeLocation: AllStoreLocations;
  financialMetrics: YearlyFinancialMetric[];
};

type FinancialMetricsDocument = FinancialMetricsSchema & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type CustomerMetricsSchema = {
  storeLocation: AllStoreLocations;
  customerMetrics: CustomerMetrics;
};

type CustomerMetricsDocument = CustomerMetricsSchema & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type BusinessMetricsDocument =
  | FinancialMetricsDocument
  | ProductMetricsDocument
  | RepairMetricsDocument
  | CustomerMetricsDocument;

type UserRoles = ("Admin" | "Employee" | "Manager")[];

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

type SafeBoxSuccess<Data = unknown> = {
  data: Option<Data>;
  message?: Option<string>;
};
type SafeBoxError<Error_ = any> = {
  data?: Option<Error_>;
  message?: Option<string>;
};

type SafeBoxResult<Data = unknown, Error_ = any> = Result<
  SafeBoxSuccess<Data>,
  SafeBoxError<Error_>
>;

type FontFamily = "Work Sans" | "sans-serif" | "serif" | "Open-Dyslexic";

type Province =
  | "Not Applicable"
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
  | "Not Applicable"
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

type FormReview<
  State extends Record<string, unknown> = Record<string, unknown>,
> = Record<string, Record<keyof State, State[keyof State]>>;

type LocalForageKeys = `${DashboardMetricsView}-${AllStoreLocations}-${
  | ProductMetricCategory
  | RepairMetricCategory}`;

export type {
  Accounting,
  BusinessMetricsDocument,
  CanadianPostalCode,
  CheckboxRadioSelectData,
  ColorScheme,
  Country,
  CustomerMetricsDocument,
  CustomerService,
  DecodedToken,
  Department,
  ExecutiveManagement,
  FieldServiceTechnicians,
  FileExtension,
  FileUploadDocument,
  FileUploadSchema,
  FinancialMetricsDocument,
  FontFamily,
  FormReview,
  HttpServerResponse,
  HumanResources,
  InformationTechnology,
  JobPosition,
  LocalForageKeys,
  LogisticsAndInventory,
  Maintenance,
  Marketing,
  NonNullableObject,
  OfficeAdministration,
  PostalCode,
  Prettify,
  ProductMetricsDocument,
  Province,
  RepairMetricsDocument,
  RepairTechnicians,
  SafeBoxResult,
  Sales,
  ScreenshotImageType,
  SetInputsInErrorPayload,
  SetStepInErrorPayload,
  SetStepWithEmptyInputsPayload,
  Shade,
  SliderInputData,
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
