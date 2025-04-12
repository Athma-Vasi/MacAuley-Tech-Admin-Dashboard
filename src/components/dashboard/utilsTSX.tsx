import {
  Accordion,
  Card,
  Center,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import type { ReactNode } from "react";
import { MdCalendarMonth, MdDateRange } from "react-icons/md";
import { RiCalendarLine } from "react-icons/ri";

import React from "react";
import { TbFolderCancel, TbFolderOpen } from "react-icons/tb";
import { INPUT_WIDTH, TEXT_SHADOW } from "../../constants";
import {
  addCommaSeparator,
  formatDate,
  splitCamelCase,
  toFixedFloat,
} from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { GoldenGrid } from "../goldenGrid";
import { MONTHS } from "./constants";
import {
  MONEY_SYMBOL_CATEGORIES,
  PERCENTAGE_SYMBOL_CATEGORIES,
} from "./financial/constants";
import {
  FinancialCardsAndStatisticsKeyPERT,
  FinancialMetricCategory,
} from "./financial/types";
import { AllStoreLocations, DashboardCalendarView } from "./types";
import { StatisticsObject } from "./utils";

type DashboardCardInfo = {
  cardBgGradient: string;
  date?: string;
  heading?: string;
  icon: ReactNode;
  idx?: number;
  percentage?: string;
  deltaTextColor?: string;
  value: string | number;
};
function returnDashboardCardElement(
  {
    cardBgGradient,
    date,
    heading,
    icon,
    idx,
    percentage,
    deltaTextColor,
    value,
  }: DashboardCardInfo,
): React.JSX.Element {
  const cardHeading = (
    <Group position="apart" w="100%">
      <Text
        size={24}
        weight={400}
      >
        {heading}
      </Text>
      {icon}
    </Group>
  );

  const cardBody = (
    <Group w="100%" position="left" py="sm">
      <Text
        size={26}
        weight={600}
        style={{ textShadow: TEXT_SHADOW }}
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
    <div
      // bg={cardBgGradient}
      className={`statistics-card c${idx ?? 0}`}
      // shadow="xs"
      // radius="md"
      // withBorder
    >
      {cardHeading}
      {cardBody}
      {cardFooter}
    </div>
  );

  return createdChartCard;
}

type CreateDashboardMetricsCardsInput = {
  cardBgGradient: string;
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
  cardBgGradient,
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
    cardBgGradient,
    date,
    heading,
    icon,
    percentage: deltaFormatted,
    value: displayValue,
    deltaTextColor,
  };
}

