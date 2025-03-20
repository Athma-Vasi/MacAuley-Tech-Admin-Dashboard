import { DashboardCalendarView } from "../types";
import {
  createDashboardMetricsCards,
  type CreateDashboardMetricsCardsInput,
  type DashboardCardInfo,
} from "../utilsTSX";
import type { SelectedDateRepairMetrics } from "./chartsData";

type createRepairMetricsCardsInput = {
  greenColorShade: string;
  redColorShade: string;
  selectedDateRepairMetrics: SelectedDateRepairMetrics;
};

type RepairMetricsCards = {
  dailyCards: DashboardCardInfo[];
  monthlyCards: DashboardCardInfo[];
  yearlyCards: DashboardCardInfo[];
};

function createRepairMetricsCards({
  greenColorShade,
  redColorShade,
  selectedDateRepairMetrics,
}: createRepairMetricsCardsInput): Promise<RepairMetricsCards> {
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
  repairMetricsCards: RepairMetricsCards,
  calendarView: DashboardCalendarView,
) {
  const cards = calendarView === "Daily"
    ? repairMetricsCards.dailyCards
    : calendarView === "Monthly"
    ? repairMetricsCards.monthlyCards
    : repairMetricsCards.yearlyCards;

  return cards.reduce((acc, card) => {
    const { heading = "Revenue" } = card;
    acc.set(heading, card);

    return acc;
  }, new Map());
}

export { createRepairMetricsCards, returnRepairMetricsCards };
export type { RepairMetricsCards };
