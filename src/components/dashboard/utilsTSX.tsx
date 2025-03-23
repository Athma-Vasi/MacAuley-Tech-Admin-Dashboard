import { Accordion, Card, Center, Group, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { MdCalendarMonth, MdDateRange } from "react-icons/md";
import { RiCalendarLine } from "react-icons/ri";

import { INPUT_WIDTH } from "../../constants";
import {
  addCommaSeparator,
  formatDate,
  splitCamelCase,
  toFixedFloat,
} from "../../utils";
import { GoldenGrid } from "../goldenGrid";
import {
  MONEY_SYMBOL_CATEGORIES,
  PERCENTAGE_SYMBOL_CATEGORIES,
} from "./financial/constants";
import {
  FinancialCardsAndStatisticsKeyPERT,
  FinancialMetricCategory,
} from "./financial/types";
import { BusinessMetricStoreLocation, DashboardCalendarView } from "./types";
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
      <Text
        size={24}
        weight={500}
        style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.05)" }}
      >
        {heading}
      </Text>
    </Group>
  );

  const cardBody = (
    <Group w="100%" position="left" py="sm">
      <Text
        size={26}
        weight={600}
        style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.05)" }}
      >
        {value}
      </Text>
    </Group>
  );

  const displayPercentage = (
    <Text size={16} italic color={deltaTextColor}>
      {percentage}
    </Text>
  );

  const cardFooter = (
    <Group w="100%" position="apart">
      {displayPercentage}
      <Text size={16}>{date}</Text>
    </Group>
  );

  const createdChartCard = (
    <Card shadow="md" radius="md" withBorder w={INPUT_WIDTH}>
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
    heading,
    icon,
    percentage: deltaFormatted,
    value: displayValue,
    deltaTextColor,
  };
}

function returnMinMaxSectionElement(
  kind: "Min" | "Max",
  data: { value: number; occurred: string },
  unitSymbol: "$" | "%" | "",
) {
  return (
    <Stack style={{ borderBottom: "1px solid hsl(0, 0%, 90%)" }}>
      <GoldenGrid>
        <Group position="right">
          <Text>{kind}:</Text>
        </Group>
        <Group position="left">
          <Text>
            {`${unitSymbol === "%" ? "" : unitSymbol} ${
              addCommaSeparator(data.value.toFixed(2))
            } ${unitSymbol === "%" ? "%" : ""}`}
          </Text>
        </Group>
      </GoldenGrid>

      <GoldenGrid>
        <Group position="right">
          <Text>Occurred:</Text>
        </Group>
        <Group position="left">
          <Text>{data.occurred}</Text>
        </Group>
      </GoldenGrid>
    </Stack>
  );
}

function returnMedianModeSection(
  kind: "Mode" | "Median",
  value: number,
  unitSymbol: "$" | "%" | "",
) {
  return (
    <GoldenGrid style={{ borderBottom: "1px solid hsl(0, 0%, 90%)" }}>
      <Group position="right">
        <Text>{kind}:</Text>
      </Group>
      <Group position="left">
        <Text>
          {`${unitSymbol === "%" ? "" : unitSymbol} ${
            addCommaSeparator(value.toFixed(2))
          } ${unitSymbol === "%" ? "%" : ""}`}
        </Text>
      </Group>
    </GoldenGrid>
  );
}

function returnMeanRangeSDSection(
  kind: "Arithmetic Mean" | "Interquartile Range" | "Standard Deviation",
  value: number,
  unitSymbol: "$" | "%" | "",
) {
  const [firstWord, lastWord] = kind.split(" ");

  return (
    <GoldenGrid
      style={kind === "Standard Deviation"
        ? {}
        : { borderBottom: "1px solid hsl(0, 0%, 90%)" }}
    >
      <Stack spacing={0}>
        <Group position="right">
          <Text>{firstWord}</Text>
        </Group>
        <Group position="right">
          <Text>{lastWord}:</Text>
        </Group>
      </Stack>
      <Group position="left">
        <Text>
          {`${unitSymbol === "%" ? "" : unitSymbol} ${
            addCommaSeparator(value.toFixed(2))
          } ${unitSymbol === "%" ? "%" : ""}`}
        </Text>
      </Group>
    </GoldenGrid>
  );
}

