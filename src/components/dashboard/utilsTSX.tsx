import { Card, Group, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { MdCalendarMonth, MdDateRange } from "react-icons/md";
import { RiCalendarLine } from "react-icons/ri";

import { addCommaSeparator, toFixedFloat } from "../../utils";

type DashboardCardInfo = {
  date?: string;
  heading?: string;
  icon: ReactNode;
  percentage?: string;
  deltaTextColor?: string;
  value: string | number;
};
function returnDashboardCardElement({
  date,
  heading,
  icon,
  percentage,
  deltaTextColor,
  value,
}: DashboardCardInfo): React.JSX.Element {
  const cardHeading = (
    <Group w="100%" position="apart">
      <Text size="md">{heading}</Text>
      {icon}
    </Group>
  );

  const cardBody = (
    <Group w="100%" position="apart">
      <Text size="xl" weight={600}>
        {value}
      </Text>
    </Group>
  );

  const displayPercentage = (
    <Text size="sm" italic color={deltaTextColor}>
      {percentage}
    </Text>
  );

  const cardFooter = (
    <Group w="100%" position="apart">
      {displayPercentage}
      <Text size="sm">{date}</Text>
    </Group>
  );

  const createdChartCard = (
    <Card shadow="sm" radius="md" withBorder>
      {cardHeading}
      {cardBody}
      {cardFooter}
    </Card>
  );

  return createdChartCard;
}

type CreateDashboardMetricsCardsInput = {
  currentMonth: string;
  currentYear: string;
  greenColorShade: string;
  heading: string;
  isDisplayValueAsCurrency?: boolean;
  isDisplayValueAsPercentage?: boolean;
  isFlipColor?: boolean;
  kind: "day" | "month" | "year";
  prevDay: string;
  prevMonth: string;
  prevValue: number;
  prevYear: string;
  redColorShade: string;
  selectedValue: number;
};

function createDashboardMetricsCards({
  currentMonth,
  currentYear,
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
}: CreateDashboardMetricsCardsInput): DashboardCardInfo {
  const icon = kind === "day"
    ? <MdDateRange size={20} />
    : kind === "month"
    ? <MdCalendarMonth size={20} />
    : <RiCalendarLine size={20} />;

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

  const valueStr = addCommaSeparator(
    toFixedFloat(
      selectedValue < 1 ? selectedValue * 100 : selectedValue,
      selectedValue < 1 ? 4 : 2,
    ),
  );

  const displayValue = isDisplayValueAsPercentage
    ? `${valueStr} %`
    : `${isDisplayValueAsCurrency ? "CAD" : ""} ${
      selectedValue.toString().includes(".")
        ? valueStr
        : addCommaSeparator(selectedValue.toString())
    }`;

  return {
    date,
    heading,
    icon,
    percentage: deltaFormatted,
    value: displayValue,
    deltaTextColor,
  };
}

export { createDashboardMetricsCards, returnDashboardCardElement };
export type { CreateDashboardMetricsCardsInput, DashboardCardInfo };