function returnMinMaxSectionElement(
  { data, kind, style = {}, unitSymbol }: {
    data: { value: number; occurred: string };
    kind: "Min" | "Max";
    style?: React.CSSProperties;
    unitSymbol: "$" | "%" | "";
  },
) {
  return (
    <Stack
      style={{ ...style }}
      w="100%"
      px={0}
    >
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
  { kind, style = {}, unitSymbol, value }: {
    kind: "Mode" | "Median";
    style?: React.CSSProperties;
    unitSymbol: "$" | "%" | "";
    value: number;
  },
) {
  return (
    <GoldenGrid
      style={{ ...style }}
    >
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
  { kind, style = {}, unitSymbol, value }: {
    kind: "Arithmetic Mean" | "Interquartile Range" | "Standard Deviation";
    style?: React.CSSProperties;
    unitSymbol: "$" | "%" | "";
    value: number;
  },
) {
  const [firstWord, lastWord] = kind.split(" ");

  return (
    <GoldenGrid
      style={{ ...style }}
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
  storeLocation: AllStoreLocations,
) {
  const NEW_STATISTICS_KEY_TO_CARDS_KEY_MAP = new Map<string, string>([
    ["Total", "Total New"],
    ["Repair", "Repair"],
    ["In Store", "Sales In-Store"],
    ["Online", "Sales Online"],
    ["Sales", "Sales"],
  ]);

  const RETURNING_STATISTICS_KEY_TO_CARDS_KEY_MAP = new Map<string, string>([
    ["Total", "Total Returning"],
    ["Repair", "Repair"],
    ["In Store", "Sales In-Store"],
    ["Online", "Sales Online"],
    ["Sales", "Sales"],
  ]);

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

      const cardsKey = metricCategory === "new"
        ? NEW_STATISTICS_KEY_TO_CARDS_KEY_MAP.get(key)
        : metricCategory === "returning"
        ? RETURNING_STATISTICS_KEY_TO_CARDS_KEY_MAP.get(key)
        : key;

      if (!cardsKey) {
        return acc;
      }

      const unitSymbol = MONEY_SYMBOL_CATEGORIES.has(cardsKey.toLowerCase())
        ? "$"
        : PERCENTAGE_SYMBOL_CATEGORIES.has(cardsKey.toLowerCase())
        ? "%"
        : "";

      const heading = (
        <Center>
          <Text weight={600} size={18}>
            {`${calendarView} ${cardsKey} ${
              splitCamelCase(metricCategory)
            } for ${storeLocation}`}
          </Text>
        </Center>
      );

      const borderBottomStyle: React.CSSProperties = {
        borderBottom: "1px solid hsla(0, 0%, 0%, 0.3)",
      };

      const minSection = returnMinMaxSectionElement(
        {
          kind: "Min",
          data: min,
          style: borderBottomStyle,
          unitSymbol,
        },
      );

      const maxSection = returnMinMaxSectionElement(
        {
          kind: "Max",
          data: max,
          unitSymbol,
        },
      );

      const medianSection = returnMedianModeSection(
        {
          kind: "Median",
          value: median,
          style: borderBottomStyle,
          unitSymbol,
        },
      );

      const modeSection = returnMedianModeSection(
        {
          kind: "Mode",
          value: mode,
          unitSymbol,
        },
      );

      const meanSection = returnMeanRangeSDSection(
        {
          kind: "Arithmetic Mean",
          value: mean,
          style: borderBottomStyle,
          unitSymbol,
        },
      );

      const iqRangeSection = returnMeanRangeSDSection(
        {
          kind: "Interquartile Range",
          value: interquartileRange,
          unitSymbol,
        },
      );

      const stdDeviationSection = returnMeanRangeSDSection(
        {
          kind: "Standard Deviation",
          value: standardDeviation,
          style: borderBottomStyle,
          unitSymbol,
        },
      );

      const statisticsElement = (
        <Stack
          key={`${idx}-${cardsKey}-${calendarView}`}
          w="100%"
        >
          {heading}
          {minSection}
          <Divider size="sm" />
          {maxSection}
          <Divider size="sm" />
          {medianSection}
          <Divider size="sm" />
          {modeSection}
          <Divider size="sm" />
          {meanSection}
          <Divider size="sm" />
          {iqRangeSection}
          <Divider size="sm" />
          {stdDeviationSection}
        </Stack>
      );

      acc.set(cardsKey, statisticsElement);

      return acc;
    }, new Map())
    : new Map();
}

function createFinancialStatisticsElements(
  calendarView: DashboardCalendarView,
  metricCategory: FinancialMetricCategory,
  metricsKind: "pert" | "otherMetrics",
  statisticsMap: Map<string, StatisticsObject>,
  storeLocation: AllStoreLocations,
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
        {
          kind: "Min",
          data: min,
          unitSymbol,
        },
      );

      const maxSection = returnMinMaxSectionElement(
        {
          kind: "Max",
          data: max,
          unitSymbol,
        },
      );

      const medianSection = returnMedianModeSection(
        {
          kind: "Median",
          value: median,
          unitSymbol,
        },
      );

      const modeSection = returnMedianModeSection(
        {
          kind: "Mode",
          value: mode,
          unitSymbol,
        },
      );

      const meanSection = returnMeanRangeSDSection(
        {
          kind: "Arithmetic Mean",
          value: mean,
          unitSymbol,
        },
      );

      const iqRangeSection = returnMeanRangeSDSection(
        {
          kind: "Interquartile Range",
          value: interquartileRange,
          unitSymbol,
        },
      );

      const stdDeviationSection = returnMeanRangeSDSection(
        {
          kind: "Standard Deviation",
          value: standardDeviation,
          unitSymbol,
        },
      );

      const statisticsElement = (
        <Stack
          key={`${idx}-${cardsKey}-${calendarView}`}
          w="100%"
        >
          {heading}
          {minSection}
          <Divider size="sm" />
          {maxSection}
          <Divider size="sm" />
          {medianSection}
          <Divider size="sm" />
          {modeSection}
          <Divider size="sm" />
          {meanSection}
          <Divider size="sm" />
          {iqRangeSection}
          <Divider size="sm" />
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

  return Array.from(cards).reduce((acc, [key, cards], idx) => {
    const statisticElement = statisticsElements.get(key) ?? <></>;
    const statisticsAccordion = (
      <Accordion>
        <Accordion.Item value={`${key}-${idx}`}>
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

    cards.forEach((card, idx) => {
      card.icon = statisticsAccordion;
      const cardElement = returnDashboardCardElement(card);
      acc.set(
        key,
        <React.Fragment
          key={`${idx}-${key}-${card.value}-${card.percentage}-${card.date}`}
        >
          {cardElement}
        </React.Fragment>,
      );
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
  return Array.from(cards).reduce((acc, [key, card], idx) => {
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

function consolidateCardsAndStatisticsModals(
  {
    modalsOpenedState,
    selectedCards,
    setModalsOpenedState,
  }: {
    selectedCards: Map<string, DashboardCardInfo>;
    modalsOpenedState: boolean[];
    setModalsOpenedState: React.Dispatch<React.SetStateAction<boolean[]>>;
  },
): Map<string, React.JSX.Element> {
  return Array.from(selectedCards).reduce((acc, [key, card], idx) => {
    const statisticsAccordion = (
      <AccessibleButton
        attributes={{
          kind: "open",
          leftIcon: modalsOpenedState[idx]
            ? <TbFolderCancel size={20} />
            : <TbFolderOpen size={20} />,
          label: "Statistics",
          onClick: () => {
            setModalsOpenedState((prev) => {
              const newStates = [...prev];
              newStates[idx] = !newStates[idx];
              return newStates;
            });
          },
        }}
      />
    );

    card.icon = statisticsAccordion;
    const cardElement = returnDashboardCardElement({ ...card, idx });

    acc.set(key, cardElement);

    return acc;
  }, new Map());
}

function returnCardElementsForYAxisVariable(
  consolidatedCards: Map<string, React.JSX.Element>,
  yAxisVariable: string,
  yAxisKeyMap: Map<string, Set<string>>,
) {
  /* {Array.from(consolidatedCards).map(([key, card], idx) => {
        const cardsSet = yAxisKeyMap.get(
          yAxisVariable,
        );

        return cardsSet?.has(key)
          ? (
            <React.Fragment key={`${idx}-${key}`}>
              {card}
            </React.Fragment>
          )
          : null;
      })} */

  return Array.from(consolidatedCards).reduce((acc, [key, card], idx) => {
    const cardsSet = yAxisKeyMap.get(
      yAxisVariable,
    );

    if (cardsSet?.has(key)) {
      acc.push(
        // <React.Fragment
        //   key={`${idx}-${key}`}
        // >
        //   {card}
        // </React.Fragment>,
        card,
      );
    }

    return acc;
  }, [] as React.JSX.Element[]);
}

function returnStatisticsModals(
  {
    modalsOpenedState,
    setModalsOpenedState,
    statisticsElementsMap,
    themeColorShade,
  }: {
    modalsOpenedState: boolean[];
    setModalsOpenedState: React.Dispatch<React.SetStateAction<boolean[]>>;
    statisticsElementsMap: Map<string, React.JSX.Element>;
    themeColorShade: string;
  },
) {
  return Array.from(statisticsElementsMap).reduce(
    (acc, entry, idx) => {
      const [key, element] = entry;

      const modal = (
        <Modal
          centered
          closeButtonProps={{ color: themeColorShade }}
          key={`${key}-${idx}-modal`}
          opened={modalsOpenedState[idx]}
          onClose={() =>
            setModalsOpenedState((prev) => {
              const newStates = [...prev];
              newStates[idx] = !newStates[idx];
              return newStates;
            })}
          transitionProps={{
            transition: "fade",
            duration: 200,
            timingFunction: "ease-in-out",
          }}
          maw={400}
          miw={250}
        >
          <Group>{element}</Group>
        </Modal>
      );
      acc.push(modal);

      return acc;
    },
    [] as React.JSX.Element[],
  );
}

function createOverviewMetricCard(
  { calendarView, selectedYYYYMMDD, storeLocationView, subMetric, unit, value }:
    {
      calendarView: DashboardCalendarView;
      selectedYYYYMMDD: string;
      storeLocationView: AllStoreLocations;
      subMetric: string;
      unit: "CAD" | "%" | "Units" | "";
      value: number;
    },
) {
  const [year, month, _day] = selectedYYYYMMDD.split("-");
  const date = calendarView === "Daily"
    ? formatDate({
      date: selectedYYYYMMDD,
      formatOptions: { dateStyle: "long" },
    })
    : calendarView === "Monthly"
    ? `${MONTHS[Number(month) - 1]} ${year}`
    : year;

  return (
    <Card
      className="overview-card"
      padding="lg"
      radius="md"
      withBorder
      shadow="md"
      w={INPUT_WIDTH}
      h={185}
    >
      <Stack align="flex-start" spacing={2}>
        <Text
          size={24}
          weight={500}
        >
          {splitCamelCase(subMetric)}
        </Text>
        <Text size={20} mb={5}>
          {storeLocationView}
        </Text>
        <Text size={16} mb={5}>
          {date}
        </Text>
        <Text
          size={26}
          weight={600}
          style={{ textShadow: TEXT_SHADOW }}
        >
          {addCommaSeparator(value)} {unit}
        </Text>
      </Stack>
    </Card>
  );
}

export {
  consolidateCardsAndStatistics,
  consolidateCardsAndStatisticsModals,
  consolidateCustomerCardsAndStatistics,
  createDashboardMetricsCards,
  createFinancialStatisticsElements,
  createOverviewMetricCard,
  createStatisticsElements,
  returnCardElementsForYAxisVariable,
  returnDashboardCardElement,
  returnStatisticsModals,
};
export type { CreateDashboardMetricsCardsInput, DashboardCardInfo };
