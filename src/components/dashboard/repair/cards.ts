import { DashboardCalendarView } from "../types";
import {
  createDashboardMetricsCards,
  type CreateDashboardMetricsCardsInput,
  type DashboardCardInfo,
} from "../utilsTSX";
import type { SelectedDateRepairMetrics } from "./chartsData";
import { RepairSubMetric } from "./types";

type createRepairMetricsCardsInput = {
  cardBgGradient: string;
  greenColorShade: string;
  redColorShade: string;
  selectedDateRepairMetrics: SelectedDateRepairMetrics;
};

type RepairMetricsCards = {
  dailyCards: DashboardCardInfo[];
  monthlyCards: DashboardCardInfo[];
  yearlyCards: DashboardCardInfo[];
};

function createRepairMetricsCards(
  { cardBgGradient, greenColorShade, redColorShade, selectedDateRepairMetrics }:
    createRepairMetricsCardsInput,
): Promise<RepairMetricsCards> {
  const {
    dayRepairMetrics: { prevDayMetrics, selectedDayMetrics },
    monthRepairMetrics: { prevMonthMetrics, selectedMonthMetrics },
    yearRepairMetrics: { prevYearMetrics, selectedYearMetrics },
  } = selectedDateRepairMetrics;

  if (
    !selectedYearMetrics ||
    !prevYearMetrics ||
    !selectedMonthMetrics ||
    !prevMonthMetrics ||
    !selectedDayMetrics ||
    !prevDayMetrics
  ) {
    return new Promise<RepairMetricsCards>((resolve) => {
      resolve({
        dailyCards: [],
        monthlyCards: [],
        yearlyCards: [],
      });
    });
  }

  return new Promise<RepairMetricsCards>((resolve) => {
    setTimeout(() => {
      const currentYear = selectedYearMetrics.year;
      const prevYear = prevYearMetrics.year;
      const currentMonth = selectedMonthMetrics.month;
      const prevMonth = prevMonthMetrics.month;
      const prevDay = prevDayMetrics.day;

      const DASHBOARD_CARD_TEMPLATE: CreateDashboardMetricsCardsInput = {
        cardBgGradient,
        currentMonth,
        currentYear,
        greenColorShade,
        heading: "Revenue",
        kind: "day",
        prevDay,
        prevMonth,
        prevValue: 1,
        prevYear,
        redColorShade,
        selectedValue: 1,
      };

      const dayRevenueCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        isDisplayValueAsCurrency: true,
        prevValue: prevDayMetrics.revenue,
        selectedValue: selectedDayMetrics.revenue,
      });

      const dayUnitsRepairedCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Units Repaired",
        prevValue: prevDayMetrics.unitsRepaired,
        selectedValue: selectedDayMetrics.unitsRepaired,
      });

      const monthRevenueCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        kind: "month",
        isDisplayValueAsCurrency: true,
        prevValue: prevMonthMetrics.revenue,
        selectedValue: selectedMonthMetrics.revenue,
      });

      const monthUnitsRepairedCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Units Repaired",
        kind: "month",
        prevValue: prevMonthMetrics.unitsRepaired,
        selectedValue: selectedMonthMetrics.unitsRepaired,
      });

      const yearRevenueCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        kind: "year",
        isDisplayValueAsCurrency: true,
        prevValue: prevYearMetrics.revenue,
        selectedValue: selectedYearMetrics.revenue,
      });

      const yearUnitsRepairedCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Units Repaired",
        kind: "year",
        prevValue: prevYearMetrics.unitsRepaired,
        selectedValue: selectedYearMetrics.unitsRepaired,
      });

      resolve({
        dailyCards: [dayRevenueCardInfo, dayUnitsRepairedCardInfo],
        monthlyCards: [monthRevenueCardInfo, monthUnitsRepairedCardInfo],
        yearlyCards: [yearRevenueCardInfo, yearUnitsRepairedCardInfo],
      });
    }, 0);
  });
}

function returnRepairMetricsCards(
  { calendarView, repairMetricsCards, repairYAxisKeyToCardsKeyMap, yAxisKey }: {
    calendarView: DashboardCalendarView;
    repairMetricsCards: RepairMetricsCards;
    repairYAxisKeyToCardsKeyMap: Map<RepairSubMetric, Set<string>>;
    yAxisKey: RepairSubMetric;
  },
) {
  const cards = calendarView === "Daily"
    ? repairMetricsCards.dailyCards
    : calendarView === "Monthly"
    ? repairMetricsCards.monthlyCards
    : repairMetricsCards.yearlyCards;

  const cardsSet = repairYAxisKeyToCardsKeyMap.get(
    yAxisKey,
  );

  return cards.reduce((acc, card) => {
    const { heading = "Revenue" } = card;
    card.isActive = cardsSet?.has(heading) ?? false;
    acc.set(heading, card);

    return acc;
  }, new Map());
}

export { createRepairMetricsCards, returnRepairMetricsCards };
export type { RepairMetricsCards };
