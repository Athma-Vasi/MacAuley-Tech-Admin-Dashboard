import html2canvas from "html2canvas";
import jwtDecode from "jwt-decode";
import { NavigateFunction } from "react-router-dom";
import { Err, Ok } from "ts-results";
import { v4 as uuidv4 } from "uuid";
import { ColorsSwatches } from "./constants";
import { AuthAction } from "./context/authProvider";
import { AuthDispatch, AuthState } from "./context/authProvider/types";

import localforage from "localforage";
import { ProductMetricCategory } from "./components/dashboard/product/types";
import { RepairMetricCategory } from "./components/dashboard/repair/types";
import { AllStoreLocations } from "./components/dashboard/types";
import {
  DecodedToken,
  HttpServerResponse,
  SafeBoxResult,
  ThemeObject,
  UserRoles,
} from "./types";

type CaptureScreenshotInput = {
  chartRef: any;
  screenshotFilename: string;
  screenshotImageQuality: number;
  screenshotImageType: string;
};
/**
 * Captures a screenshot of a chart rendered in the browser and triggers a download.
 * @see https://medium.com/@pro.grb.studio/how-to-screencapture-in-reactjs-step-by-step-guide-b435e8b53e11
 * @param {CaptureScreenshotInput} options - Options for capturing the screenshot.
 * @param {any} options.chartRef - A reference to the chart element to capture.
 * @param {string} options.screenshotFilename - The desired filename for the screenshot.
 * @param {number} options.screenshotImageQuality - The quality of the screenshot image (0-1).
 * @param {string} options.screenshotImageType - The type of the image (image/webp, 'image/png', 'image/jpeg').
 * @returns {Promise<void>}
 */
async function captureScreenshot({
  chartRef,
  screenshotFilename,
  screenshotImageQuality,
  screenshotImageType,
}: CaptureScreenshotInput): Promise<void> {
  const canvasPromise = html2canvas(chartRef.current, {
    useCORS: true,
  });
  canvasPromise.then((canvas) => {
    const dataURL = canvas.toDataURL(
      screenshotImageType,
      screenshotImageQuality,
    );
    // Create an image element from the data URL
    const img = new Image();
    img.src = dataURL;
    // Create a link element
    const a = document.createElement("a");
    // Set the href of the link to the data URL of the image
    a.href = img.src;

    const filename = screenshotFilename ? screenshotFilename : uuidv4();
    const extension = screenshotImageType.split("/")[1];

    // Set the download attribute of the link
    a.download = `${filename}.${extension}`;
    // Append the link to the page
    document.body.appendChild(a);
    // Click the link to trigger the download
    a.click();
    // Remove the link from the page
    document.body.removeChild(a);
  });
}

