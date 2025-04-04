import { CheckboxRadioSelectData, FontFamily, StoreLocation } from "./types";

const FONT_FAMILY_DATA: CheckboxRadioSelectData<FontFamily> = [
  { value: "Work Sans", label: "Sans" },
  { value: "serif", label: "Serif" },
  { value: "Open-Dyslexic", label: "Dyslexic" },
];

type ColorsSwatches = {
  dark: string[];
  gray: string[];
  red: string[];
  pink: string[];
  grape: string[];
  violet: string[];
  indigo: string[];
  blue: string[];
  cyan: string[];
  teal: string[];
  green: string[];
  lime: string[];
  yellow: string[];
  orange: string[];
};

/**
 * Mantine uses open-color in default theme with some additions (dark).
 * Each color has an array of 10 shades. shades[0] is the lightest shade and
 * shades[9] is the darkest shade.
 * @see https://yeun.github.io/open-color/
 */
const COLORS_SWATCHES: ColorsSwatches = {
  dark: [
    "#C1C2C5",
    "#A6A7AB",
    "#909296",
    "#5c5f66",
    "#373A40",
    "#2C2E33",
    "#25262b",
    "#1A1B1E",
    "#141517",
    "#101113",
  ],
  gray: [
    "#f8f9fa",
    "#f1f3f5",
    "#e9ecef",
    "#dee2e6",
    "#ced4da",
    "#adb5bd",
    "#868e96",
    "#495057",
    "#343a40",
    "#212529",
  ],
  red: [
    "#fff5f5",
    "#ffe3e3",
    "#ffc9c9",
    "#ffa8a8",
    "#ff8787",
    "#ff6b6b",
    "#fa5252",
    "#f03e3e",
    "#e03131",
    "#c92a2a",
  ],
  pink: [
    "#fff0f6",
    "#ffdeeb",
    "#fcc2d7",
    "#faa2c1",
    "#f783ac",
    "#f06595",
    "#e64980",
    "#d6336c",
    "#c2255c",
    "#a61e4d",
  ],
  grape: [
    "#f8f0fc",
    "#f3d9fa",
    "#eebefa",
    "#e599f7",
    "#da77f2",
    "#cc5de8",
    "#be4bdb",
    "#ae3ec9",
    "#9c36b5",
    "#862e9c",
  ],
  violet: [
    "#f3f0ff",
    "#e5dbff",
    "#d0bfff",
    "#b197fc",
    "#9775fa",
    "#845ef7",
    "#7950f2",
    "#7048e8",
    "#6741d9",
    "#5f3dc4",
  ],
  indigo: [
    "#edf2ff",
    "#dbe4ff",
    "#bac8ff",
    "#91a7ff",
    "#748ffc",
    "#5c7cfa",
    "#4c6ef5",
    "#4263eb",
    "#3b5bdb",
    "#364fc7",
  ],
  blue: [
    "#e7f5ff",
    "#d0ebff",
    "#a5d8ff",
    "#74c0fc",
    "#4dabf7",
    "#339af0",
    "#228be6",
    "#1c7ed6",
    "#1971c2",
    "#1864ab",
  ],
  cyan: [
    "#e3fafc",
    "#c5f6fa",
    "#99e9f2",
    "#66d9e8",
    "#3bc9db",
    "#22b8cf",
    "#15aabf",
    "#1098ad",
    "#0c8599",
    "#0b7285",
  ],
  teal: [
    "#e6fcf5",
    "#c3fae8",
    "#96f2d7",
    "#63e6be",
    "#38d9a9",
    "#20c997",
    "#12b886",
    "#0ca678",
    "#099268",
    "#087f5b",
  ],
  green: [
    "#ebfbee",
    "#d3f9d8",
    "#b2f2bb",
    "#8ce99a",
    "#69db7c",
    "#51cf66",
    "#40c057",
    "#37b24d",
    "#2f9e44",
    "#2b8a3e",
  ],
  lime: [
    "#f4fce3",
    "#e9fac8",
    "#d8f5a2",
    "#c0eb75",
    "#a9e34b",
    "#94d82d",
    "#82c91e",
    "#74b816",
    "#66a80f",
    "#5c940d",
  ],
  yellow: [
    "#fff9db",
    "#fff3bf",
    "#ffec99",
    "#ffe066",
    "#ffd43b",
    "#fcc419",
    "#fab005",
    "#f59f00",
    "#f08c00",
    "#e67700",
  ],
  orange: [
    "#fff4e6",
    "#ffe8cc",
    "#ffd8a8",
    "#ffc078",
    "#ffa94d",
    "#ff922b",
    "#fd7e14",
    "#f76707",
    "#e8590c",
    "#d9480f",
  ],
};

const SCREENSHOT_IMAGE_TYPE_DATA = [
  { value: "image/png", label: "Image/png" },
  { value: "image/jpeg", label: "Image/jpeg" },
  { value: "image/webp", label: "Image/webp" },
];

const FETCH_REQUEST_TIMEOUT = 10000;

const STORE_LOCATION_DATA: CheckboxRadioSelectData<StoreLocation> = [
  { label: "Edmonton", value: "Edmonton" },
  { label: "Calgary", value: "Calgary" },
  { label: "Vancouver", value: "Vancouver" },
];

const INPUT_WIDTH = 310;
const TEXT_SHADOW = "0 2px 4px rgba(0, 0, 0, 0.15)";

const APP_HEADER_HEIGHT = 70;
const DASHBOARD_HEADER_HEIGHT = 170;
const DASHBOARD_HEADER_HEIGHT_MOBILE = 70;
const METRICS_HEADER_HEIGHT = 100;
const METRICS_HEADER_HEIGHT_MOBILE = 70;

const MOBILE_BREAKPOINT = 1024;

const PROTOCOL = "http";
const DOMAIN_NAME = "://localhost";
const PORT = 5000;

const AUTH_URL = `${PROTOCOL}${DOMAIN_NAME}:${PORT}/auth`;
const LOGIN_URL = `${AUTH_URL}/login`;
const REGISTER_URL = `${AUTH_URL}/register`;
const LOGOUT_URL = `${AUTH_URL}/logout`;

const API_URL = `${PROTOCOL}${DOMAIN_NAME}:${PORT}/api/v1`;
const METRICS_URL = `${API_URL}/metrics`;
const CUSTOMER_URL = `${METRICS_URL}/customers`;
const FINANCIAL_URL = `${METRICS_URL}/financials`;
const PRODUCT_URL = `${METRICS_URL}/products`;
const REPAIR_URL = `${METRICS_URL}/repairs`;

export {
  API_URL,
  APP_HEADER_HEIGHT,
  COLORS_SWATCHES,
  CUSTOMER_URL,
  DASHBOARD_HEADER_HEIGHT,
  DASHBOARD_HEADER_HEIGHT_MOBILE,
  DOMAIN_NAME,
  FETCH_REQUEST_TIMEOUT,
  FINANCIAL_URL,
  FONT_FAMILY_DATA,
  INPUT_WIDTH,
  LOGIN_URL,
  LOGOUT_URL,
  METRICS_HEADER_HEIGHT,
  METRICS_HEADER_HEIGHT_MOBILE,
  METRICS_URL,
  MOBILE_BREAKPOINT,
  PORT,
  PRODUCT_URL,
  PROTOCOL,
  REGISTER_URL,
  REPAIR_URL,
  SCREENSHOT_IMAGE_TYPE_DATA,
  STORE_LOCATION_DATA,
  TEXT_SHADOW,
};
export type { ColorsSwatches };
