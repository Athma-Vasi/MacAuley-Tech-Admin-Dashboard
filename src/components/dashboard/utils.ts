import type { StoreLocation } from "../../types";
import { addCommaSeparator, splitCamelCase, toFixedFloat } from "../../utils";
import { CalendarChartData } from "../charts/responsiveCalendarChart/types";
import { CustomerMetricsCategory } from "./customer/types";
import { FinancialMetricCategory } from "./financial/types";
import { ProductSubMetric } from "./product/types";
import { RepairSubMetric } from "./repair/types";
import type {
  AllStoreLocations,
  DashboardCalendarView,
  DashboardMetricsView,
  LocationYearSpread,
  Month,
  Year,
} from "./types";
import {
  CreateDashboardMetricsCardsInput,
  DashboardCardInfo,
} from "./utilsTSX";

/**
 * - returns a random number of units sold for a specific store location and year
 */
function createRandomNumber({
  storeLocation,
  year,
  yearUnitsSpread,
  defaultMin = 3,
  defaultMax = 5,
  isFraction = false,
}: {
  storeLocation: StoreLocation;
  year: string;
  yearUnitsSpread: LocationYearSpread;
  defaultMin?: number;
  defaultMax?: number;
  isFraction?: boolean;
}) {
  const store = yearUnitsSpread[storeLocation] ?? "Edmonton";
  const yearSpread =
    Object.entries(store).find(([yearKey]) => yearKey === year)?.[1] ?? [
      defaultMin,
      defaultMax,
    ];
  const [min, max] = yearSpread;

  return isFraction
    ? Math.random() * (max - min) + min
    : Math.round(Math.random() * (max - min) + min);
}

function splitSelectedCalendarDate({
  calendarDate,
  months,
}: {
  calendarDate: string;
  months: Month[];
}): {
  selectedDate: string;
  selectedMonth: Month;
  selectedYear: Year;
} {
  const [year, month, date] = calendarDate.split("-") as [Year, string, string];

  return {
    selectedDate: date.toString().padStart(2, "0"),
    selectedMonth: months[Number.parseInt(month) - 1],
    selectedYear: year,
  };
}

function returnIsTabDisabled(
  storeLocation: AllStoreLocations,
  selectedYear: Year,
) {
  const yearNumber = isNaN(Number(selectedYear)) ? 0 : Number(selectedYear);

  switch (storeLocation) {
    case "Calgary": {
      return yearNumber < 2017;
    }

    case "Vancouver": {
      return yearNumber < 2019;
    }

    default:
      return false;
  }
}

function createExpandChartNavigateLinks(
  {
    calendarView,
    metricCategory,
    metricsView,
    subMetric,
    yAxisKey,
  }: {
    calendarView: DashboardCalendarView;
    metricCategory?: string;
    metricsView: DashboardMetricsView;
    subMetric?: string;
    yAxisKey: string;
  },
) {
  const genericLink = `/dashboard/chart/${calendarView.toLowerCase()}${
    metricCategory
      ? `-${
        splitCamelCase(metricCategory).toLowerCase()
          .split(" ")
          .join("-")
      }`
      : ""
  }-${metricsView.toLowerCase()}${
    subMetric
      ? `-${splitCamelCase(subMetric).toLowerCase().split(" ").join("-")}`
      : ""
  }`;

  const yAxisKeySplit = splitCamelCase(
    yAxisKey,
  ).toLowerCase().split(" ").join("-");

  return {
    expandBarChartNavigateLink: `${genericLink}-${yAxisKeySplit}-bar`,
    expandCalendarChartNavigateLink: `${genericLink}-${yAxisKeySplit}-calendar`,
    expandLineChartNavigateLink: `${genericLink}-${yAxisKeySplit}-line`,
    expandPieChartNavigateLink: `${genericLink}${yAxisKeySplit}-pie`,
    expandRadialBarChartNavigateLink: `${genericLink}-${yAxisKeySplit}-radial`,
  };
}