function addCommaSeparator(numStr: string | number): string {
  return numStr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toFixedFloat(num: number, precision = 4): number {
  return num === undefined ? 0 : Number(num.toFixed(precision));
}

function removeUndefinedAndNull<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

function capitalizeAll(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

function capitalizeJoinWithAnd(strings: string[]): string {
  const joined = strings
    // .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
    .map((string) => splitCamelCase(string))
    .join(", ");
  return replaceLastCommaWithAnd(joined);
}

/**
 * Splits a camelCase or PascalCase string into words and capitalizes the first letter.
 *
 * This function takes a camelCase or PascalCase string as input and splits it into words
 * by inserting spaces between lowercase and uppercase letters. The first letter of the
 * resulting string is then capitalized.
 *
 * @param {string} word - The camelCase or PascalCase string to be processed.
 * @returns {string} A new string with words separated and the first letter capitalized.
 */
function splitCamelCase(word: string): string {
  // Replace lowercase-uppercase pairs with a space in between
  const splitStr = word.replace(/([a-z])([A-Z])/g, "$1 $2");
  // Capitalize the first letter of the resulting string
  return splitStr.charAt(0).toUpperCase() + splitStr.slice(1);
}

/**
 * Replaces the last comma in a string with ' and ' if needed.
 *
 * This function takes a string as input and replaces the last comma in the string with ' and '
 * if the string contains at least one comma. It then returns the modified string.
 *
 * @param {string} str - The input string to process.
 * @returns {string} A new string with the last comma replaced by ' and ' if applicable.
 */
function replaceLastCommaWithAnd(str: string): string {
  // returns an array of matches of all occurrences of a comma
  const commaCount = str.match(/,/g)?.length ?? 0;
  // /(?=[^,]*$)/: matches a comma that is followed by zero or more non-comma characters until the end of the string, using a positive lookahead assertion (?=...).
  const strWithAnd = str.replace(/,(?=[^,]*$)/, commaCount > 0 ? " and" : "");

  return strWithAnd;
}

function replaceLastCommaWithOr(str: string): string {
  // returns an array of matches of all occurrences of a comma
  const commaCount = str.match(/,/g)?.length ?? 0;
  // /(?=[^,]*$)/: matches a comma that is followed by zero or more non-comma characters until the end of the string, using a positive lookahead assertion (?=...).
  const strWithOr = str.replace(/,(?=[^,]*$)/, commaCount > 0 ? " or" : "");

  return strWithOr;
}

function returnTimeToRead(string: string) {
  const wordsPerMinute = 200;
  const textLength = string.split(" ").length;
  return Math.ceil(textLength / wordsPerMinute);
}

function formatDate({
  date,
  formatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  },
  locale = "en-US",
}: {
  date: string;
  formatOptions?: Intl.DateTimeFormatOptions;
  locale?: string;
}): string {
  return new Intl.DateTimeFormat(locale, formatOptions).format(
    new Date(date),
  );
}

function returnThemeColors({
  themeObject,
  colorsSwatches,
}: {
  themeObject: ThemeObject;
  colorsSwatches: ColorsSwatches;
}) {
  const { colorScheme, primaryColor, primaryShade } = themeObject;
  const {
    blue,
    cyan,
    dark,
    grape,
    gray,
    green,
    indigo,
    lime,
    orange,
    pink,
    red,
    teal,
    violet,
    yellow,
  } = colorsSwatches;

  const colorShade = colorScheme === "light"
    ? primaryShade.light
    : primaryShade.dark;
  const themeColorShades = Object.entries(colorsSwatches).find(
    ([color, _shades]) => color === primaryColor,
  )?.[1];
  const themeColorShade = themeColorShades
    ? themeColorShades[colorShade]
    : gray[5];

  // all color shades
  const grayColorShade = gray[colorShade];
  const grayBorderShade = colorScheme === "light" ? gray[2] : gray[8];
  const redColorShade = red[colorShade];
  const greenColorShade = green[colorShade];
  const cyanColorShade = cyan[colorShade];
  const yellowColorShade = yellow[colorShade];
  const orangeColorShade = orange[colorShade];
  const blueColorShade = blue[colorShade];
  const pinkColorShade = pink[colorShade];
  const violetColorShade = violet[colorShade];
  const indigoColorShade = indigo[colorShade];
  const limeColorShade = lime[colorShade];
  const darkColorShade = dark[colorShade];
  const tealColorShade = teal[colorShade];
  const grapeColorShade = grape[colorShade];

  const textColor = colorScheme === "light" ? gray[8] : gray[5];
  const textColorSliderLabel = gray[3];

  const ANGLE = "45deg";

  const headerBgColor = colorScheme === "light"
    ? (themeColorShades?.[0] ?? "#f5f5f5")
    : dark[6];
  const headerBgGradient = colorScheme === "light"
    ? `linear-gradient(${ANGLE},  #f5f5f5, ${headerBgColor})`
    : `linear-gradient(${ANGLE}, ${headerBgColor}, ${headerBgColor})`;

  const stickyHeaderBackgroundColor = colorScheme === "light"
    ? (themeColorShades?.[1] ?? "#f5f5f5")
    : dark[6];
  const stickyHeaderBgGradient = colorScheme === "light"
    ? `linear-gradient(${ANGLE}, ${stickyHeaderBackgroundColor}, #f5f5f5)`
    : `linear-gradient(${ANGLE}, ${stickyHeaderBackgroundColor}, ${dark[7]})`;

  const backgroundColorLight = colorScheme === "light"
    ? (themeColorShades?.[0] ?? "#f5f5f5")
    : dark[7];
  const bgGradient = colorScheme === "light"
    ? `linear-gradient(${ANGLE}, ${backgroundColorLight}, #f5f5f5)`
    : `linear-gradient(${ANGLE}, ${backgroundColorLight}, ${dark[8]})`;

  const cardBackgroundColor = colorScheme === "light"
    ? (themeColorShades?.[0] ?? "#f5f5f5")
    : dark[8];
  const cardBgGradient = colorScheme === "light"
    ? `linear-gradient(${ANGLE},  #f5f5f5, ${cardBackgroundColor})`
    : `linear-gradient(${ANGLE}, ${cardBackgroundColor}, ${dark[8]})`;

  // for ScrollArea styles
  const scrollBarStyle = {
    scrollbar: {
      "&, &:hover": {
        background: colorScheme === "dark" ? dark[6] : gray[0],
      },

      '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
        backgroundColor: themeColorShade,
      },

      '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb': {
        backgroundColor: themeColorShade,
      },
    },

    corner: {
      opacity: 1,
      background: colorScheme === "dark" ? dark[6] : gray[0],
    },
  };

  return {
    stickyHeaderBgGradient,
    cardBgGradient,
    headerBgGradient,
    bgGradient,
    blueColorShade,
    cyanColorShade,
    darkColorShade,
    grapeColorShade,
    grayBorderShade,
    grayColorShade,
    greenColorShade,
    indigoColorShade,
    limeColorShade,
    orangeColorShade,
    pinkColorShade,
    redColorShade,
    scrollBarStyle,
    tealColorShade,
    textColor,
    textColorSliderLabel,
    themeColorShade,
    themeColorShades,
    violetColorShade,
    yellowColorShade,
  };
}

