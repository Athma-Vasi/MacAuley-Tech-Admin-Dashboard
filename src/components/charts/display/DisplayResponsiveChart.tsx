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

  if (selectedChartKind === "bar") {
    if (!expandBarChartData) {
      return null;
    }

    console.log("display responsive chart", {
      expandBarChartData,
      selectedChartKind,
      themeObject,
    });

    const {
      calendarView,
      chartData,
      yAxisKeyChartHeading,
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
        dashboardChartTitle={yAxisKeyChartHeading}
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
      />
    );
  }

  if (selectedChartKind === "calendar") {
    if (!expandCalendarChartData) {
      return null;
    }

    const {
      yAxisKeyChartHeading,
      chartData,
      chartUnitKind,
      day,
      month,
      year,
      yAxisKey,
    } = expandCalendarChartData;

    return (
      <ResponsiveCalendarChart
        calendarChartData={chartData}
        dashboardChartTitle={yAxisKeyChartHeading}
        from={`${year}-01-01`}
        to={`${year}-12-31`}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            kind: "calendar",
            chartUnitKind,
            yAxisKey,
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

    const { calendarView, chartData, yAxisKeyChartHeading, chartUnitKind } =
      expandLineChartData;

    return (
      <ResponsiveLineChart
        chartUnitKind={chartUnitKind}
        dashboardChartTitle={yAxisKeyChartHeading}
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

    const { chartData, yAxisKeyChartHeading, chartUnitKind, day, month, year } =
      expandPieChartData;

    return (
      <ResponsivePieChart
        chartUnitKind={chartUnitKind}
        dashboardChartTitle={yAxisKeyChartHeading}
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

    const { chartData, yAxisKeyChartHeading, chartUnitKind } =
      expandRadialBarChartData;

    return (
      <ResponsiveRadialBarChart
        dashboardChartTitle={yAxisKeyChartHeading}
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
