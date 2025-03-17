import { Accordion, Card, Center, Group, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { MdCalendarMonth, MdDateRange } from "react-icons/md";
import { RiCalendarLine } from "react-icons/ri";

import { addCommaSeparator, toFixedFloat } from "../../utils";
import { FinancialMetricsBarLineChartsKey } from "./financial/chartsData";
import { FinancialCardsAndStatisticsKey } from "./financial/types";
import { DashboardCalendarView } from "./types";
import { StatisticsObject } from "./utils";

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
  // const cardHeading = (
  //   <Group w="100%" position="apart">
  //     <Text size="md">{heading}</Text>
  //     {icon}
  //   </Group>
  // );
  const cardHeading = (
    <Group position="left">
      <Text size="md">{heading}</Text>
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
      {icon}
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

function createFinancialStatisticsElements(
  isMoney: boolean,
  calendarView: DashboardCalendarView,
  statisticsMap: Map<string, StatisticsObject>,
): Map<FinancialCardsAndStatisticsKey, React.JSX.Element> {
  const statisticsKeyToCardsKeyMap = new Map<
    string,
    FinancialCardsAndStatisticsKey
  >([
    ["Total", "Total"],
    ["Repair", "Repair"],
    ["In-Store", "Sales In-Store"],
    ["Online", "Sales Online"],
    ["Sales", "Sales Total"],
  ]);

  return statisticsMap
    ? Array.from(statisticsMap).reduce((acc, [key, statisticsObj], idx) => {
      const cardsKey = statisticsKeyToCardsKeyMap.get(key);
      const {
        mean,
        interquartileRange,
        max,
        median,
        min,
        mode,
        standardDeviation,
      } = statisticsObj;

      const unitSymbol =
        isMoney || key === "Revenue" || key === "Average Order Value"
          ? "$"
          : "";

      const statisticsElement = (
        <Stack
          key={`${idx}-${key}`}
        >
          <Center>
            <Text weight={500} size="md">
              {`${calendarView} ${cardsKey}`}
            </Text>
          </Center>

          <Text>
            {`Min: ${unitSymbol} ${addCommaSeparator(min.value.toFixed(2))}`}
          </Text>
          <Text>{`Occurred: ${min.occurred}`}</Text>

          <Text>
            {`Max: ${unitSymbol} ${addCommaSeparator(max.value.toFixed(2))}`}
          </Text>
          <Text>{`Occurred: ${max.occurred}`}</Text>

          <Text>
            {`Median: ${unitSymbol} ${addCommaSeparator(median.toFixed(2))}`}
          </Text>

          <Text>
            {`Mode: ${unitSymbol} ${addCommaSeparator(mode.toFixed(2))}`}
          </Text>

          <Text>
            {`Arithmetic Mean: ${unitSymbol} ${
              addCommaSeparator(mean.toFixed(2))
            }`}
          </Text>

          <Text>
            {`Interquartile Range: ${unitSymbol} ${
              addCommaSeparator(interquartileRange.toFixed(2))
            }`}
          </Text>

          <Text>
            {`Standard Deviation: ${unitSymbol} ${
              addCommaSeparator(standardDeviation.toFixed(2))
            }`}
          </Text>
        </Stack>
      );

      if (cardsKey) {
        acc.set(cardsKey, statisticsElement);
      }

      return acc;
    }, new Map())
    : new Map();
}

function consolidateFinancialCardsAndStatistics(
  overviewCards: Map<FinancialCardsAndStatisticsKey, DashboardCardInfo>,
  statisticsElements: Map<FinancialCardsAndStatisticsKey, React.JSX.Element>,
): Map<FinancialMetricsBarLineChartsKey, React.JSX.Element> {
  return Array.from(overviewCards).reduce((acc, [key, card]: [
    FinancialCardsAndStatisticsKey,
    DashboardCardInfo,
  ]) => {
    const statisticElement = statisticsElements.get(key) ?? <></>;
    const statisticsAccordion = (
      <Accordion>
        <Accordion.Item value={key}>
          <Accordion.Control>
            <Text size="sm" weight={500}>
              Statistics
            </Text>
          </Accordion.Control>

          <Accordion.Panel>
            <Stack spacing="xs">
              {statisticElement}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );

    card.icon = statisticsAccordion;
    const cardElement = returnDashboardCardElement(card);

    acc.set(key, cardElement);

    return acc;
  }, new Map());
}

export {
  consolidateFinancialCardsAndStatistics,
  createDashboardMetricsCards,
  createFinancialStatisticsElements,
  returnDashboardCardElement,
};
export type { CreateDashboardMetricsCardsInput, DashboardCardInfo };
