import { useGlobalState } from "../../../hooks/useGlobalState";
import { addCommaSeparator } from "../../../utils";
import {
  ResponsiveBarChart,
  ResponsiveCalendarChart,
  ResponsiveLineChart,
  ResponsivePieChart,
  ResponsiveRadialBarChart,
} from "../../charts";
import { createChartTooltipElement } from "../../charts/utils";

function DisplayResponsiveChart() {
  const {
    globalState: {
      expandBarChartData,
      expandCalendarChartData,
      expandLineChartData,
      expandPieChartData,
      expandRadialBarChartData,
      expandSunburstChartData,
      selectedChartKind,
      themeObject,
    },
  } = useGlobalState();

  console.group("DisplayResponsiveChart");
  console.log("expandBarChartData", expandBarChartData);
  console.log("expandCalendarChartData", expandCalendarChartData);
  console.log("expandLineChartData", expandLineChartData);
  console.log("expandPieChartData", expandPieChartData);
  console.log("expandRadialBarChartData", expandRadialBarChartData);
  console.log("expandSunburstChartData", expandSunburstChartData);
  console.log("themeObject", themeObject);
  console.groupEnd();

  // const barChartIndexBy = chartKind === "bar"
  //   ? Object.keys(chartData[0]).filter(
  //     (key) => key === "Days" || key === "Months" || key === "Years",
  //   )[0]
  //   : "";

  // const barChartKeys = Object.keys(chartData[0]).filter(
  //   (key) => key !== "Days" && key !== "Months" && key !== "Years",
  // );

  // let [year, month, day] = selectedYYYYMMDD?.split("-") ?? ["2021", "01", "01"];
  // month = month.padStart(2, "0");
  // day = day.padStart(2, "0");

  // const xValueLine = chartKind === "line" ? chartData[0].data[0].x : "";
  // const xFormatLineChart = MONTHS.includes(xValueLine as any)
  //   ? () => ""
  //   : YEARS_SET.has(xValueLine)
  //   ? (x: string) => `Year - ${x}`
  //   : (x: string) => `Day - ${x}`;

  // const lineChartKey = chartKind === "line" ? chartData[0].id : "";
  // const yFormatLineChart = PERCENTAGE_METRICS_SET.has(lineChartKey)
  //   ? (y: number) => `${y}%`
  //   : UNITLESS_METRICS_SET.has(lineChartKey)
  //   ? (y: number) => `${addCommaSeparator(y)}`
  //   : (y: number) => `$${addCommaSeparator(y)}`;

  if (selectedChartKind === "bar") {
    if (!expandBarChartData) {
      return null;
    }

    const {
      calendarView,
      chartData,
      chartTitle,
      chartUnitKind,
      day,
      indexBy,
      keys,
      month,
      year,
    } = expandBarChartData;

    return (
      <ResponsiveBarChart
        barChartData={chartData}
        chartUnitKind={chartUnitKind}
        indexBy={indexBy}
        keys={keys}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            kind: "bar",
            chartUnitKind,
            calendarView,
            day,
            month,
            year,
          })}
        dashboardChartTitle={chartTitle}
      />
    );
  }

  if (selectedChartKind === "calendar") {
    if (!expandCalendarChartData) {
      return null;
    }

    const {
      calendarChartYAxis,
      chartData,
      chartTitle,
      chartUnitKind,
      day,
      month,
      year,
    } = expandCalendarChartData;

    return (
      <ResponsiveCalendarChart
        calendarChartData={chartData}
        dashboardChartTitle={chartTitle}
        from={`${year}-01-01`}
        to={`${year}-12-31`}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            kind: "calendar",
            chartUnitKind,
            calendarChartYAxis,
            day,
            month,
            year,
          })}
      />
    );
  }

  if (selectedChartKind === "line") {
    if (!expandLineChartData) {
      return null;
    }

    const { calendarView, chartData, chartTitle, chartUnitKind } =
      expandLineChartData;

    return (
      <ResponsiveLineChart
        chartUnitKind={chartUnitKind}
        dashboardChartTitle={chartTitle}
        lineChartData={chartData}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            kind: "line",
            chartUnitKind,
          })}
        xFormat={(x) =>
          `${
            calendarView === "Daily"
              ? "Day - "
              : calendarView === "Yearly"
              ? "Year - "
              : ""
          }${x}`}
        yFormat={(y) => addCommaSeparator(y) + chartUnitKind}
      />
    );
  }

  if (selectedChartKind === "pie") {
    if (!expandPieChartData) {
      return null;
    }

    const { chartData, chartTitle, chartUnitKind } = expandPieChartData;

    return (
      <ResponsivePieChart
        chartUnitKind={chartUnitKind}
        dashboardChartTitle={chartTitle}
        pieChartData={chartData}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            kind: "pie",
            chartUnitKind,
          })}
      />
    );
  }

  if (selectedChartKind === "radial") {
    if (!expandRadialBarChartData) {
      return null;
    }

    const { chartData, chartTitle, chartUnitKind } = expandRadialBarChartData;

    return (
      <ResponsiveRadialBarChart
        radialBarChartData={chartData}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            kind: "radial",
            chartUnitKind,
          })}
      />
    );
  }

  // const displayResponsiveChart = selectedChartKind === "bar"
  //   ? (
  //     <ResponsiveBarChart
  //       barChartData={chartData}
  //       dashboardChartTitle={chartTitle}
  //       indexBy={barChartIndexBy}
  //       keys={barChartKeys}
  //       unitKind={chartUnitKind}
  //       tooltip={(arg) =>
  //         createChartTooltipElement({ arg, kind: "bar", unit: "" })}
  //     />
  //   )
  //   : chartKind === "calendar"
  //   ? (
  //     <ResponsiveCalendarChart
  //       calendarChartData={chartData}
  //       dashboardChartTitle={chartTitle}
  //       from={`${year}-${month}-01`}
  //       to={`${year}-${month}-${day}`}
  //       tooltip={(arg) =>
  //         createChartTooltipElement({ arg, kind: "calendar", unit: "" })}
  //     />
  //   )
  //   : chartKind === "line"
  //   ? (
  //     <ResponsiveLineChart
  //       dashboardChartTitle={chartTitle}
  //       lineChartData={chartData}
  //       xFormat={xFormatLineChart}
  //       yFormat={yFormatLineChart}
  //       unitKind={chartUnitKind}
  //       tooltip={(arg) =>
  //         createChartTooltipElement({ arg, kind: "line", unit: "" })}
  //     />
  //   )
  //   : chartKind === "pie"
  //   ? (
  //     <ResponsivePieChart
  //       dashboardChartTitle={chartTitle}
  //       pieChartData={chartData}
  //       unitKind={chartUnitKind}
  //       tooltip={(arg) =>
  //         createChartTooltipElement({ arg, kind: "pie", unit: "" })}
  //     />
  //   )
  //   : null;

  // return (
  //   <Stack w="100%">
  //     <Text size="lg" weight={500}>
  //       {chartTitle}
  //     </Text>
  //     <Group w="100%">
  //       {displayResponsiveChart}
  //     </Group>
  //   </Stack>
  // );
}

export default DisplayResponsiveChart;
