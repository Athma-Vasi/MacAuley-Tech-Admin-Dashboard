import {
  Card,
  Center,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import type { ReactNode } from "react";

import React from "react";
import { TbFolderCancel, TbFolderOpen } from "react-icons/tb";
import { INPUT_WIDTH, TEXT_SHADOW } from "../../constants";
import {
  addCommaSeparator,
  formatDate,
  splitCamelCase,
  StatisticsObject,
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

type DashboardCardInfo = {
  date?: string;
  grayBorderShade: string;
  heading?: string;
  icon: ReactNode;
  idx?: number;
  isActive?: boolean;
  percentage?: string;
  deltaTextColor?: string;
  value: string | number;
};
function returnDashboardCardElement(
  {
    date,
    grayBorderShade,
    heading,
    icon,
    idx,
    isActive,
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
    <Group w="100%" position="center">
      <Text
        size={28}
        weight={600}
        style={{ textShadow: TEXT_SHADOW }}
      >
        {value}
      </Text>
    </Group>
  );

  const displayPercentage = (
    <Text size={18} italic color={deltaTextColor}>
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
      className={`statistics-card c${idx ?? 0} ${isActive ? "active" : ""}`}
      data-testid={`statistics-card-${heading}`}
      style={{ border: `1px solid ${grayBorderShade}` }}
    >
      {cardHeading}
      {cardBody}
      {cardFooter}
    </div>
  );

  return createdChartCard;
}

type CreateDashboardMetricsCardsInput = {
  currentMonth: string;
  currentYear: string;
  grayBorderShade: string;
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
          <Text size="md">{kind}:</Text>
        </Group>
        <Group position="left">
          <Text size="md">
            {`${unitSymbol === "%" ? "" : unitSymbol} ${
              addCommaSeparator(data.value.toFixed(2))
            } ${unitSymbol === "%" ? "%" : ""}`}
          </Text>
        </Group>
      </GoldenGrid>

      <GoldenGrid>
        <Group position="right">
          <Text size="md">Occurred:</Text>
        </Group>
        <Group position="left">
          <Text size="md">{data.occurred}</Text>
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
        <Text size="md">{kind}:</Text>
      </Group>
      <Group position="left">
        <Text size="md">
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
          <Text size="md">{firstWord}</Text>
        </Group>
        <Group position="right">
          <Text size="md">{lastWord}:</Text>
        </Group>
      </Stack>
      <Group position="left">
        <Text size="md">
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
          <Text weight={600} size={22}>
            {`${calendarView} ${cardsKey} ${
              splitCamelCase(metricCategory)
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
          <Text weight={600} size={22}>
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

function consolidateCardsAndStatisticsModals(
  {
    modalsOpenedState,
    selectedCards,
    setModalsOpenedState,
  }: {
    selectedCards: Map<string, DashboardCardInfo>;
    modalsOpenedState: Map<string, boolean>;
    setModalsOpenedState: React.Dispatch<
      React.SetStateAction<Map<string, boolean>>
    >;
  },
): Map<string, React.JSX.Element> {
  return Array.from(selectedCards).reduce((acc, [key, card], idx) => {
    const statisticsButton = (
      <AccessibleButton
        attributes={{
          dataTestId: `statistics-button-${key}`,
          kind: "open",
          leftIcon: modalsOpenedState.get(key)
            ? <TbFolderCancel size={20} />
            : <TbFolderOpen size={20} />,
          label: "Statistics",
          onClick: () => {
            setModalsOpenedState((prev) => {
              const newStates = new Map(prev);
              newStates.set(key, !newStates.get(key));
              return newStates;
            });
          },
        }}
        uniqueId={`${key}-${idx}-${card.value}-${card.percentage}-${card.date}`}
      />
    );

    card.icon = statisticsButton;
    const cardElement = returnDashboardCardElement({ ...card, idx });
    acc.set(key, cardElement);

    return acc;
  }, new Map());
}

function returnCardElementsForYAxisVariable(
  consolidatedCards: Map<string, React.JSX.Element>,
  yAxisKey: string,
  yAxisKeyMap: Map<string, Set<string>>,
) {
  return Array.from(consolidatedCards).reduce((acc, [key, card]) => {
    const cardsSet = yAxisKeyMap.get(
      yAxisKey,
    );

    if (cardsSet?.has(key)) {
      acc.push(
        <React.Fragment key={`${key}-fragment`}>
          {card}
        </React.Fragment>,
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
    modalsOpenedState: Map<string, boolean>;
    setModalsOpenedState: React.Dispatch<
      React.SetStateAction<Map<string, boolean>>
    >;
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
          opened={modalsOpenedState.get(key) ?? false}
          onClose={() =>
            setModalsOpenedState((prev) => {
              const newStates = new Map(prev);
              newStates.set(key, !newStates.get(key));
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
          <Group data-testid={`statistics-modal-${key}`}>{element}</Group>
        </Modal>
      );
      acc.push(modal);

      return acc;
    },
    [] as React.JSX.Element[],
  );
}

function createOverviewMetricCard(
  { calendarView, selectedYYYYMMDD, storeLocation, subMetric, unit, value }: {
    calendarView: DashboardCalendarView;
    selectedYYYYMMDD: string;
    storeLocation: AllStoreLocations;
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
          {storeLocation}
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
  consolidateCardsAndStatisticsModals,
  createFinancialStatisticsElements,
  createOverviewMetricCard,
  createStatisticsElements,
  returnCardElementsForYAxisVariable,
  returnDashboardCardElement,
  returnStatisticsModals,
};
export type { CreateDashboardMetricsCardsInput, DashboardCardInfo };
