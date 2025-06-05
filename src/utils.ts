import html2canvas from "html2canvas";
import jwtDecode from "jwt-decode";
import { Err, None, Ok, Option, Some } from "ts-results";
import { v4 as uuidv4 } from "uuid";
import {
  ColorsSwatches,
  PROPERTY_DESCRIPTOR,
  ROUTES_ZOD_SCHEMAS_MAP,
  RoutesZodSchemasMapKey,
} from "./constants";

import { compress, ICompressConfig } from "image-conversion";
import localforage from "localforage";
import React from "react";
import { flushSync } from "react-dom";
import {
  interquartileRange,
  mean,
  median,
  mode,
  standardDeviation,
} from "simple-statistics";
import { z } from "zod";
import { BarChartData } from "./components/charts/responsiveBarChart/types";
import { DAYS_PER_MONTH, MONTHS } from "./components/dashboard/constants";
import { ProductMetricCategory } from "./components/dashboard/product/types";
import { RepairMetricCategory } from "./components/dashboard/repair/types";
import {
  AllStoreLocations,
  DaysInMonthsInYears,
  Month,
  Year,
} from "./components/dashboard/types";
import {
  AbortError,
  AppError,
  CacheError,
  HTTPError,
  InvariantError,
  JSONError,
  NetworkError,
  ParseError,
  PromiseRejectedError,
  TimeoutError,
  TokenDecodeError,
  UnknownError,
} from "./components/error";
import { SidebarNavlinks } from "./components/sidebar/types";
import {
  DecodedToken,
  ResponsePayloadSafe,
  SafeError,
  SafeResult,
  StoreLocation,
  ThemeObject,
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
  const result = parseSyncSafe({
    object: numStr,
    zSchema: z.union([z.string(), z.number()]),
  });
  if (result.err || result.val.none) {
    return numStr.toString();
  }

  return result.val.val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toFixedFloat(num: number, precision = 4): number {
  const result = parseSyncSafe({
    object: num,
    zSchema: z.number(),
  });
  if (result.err || result.val.none) {
    return 0;
  }
  return result.val.val === undefined
    ? 0
    : Number(result.val.val.toFixed(precision));
}

function removeUndefinedAndNull<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

function capitalizeJoinWithAnd(strings: string[]): string {
  const result = parseSyncSafe({
    object: strings,
    zSchema: z.array(z.string()),
  });
  if (result.err || result.val.none) {
    return "";
  }
  const strings_ = result.val.val.filter(removeUndefinedAndNull);
  if (strings_.length === 0) {
    return "";
  }

  const joined = strings_
    // .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
    .map((string) => splitCamelCase(string))
    .join(", ");
  return replaceLastCommaWithAnd(joined);
}

function splitCamelCase(word: string): string {
  const result = parseSyncSafe({
    object: word,
    zSchema: z.string(),
  });
  if (result.err || result.val.none) {
    return "";
  }
  // Replace lowercase-uppercase pairs with a space in between
  const splitStr = result.val.val.replace(/([a-z])([A-Z])/g, "$1 $2");
  // Capitalize the first letter of the resulting string
  return splitStr.charAt(0).toUpperCase() + splitStr.slice(1);
}

function replaceLastCommaWithAnd(str: string): string {
  const result = parseSyncSafe({
    object: str,
    zSchema: z.string(),
  });
  if (result.err || result.val.none) {
    return "";
  }
  // returns an array of matches of all occurrences of a comma
  const commaCount = result.val.val.match(/,/g)?.length ?? 0;
  // /(?=[^,]*$)/: matches a comma that is followed by zero or more non-comma characters until the end of the string, using a positive lookahead assertion (?=...).
  const strWithAnd = result.val.val.replace(
    /,(?=[^,]*$)/,
    commaCount > 0 ? " and" : "",
  );
  return strWithAnd;
}

function replaceLastCommaWithOr(str: string): string {
  const result = parseSyncSafe({
    object: str,
    zSchema: z.string(),
  });
  if (result.err || result.val.none) {
    return "";
  }
  // returns an array of matches of all occurrences of a comma
  const commaCount = result.val.val.match(/,/g)?.length ?? 0;
  // /(?=[^,]*$)/: matches a comma that is followed by zero or more non-comma characters until the end of the string, using a positive lookahead assertion (?=...).
  const strWithOr = result.val.val.replace(
    /,(?=[^,]*$)/,
    commaCount > 0 ? " or" : "",
  );
  return strWithOr;
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
  const result = parseSyncSafe({
    object: date,
    zSchema: z.string(),
  });
  if (result.err || result.val.none) {
    return "";
  }
  return new Intl.DateTimeFormat(locale, formatOptions).format(
    new Date(result.val.val),
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
  const grayBorderShade = colorScheme === "light" ? gray[5] : gray[8];
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

function createSafeSuccessResult<Data = unknown>(
  data: Data,
): Ok<Option<NonNullable<Data>>> {
  return new Ok(data == null ? None : Some(data));
}

function createSafeErrorResult(
  error: AppError | unknown,
  trace?: {
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
  },
): Err<SafeError> {
  const additional = {
    fileName: trace?.fileName ? Some(trace.fileName) : None,
    lineNumber: trace?.lineNumber ? Some(trace.lineNumber) : None,
    columnNumber: trace?.columnNumber ? Some(trace.columnNumber) : None,
    timestamp: Date.now(),
  };

  if (error instanceof Error) {
    return new Err({
      message: error.message == null ? "Unknown error" : error.message,
      name: error.name == null ? "Error" : error.name,
      original: None,
      stack: error.stack == null ? None : Some(error.stack),
      status: None,
      ...additional,
    });
  }

  if (typeof error === "string") {
    return new Err({
      message: error,
      name: "Error",
      original: None,
      stack: None,
      status: None,
      ...additional,
    });
  }

  function serializeSafe(data: unknown): Option<string> {
    try {
      const serializedData = JSON.stringify(data, null, 2);
      return Some(serializedData);
    } catch (_error: unknown) {
      return Some("Unserializable data");
    }
  }

  if (error instanceof Event) {
    if (error instanceof PromiseRejectionEvent) {
      return new Err({
        message: error.reason.toString() ?? "",
        name: `PromiseRejectionEvent: ${error.type}`,
        original: serializeSafe(error),
        stack: None,
        status: None,
        ...additional,
      });
    }

    return new Err({
      message: error.timeStamp.toString() ?? "",
      name: `EventError: ${error.type}`,
      original: serializeSafe(error),
      stack: None,
      status: None,
      ...additional,
    });
  }

  if (error instanceof HTTPError) {
    return new Err({
      message: error.message,
      name: error._tag,
      original: serializeSafe(error.data),
      stack: error.stack ?? None,
      status: error.status ? Some(error.status) : None,
      ...additional,
    });
  } else if (
    error instanceof AbortError ||
    error instanceof CacheError ||
    error instanceof InvariantError ||
    error instanceof JSONError ||
    error instanceof NetworkError ||
    error instanceof ParseError ||
    error instanceof TimeoutError ||
    error instanceof TokenDecodeError ||
    error instanceof PromiseRejectedError ||
    error instanceof UnknownError
  ) {
    return new Err({
      message: error.message,
      name: error._tag,
      original: serializeSafe(error.data),
      stack: error.stack ?? None,
      status: None,
      ...additional,
    });
  }

  return new Err({
    message: "🪞 You've seen it before. Déjà vu. Something's off...",
    name: "👾 SimulationDysfunction",
    original: serializeSafe(error),
    stack: None,
    status: None,
    ...additional,
  });
}

function handleErrorResultAndNoneOptionInWorker<Data = unknown>(
  result: SafeResult<Data>,
  errorMessageIfNone: string,
): Option<Data> {
  if (result.err) {
    self.postMessage(result);
    return None;
  }
  if (result.val.none) {
    self.postMessage(createSafeErrorResult(
      new InvariantError(errorMessageIfNone),
    ));
    return None;
  }
  return result.val;
}

function catchHandlerErrorSafe(
  error: unknown,
  isComponentMountedRef: React.RefObject<boolean> = { current: true },
  showBoundary: (error: unknown) => void = () => {},
) {
  if (!isComponentMountedRef.current) {
    return createSafeErrorResult("Component unmounted");
  }

  const safeErrorResult = createSafeErrorResult(error);
  showBoundary(safeErrorResult);
  return safeErrorResult;
}

type RetryOptions = {
  backOffFactor?: number;
  retries?: number;
  delayMs?: number;
};
async function retryFetchSafe<Data = unknown>(
  { init, input, routesZodSchemaMapKey, retryOptions, signal }: {
    init: RequestInit;
    input: RequestInfo | URL;
    retryOptions?: RetryOptions;
    routesZodSchemaMapKey: RoutesZodSchemasMapKey;
    signal: AbortSignal | undefined;
  },
): Promise<SafeResult<ResponsePayloadSafe<Data>>> {
  const {
    backOffFactor = 2,
    retries = 3,
    delayMs = 1000,
  } = retryOptions ?? {};

  const retryStatusCodes = new Set([
    408, // Request Timeout
    429, // Too Many Requests
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ]);

  async function tryAgain(
    attempt: number,
  ): Promise<SafeResult<ResponsePayloadSafe<Data>>> {
    try {
      const response: Response = await fetch(input, {
        ...init,
        signal,
      });
      if (response == null) {
        // perhaps a network-level failure occurred before any HTTP response could be received
        // trigger a retry
        throw new InvariantError("Response is null or undefined");
      }

      try {
        const data = await response.json();
        if (data == null) {
          // trigger a retry
          throw new JSONError("Response data is null or undefined");
        }

        const responsePayloadSafeResult = await parseResponsePayloadAsyncSafe<
          Data
        >({
          object: data,
          zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        // don't throw
        if (responsePayloadSafeResult.err) {
          return Promise.resolve(responsePayloadSafeResult);
        }
        if (responsePayloadSafeResult.val.none) {
          return Promise.resolve(
            createSafeErrorResult(
              new InvariantError(
                "Response payload is None, expected a valid response",
              ),
            ),
          );
        }

        const statusCode = responsePayloadSafeResult.val.val.status.none
          ? 0
          : responsePayloadSafeResult.val.val.status.val;
        if (retryStatusCodes.has(statusCode)) {
          throw new HTTPError(
            statusCode,
            `Retryable HTTP error: ${statusCode}`,
          );
        }

        return Promise.resolve(
          createSafeSuccessResult<ResponsePayloadSafe<Data>>(
            responsePayloadSafeResult.val.val,
          ),
        );
      } catch (error_: unknown) {
        if (attempt === retries) {
          return Promise.resolve(
            createSafeErrorResult(error_),
          );
        }

        throw new JSONError(error_);
      }
    } catch (error: unknown) {
      if (attempt === retries) {
        return Promise.resolve(
          createSafeErrorResult(error),
        );
      }

      // Exponential backoff with jitter
      const backOff = Math.pow(backOffFactor, attempt) * delayMs;
      const jitter = backOff * 0.2 * (Math.random() - 0.5);
      const delay = backOff + jitter;

      console.log(
        `Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`,
      );

      return new Promise((resolve) => {
        setTimeout(() => {
          tryAgain(attempt + 1).then(resolve);
        }, delay);
      });
    }
  }

  return tryAgain(0);
}

function decodeJWTSafe<Decoded extends Record<string, unknown> = DecodedToken>(
  token: string,
): SafeResult<Decoded> {
  try {
    const decoded: Decoded = jwtDecode(token);
    return createSafeSuccessResult(decoded);
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

async function getCachedItemAsyncSafe<Data = unknown>(
  key: string,
): Promise<SafeResult<Data>> {
  try {
    const data = await localforage.getItem<Data>(key);
    return createSafeSuccessResult(data);
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

async function setCachedItemAsyncSafe<Data = unknown>(
  key: string,
  value: Data,
): Promise<SafeResult> {
  try {
    await localforage.setItem(key, value);
    return new Ok(None);
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

async function removeCachedItemAsyncSafe(
  key: string,
): Promise<SafeResult> {
  try {
    await localforage.removeItem(key);
    return new Ok(None);
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

function parseSyncSafe<Output = unknown>(
  { object, zSchema }: {
    object: Output;
    zSchema: z.ZodSchema;
  },
): SafeResult<Output> {
  try {
    const { data, error, success } = Array.isArray(object)
      ? z.array(zSchema).safeParse(object)
      : zSchema.safeParse(object);

    return success ? createSafeSuccessResult(data) : createSafeErrorResult(
      new ParseError(
        `Failed to parse object: ${error.message}`,
      ),
    );
  } catch (error_: unknown) {
    return createSafeErrorResult(error_);
  }
}

type ModifyImageSafe = (
  file: Blob,
  config?: ICompressConfig | number,
) => Promise<SafeResult<Blob>>;

async function modifyImageSafe(
  file: Blob,
  config?: ICompressConfig | number,
): Promise<SafeResult<Blob>> {
  try {
    const compressedBlob = await compress(file, config);
    return createSafeSuccessResult(compressedBlob);
  } catch (error) {
    return createSafeErrorResult(error);
  }
}

async function parseResponsePayloadAsyncSafe<Data = unknown, Output = unknown>(
  { object, zSchema }: {
    object: Output;
    zSchema: z.ZodSchema;
  },
): Promise<SafeResult<ResponsePayloadSafe<Data>>> {
  try {
    const responsePayloadSchema = <T extends z.ZodSchema>(dataSchema: T) =>
      z.object({
        accessToken: z.string().optional(),
        data: z.array(dataSchema),
        kind: z.enum(["error", "success", "rejected"]),
        message: z.string().optional(),
        pages: z.number().optional(),
        status: z.number().optional(),
        totalDocuments: z.number().optional(),
        triggerLogout: z.boolean().optional(),
      });

    const { success, data, error } = await responsePayloadSchema(zSchema)
      .safeParseAsync(
        object,
      );

    if (!success) {
      return createSafeErrorResult(
        new ParseError(error),
      );
    }

    const safeData = Object.entries(data).reduce<ResponsePayloadSafe<Data>>(
      (acc, [key, value]) => {
        // always present entries
        if (key === "data" || key === "kind") {
          Object.defineProperty(acc, key, {
            value,
            ...PROPERTY_DESCRIPTOR,
          });
          return acc;
        }

        // optional entries
        Object.defineProperty(acc, key, {
          value: value == null ? None : Some(value),
          ...PROPERTY_DESCRIPTOR,
        });

        return acc;
      },
      Object.create(null),
    );

    return createSafeSuccessResult(safeData);
  } catch (error_: unknown) {
    return createSafeErrorResult(error_);
  }
}

function createUsersURLCacheKey(
  { currentPage, newQueryFlag, queryString, totalDocuments, url }: {
    url: string;
    queryString: string;
    totalDocuments: number;
    newQueryFlag: boolean;
    currentPage: number;
  },
) {
  const urlWithQuery = new URL(
    `${url}/user/${queryString}&totalDocuments=${totalDocuments}&newQueryFlag=${newQueryFlag}&page=${currentPage}`,
  );

  return urlWithQuery.toString();
}

function createMetricsURLCacheKey(
  {
    metricsUrl,
    metricsView,
    productMetricCategory,
    repairMetricCategory,
    storeLocation,
  }: {
    metricsUrl: string;
    metricsView: SidebarNavlinks;
    productMetricCategory: ProductMetricCategory;
    repairMetricCategory: RepairMetricCategory;
    storeLocation: AllStoreLocations;
  },
) {
  const storeLocationQuery =
    metricsView === "directory" || metricsView === "users" ||
      metricsView === "logout"
      ? ""
      : `&storeLocation[$eq]=${storeLocation}`;
  const metricCategoryQuery = metricsView === "products"
    ? `&metricCategory[$eq]=${productMetricCategory}`
    : metricsView === "repairs"
    ? `&metricCategory[$eq]=${repairMetricCategory}`
    : "";
  const urlWithQuery = new URL(
    `${metricsUrl}/${metricsView}/?${storeLocationQuery}${metricCategoryQuery}`,
  );

  return urlWithQuery.toString();
}

function createMetricsForageKey(
  {
    metricsView,
    productMetricCategory,
    repairMetricCategory,
    storeLocation,
  }: {
    metricsView: string;
    storeLocation: AllStoreLocations;
    productMetricCategory: ProductMetricCategory;
    repairMetricCategory: RepairMetricCategory;
  },
) {
  return `${metricsView}/${storeLocation}${
    metricsView === "repairs" ? "/" + repairMetricCategory : metricsView ===
        "products"
      ? "/" + productMetricCategory
      : ""
  }`;
}

/**
 * Generate a map of days in months for a range of years.
 */
function createDaysInMonthsInYearsSafe({
  monthEnd = 11,
  monthStart = 0,
  storeLocation,
  yearEnd = new Date().getFullYear(),
  yearStart = storeLocation === "Calgary"
    ? 2017
    : storeLocation === "Vancouver"
    ? 2019
    : 2013,
}: {
  monthEnd?: number;
  monthStart?: number;
  storeLocation: StoreLocation | "All Locations";
  yearEnd?: number;
  yearStart?: number;
}): SafeResult<DaysInMonthsInYears> {
  try {
    const yearsRange = Array.from(
      { length: yearEnd - yearStart + 1 },
      (_, idx) => idx + yearStart,
    );

    const daysInMonthsInYears = yearsRange.reduce<
      Map<Year, Map<Month, string[]>>
    >(
      (yearsAcc, year) => {
        const isCurrentYear = year === new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const slicedMonths = isCurrentYear
          ? MONTHS.slice(0, currentMonth + 1)
          : MONTHS.slice(monthStart, monthEnd + 1);

        const daysInMonthsMap = slicedMonths.reduce<Map<Month, string[]>>(
          (monthsAcc, month, monthIdx) => {
            const days = DAYS_PER_MONTH[monthIdx];
            const isCurrentMonth = isCurrentYear && monthIdx === currentMonth;
            const currentDay = isCurrentYear
              ? isCurrentMonth ? new Date().getDate() : days
              : days;

            const isLeapYear = (year % 4 === 0 && year % 100 !== 0) ||
              year % 400 === 0;
            const safeCurrentDay = typeof currentDay === "number"
              ? currentDay
              : 0;
            const daysWithLeapYear = monthIdx === 1 && isLeapYear
              ? safeCurrentDay + 1
              : safeCurrentDay;

            const daysRange = Array.from(
              { length: daysWithLeapYear },
              (_, idx) => idx + 1,
            ).map((day) => day.toString().padStart(2, "0"));

            monthsAcc.set(month, daysRange);

            return monthsAcc;
          },
          new Map(),
        );

        yearsAcc.set(year.toString() as Year, daysInMonthsMap);

        return yearsAcc;
      },
      new Map(),
    );

    return createSafeSuccessResult(daysInMonthsInYears);
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

function handlePromiseSettledResults(
  results: PromiseSettledResult<
    Err<SafeError> | Ok<Option<NonNullable<unknown>>>
  >[],
): SafeResult<string> {
  try {
    const [successes, errors] = results.reduce<
      [Ok<Option<NonNullable<unknown>>>[], Err<SafeError>[]]
    >(
      (acc, result) => {
        const [successes, errors] = acc;

        if (result.status === "fulfilled") {
          if (result.value.err) {
            errors.push(result.value);
          } else if (result.value.val.none) {
            errors.push(createSafeErrorResult("No data"));
          } else {
            successes.push(result.value);
          }
        } else {
          errors.push(
            createSafeErrorResult(
              result.reason ?? "Unknown error",
            ),
          );
        }
        return acc;
      },
      [[], []],
    );

    if (errors.length > 0) {
      return createSafeErrorResult(
        `Some promises were rejected: ${
          errors.map((error) => error.val.message ?? "unknown").join("\n")
        }`,
      );
    }

    if (successes.length === 0) {
      return createSafeErrorResult("No successful results");
    }

    return createSafeSuccessResult(
      "All promises were fulfilled with successful results",
    );
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

type StatisticsObject = {
  min: {
    value: number;
    occurred: string;
  };
  max: {
    value: number;
    occurred: string;
  };
  mean: number;
  mode: number;
  median: number;
  standardDeviation: number;
  interquartileRange: number;
};
/**
 * - Return statistics for each key in the barChartsObj of the dailyChartsObj returned by the `return${metric}ChartData` functions
 * - barChartsObj is used as it is generated (along with lineChartsObj) for all metrics and sub-metrics, and has a reasonably simple structure (when compared to lineChartsObj)
 */
function returnStatisticsSafe<
  BarObjKeys extends string = string,
  BarChartObj extends Record<string, string | number> = Record<
    string,
    string | number
  >,
>(
  barChartsObj: Record<BarObjKeys, BarChartData<BarChartObj>[]>,
): SafeResult<Map<BarObjKeys, StatisticsObject>> {
  try {
    const statisticsMap = Object.entries(barChartsObj).reduce(
      (statisticsAcc, [_barObjKey, barObjsArr]) => {
        if (Array.isArray(barObjsArr)) {
          // returns an map without the 'Days', 'Months', and 'Years' keyVals
          const filteredBarObjsArr = barObjsArr.reduce(
            (filteredBarObjAcc, barObj: BarChartObj) => {
              Object.entries(barObj).forEach(([key, value]) => {
                if (key === "Days" || key === "Months" || key === "Years") {
                  return;
                }

                if (filteredBarObjAcc.has(key)) {
                  filteredBarObjAcc.get(key).push(value);
                } else {
                  filteredBarObjAcc.set(key, [value]);
                }
              });

              return filteredBarObjAcc;
            },
            new Map<
              Omit<[keyof BarChartObj], "Days" | "Months" | "Years">,
              number[]
            >(),
          );

          Array.from(filteredBarObjsArr).forEach((filteredBarObj) => {
            const [key, value] = filteredBarObj as [BarObjKeys, number[]];

            const min = Math.min(...value);
            const max_ = Math.max(...value);

            // find the first barObj that has the min value
            const minOccurenceBarObj = barObjsArr.find((barObj) =>
              Object.entries(barObj).find(([_, val]) => val === min)
            );
            // return the keyVal that has the min value
            const [minOccurenceKey, minOccurenceVal] = Object.entries(
              minOccurenceBarObj,
            ).filter(([_, val]) => val !== min)[0];
            // format the date (key will be either 'Days', 'Months', or 'Years')
            const minOccurenceDate = `${
              minOccurenceKey.slice(
                0,
                minOccurenceKey.length - 1,
              )
            } - ${minOccurenceVal}`;

            const maxOccurenceBarObj = barObjsArr.find((barObj) =>
              Object.entries(barObj).find(([_, val]) => val === max_)
            );
            const [maxOccurenceKey, maxOccurenceVal] = Object.entries(
              maxOccurenceBarObj,
            ).filter(([_, val]) => val !== max_)[0];
            const maxOccurenceDate = `${
              maxOccurenceKey.slice(
                0,
                maxOccurenceKey.length - 1,
              )
            } - ${maxOccurenceVal}`;

            const mean_ = mean(value);
            const mode_ = mode(value);
            const median_ = median(value);
            const standardDeviation_ = standardDeviation(value);
            const interquartileRange_ = interquartileRange(value);

            const statisticsObj: StatisticsObject = {
              min: {
                value: min,
                occurred: minOccurenceDate ?? "",
              },
              max: {
                value: max_,
                occurred: maxOccurenceDate ?? "",
              },
              mean: mean_,
              mode: mode_,
              median: median_,
              standardDeviation: standardDeviation_,
              interquartileRange: interquartileRange_,
            };

            statisticsAcc.set(key, statisticsObj);
          });
        }

        return statisticsAcc;
      },
      new Map<BarObjKeys, StatisticsObject>(),
    );

    return createSafeSuccessResult(statisticsMap);
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

function makeTransition(transition: () => void): SafeResult<boolean> {
  try {
    // check if browser supports transitions
    if (
      typeof document !== "undefined" && "transition" in document.body.style
    ) {
      document.startViewTransition(() => {
        flushSync(() => {
          transition();
        });
      });
    } else {
      // if not, just call the transition function
      transition();
    }

    return createSafeSuccessResult(true);
  } catch (error) {
    return createSafeErrorResult(error);
  }
}

export {
  addCommaSeparator,
  capitalizeJoinWithAnd,
  captureScreenshot,
  catchHandlerErrorSafe,
  createDaysInMonthsInYearsSafe,
  createMetricsForageKey,
  createMetricsURLCacheKey,
  createSafeErrorResult,
  createSafeSuccessResult,
  createUsersURLCacheKey,
  decodeJWTSafe,
  formatDate,
  getCachedItemAsyncSafe,
  handleErrorResultAndNoneOptionInWorker,
  handlePromiseSettledResults,
  makeTransition,
  modifyImageSafe,
  parseResponsePayloadAsyncSafe,
  parseSyncSafe,
  removeCachedItemAsyncSafe,
  removeUndefinedAndNull,
  replaceLastCommaWithAnd,
  replaceLastCommaWithOr,
  retryFetchSafe,
  returnSliderMarks,
  returnStatisticsSafe,
  returnThemeColors,
  setCachedItemAsyncSafe,
  splitCamelCase,
  splitWordIntoUpperCasedSentence,
  toFixedFloat,
};
export type { ModifyImageSafe, StatisticsObject };
