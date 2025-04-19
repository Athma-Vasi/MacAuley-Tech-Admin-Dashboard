import type { ValidationFunctionsTable } from "./types";

type ValidationKey =
  | "accessoryType"
  | "acknowledgement"
  | "addressLine"
  | "allowAll"
  | "axisBottomLegend"
  | "axisLeftLegend"
  | "axisRightLegend"
  | "axisTopLegend"
  | "brand"
  | "chartTitle"
  | "city"
  | "colorVariant"
  | "confirmPassword"
  | "country"
  | "cpuFrequency"
  | "cpuSocket" // | "gpuChipset" | "motherboardSocket" | "motherboardChipset"
  | "createdAt"
  | "date"
  | "department"
  | "dimensions"
  | "displayAspectRatio"
  | "editFieldValue"
  | "email"
  | "exclusion"
  | "filterValue"
  | "firstName"
  | "frequencyResponse"
  | "fullName"
  | "inclusion"
  | "jobPosition"
  | "largeInteger"
  | "lastName"
  | "mediumInteger"
  | "money"
  | "name"
  | "objectKey"
  | "orgId"
  | "password"
  | "phoneNumber"
  | "postalCodeCanada"
  | "postalCodeUS"
  | "privacyConsent"
  | "profilePictureUrl"
  | "province"
  | "ramTiming"
  | "ramVoltage"
  | "screenshotFilename"
  | "search"
  | "searchValue"
  | "smallInteger"
  | "state"
  | "textAreaInput"
  | "textInput"
  | "timeRailway"
  | "updatedAt"
  | "url"
  | "userDefinedValue"
  | "userId"
  | "username"
  | "weight";

/**
 * - Validation functions for input fields.
 * - validation === false ? message : ""
 */