/**
 * @description creates marks for slider wrapper component
 */
function returnSliderMarks({
  max,
  min,
  precision = 0,
  steps = 2,
  symbol = "",
}: {
  max: number;
  min: number;
  steps?: number;
  precision?: number;
  symbol?: string;
}): { value: number; label: string }[] {
  const step = (max - min) / steps;

  return Array.from({ length: steps + 1 }, (_, i) => {
    const value = min + step * i;
    const valueFormatted = value.toFixed(precision);

    return {
      value: Number.parseInt(valueFormatted),
      label: `${valueFormatted}${symbol}`,
    };
  });
}

/**
 * @description replaces hyphens & underscores with spaces and capitalizes the first letter of each word
 */
function splitWordIntoUpperCasedSentence(sentence: string): string {
  return sentence
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type UrlBuilderInput = {
  protocol?: string;
  host?: string;
  port?: string;
  path?: string;
  query?: string;
  hash?: string;
};
function urlBuilder({
  hash = "",
  host = "localhost",
  path = "",
  port = "5500",
  protocol = "http",
  query = "",
}: UrlBuilderInput): URL {
  return new URL(`${protocol}://${host}:${port}/api/v1/${path}${query}${hash}`);
}

async function decodeJWTSafe<Decoded extends DecodedToken = DecodedToken>(
  token: string,
): Promise<SafeBoxResult<Decoded>> {
  try {
    const decoded: Decoded = jwtDecode(token);
    return new Ok({ data: decoded, kind: "success" });
  } catch (error: unknown) {
    return new Err({ data: error, kind: "error" });
  }
}

async function fetchSafe(input: RequestInfo | URL, init?: RequestInit): Promise<
  SafeBoxResult<Response>
> {
  try {
    const response: Response = await fetch(input, init);
    return new Ok({ data: response, kind: "success" });
  } catch (error: unknown) {
    return new Err({ data: error, kind: "error" });
  }
}

async function responseToJSONSafe<Data = unknown>(
  response: Response,
): Promise<SafeBoxResult<Data>> {
  try {
    const data: Data = await response.json();
    return new Ok({ data, kind: "success" });
  } catch (error: unknown) {
    return new Err({ data: error, kind: "error" });
  }
}

async function getItemForageSafe<Data = unknown>(
  key: string,
): Promise<SafeBoxResult<Data>> {
  try {
    const data: Data = await localforage.getItem(key);
    if (data === null || data === undefined) {
      return new Ok({ data: void 0, kind: "notFound" });
    }

    return new Ok({ data, kind: "success" });
  } catch (error: unknown) {
    return new Err({ data: error, kind: "error" });
  }
}

async function setItemForageSafe<Data = unknown>(
  key: string,
  value: Data,
): Promise<SafeBoxResult<undefined>> {
  try {
    await localforage.setItem(key, value);
    return new Ok({ data: void 0, kind: "success" });
  } catch (error: unknown) {
    return new Err({ data: error, kind: "error" });
  }
}

function createForageKey(
  {
    metricsView,
    productMetricCategory,
    repairMetricCategory,
    storeLocationView,
  }: {
    metricsView: string;
    storeLocationView: AllStoreLocations;
    productMetricCategory: ProductMetricCategory;
    repairMetricCategory: RepairMetricCategory;
  },
) {
  const capitalizedMetricsView = `${metricsView?.[0].toUpperCase()}${
    metricsView?.slice(1)
  }`;

  return `${capitalizedMetricsView}-${storeLocationView}${
    metricsView === "repairs" ? "-" + repairMetricCategory : metricsView ===
        "products"
      ? "-" + productMetricCategory
      : ""
  }`;
}

function addTokenDetailsToBody(
  body: Record<string, unknown>,
  authState: AuthState,
): string {
  const { decodedToken } = authState;

  if (!decodedToken) {
    return JSON.stringify(body);
  }

  const { sessionId, userInfo: { userId, username, roles } } = decodedToken;

  const tokenDetails = {
    sessionId,
    userInfo: {
      roles,
      userId,
      username,
    },
  };

  return JSON.stringify({ ...body, ...tokenDetails });
}

async function fetchRequestPOSTSafe<
  DBRecord = Record<string, unknown> & {
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  },
  IsSubmittingAction extends string = string,
  IsSuccessfulAction extends string = string,
  TriggerFormSubmitAction extends string = string,
>(
  {
    accessToken,
    authAction,
    authDispatch,
    closeSubmitFormModal,
    url,
    dispatch,
    fetchAbortController,
    isComponentMounted,
    isSubmittingAction,
    isSuccessfulAction,
    navigateFn,
    openSubmitFormModal,
    queryString,
    requestBody,
    roles,
    triggerFormSubmitAction,
  }: {
    accessToken: string;
    authAction: AuthAction;
    authDispatch: React.Dispatch<AuthDispatch>;
    closeSubmitFormModal: () => void;
    url: URL | string;
    dispatch: React.Dispatch<{
      action: IsSubmittingAction | IsSuccessfulAction | TriggerFormSubmitAction;
      payload: boolean;
    }>;
    /** must be defined outside useEffect */
    fetchAbortController: AbortController;
    /** must be defined outside useEffect */
    isComponentMounted: boolean;
    isSubmittingAction: IsSubmittingAction;
    isSuccessfulAction: IsSuccessfulAction;
    navigateFn: NavigateFunction;
    openSubmitFormModal: () => void;
    queryString?: string;
    requestBody: string | FormData;
    roles: UserRoles;
    triggerFormSubmitAction: TriggerFormSubmitAction;
  },
): Promise<SafeBoxResult<HttpServerResponse<DBRecord>>> {
  openSubmitFormModal();

  dispatch({
    action: isSubmittingAction,
    payload: true,
  });

  const userRole = roles.includes("Manager")
    ? "manager"
    : roles.includes("Admin")
    ? "admin"
    : "employee";

  const requestInit: RequestInit = {
    body: requestBody,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    signal: fetchAbortController.signal,
  };

  try {
    const responseResult = await fetchSafe(url, requestInit);

    if (responseResult.err) {
      return new Err({
        data: responseResult.val.data ??
          new Error(responseResult.val.message ?? "Network error"),
        kind: "error",
      });
    }

    if (!isComponentMounted) {
      return new Ok({ kind: "error", message: "Component is not mounted" });
    }

    const responseUnwrapped = responseResult.safeUnwrap().data;
    if (responseUnwrapped === undefined) {
      return new Ok({ kind: "error", message: "Response is undefined" });
    }

    if (!responseUnwrapped.ok) {
      return new Ok({ kind: "error", message: responseUnwrapped.statusText });
    }

    const jsonResult = await responseToJSONSafe<HttpServerResponse<DBRecord>>(
      responseUnwrapped,
    );

    if (jsonResult.err) {
      return new Err({
        data: jsonResult.val.data ??
          new Error(jsonResult.val.message ?? "Network error"),
        kind: "error",
      });
    }

    if (!isComponentMounted) {
      return new Ok({ kind: "error", message: "Component is not mounted" });
    }

    const serverResponse = jsonResult.safeUnwrap().data;
    if (serverResponse === undefined) {
      return new Ok({ kind: "error", message: "JSON data is undefined" });
    }

    if (serverResponse.triggerLogout) {
      authDispatch({
        action: authAction.setAccessToken,
        payload: "",
      });
      authDispatch({
        action: authAction.setIsLoggedIn,
        payload: false,
      });
      authDispatch({
        action: authAction.setDecodedToken,
        payload: Object.create(null),
      });
      authDispatch({
        action: authAction.setUserDocument,
        payload: Object.create(null),
      });

      navigateFn("/login");

      return new Err({
        data: new Error("Unauthorized access"),
        kind: "error",
      });
    }

    const decodedTokenResult = await decodeJWTSafe(accessToken);
    if (decodedTokenResult.err) {
      return new Err({ data: decodedTokenResult.val.data, kind: "error" });
    }

    const decodedToken = decodedTokenResult.safeUnwrap().data;
    if (decodedToken === undefined) {
      return new Ok({ kind: "error", message: "Decoded token is undefined" });
    }

    authDispatch({
      action: authAction.setAccessToken,
      payload: serverResponse.accessToken,
    });
    authDispatch({
      action: authAction.setDecodedToken,
      payload: decodedToken,
    });

    dispatch({
      action: isSuccessfulAction,
      payload: true,
    });
    dispatch({
      action: isSubmittingAction,
      payload: false,
    });
    dispatch({
      action: triggerFormSubmitAction,
      payload: false,
    });

    return new Ok({ data: serverResponse, kind: "success" });
  } catch (error: unknown) {
    if (
      !isComponentMounted ||
      error instanceof Error && error?.name === "AbortError"
    ) {
      return new Ok({ kind: "error" });
    }

    return new Err({ data: error, kind: "error" });
  } finally {
    closeSubmitFormModal();
  }
}

function hexToHSL(
  hex: string,
  returnKind: "string" | "object",
): string | { h: number; s: number; l: number } {
  // Remove the '#' if present
  let hex_ = hex.replace(/^#/, "");

  // Parse the hex color into RGB components
  let r = parseInt(hex_.substring(0, 2), 16) / 255;
  let g = parseInt(hex_.substring(2, 4), 16) / 255;
  let b = parseInt(hex_.substring(4, 6), 16) / 255;

  // Find min and max values to calculate lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // Achromatic (no saturation)
  } else {
    const d = max - min;

    // Saturation calculation
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    // Hue calculation
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // Convert to percentage
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return returnKind === "string" ? `hsl(${h}, ${s}%, ${l}%)` : { h, s, l };
}

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): T {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  } as T;
}

