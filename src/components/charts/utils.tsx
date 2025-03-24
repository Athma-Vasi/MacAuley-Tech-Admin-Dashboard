import { Card, Group, Text } from "@mantine/core";

import { BarTooltipProps } from "@nivo/bar";
import { CalendarTooltipProps } from "@nivo/calendar";
import { PointTooltipProps } from "@nivo/line";
import { PieTooltipProps } from "@nivo/pie";
import { RadialBarDatum, RadialBarTooltipProps } from "@nivo/radial-bar";
import { toFixedFloat } from "../../utils";
import { BarChartData } from "./responsiveBarChart/types";
import { PieChartData } from "./responsivePieChart/types";

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
  arg: CalendarTooltipProps;
} | {
  kind: "line";
  arg: PointTooltipProps;
};

type CreateChartTooltipElementInput = ChartKindTooltipValue & {
  unit: "CAD" | "%" | "Units" | "";
};

function createChartTooltipElement(
  { arg, kind, unit }: CreateChartTooltipElementInput,
) {
  switch (kind) {
    case "bar": {
      const { color, formattedValue, id } = arg;
      return returnTooltipCard({ color, id, unit, formattedValue });
    }

    case "calendar": {
      const { color, day, value } = arg;
      return returnTooltipCard({
        color,
        id: day,
        unit,
        formattedValue: toFixedFloat(parseInt(value)),
      });
    }

    case "line": {
      const { point: { color, data: { xFormatted, yFormatted } } } = arg;
      return returnTooltipCard({
        color,
        id: xFormatted,
        unit,
        formattedValue: toFixedFloat(parseInt(yFormatted.toString())),
      });
    }

    case "pie": {
      const { datum: { color, data: { id }, formattedValue } } = arg;
      return returnTooltipCard({ color, id, unit, formattedValue });
    }

    // radial
    default: {
      const { bar: { color, data: { x, y } } } = arg;
      return returnTooltipCard({
        color,
        id: x,
        unit,
        formattedValue: toFixedFloat(y),
      });
    }
  }

  function returnTooltipCard(
    { color, id, unit, formattedValue }: {
      color: string;
      id: string | number;
      unit: "CAD" | "%" | "Units" | "";
      formattedValue: string | number;
    },
  ) {
    return (
      <Card bg="hsl(0, 0%, 25%)" maw={300} miw="fit-content">
        <Group py="xs" position="center">
          <Group>
            <div
              style={{
                backgroundColor: color,
                borderRadius: 3,
                width: 15,
                height: 15,
              }}
            />
            <Text color={color} size={15}>{id}:</Text>
          </Group>
          <Group>
            <Text color={color} size={15}>{formattedValue} {unit}</Text>
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
