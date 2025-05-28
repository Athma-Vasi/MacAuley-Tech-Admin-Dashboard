import html2canvas from "html2canvas";
import jwtDecode from "jwt-decode";
import { Err, None, Ok, Option, Some } from "ts-results";
import { v4 as uuidv4 } from "uuid";
import { ColorsSwatches, PROPERTY_DESCRIPTOR } from "./constants";

import { compress, ICompressConfig } from "image-conversion";
import localforage from "localforage";
import { z } from "zod";
import { DAYS_PER_MONTH, MONTHS } from "./components/dashboard/constants";
import { ProductMetricCategory } from "./components/dashboard/product/types";
import { RepairMetricCategory } from "./components/dashboard/repair/types";
import {
  AllStoreLocations,
  DaysInMonthsInYears,
  Month,
  Year,
} from "./components/dashboard/types";
import { DepartmentsWithDefaultKey } from "./components/directory/types";
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

function createSafeErrorResult(error: unknown, trace?: {
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
}): Err<SafeError> {
  const additional = {
    fileName: trace?.fileName ? Some(trace.fileName) : None,
    lineNumber: trace?.lineNumber ? Some(trace.lineNumber) : None,
    columnNumber: trace?.columnNumber ? Some(trace.columnNumber) : None,
  };

  if (error instanceof Error) {
    return new Err({
      name: error.name == null ? "Error" : error.name,
      message: error.message == null ? "Unknown error" : error.message,
      stack: error.stack == null ? None : Some(error.stack),
      original: None,
      ...additional,
    });
  }

  if (typeof error === "string") {
    return new Err({
      name: "Error",
      message: error,
      stack: None,
      original: None,
      ...additional,
    });
  }

  function serializeSafe(data: unknown): Option<string> {
    try {
      const serializedData = JSON.stringify(data, null, 2);
      return Some(serializedData);
    } catch (error: unknown) {
      return Some("Unserializable data");
    }
  }

  if (error instanceof Event) {
    if (error instanceof PromiseRejectionEvent) {
      return new Err({
        name: `PromiseRejectionEvent: ${error.type}`,
        message: error.reason.toString() ?? "",
        stack: None,
        original: serializeSafe(error),
        ...additional,
      });
    }

    return new Err({
      name: `EventError: ${error.type}`,
      message: error.timeStamp.toString() ?? "",
      stack: None,
      original: serializeSafe(error),
      ...additional,
    });
  }

  return new Err({
    name: "👾 SimulationDysfunction",
    message: "🪞 You've seen it before. Déjà vu. Something's off...",
    stack: None,
    original: serializeSafe(error),
    ...additional,
  });
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

async function fetchResponseSafe(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<
  SafeResult<Response>
> {
  try {
    const response: Response = await fetch(input, init);
    return createSafeSuccessResult(response);
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

async function extractJSONFromResponseSafe<Data = unknown>(
  response: Response,
): Promise<SafeResult<Data>> {
  try {
    const data: Data = await response.json();
    return createSafeSuccessResult(data);
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
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
    const data: Data = await localforage.getItem(key);
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

    return success
      ? createSafeSuccessResult(data)
      : createSafeErrorResult(error);
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
      return createSafeErrorResult(error);
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

function createDirectoryURLCacheKey(
  { department, directoryUrl, storeLocation }: {
    department: DepartmentsWithDefaultKey;
    directoryUrl: string;
    storeLocation: AllStoreLocations;
  },
) {
  const urlWithQuery = department === "All Departments"
    ? new URL(
      `${directoryUrl}/user/?&limit=1000&newQueryFlag=true&totalDocuments=0`,
    )
    : new URL(
      `${directoryUrl}/user/?&$and[storeLocation][$eq]=${storeLocation}&$and[department][$eq]=${department}&limit=1000&newQueryFlag=true&totalDocuments=0`,
    );

  return urlWithQuery.toString();
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
            const daysWithLeapYear = monthIdx === 1 && isLeapYear
              ? currentDay + 1
              : currentDay;

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
        if (result.status === "fulfilled") {
          if (result.value.err) {
            acc[1].push(result.value);
          } else if (result.value.val.none) {
            acc[1].push(createSafeErrorResult("No data"));
          } else {
            acc[0].push(result.value);
          }
        } else {
          acc[1].push(
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

export {
  addCommaSeparator,
  capitalizeJoinWithAnd,
  captureScreenshot,
  catchHandlerErrorSafe,
  createDaysInMonthsInYearsSafe,
  createDirectoryURLCacheKey,
  createMetricsForageKey,
  createMetricsURLCacheKey,
  createSafeErrorResult,
  createSafeSuccessResult,
  createUsersURLCacheKey,
  decodeJWTSafe,
  extractJSONFromResponseSafe,
  fetchResponseSafe,
  formatDate,
  getCachedItemAsyncSafe,
  handlePromiseSettledResults,
  modifyImageSafe,
  parseResponsePayloadAsyncSafe,
  parseSyncSafe,
  removeCachedItemAsyncSafe,
  removeUndefinedAndNull,
  replaceLastCommaWithAnd,
  replaceLastCommaWithOr,
  returnSliderMarks,
  returnThemeColors,
  setCachedItemAsyncSafe,
  splitCamelCase,
  splitWordIntoUpperCasedSentence,
  toFixedFloat,
};
export type { ModifyImageSafe };