const VALIDATION_FUNCTIONS_TABLE: ValidationFunctionsTable = {
  accessoryType: [
    [
      /^[a-zA-Z0-9\s.,'-]+$/,
      "Must contain only letters, numbers, spaces, periods, commas, hyphens, and apostrophes.",
    ],
    [/^.{2,30}/, "Must be between 2 and 30 characters length."],
  ],

  acknowledgement: [[
    /^(true)$/,
    "Must acknowledge that the information entered is correct.",
  ]],

  addressLine: [
    [/^.{2,75}/, "Must be between 2 and 75 characters length."],
    [
      /^[A-Za-z0-9\s.,#-]+$/,
      "Must contain only letters, numbers, spaces, and special characters: . , # -",
    ],
  ],

  allowAll: [],

  axisBottomLegend: [
    [
      /^(?=.*[A-Za-z0-9])/,
      "Must contain at least one alphanumeric character.",
    ],
    [
      /^[A-Za-z0-9\s.,#-]+$/,
      "Must contain only letters, numbers, spaces, and special characters: . , # -",
    ],
    [/^.{2,75}$/, "Must be between 2 and 75 characters length."],
  ],

  axisLeftLegend: [
    [
      /^(?=.*[A-Za-z0-9])/,
      "Must contain at least one alphanumeric character.",
    ],
    [
      /^[A-Za-z0-9\s.,#-]+$/,
      "Must contain only letters, numbers, spaces, and special characters: . , # -",
    ],
    [/^.{2,75}$/, "Must be between 2 and 75 characters length."],
  ],

  axisRightLegend: [
    [
      /^(?=.*[A-Za-z0-9])/,
      "Must contain at least one alphanumeric character.",
    ],
    [
      /^[A-Za-z0-9\s.,#-]+$/,
      "Must contain only letters, numbers, spaces, and special characters: . , # -",
    ],
    [/^.{2,75}$/, "Must be between 2 and 75 characters length."],
  ],

  axisTopLegend: [
    [
      /^(?=.*[A-Za-z0-9])/,
      "Must contain at least one alphanumeric character.",
    ],
    [
      /^[A-Za-z0-9\s.,#-]+$/,
      "Must contain only letters, numbers, spaces, and special characters: . , # -",
    ],
    [/^.{2,75}$/, "Must be between 2 and 75 characters length."],
  ],

  brand: [
    [
      /^[a-zA-Z0-9\s.,'-]+$/,
      "Must contain only letters, numbers, spaces, periods, commas, hyphens, and apostrophes.",
    ],
    [/^.{2,30}$/, "Must be between 2 and 30 characters length."],
  ],

  chartTitle: [
    [
      /^(?!^\s*$)/,
      "Must not be empty or consist entirely of whitespace characters.",
    ],
    [
      /^[A-Za-z\s.\-']+$/,
      "Must contain only letters, spaces, periods, hyphens, and apostrophes.",
    ],
    // [
    //   /^[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/,
    //   "Must contain only alphanumeric characters and special characters.",
    // ],
    [/^.{2,100}$/, "Must be between 2 and 100 characters length."],
  ],

  city: [
    [
      /^[A-Za-z\s.\-']+$/,
      "Must contain only letters, spaces, periods, hyphens, and apostrophes.",
    ],
    [/^.{2,75}$/, "Must be between 2 and 75 characters length."],
  ],

  colorVariant: [
    [
      /^[a-zA-Z0-9#\s-]+$/,
      "Must be in hexadecimal string notation (e.g. #ff000044) or a valid color name (e.g. violet).",
    ],
    [/^.{2,9}$/, "Must be between 2 and 9 characters length."],
  ],

  confirmPassword: [
    [/^.{8,32}$/i, "Must be between 8 and 32 characters."],
    [/^(?=.*[A-Z])/, "Must contain at least one uppercase letter."],
    [/^(?=.*[a-z])/, "Must contain at least one lowercase letter."],
    [/^(?=.*[0-9])/, "Must contain at least one number."],
    [/^(?=.*[!@#$%^&*])/, "Must contain at least one special character."],
    [/^(?!.*\s)/, "Cannot contain spaces."],
  ],

  country: [
    [/^(Canada|United States)$/, "Must be either Canada or United States."],
  ],

  cpuFrequency: [
    [/^(?!^$|^0*$)/, "Must not be empty or consist entirely of zeroes."],
    [/^[0-9]{1}(\.[0-9]{1,3})?$/, "Must contain only numbers."],
    [/^.{1,5}$/, "Must be between 1 and 5 characters length."],
    [
      /^[0-9]{1}(\.[0-9]{1,3})?$/,
      "Must contain only numbers with an optional decimal point.",
    ],
  ],

  cpuSocket: [
    [
      /^[a-zA-Z0-9\s.,'()-]+$/,
      "Must contain only letters, numbers, spaces, periods, commas, hyphens, and apostrophes.",
    ],
    [/^.{2,30}$/, "Must be between 2 and 30 characters length."],
  ],

  createdAt: [[
    /^(19[0-9][0-9]|20[0-2][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    "Must be a valid date from 1900-01-01 to 2029-12-31.",
  ], [/^.{10}$/, "Must be 10 characters length."]],

  date: [
    [
      /^(19[0-9][0-9]|20[0-2][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
      "Must be a valid date from 1900-01-01 to 2029-12-31.",
    ],
    [/^.{10}$/, "Must be 10 characters length."],
  ],

  department: [
    [
      /^(Executive Management|Store Administration|Office Administration|Accounting|Human Resources|Sales|Marketing|Information Technology|Repair Technicians|Field Service Technicians|Logistics and Inventory|Customer Service|Maintenance)$/,
      "Must be a valid department.",
    ],
  ],

  dimensions: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [/^.{1,6}$/, "Must be between 1 and 6 characters length."],
    [
      /^([0-9][.]?)+$/,
      "Must contain only numbers with an optional decimal point.",
    ],
  ],

  displayAspectRatio: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [
      /^[0-9]{1,2}:[0-9]{1,2}$/,
      "Must be a valid display aspect ratio in the format 00:00.",
    ],
  ],

  editFieldValue: [],

  /**
   * - RFC 5322 Official Standard
   * - @see https://emailregex.com/
   */
  email: [
    [
      // eslint-disable-next-line no-control-regex
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
      "Must be a valid email address.",
    ],
  ],

  exclusion: [
    [
      /^[A-Za-z0-9\w\s.,!?():;"'-]+$/,
      "Must contain only letters, numbers, spaces, periods, commas, exclamation marks, question marks, parentheses, colons, semicolons, double quotation marks, single quotation marks, or hyphens.",
    ],
    [/^.{1,100}$/, "Must be between 1 and 100 characters length."],
  ],

  filterValue: [],

  firstName: [
    [
      /^[A-Za-z\s.\-']+$/,
      "Must contain only letters, spaces, periods, hyphens, and apostrophes.",
    ],
    [/^.{2,75}$/, "Must be between 2 and 75 characters length."],
  ],

  frequencyResponse: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [
      /^[0-9]{1,2}[\s]{0,1}Hz[\s]{0,1}-[\s]{0,1}[0-9]{1,2}[\s]{0,1}kHz$/,
      "Must be a valid speaker frequency response in the format 00Hz-00kHz with optional single spaces.",
    ],
  ],

  fullName: [
    [
      /^[A-Za-z\s.\-']+$/,
      "Must contain only letters, spaces, periods, hyphens, and apostrophes.",
    ],
    [/^.{2,75}$/, "Must be between 2 and 75 characters length."],
  ],

  inclusion: [
    [
      /^[A-Za-z0-9\w\s.,!?():;"'-]+$/,
      "Must contain only letters, numbers, spaces, periods, commas, exclamation marks, question marks, parentheses, colons, semicolons, double quotation marks, single quotation marks, or hyphens.",
    ],
    [/^.{1,100}$/, "Must be between 1 and 100 characters length."],
  ],

  jobPosition: [
    [
      /^(Chief Executive Officer|Chief Operations Officer|Chief Financial Officer|Chief Technology Officer|Chief Marketing Officer|Chief Sales Officer|Chief Human Resources Officer|Human Resources Manager|Compensation and Benefits Specialist|Health and Safety Specialist|Training Specialist|Recruiting Specialist|Store Manager|Shift Supervisor|Office Manager|Office Administrator|Receptionist|Data Entry Specialist|Accounting Manager|Accounts Payable Clerk|Accounts Receivable Clerk|Financial Analyst|Sales Manager|Sales Representative|Business Development Specialist|Sales Support Specialist|Sales Operations Analyst|Marketing Manager|Digital Marketing Specialist|Graphic Designer|Public Relations Specialist|Marketing Analyst|IT Manager|Systems Administrator|IT Support Specialist|Database Administrator|Web Developer|Software Developer|Software Engineer|Repair Technicians Supervisor|Electronics Technician|Computer Technician|Smartphone Technician|Tablet Technician|Audio\/Video Equipment Technician|Field Service Supervisor|On-Site Technician|Warehouse Supervisor|Inventory Clerk|Delivery Driver|Parts and Materials Handler|Shipper\/Receiver|Customer Service Supervisor|Customer Service Representative|Technical Support Specialist|Maintenance Supervisor|Maintenance Worker|Custodian)$/,
      "Must be a valid job position.",
    ],
  ],

  largeInteger: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [/^[0-9]+$/, "Must contain only numbers."],
    [/^.{1,6}$/, "Must be between 1 and 6 characters length."],
  ],

  lastName: [
    [
      /^[A-Za-z\s.\-']+$/,
      "Must contain only letters, spaces, periods, hyphens, and apostrophes.",
    ],
    [/^.{2,75}$/, "Must be between 2 and 75 characters length."],
  ],

  mediumInteger: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [/^[0-9]+$/, "Must contain only numbers."],
    [/^.{1,4}$/, "Must be between 1 and 4 characters length."],
  ],

  money: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [/^(?=.*[0-9])/, "Must contain at least one number."],
    [
      /^([0-9][.]?)+$/,
      "Must contain only numbers and an optional decimal point.",
    ],
    [/^.{1,9}$/, "Must be between 1 and 9 characters length."],
  ],

  name: [
    [
      /^[A-Za-z\s.\-']+$/,
      "Must contain only letters, spaces, periods, hyphens, and apostrophes.",
    ],
    [/^.{2,30}$/, "Must be between 2 and 30 characters length."],
  ],

  objectKey: [
    [/^(?!\d)/, "Must not start with a digit."],
    [/^(?!.*['"]).*$/, "Must not contain quotes."],
    [/^(?!.*[ ]).*$/, "Must not contain spaces."],
    [/^(?!.*\\).*$/, "Must not contain backslashes."],
    [
      /^.{1,75}$/,
      "Must be between 1 and 75 characters length.",
    ],
  ],

  orgId: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [/^[0-9]+$/, "Must contain only numbers."],
    [/^.{1,6}$/, "Must be between 1 and 6 characters length."],
  ],

  password: [
    [/^.{8,32}$/i, "Must be between 8 and 32 characters."],
    [/^(?=.*[A-Z])/, "Must contain at least one uppercase letter."],
    [/^(?=.*[a-z])/, "Must contain at least one lowercase letter."],
    [/^(?=.*[0-9])/, "Must contain at least one number."],
    [/^(?=.*[!@#$%^&*])/, "Must contain at least one special character."],
    [/^(?!.*\s)/, "Cannot contain spaces."],
  ],

  phoneNumber: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [/\d+$/, "Must contain only numbers."],
    [/^.{10,15}$/, "Must be between 10 and 15 characters length."],
  ],

  postalCodeCanada: [
    [
      /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/,
      "Must be in the format A1A 1A1.",
    ],
  ],

  postalCodeUS: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [
      /^\d{5}(?:[-]\d{4})?$/,
      "Must be a valid US zip code of the ZIP+4 format with five digits or five digits plus a hyphen and four additional digits.",
    ],
    [/^[0-9-]+$/, "Must only contain numbers and a hyphen."],
  ],

  privacyConsent: [[/^(true)$/, "Must consent to share details."]],

  profilePictureUrl: [
    [/^https?:\/\//, "Must start with 'http://' or 'https://'."],
    [/^.{1,256}/, "Must be between 1 and 256 characters length."],
    [
      /^[-a-zA-Z0-9()@:%_+.~#?&//=]*$/,
      "Must contain only letters, numbers, and special characters.",
    ],
  ],

  province: [
    [
      /^(Not Applicable|Alberta|British Columbia|Manitoba|New Brunswick|Newfoundland and Labrador|Nova Scotia|Ontario|Prince Edward Island|Quebec|Saskatchewan|Northwest Territories|Nunavut|Yukon)$/,
      "Must be a valid Canadian province or territory.",
    ],
  ],

  ramTiming: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [
      /^[0-9]{1,3}[-]{1}[0-9]{1,3}[-]{1}[0-9]{1,3}[-]{1}[0-9]{1,3}$/,
      "Must be a valid RAM timing in the format 00-00-00-00.",
    ],
    [/^.{11}$/, "Must be 11 characters length."],
  ],

  ramVoltage: [
    [
      /^[0-9]{1}[.]{1}[0-9]{1,3}$/,
      "Must only contain numbers and a period in the format 0.0 - 0.000.",
    ],
    [
      /^([0-9][.]?)+$/,
      "Must contain only numbers and an optional decimal point.",
    ],
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [/^.{1,5}$/, "Must be 3 to 5 characters length."],
  ],

  screenshotFilename: [
    [
      /^(?!^\s*$)/,
      "Must not be empty or consist entirely of whitespace characters.",
    ],
    [
      /^[a-zA-Z0-9-_]+$/,
      "Can only contain alphanumeric characters, hyphens and underscores.",
    ],
    // [
    //   /^[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/,
    //   "Must contain only alphanumeric characters and special characters.",
    // ],
    [/^.{2,100}$/, "Must be between 2 and 100 characters length."],
  ],

  search: [
    [/[A-Za-z0-9]+$/, "Must contain only letters and numbers."],
    [
      /^[\w\s.,!?():;"'-]+$/,
      "Can only contain letters, numbers, spaces, and special characters: . , ! ? ( ) : ; \" ' -",
    ],
  ],

  searchValue: [],

  smallInteger: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [/^[0-9]+$/, "Must contain only numbers."],
    [/^.{1,2}$/, "Must be between 1 and 2 characters length."],
  ],

  state: [
    [
      /^(Not Applicable|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)$/,
      "Must be a valid US state.",
    ],
  ],

  textInput: [
    [
      /^(?=.*[A-Za-z0-9])/,
      "Must contain at least one alphanumeric character.",
    ],
    [
      /^[A-Za-z0-9\s.,#-]+$/,
      "Must contain only letters, numbers, spaces, and special characters: . , # -",
    ],
    [/^.{2,75}$/, "Must be between 2 and 75 characters length."],
  ],

  textAreaInput: [
    [
      /^(?=.*[A-Za-z0-9])/,
      "Must contain at least one alphanumeric character.",
    ],
    [/^.{2,2000}$/, "Must be between 2 and 2000 characters length."],
    [
      /^[\w\s.,!?():;"'-]+$/,
      "Can only contain letters, numbers, spaces, and special characters: . , ! ? ( ) : ; \" ' -",
    ],
  ],

  timeRailway: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Must be a valid time in 24-hour format.",
    ],
    [/^.{4,5}$/i, "Must be between 4 and 5 characters long."],
  ],

  updatedAt: [[
    /^(19[0-9][0-9]|20[0-2][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    "Must be a valid date from 1900-01-01 to 2029-12-31.",
  ], [/^.{10}$/, "Must be 10 characters length."]],

  url: [
    [/^https?:\/\//, "Must start with 'http://' or 'https://'."],
    [/^.{1,256}/, "Must be between 1 and 256 characters length."],
    [
      /^[-a-zA-Z0-9()@:%_+.~#?&//=]*$/,
      "Must contain only letters, numbers, and special characters.",
    ],
  ],

  userDefinedValue: [
    [
      /^(?!^\s*$)/,
      "Must not be empty or consist entirely of whitespace characters.",
    ],
    [
      /^[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/,
      "Must contain only alphanumeric characters and special characters.",
    ],
    [/^.{2,2000}$/, "Must be between 2 and 2000 characters length."],
  ],

  userId: [
    [/^[0-9a-fA-F]$/, "Must contain only hexadecimal characters."],
    [/^.{24}$/, "Must be 24 characters length."],
  ],

  username: [
    [
      /^.{3,48}$/,
      "Must be between 3 and 48 characters.",
    ],
    [/^(?![-])/, "Cannot start with a hyphen."],
    [/^(?![_])/, "Cannot start with an underscore."],
    [/^(?![.])/, "Cannot start with a period."],
    [
      /^[a-zA-Z0-9-_.]+$/,
      "Can only contain alphanumeric characters, hyphens, underscores, and periods.",
    ],
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
  ],

  weight: [
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    [
      /^([0-9][.]?)+$/,
      "Must contain only numbers with an optional decimal point.",
    ],
    [/^.{1,6}$/, "Must be between 1 and 6 characters length."],
  ],
};

export { VALIDATION_FUNCTIONS_TABLE };
export type { ValidationKey };
