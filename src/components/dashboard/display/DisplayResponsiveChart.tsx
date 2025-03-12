import { Group, Stack, Text } from "@mantine/core";

import { COLORS_SWATCHES } from "../../../constants/data";
import { useGlobalState } from "../../../hooks";
import { addCommaSeparator, returnThemeColors } from "../../../utils";
import {
  ResponsiveBarChart,
  ResponsiveCalendarChart,
  ResponsiveLineChart,
  ResponsivePieChart,
} from "../../charts";
import {
  MONTHS,
  PERCENTAGE_METRICS_SET,
  UNITLESS_METRICS_SET,
  YEARS_SET,
} from "../constants";

function DisplayResponsiveChart() {
  const {
    globalState: { customizeChartsPageData, width, themeObject },
  } = useGlobalState();

  const {
    appThemeColors: { borderColor },
  } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  if (!customizeChartsPageData) {
    return null;
  }

  const componentWidth = width < 480 // for iPhone 5/SE
    ? width * 0.93
    : width < 768 // for iPhones 6 - 15
    ? width - 40
    // at 768vw the navbar appears at width of 225px
    : width < 1024
    ? (width - 225) * 0.8
    // at >= 1200vw the navbar width is 300px
    : width < 1200
    ? (width - 225) * 0.8
    : 900 - 40;
  const chartHeight = width < 1024
    ? componentWidth * 0.618
    : componentWidth * 0.382;
  const chartWidth = componentWidth;

  const { chartData, chartKind, chartTitle, selectedYYYYMMDD, chartUnitKind } =
    customizeChartsPageData;

  const barChartIndexBy = chartKind === "bar"
    ? Object.keys(chartData[0]).filter(
      (key) => key === "Days" || key === "Months" || key === "Years",
    )[0]
    : "";

  const barChartKeys = Object.keys(chartData[0]).filter(
    (key) => key !== "Days" && key !== "Months" && key !== "Years",
  );

  let [year, month, day] = selectedYYYYMMDD?.split("-") ?? ["2021", "01", "01"];
  month = month.padStart(2, "0");
  day = day.padStart(2, "0");

  const xValueLine = chartKind === "line" ? chartData[0].data[0].x : "";
  const xFormatLineChart = MONTHS.includes(xValueLine as any)
    ? () => ""
    : YEARS_SET.has(xValueLine)
    ? (x: string) => `Year - ${x}`
    : (x: string) => `Day - ${x}`;

  const lineChartKey = chartKind === "line" ? chartData[0].id : "";
  const yFormatLineChart = PERCENTAGE_METRICS_SET.has(lineChartKey)
    ? (y: number) => `${y}%`
    : UNITLESS_METRICS_SET.has(lineChartKey)
    ? (y: number) => `${addCommaSeparator(y)}`
    : (y: number) => `$${addCommaSeparator(y)}`;

  const displayResponsiveChart = chartKind === "bar"
    ? (
      <ResponsiveBarChart
        barChartData={chartData}
        dashboardChartTitle={chartTitle}
        indexBy={barChartIndexBy}
        keys={barChartKeys}
        chartHeight={chartHeight}
        chartWidth={chartWidth}
        unitKind={chartUnitKind}
      />
    )
    : chartKind === "calendar"
    ? (
      <ResponsiveCalendarChart
        calendarChartData={chartData}
        dashboardChartTitle={chartTitle}
        from={`${year}-${month}-01`}
        to={`${year}-${month}-${day}`}
        chartHeight={chartHeight}
        chartWidth={chartWidth}
      />
    )
    : chartKind === "line"
    ? (
      <ResponsiveLineChart
        chartHeight={chartHeight}
        chartWidth={chartWidth}
        dashboardChartTitle={chartTitle}
        lineChartData={chartData}
        xFormat={xFormatLineChart}
        yFormat={yFormatLineChart}
        unitKind={chartUnitKind}
      />
    )
    : chartKind === "pie"
    ? (
      <ResponsivePieChart
        chartHeight={chartHeight}
        chartWidth={chartWidth}
        dashboardChartTitle={chartTitle}
        pieChartData={chartData}
        unitKind={chartUnitKind}
      />
    )
    : null;

  return (
    <Stack w="100%">
      <Text size="lg" weight={500}>
        {chartTitle}
      </Text>
      <Group w="100%" style={{ borderTop: borderColor }}>
        {displayResponsiveChart}
      </Group>
    </Stack>
  );
}

export default DisplayResponsiveChart;
