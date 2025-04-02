import {
  ContextStylesParams,
  CSSObject,
  MantineColor,
  MantineTheme,
  MantineThemeOverride,
} from "@mantine/core";
import type { Result } from "ts-results";
import {
  BusinessMetricStoreLocation,
  CustomerMetrics,
  ProductMetric,
  RepairMetric,
  YearlyFinancialMetric,
} from "./components/dashboard/types";
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

type InputType =
  | "boolean"
  | "checkbox"
  | "date"
  | "file"
  | "number"
  | "select"
  | "slider"
  | "switch"
  | "text"
  | "time";

type SliderInputData = {
  marks?: SliderMarksData;
  max: number;
  min: number;
};

type StepperChild = {
  inputType: InputType;
  isRequired?: boolean;
  name: string;
  validationKey?: ValidationKey;
  selectInputData?: CheckboxRadioSelectData;
  checkboxInputData?: CheckboxRadioSelectData;
  sliderInputData?: SliderInputData;
};

type StepperPage = {
  kind?: "form" | "review";
  preventErrorStateDisplay?: boolean;
  description: string;
  children: Array<StepperChild>;
};

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
  roles: UserRoles;
};

type UserDocument = UserSchema & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type RepairMetricsSchema = {
  storeLocation: BusinessMetricStoreLocation;
  repairMetrics: RepairMetric[];
};

type RepairMetricsDocument = RepairMetricsSchema & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type ProductMetricsSchema = {
  storeLocation: BusinessMetricStoreLocation;
  productMetrics: ProductMetric[];
};

type ProductMetricsDocument = ProductMetricsSchema & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type FinancialMetricsSchema = {
  storeLocation: BusinessMetricStoreLocation;
  financialMetrics: YearlyFinancialMetric[];
};

type FinancialMetricsDocument = FinancialMetricsSchema & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type CustomerMetricsSchema = {
  storeLocation: BusinessMetricStoreLocation;
  customerMetrics: CustomerMetrics;
};

type CustomerMetricsDocument = CustomerMetricsSchema & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
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

type SafeBox<Data = unknown> = {
  data?: Data;
  kind: "error" | "notFound" | "success";
  message?: string;
};

type SafeBoxResult<Data = unknown> = Result<SafeBox<Data>, SafeBox>;

export type {
  BusinessMetricsDocument,
  CheckboxRadioSelectData,
  ColorScheme,
  CustomerMetricsDocument,
  DecodedToken,
  FinancialMetricsDocument,
  HttpServerResponse,
  InputType,
  ProductMetricsDocument,
  RepairMetricsDocument,
  SafeBox,
  SafeBoxResult,
  ScreenshotImageType,
  SetPageInErrorPayload,
  Shade,
  SliderInputData,
  SliderMarksData,
  StepperChild,
  StepperPage,
  StoreLocation,
  ThemeComponent,
  ThemeObject,
  UserDocument,
  UserRoles,
  UserSchema,
  Validation,
  ValidationFunctionsTable,
};