// function throttle<T extends (...args: any[]) => void>(
//   func: T,
//   limit: number,
// ): T {
//   let lastCall = 0;

//   return function (this: any, ...args: any[]) {
//     const now = Date.now();

//     if (now - lastCall >= limit) {
//       lastCall = now;
//       func.apply(this, args);
//     }
//   } as T;
// }

function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let lastRan: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    lastArgs = args;
    lastThis = this;

    if (remaining <= 0) {
      lastCall = now;
      func.apply(this, args);
      lastRan = now;
    } else if (!lastRan) {
      setTimeout(() => {
        if (now - lastCall >= limit) {
          lastCall = Date.now();
          func.apply(lastThis, lastArgs!);
          lastRan = Date.now();
        }
      }, remaining);
      lastRan = now;
    }
  };
}

export {
  addCommaSeparator,
  addTokenDetailsToBody,
  capitalizeAll,
  capitalizeJoinWithAnd,
  captureScreenshot,
  createForageKey,
  debounce,
  decodeJWTSafe,
  fetchRequestPOSTSafe,
  fetchSafe,
  formatDate,
  getItemForageSafe,
  hexToHSL,
  removeUndefinedAndNull,
  replaceLastCommaWithAnd,
  replaceLastCommaWithOr,
  responseToJSONSafe,
  returnSliderMarks,
  returnThemeColors,
  returnTimeToRead,
  setItemForageSafe,
  splitCamelCase,
  splitWordIntoUpperCasedSentence,
  throttle,
  toFixedFloat,
  urlBuilder,
};