function returnChartTitles(
  {
    calendarView,
    metricCategory,
    storeLocation,
    subMetric = "",
    yAxisKey,
  }: {
    calendarView: DashboardCalendarView;
    metricCategory: string;
    storeLocation: AllStoreLocations;
    subMetric?: string;
    yAxisKey: string;
  },
) {
  return {
    yAxisKeyChartHeading: `${calendarView} ${splitCamelCase(metricCategory)} ${
      splitCamelCase(subMetric)
    } ${splitCamelCase(yAxisKey ?? "")} for ${storeLocation}`,
  };
}

function returnSelectedCalendarCharts<
  MetricCategory extends
    | FinancialMetricCategory
    | CustomerMetricsCategory
    | ProductSubMetric
    | RepairSubMetric,
  MetricsCalendarCharts extends Record<MetricCategory, any> = Record<
    MetricCategory,
    any
  >,
  YAxisVariable extends string = string,
>(
  calendarChartsData: {
    currentYear: MetricsCalendarCharts | null;
    previousYear: MetricsCalendarCharts | null;
  },
  calendarChartYAxisVariable: YAxisVariable,
  metricCategory: MetricCategory,
): Array<CalendarChartData> {
  const defaultValue = [{
    day: "",
    value: 0,
  }];

  const { currentYear, previousYear } = calendarChartsData;
  if (
    currentYear === null || previousYear === null
  ) {
    return defaultValue;
  }

  const currentYearMetric = currentYear[metricCategory];
  const previousYearMetric = previousYear[metricCategory];

  const currentYearData =
    Object.entries(currentYearMetric).find(([key]) =>
      key === calendarChartYAxisVariable
    )?.[1] ?? defaultValue as CalendarChartData[];

  const previousYearData =
    Object.entries(previousYearMetric).find(([key]) =>
      key === calendarChartYAxisVariable
    )?.[1] ?? defaultValue as CalendarChartData[];

  return Array.isArray(currentYearData)
    ? currentYearData.concat(previousYearData)
    : defaultValue;
}

function createDashboardMetricsCards(
  {
    currentMonth,
    currentYear,
    grayBorderShade,
    greenColorShade,
    heading,
    isDisplayValueAsCurrency = false,
    isDisplayValueAsPercentage = false,
    isFlipColor = false,
    kind,
    prevDay,
    prevMonth,
    prevValue,
    prevYear,
    redColorShade,
    selectedValue,
  }: CreateDashboardMetricsCardsInput,
): DashboardCardInfo {
  const deltaPercentage = toFixedFloat(
    ((selectedValue - prevValue) / prevValue) * 100,
    2,
  );
  const deltaFormatted = Number.isFinite(deltaPercentage)
    ? `${deltaPercentage > 0 ? "+" : ""} ${toFixedFloat(deltaPercentage, 2)} %`
    : "N/A";

  const deltaTextColor = deltaPercentage > 0
    ? isFlipColor ? redColorShade : greenColorShade
    : deltaPercentage < 0
    ? isFlipColor ? greenColorShade : redColorShade
    : "inherit";

  const dateEndMonthSet = new Set(["31", "30", "29", "28"]);

  const date = kind === "day"
    ? `Since ${prevDay} ${
      // display the previous month if the previous day is the last day of the month
      dateEndMonthSet.has(prevDay) ? prevMonth : currentMonth} ${
      // display the previous year if the previous day is 31st December of the previous year
      currentMonth === "January" ? prevYear : currentYear}`
    : kind === "month"
    ? `Since ${prevMonth} ${
      currentMonth === "January" ? prevYear : currentYear
    }`
    : `Since ${prevYear}`;

  const valueStr = selectedValue < 1
    ? toFixedFloat(selectedValue * 100, 2)
    : toFixedFloat(selectedValue, 2);

  const displayValue = isDisplayValueAsPercentage
    ? `${valueStr} %`
    : `${
      selectedValue.toString().includes(".")
        ? valueStr
        : addCommaSeparator(selectedValue.toString())
    } ${isDisplayValueAsCurrency ? "CAD" : ""}`;

  return {
    date,
    grayBorderShade,
    heading,
    icon: null,
    percentage: deltaFormatted,
    value: displayValue,
    deltaTextColor,
  };
}

export {
  createDashboardMetricsCards,
  createExpandChartNavigateLinks,
  createRandomNumber,
  returnChartTitles,
  returnIsTabDisabled,
  returnSelectedCalendarCharts,
  splitSelectedCalendarDate,
};
