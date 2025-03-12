import { Group, Stack, Text } from "@mantine/core";

import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
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
    globalState: { customizeChartsPageData, themeObject },
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
      />
    )
    : chartKind === "line"
    ? (
      <ResponsiveLineChart
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
