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
  | "cpuFrequency"
  | "cpuSocket" // | "gpuChipset" | "motherboardSocket" | "motherboardChipset"
  | "date"
  | "dateNearFuture"
  | "dateNearPast"
  | "dateOfBirth"
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
  | "largeInteger"
  | "lastName"
  | "mediumInteger"
  | "money"
  | "name"
  | "objectKey"
  | "objectKey"
  | "password"
  | "phoneNumber"
  | "postalCodeCanada"
  | "postalCodeUS"
  | "privacyConsent"
  | "profilePictureUrl"
  | "ramTiming"
  | "ramVoltage"
  | "screenshotFilename"
  | "search"
  | "searchValue"
  | "smallInteger"
  | "textAreaInput"
  | "textInput"
  | "timeRailway"
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

  date: [
    [
      /^(19[0-9][0-9]|20[0-2][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
      "Must be a valid date from 1900-01-01 to 2029-12-31.",
    ],
    [/^.{10}$/, "Must be 10 characters length."],
  ],

  dateNearFuture: [
    [/^.{10}$/, "Must be 10 characters length."],
    [
      (value: string) => {
        const date = new Date(value);
        return date > new Date();
      },
      "Must be a valid date in the future.",
    ],
  ],

  dateNearPast: [
    [/^.{10}$/, "Must be 10 characters length."],
    [
      (value: string) => {
        const date = new Date(value);
        return date < new Date();
      },
      "Must be a valid date in the past.",
    ],
  ],

  dateOfBirth: [
    [
      /^(19[0-9][0-9]|20[0-1][0-9]|202[0-4])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
      `Must be a valid date in the range 1900-${
        new Date().getFullYear() - 18
      }.`,
    ],
    [/^.{10}$/, "Must be 10 characters length."],
    [
      (value: string) => {
        const date = new Date(value);
        return date < new Date();
      },
      "Must be a valid date in the past.",
    ],
    [
      (value: string) => {
        const date = new Date(value);
        const now = new Date();
        let age = now.getFullYear() - date.getFullYear();
        const m = now.getMonth() - date.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < date.getDate())) {
          age -= 1;
        }
        return age >= 18;
      },
      "Must be 18 years or older.",
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
      /^.{3,20}$/,
      "Must be between 3 and 20 characters.",
    ],
    [/^(?![-])/, "Cannot start with a hyphen."],
    [/^(?![_])/, "Cannot start with an underscore."],
    [/^(?![.])/, "Cannot start with a period."],
    [/^(?!.*[-]{2})/, "Cannot contain two hyphens in a row."],
    [/^(?!.*[_]{2})/, "Cannot contain two underscores in a row."],
    [/^(?!.*[.]{2})/, "Cannot contain two periods in a row."],
    [
      /^[a-zA-Z0-9-_.]+$/,
      "Can only contain alphanumeric characters, hyphens, underscores, and periods.",
    ],
    [/^(?!^0*\.?0*$)/, "Must not consist entirely of zeroes."],
    // [/^(?!.*[-]).*$/, "Cannot end with a hyphen."],
    // [/^(?!.*[_]).*$/, "Cannot end with an underscore."],
    // [/^(?!.*[.]).*$/, "Cannot end with a period."],
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
