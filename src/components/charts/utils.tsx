import { Card, Group, Text } from "@mantine/core";

import { BarTooltipProps } from "@nivo/bar";
import { PointTooltipProps } from "@nivo/line";
import { PieTooltipProps } from "@nivo/pie";
import { RadialBarDatum, RadialBarTooltipProps } from "@nivo/radial-bar";
import { addCommaSeparator, splitCamelCase, toFixedFloat } from "../../utils";
import { MONTHS } from "../dashboard/constants";
import { DashboardCalendarView } from "../dashboard/types";
import { BarChartData } from "./responsiveBarChart/types";
import { MyCalendarTooltipProps } from "./responsiveCalendarChart/types";
import { PieChartData } from "./responsivePieChart/types";
import { ChartUnitKind } from "./types";

type ChartKindTooltipValue = {
  kind: "bar";
  arg: BarTooltipProps<BarChartData<Record<string, string | number>>>;
} | {
  kind: "pie";
  arg: PieTooltipProps<PieChartData>;
} | {
  kind: "radial";
  arg: RadialBarTooltipProps<RadialBarDatum>;
} | {
  kind: "calendar";
  arg: MyCalendarTooltipProps;
} | {
  kind: "line";
  arg: PointTooltipProps;
};

type CreateChartTooltipElementInput = ChartKindTooltipValue & {
  calendarView?: DashboardCalendarView; // only for radial chart
  day?: string; // only for pie chart
  month?: string; // only for pie chart
  calendarChartYAxis?: string; // only for calendar chart
  chartUnitKind: ChartUnitKind;
  year?: string; // only for pie chart
};

function createChartTooltipElement(
  {
    calendarView,
    calendarChartYAxis,
    arg,
    day,
    month,
    year,
    kind,
    chartUnitKind,
  }: CreateChartTooltipElementInput,
) {
  switch (kind) {
    case "bar": {
      const { color, formattedValue, id, data } = arg;
      return returnTooltipCard({
        color,
        id,
        xAxis: { kind: "bar", data },
        chartUnitKind,
        formattedValue,
      });
    }

    case "calendar": {
      const { color, data: { day, value } } = arg;
      let [year, month, day_] = day.split("-");
      month = MONTHS[Number(month) - 1];
      return returnTooltipCard({
        color,
        id: day,
        chartUnitKind,
        formattedValue: addCommaSeparator(value),
        xAxis: {
          kind: "calendar",
          calendarChartYAxis: splitCamelCase(calendarChartYAxis ?? ""),
          day: day_,
          month,
          year,
        },
      });
    }

    case "line": {
      const {
        point: { serieId, borderColor, data: { xFormatted, yStacked = 0 } },
      } = arg;
      return returnTooltipCard({
        color: borderColor,
        id: serieId,
        chartUnitKind,
        formattedValue: addCommaSeparator(yStacked),
        xAxis: { kind: "line", xFormatted },
      });
    }

    case "pie": {
      const { datum: { color, data: { id }, formattedValue } } = arg;
      return returnTooltipCard({
        color,
        id,
        chartUnitKind,
        formattedValue,
        xAxis: { kind: "pie", day, month, year },
      });
    }

    // radial
    default: {
      const { bar: { color, data: { x, y }, groupId } } = arg;
      return returnTooltipCard({
        color,
        id: groupId,
        chartUnitKind,
        formattedValue: addCommaSeparator(toFixedFloat(y)),
        xAxis: { kind: "radial", calendarView, x },
      });
    }
  }

  function returnTooltipCard(
    { color, id, xAxis, chartUnitKind, formattedValue }: {
      color: string;
      id: string | number;
      xAxis: {
        kind: "bar";
        data: BarChartData<Record<string, string | number>>;
      } | {
        kind: "pie";
        day: string | undefined;
        month: string | undefined;
        year: string | undefined;
      } | {
        kind: "line";
        xFormatted: string | number;
      } | {
        kind: "radial";
        calendarView?: DashboardCalendarView;
        x: string | number;
      } | {
        kind: "calendar";
        calendarChartYAxis?: string;
        day: string;
        month: string;
        year: string;
      };
      chartUnitKind: ChartUnitKind;
      formattedValue: string | number;
    },
  ) {
    const xAxisIndex = xAxis.kind === "bar"
      ? xAxis.data?.Days
        ? `Day - ${xAxis.data?.Days}`
        : xAxis.data?.Months
        ? xAxis.data?.Months
        : `Year - ${xAxis.data?.Years}`
      : xAxis.kind === "pie"
      ? `${MONTHS[Number(xAxis.month) - 1]} ${xAxis.day}, ${xAxis.year}`
      : xAxis.kind === "line"
      ? xAxis.xFormatted
      : xAxis.kind === "radial"
      ? calendarView === "Daily"
        ? `Day - ${xAxis.x}`
        : calendarView === "Monthly"
        ? xAxis.x
        : `Year - ${xAxis.x}`
      : xAxis.kind === "calendar"
      ? `${xAxis.month} ${xAxis.day}, ${xAxis.year}`
      : "";

    return (
      <Card bg="hsl(0, 0%, 25%)" maw={300} miw="fit-content">
        <Group position="center" pb="xs">
          <div
            style={{
              backgroundColor: color,
              borderRadius: 3,
              width: 15,
              height: 15,
            }}
          />
          <Text color={color} size={15}>
            {xAxis?.kind === "calendar" ? xAxis.calendarChartYAxis : id}
          </Text>
        </Group>

        <Group position="center">
          <Group>
            <Text color={color} size={15}>
              {xAxisIndex}:
            </Text>
          </Group>
          <Group>
            <Text color={color} size={15}>
              {formattedValue} {chartUnitKind}
            </Text>
          </Group>
        </Group>
      </Card>
    );
  }
}

function returnBarLineChartDimensions(
  windowWidth: number,
) {
  if (windowWidth < 400) {
    return {
      chartWidth: windowWidth - 20,
      chartHeight: Math.floor(windowWidth * 0.382),
    };
  }

  if (windowWidth > 400 && windowWidth < 618) {
    return {
      chartWidth: windowWidth - 20,
      chartHeight: Math.floor(windowWidth * 0.382),
    };
  }

  // if (windowWidth > 768 && windowWidth < 1024) {
  //   return {
  //     chartWidth: windowWidth - 40,
  //     chartHeight: Math.floor(windowWidth * 0.382),
  //   };
  // }

  return {
    chartWidth: 618,
    chartHeight: 382,
  };
}

function returnPieRadialChartDimensions(
  windowWidth: number,
  isFullScreen?: boolean,
) {
  if (windowWidth < 400) {
    return {
      chartWidth: windowWidth - 20,
      chartHeight: windowWidth - 20,
    };
  }

  return {
    chartWidth: 400,
    chartHeight: 400,
  };
}

export {
  createChartTooltipElement,
  returnBarLineChartDimensions,
  returnPieRadialChartDimensions,
};