function createStatisticsElements(
  calendarView: DashboardCalendarView,
  metricCategory: string,
  statisticsMap: Map<string, StatisticsObject>,
  storeLocation: BusinessMetricStoreLocation,
) {
  return statisticsMap
    ? Array.from(statisticsMap).reduce((acc, [key, statisticsObj], idx) => {
      const {
        mean,
        interquartileRange,
        max,
        median,
        min,
        mode,
        standardDeviation,
      } = statisticsObj;

      const unitSymbol = MONEY_SYMBOL_CATEGORIES.has(key.toLowerCase())
        ? "$"
        : PERCENTAGE_SYMBOL_CATEGORIES.has(key.toLowerCase())
        ? "%"
        : "";

      const heading = (
        <Center>
          <Text weight={600} size={18}>
            {`${calendarView} ${key} ${
              splitCamelCase(metricCategory)
            } for ${storeLocation}`}
          </Text>
        </Center>
      );

      const minSection = returnMinMaxSectionElement(
        "Min",
        min,
        unitSymbol,
      );

      const maxSection = returnMinMaxSectionElement(
        "Max",
        max,
        unitSymbol,
      );

      const medianSection = returnMedianModeSection(
        "Median",
        median,
        unitSymbol,
      );

      const modeSection = returnMedianModeSection(
        "Mode",
        mode,
        unitSymbol,
      );

      const meanSection = returnMeanRangeSDSection(
        "Arithmetic Mean",
        mean,
        unitSymbol,
      );

      const iqRangeSection = returnMeanRangeSDSection(
        "Interquartile Range",
        interquartileRange,
        unitSymbol,
      );

      const stdDeviationSection = returnMeanRangeSDSection(
        "Standard Deviation",
        standardDeviation,
        unitSymbol,
      );

      const statisticsElement = (
        <Stack
          key={`${idx}-${key}`}
          w="100%"
        >
          {heading}
          {minSection}
          {maxSection}
          {medianSection}
          {modeSection}
          {meanSection}
          {iqRangeSection}
          {stdDeviationSection}
        </Stack>
      );

      acc.set(key, statisticsElement);

      return acc;
    }, new Map())
    : new Map();
}

function createFinancialStatisticsElements(
  calendarView: DashboardCalendarView,
  metricCategory: FinancialMetricCategory,
  metricsKind: "pert" | "otherMetrics",
  statisticsMap: Map<string, StatisticsObject>,
  storeLocation: BusinessMetricStoreLocation,
): Map<FinancialCardsAndStatisticsKeyPERT, React.JSX.Element> {
  const statisticsKeyToCardsKeyMapPERT = new Map<
    string,
    FinancialCardsAndStatisticsKeyPERT
  >([
    ["Total", "Total"],
    ["Repair", "Repair"],
    ["In-Store", "Sales In-Store"],
    ["Online", "Sales Online"],
    ["Sales", "Sales Total"],
  ]);

  return statisticsMap
    ? Array.from(statisticsMap).reduce((acc, [key, statisticsObj], idx) => {
      const cardsKey = metricsKind === "pert"
        ? statisticsKeyToCardsKeyMapPERT.get(key) ?? key
        : key;
      const {
        mean,
        interquartileRange,
        max,
        median,
        min,
        mode,
        standardDeviation,
      } = statisticsObj;

      const unitSymbol = MONEY_SYMBOL_CATEGORIES.has(cardsKey.toLowerCase())
        ? "$"
        : PERCENTAGE_SYMBOL_CATEGORIES.has(cardsKey.toLowerCase())
        ? "%"
        : "";

      const heading = (
        <Center>
          <Text weight={600} size={18}>
            {`${calendarView} ${cardsKey} ${
              metricsKind === "pert" ? splitCamelCase(metricCategory) : ""
            } for ${storeLocation}`}
          </Text>
        </Center>
      );

      const minSection = returnMinMaxSectionElement(
        "Min",
        min,
        unitSymbol,
      );

      const maxSection = returnMinMaxSectionElement(
        "Max",
        max,
        unitSymbol,
      );

      const medianSection = returnMedianModeSection(
        "Median",
        median,
        unitSymbol,
      );

      const modeSection = returnMedianModeSection(
        "Mode",
        mode,
        unitSymbol,
      );

      const meanSection = returnMeanRangeSDSection(
        "Arithmetic Mean",
        mean,
        unitSymbol,
      );

      const iqRangeSection = returnMeanRangeSDSection(
        "Interquartile Range",
        interquartileRange,
        unitSymbol,
      );

      const stdDeviationSection = returnMeanRangeSDSection(
        "Standard Deviation",
        standardDeviation,
        unitSymbol,
      );

      const statisticsElement = (
        <Stack
          key={`${idx}-${key}`}
        >
          {heading}
          {minSection}
          {maxSection}
          {medianSection}
          {modeSection}
          {meanSection}
          {iqRangeSection}
          {stdDeviationSection}
        </Stack>
      );

      if (cardsKey) {
        acc.set(cardsKey, statisticsElement);
      }

      return acc;
    }, new Map())
    : new Map();
}

