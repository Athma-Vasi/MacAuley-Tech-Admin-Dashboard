import { AllStoreLocations } from "./components/dashboard/types";
import {
  CheckboxRadioSelectData,
  Country,
  Department,
  FontFamily,
  JobPosition,
  LocalForageKeys,
  Province,
  StatesUS,
  StoreLocation,
} from "./types";

const FONT_FAMILY_DATA: CheckboxRadioSelectData<FontFamily> = [
  { value: "Work Sans", label: "App" },
  { value: "sans-serif", label: "Sans" },
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

const ALL_STORE_LOCATIONS_DATA: CheckboxRadioSelectData<AllStoreLocations> = [
  { label: "All Locations", value: "All Locations" },
  { label: "Edmonton", value: "Edmonton" },
  { label: "Calgary", value: "Calgary" },
  { label: "Vancouver", value: "Vancouver" },
];

const SCREENSHOT_IMAGE_TYPE_DATA = [
  { value: "image/png", label: "Image/png" },
  { value: "image/jpeg", label: "Image/jpeg" },
  { value: "image/webp", label: "Image/webp" },
];

const FETCH_REQUEST_TIMEOUT = 10000;

const STORE_LOCATIONS: CheckboxRadioSelectData<StoreLocation> = [
  { label: "Edmonton", value: "Edmonton" },
  { label: "Calgary", value: "Calgary" },
  { label: "Vancouver", value: "Vancouver" },
];

const DEPARTMENTS_DATA: CheckboxRadioSelectData<Department> = [
  { value: "Executive Management", label: "Executive Management" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Store Administration", label: "Store Administration" },
  { value: "Office Administration", label: "Office Administration" },
  { value: "Accounting", label: "Accounting" },
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Repair Technicians", label: "Repair Technicians" },
  { value: "Field Service Technicians", label: "Field Service Technicians" },
  { value: "Logistics and Inventory", label: "Logistics and Inventory" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Maintenance", label: "Maintenance" },
];

const JOB_POSITIONS_DATA: CheckboxRadioSelectData<JobPosition> = [
  // executive management
  { value: "Chief Executive Officer", label: "Chief Executive Officer" },
  { value: "Chief Operations Officer", label: "Chief Operations Officer" },
  { value: "Chief Financial Officer", label: "Chief Financial Officer" },
  { value: "Chief Technology Officer", label: "Chief Technology Officer" },
  { value: "Chief Marketing Officer", label: "Chief Marketing Officer" },
  {
    value: "Chief Human Resources Officer",
    label: "Chief Human Resources Officer",
  },

  // human resources
  { value: "Human Resources Manager", label: "Human Resources Manager" },
  {
    value: "Compensation and Benefits Specialist",
    label: "Compensation and Benefits Specialist",
  },
  {
    value: "Health and Safety Specialist",
    label: "Health and Safety Specialist",
  },
  { value: "Training Specialist", label: "Training Specialist" },
  { value: "Recruiting Specialist", label: "Recruiting Specialist" },

  // store administration
  { value: "Store Manager", label: "Store Manager" },
  { value: "Shift Supervisor", label: "Shift Supervisor" },
  { value: "Office Manager", label: "Office Manager" },

  // office administration
  { value: "Office Administrator", label: "Office Administrator" },
  { value: "Receptionist", label: "Receptionist" },
  { value: "Data Entry Specialist", label: "Data Entry Specialist" },

  // accounting
  { value: "Accounting Manager", label: "Accounting Manager" },
  { value: "Accounts Payable Clerk", label: "Accounts Payable Clerk" },
  { value: "Accounts Receivable Clerk", label: "Accounts Receivable Clerk" },
  { value: "Financial Analyst", label: "Financial Analyst" },

  // sales
  { value: "Sales Manager", label: "Sales Manager" },
  { value: "Sales Representative", label: "Sales Representative" },
  {
    value: "Business Development Specialist",
    label: "Business Development Specialist",
  },
  { value: "Sales Support Specialist", label: "Sales Support Specialist" },
  { value: "Sales Operations Analyst", label: "Sales Operations Analyst" },

  // marketing
  { value: "Marketing Manager", label: "Marketing Manager" },
  {
    value: "Digital Marketing Specialist",
    label: "Digital Marketing Specialist",
  },
  { value: "Graphic Designer", label: "Graphic Designer" },
  {
    value: "Public Relations Specialist",
    label: "Public Relations Specialist",
  },
  { value: "Marketing Analyst", label: "Marketing Analyst" },

  // information technology
  { value: "IT Manager", label: "IT Manager" },
  { value: "Systems Administrator", label: "Systems Administrator" },
  { value: "IT Support Specialist", label: "IT Support Specialist" },
  { value: "Database Administrator", label: "Database Administrator" },
  { value: "Web Developer", label: "Web Developer" },
  { value: "Software Developer", label: "Software Developer" },
  { value: "Software Engineer", label: "Software Engineer" },

  // repair technicians
  {
    value: "Repair Technicians Supervisor",
    label: "Repair Technicians Supervisor",
  },
  { value: "Electronics Technician", label: "Electronics Technician" },
  { value: "Computer Technician", label: "Computer Technician" },
  { value: "Smartphone Technician", label: "Smartphone Technician" },
  { value: "Tablet Technician", label: "Tablet Technician" },
  {
    value: "Audio/Video Equipment Technician",
    label: "Audio/Video Equipment Technician",
  },

  // field service technicians
  { value: "Field Service Supervisor", label: "Field Service Supervisor" },
  { value: "On-Site Technician", label: "On-Site Technician" },

  // logistics and inventory
  { value: "Warehouse Supervisor", label: "Warehouse Supervisor" },
  { value: "Inventory Clerk", label: "Inventory Clerk" },
  { value: "Delivery Driver", label: "Delivery Driver" },
  {
    value: "Parts and Materials Handler",
    label: "Parts and Materials Handler",
  },
  { value: "Shipper/Receiver", label: "Shipper/Receiver" },

  // customer service
  {
    value: "Customer Service Supervisor",
    label: "Customer Service Supervisor",
  },
  {
    value: "Customer Service Representative",
    label: "Customer Service Representative",
  },
  {
    value: "Technical Support Specialist",
    label: "Technical Support Specialist",
  },

  // maintenance
  { value: "Maintenance Supervisor", label: "Maintenance Supervisor" },
  { value: "Maintenance Worker", label: "Maintenance Worker" },
  { value: "Custodian", label: "Custodian" },
];

const DEPARTMENT_JOB_POSITION_MAP = new Map<Department, string[]>([
  [
    "Executive Management",
    [
      "Chief Executive Officer",
      "Chief Operations Officer",
      "Chief Financial Officer",
      "Chief Technology Officer",
      "Chief Marketing Officer",
      "Chief Human Resources Officer",
    ],
  ],

  [
    "Human Resources",
    [
      "Human Resources Manager",
      "Compensation and Benefits Specialist",
      "Health and Safety Specialist",
      "Training Specialist",
      "Recruiting Specialist",
    ],
  ],

  ["Store Administration", [
    "Store Manager",
    "Shift Supervisor",
    "Office Manager",
  ]],

  [
    "Office Administration",
    ["Office Administrator", "Receptionist", "Data Entry Specialist"],
  ],

  [
    "Accounting",
    [
      "Accounting Manager",
      "Accounts Payable Clerk",
      "Accounts Receivable Clerk",
      "Financial Analyst",
    ],
  ],

  [
    "Sales",
    [
      "Sales Manager",
      "Sales Representative",
      "Business Development Specialist",
      "Sales Support Specialist",
      "Sales Operations Analyst",
    ],
  ],

  [
    "Marketing",
    [
      "Marketing Manager",
      "Digital Marketing Specialist",
      "Graphic Designer",
      "Public Relations Specialist",
      "Marketing Analyst",
    ],
  ],

  [
    "Information Technology",
    [
      "IT Manager",
      "Systems Administrator",
      "IT Support Specialist",
      "Database Administrator",
      "Web Developer",
      "Software Developer",
      "Software Engineer",
    ],
  ],

  [
    "Repair Technicians",
    [
      "Repair Technicians Supervisor",
      "Electronics Technician",
      "Computer Technician",
      "Smartphone Technician",
      "Tablet Technician",
      "Audio/Video Equipment Technician",
    ],
  ],

  ["Field Service Technicians", [
    "Field Service Supervisor",
    "On-Site Technician",
  ]],

  [
    "Logistics and Inventory",
    [
      "Warehouse Supervisor",
      "Inventory Clerk",
      "Delivery Driver",
      "Parts and Materials Handler",
      "Shipper/Receiver",
    ],
  ],

  [
    "Customer Service",
    [
      "Customer Service Supervisor",
      "Customer Service Representative",
      "Technical Support Specialist",
    ],
  ],

  ["Maintenance", [
    "Maintenance Supervisor",
    "Maintenance Worker",
    "Custodian",
  ]],
]);

const PROVINCES: CheckboxRadioSelectData<Province> = [
  { value: "Not Applicable", label: "Not Applicable" },
  { value: "Alberta", label: "Alberta" },
  { value: "British Columbia", label: "British Columbia" },
  { value: "Manitoba", label: "Manitoba" },
  { value: "New Brunswick", label: "New Brunswick" },
  { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
  { value: "Northwest Territories", label: "Northwest Territories" },
  { value: "Nova Scotia", label: "Nova Scotia" },
  { value: "Nunavut", label: "Nunavut" },
  { value: "Ontario", label: "Ontario" },
  { value: "Prince Edward Island", label: "Prince Edward Island" },
  { value: "Quebec", label: "Quebec" },
  { value: "Saskatchewan", label: "Saskatchewan" },
  { value: "Yukon", label: "Yukon" },
];

const STATES_US: CheckboxRadioSelectData<StatesUS> = [
  { value: "Not Applicable", label: "Not Applicable" },
  { value: "Alabama", label: "Alabama" },
  { value: "Alaska", label: "Alaska" },
  { value: "Arizona", label: "Arizona" },
  { value: "Arkansas", label: "Arkansas" },
  { value: "California", label: "California" },
  { value: "Colorado", label: "Colorado" },
  { value: "Connecticut", label: "Connecticut" },
  { value: "Delaware", label: "Delaware" },
  { value: "Florida", label: "Florida" },
  { value: "Georgia", label: "Georgia" },
  { value: "Hawaii", label: "Hawaii" },
  { value: "Idaho", label: "Idaho" },
  { value: "Illinois", label: "Illinois" },
  { value: "Indiana", label: "Indiana" },
  { value: "Iowa", label: "Iowa" },
  { value: "Kansas", label: "Kansas" },
  { value: "Kentucky", label: "Kentucky" },
  { value: "Louisiana", label: "Louisiana" },
  { value: "Maine", label: "Maine" },
  { value: "Maryland", label: "Maryland" },
  { value: "Massachusetts", label: "Massachusetts" },
  { value: "Michigan", label: "Michigan" },
  { value: "Minnesota", label: "Minnesota" },
  { value: "Mississippi", label: "Mississippi" },
  { value: "Missouri", label: "Missouri" },
  { value: "Montana", label: "Montana" },
  { value: "Nebraska", label: "Nebraska" },
  { value: "Nevada", label: "Nevada" },
  { value: "New Hampshire", label: "New Hampshire" },
  { value: "New Jersey", label: "New Jersey" },
  { value: "New Mexico", label: "New Mexico" },
  { value: "New York", label: "New York" },
  { value: "North Carolina", label: "North Carolina" },
  { value: "North Dakota", label: "North Dakota" },
  { value: "Ohio", label: "Ohio" },
  { value: "Oklahoma", label: "Oklahoma" },
  { value: "Oregon", label: "Oregon" },
  { value: "Pennsylvania", label: "Pennsylvania" },
  { value: "Rhode Island", label: "Rhode Island" },
  { value: "South Carolina", label: "South Carolina" },
  { value: "South Dakota", label: "South Dakota" },
  { value: "Tennessee", label: "Tennessee" },
  { value: "Texas", label: "Texas" },
  { value: "Utah", label: "Utah" },
  { value: "Vermont", label: "Vermont" },
  { value: "Virginia", label: "Virginia" },
  { value: "Washington", label: "Washington" },
  { value: "West Virginia", label: "West Virginia" },
  { value: "Wisconsin", label: "Wisconsin" },
  { value: "Wyoming", label: "Wyoming" },
];

const COUNTRIES: CheckboxRadioSelectData<Country> = [
  { value: "Canada", label: "Canada" },
  { value: "United States", label: "United States" },
];

const INPUT_WIDTH = 250;
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

const BASE_URL = `${PROTOCOL}${DOMAIN_NAME}:${PORT}`;
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

const OVERLAY_OPACITY = 0.05;
const OVERLAY_BLUR = 2;

// all fields of all resources that are date fields
// used in displayResource to format date fields
const RESOURCES_DATE_FIELDS = new Set([
  "createdAt",
  "updatedAt",
]);

// all fields of all resources that are image fields
// used in displayResource to format image fields
const RESOURCES_IMAGE_URL_FIELDS = new Set([
  "profilePictureUrl",
]);

export {
  ALL_STORE_LOCATIONS_DATA,
  API_URL,
  APP_HEADER_HEIGHT,
  AUTH_URL,
  BASE_URL,
  COLORS_SWATCHES,
  COUNTRIES,
  CUSTOMER_URL,
  DASHBOARD_HEADER_HEIGHT,
  DASHBOARD_HEADER_HEIGHT_MOBILE,
  DEPARTMENT_JOB_POSITION_MAP,
  DEPARTMENTS_DATA,
  DOMAIN_NAME,
  FETCH_REQUEST_TIMEOUT,
  FINANCIAL_URL,
  FONT_FAMILY_DATA,
  INPUT_WIDTH,
  JOB_POSITIONS_DATA,
  LOGIN_URL,
  LOGOUT_URL,
  METRICS_HEADER_HEIGHT,
  METRICS_HEADER_HEIGHT_MOBILE,
  METRICS_URL,
  MOBILE_BREAKPOINT,
  OVERLAY_BLUR,
  OVERLAY_OPACITY,
  PORT,
  PRODUCT_URL,
  PROTOCOL,
  PROVINCES,
  REGISTER_URL,
  REPAIR_URL,
  RESOURCES_DATE_FIELDS,
  RESOURCES_IMAGE_URL_FIELDS,
  SCREENSHOT_IMAGE_TYPE_DATA,
  STATES_US,
  STORE_LOCATIONS,
  TEXT_SHADOW,
};
export type { ColorsSwatches };
