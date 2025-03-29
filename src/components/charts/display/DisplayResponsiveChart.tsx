import { Stack } from "@mantine/core";
import {
  ResponsiveBarChart,
  ResponsiveCalendarChart,
  ResponsiveLineChart,
  ResponsivePieChart,
  ResponsiveRadialBarChart,
} from "..";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { addCommaSeparator } from "../../../utils";
import { createChartTooltipElement } from "../utils";

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

    console.log("inside bar");

    return (
      <Stack w="100%">
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
      </Stack>
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

    const { chartData, chartTitle, chartUnitKind, day, month, year } =
      expandPieChartData;

    return (
      <ResponsivePieChart
        chartUnitKind={chartUnitKind}
        dashboardChartTitle={chartTitle}
        pieChartData={chartData}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            chartUnitKind,
            day,
            kind: "pie",
            month,
            year,
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
}

export default DisplayResponsiveChart;