function consolidateCustomerCardsAndStatistics(
  cards: Map<string, DashboardCardInfo[]>,
  statisticsElements: Map<string, React.JSX.Element>,
): Map<string, React.JSX.Element> {
  console.group("consolidateCustomerCardsAndStatistics");
  console.log("cards", cards);
  console.log("statisticsElements", statisticsElements);
  console.groupEnd();

  return Array.from(cards).reduce((acc, [key, cards]) => {
    const statisticElement = statisticsElements.get(key) ?? <></>;
    const statisticsAccordion = (
      <Accordion>
        <Accordion.Item value={key}>
          <Accordion.Control>
            <Text size={18} weight={500}>
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

    cards.forEach((card) => {
      card.icon = statisticsAccordion;
      const cardElement = returnDashboardCardElement(card);
      acc.set(key, cardElement);
    });

    // card.icon = statisticsAccordion;
    // const cardElement = returnDashboardCardElement(card);

    // acc.set(key, cardElement);

    return acc;
  }, new Map());
}

function consolidateCardsAndStatistics(
  cards: Map<string, DashboardCardInfo>,
  statisticsElements: Map<string, React.JSX.Element>,
): Map<string, React.JSX.Element> {
  return Array.from(cards).reduce((acc, [key, card]) => {
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

function returnCardElementsForYAxisVariable(
  consolidatedCards: Map<string, React.JSX.Element>,
  yAxisVariable: string,
  yAxisKeyMap: Map<string, Set<string>>,
) {
  return (
    <>
      {Array.from(consolidatedCards).map(([key, card], idx) => {
        const cardsSet = yAxisKeyMap.get(
          yAxisVariable,
        );

        return cardsSet?.has(key)
          ? (
            <Group key={`${idx}-${key}`}>
              {card}
            </Group>
          )
          : null;
      })}
    </>
  );
}

function createOverviewMetricCard(
  {
    selectedYYYYMMDD,
    storeLocationView,
    subMetric,
    unit,
    value,
  }: {
    selectedYYYYMMDD: string;
    storeLocationView: BusinessMetricStoreLocation;
    subMetric: string;
    unit: "CAD" | "%" | "Units";
    value: number;
  },
) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      w={INPUT_WIDTH}
      h={185}
    >
      <Stack align="flex-start" spacing={2}>
        <Text size={24} weight={600}>{splitCamelCase(subMetric)}</Text>
        <Text size={20} mb={5}>
          {storeLocationView}
        </Text>
        <Text size={16} mb={5}>
          {formatDate({
            date: selectedYYYYMMDD,
            formatOptions: { dateStyle: "long" },
          })}
        </Text>
        <Text size={26} weight={600}>
          {addCommaSeparator(value)} {unit}
        </Text>
      </Stack>
    </Card>
  );
}

function createOverviewProductMetricCards(
  otherMetrics: {
    dailyAverageOrderValue: number;
    dailyConversionRate: number;
    dailyNetProfitMargin: number;
  },
  pert: {
    dailyExpenses: number;
    dailyProfit: number;
    dailyRevenue: number;
    dailyTransactions: number;
  },
  selectedYYYYMMDD: string,
  storeLocationView: BusinessMetricStoreLocation,
) {
  const overviewDailyProfitCard = createOverviewMetricCard({
    selectedYYYYMMDD,
    storeLocationView,
    subMetric: "profit",
    unit: "CAD",
    value: pert.dailyProfit,
  });

  const overviewDailyRevenueCard = createOverviewMetricCard({
    selectedYYYYMMDD,
    storeLocationView,
    subMetric: "revenue",
    unit: "CAD",
    value: pert.dailyRevenue,
  });

  const overviewDailyTransactionsCard = createOverviewMetricCard({
    selectedYYYYMMDD,
    storeLocationView,
    subMetric: "transactions",
    unit: "Units",
    value: pert.dailyTransactions,
  });

  const overviewDailyExpensesCard = createOverviewMetricCard({
    selectedYYYYMMDD,
    storeLocationView,
    subMetric: "expenses",
    unit: "CAD",
    value: pert.dailyExpenses,
  });

  const overviewDailyAverageOrderValueCard = createOverviewMetricCard({
    selectedYYYYMMDD,
    storeLocationView,
    subMetric: "averageOrderValue",
    unit: "CAD",
    value: otherMetrics.dailyAverageOrderValue,
  });

  const overviewDailyConversionRateCard = createOverviewMetricCard({
    selectedYYYYMMDD,
    storeLocationView,
    subMetric: "conversionRate",
    unit: "%",
    value: otherMetrics.dailyConversionRate,
  });

  const overviewDailyNetProfitMarginCard = createOverviewMetricCard({
    selectedYYYYMMDD,
    storeLocationView,
    subMetric: "netProfitMargin",
    unit: "%",
    value: toFixedFloat(otherMetrics.dailyNetProfitMargin),
  });

  return {
    otherMetricsOverviewCards: {
      averageOrderValue: overviewDailyAverageOrderValueCard,
      conversionRate: overviewDailyConversionRateCard,
      netProfitMargin: overviewDailyNetProfitMarginCard,
    },
    pertOverviewCards: {
      expenses: overviewDailyExpensesCard,
      profit: overviewDailyProfitCard,
      revenue: overviewDailyRevenueCard,
      transactions: overviewDailyTransactionsCard,
    },
  };
}

export {
  consolidateCardsAndStatistics,
  consolidateCustomerCardsAndStatistics,
  createDashboardMetricsCards,
  createFinancialStatisticsElements,
  createOverviewMetricCard,
  createOverviewProductMetricCards,
  createStatisticsElements,
  returnCardElementsForYAxisVariable,
  returnDashboardCardElement,
};
export type { CreateDashboardMetricsCardsInput, DashboardCardInfo };
