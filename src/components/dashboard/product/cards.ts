import { Err, Some } from "ts-results";
import { SafeBoxResult } from "../../../types";
import { createSafeBoxResult } from "../../../utils";
import { DashboardCalendarView } from "../types";
import { createDashboardMetricsCards } from "../utils";
import {
  type CreateDashboardMetricsCardsInput,
  type DashboardCardInfo,
} from "../utilsTSX";
import type {
  ProductMetricsChartKey,
  SelectedDateProductMetrics,
} from "./chartsData";
import { ProductSubMetric } from "./types";

type createProductMetricsCardsInput = {
  cardBgGradient: string;
  greenColorShade: string;
  redColorShade: string;
  selectedDateProductMetrics: SelectedDateProductMetrics;
};

type ProductMetricsCards = {
  dailyCards: {
    revenue: DashboardCardInfo[];
    unitsSold: DashboardCardInfo[];
  };
  monthlyCards: {
    revenue: DashboardCardInfo[];
    unitsSold: DashboardCardInfo[];
  };
  yearlyCards: {
    revenue: DashboardCardInfo[];
    unitsSold: DashboardCardInfo[];
  };
};

function createProductMetricsCardsSafe(
  {
    cardBgGradient,
    greenColorShade,
    redColorShade,
    selectedDateProductMetrics,
  }: createProductMetricsCardsInput,
): SafeBoxResult<ProductMetricsCards> {
  const productMetricsCardsTemplate: ProductMetricsCards = {
    dailyCards: {
      revenue: [],
      unitsSold: [],
    },
    monthlyCards: {
      revenue: [],
      unitsSold: [],
    },
    yearlyCards: {
      revenue: [],
      unitsSold: [],
    },
  };

  if (!selectedDateProductMetrics) {
    return createSafeBoxResult({
      data: Some(productMetricsCardsTemplate),
    });
  }

  const {
    dayProductMetrics: { prevDayMetrics, selectedDayMetrics },
    monthProductMetrics: { prevMonthMetrics, selectedMonthMetrics },
    yearProductMetrics: { prevYearMetrics, selectedYearMetrics },
  } = selectedDateProductMetrics;

  if (
    !selectedYearMetrics ||
    !prevYearMetrics ||
    !selectedMonthMetrics ||
    !prevMonthMetrics ||
    !selectedDayMetrics ||
    !prevDayMetrics
  ) {
    return createSafeBoxResult({
      data: Some(productMetricsCardsTemplate),
    });
  }

  try {
    const currentYear = selectedYearMetrics.year;
    const prevYear = prevYearMetrics.year;
    const currentMonth = selectedMonthMetrics.month;
    const prevMonth = prevMonthMetrics.month;
    const prevDay = prevDayMetrics.day;

    const DASHBOARD_CARD_INFO_INPUT_TEMPLATE: CreateDashboardMetricsCardsInput =
      {
        cardBgGradient,
        currentMonth,
        currentYear,
        greenColorShade,
        heading: "Total",
        kind: "day",
        prevDay,
        prevMonth,
        prevValue: 1,
        prevYear,
        redColorShade,
        selectedValue: 1,
      };

    // daily

    const dayRevenueTotalCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      isDisplayValueAsCurrency: true,
      prevValue: prevDayMetrics.revenue.total,
      selectedValue: selectedDayMetrics.revenue.total,
    });

    const dayRevenueInStoreCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "In-Store",
      isDisplayValueAsCurrency: true,
      prevValue: prevDayMetrics.revenue.inStore,
      selectedValue: selectedDayMetrics.revenue.inStore,
    });

    const dayRevenueOnlineCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Online",
      isDisplayValueAsCurrency: true,
      prevValue: prevDayMetrics.revenue.online,
      selectedValue: selectedDayMetrics.revenue.online,
    });

    const dayUnitsSoldTotalCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total",
      prevValue: prevDayMetrics.unitsSold.total,
      selectedValue: selectedDayMetrics.unitsSold.total,
    });

    const dayUnitsSoldInStoreCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "In-Store",
      prevValue: prevDayMetrics.unitsSold.inStore,
      selectedValue: selectedDayMetrics.unitsSold.inStore,
    });

    const dayUnitsSoldOnlineCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Online",
      prevValue: prevDayMetrics.unitsSold.online,
      selectedValue: selectedDayMetrics.unitsSold.online,
    });

    // monthly

    const monthRevenueTotalCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      isDisplayValueAsCurrency: true,
      kind: "month",
      prevValue: prevMonthMetrics.revenue.total,
      selectedValue: selectedMonthMetrics.revenue.total,
    });

    const monthRevenueInStoreCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      isDisplayValueAsCurrency: true,
      heading: "In-Store",
      kind: "month",
      prevValue: prevMonthMetrics.revenue.inStore,
      selectedValue: selectedMonthMetrics.revenue.inStore,
    });

    const monthRevenueOnlineCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      isDisplayValueAsCurrency: true,
      heading: "Online",
      kind: "month",
      prevValue: prevMonthMetrics.revenue.online,
      selectedValue: selectedMonthMetrics.revenue.online,
    });

    const monthUnitsSoldTotalCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total",
      kind: "month",
      prevValue: prevMonthMetrics.unitsSold.total,
      selectedValue: selectedMonthMetrics.unitsSold.total,
    });

    const monthUnitsSoldInStoreCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "In-Store",
      kind: "month",
      prevValue: prevMonthMetrics.unitsSold.inStore,
      selectedValue: selectedMonthMetrics.unitsSold.inStore,
    });

    const monthUnitsSoldOnlineCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Online",
      kind: "month",
      prevValue: prevMonthMetrics.unitsSold.online,
      selectedValue: selectedMonthMetrics.unitsSold.online,
    });

    // yearly

    const yearRevenueTotalCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      isDisplayValueAsCurrency: true,
      kind: "year",
      prevValue: prevYearMetrics.revenue.total,
      selectedValue: selectedYearMetrics.revenue.total,
    });

    const yearRevenueInStoreCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "In-Store",
      isDisplayValueAsCurrency: true,
      kind: "year",
      prevValue: prevYearMetrics.revenue.inStore,
      selectedValue: selectedYearMetrics.revenue.inStore,
    });

    const yearRevenueOnlineCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Online",
      isDisplayValueAsCurrency: true,
      kind: "year",
      prevValue: prevYearMetrics.revenue.online,
      selectedValue: selectedYearMetrics.revenue.online,
    });

    const yearUnitsSoldTotalCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total",
      kind: "year",
      prevValue: prevYearMetrics.unitsSold.total,
      selectedValue: selectedYearMetrics.unitsSold.total,
    });

    const yearUnitsSoldInStoreCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "In-Store",
      kind: "year",
      prevValue: prevYearMetrics.unitsSold.inStore,
      selectedValue: selectedYearMetrics.unitsSold.inStore,
    });

    const yearUnitsSoldOnlineCardInfo = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Online",
      kind: "year",
      prevValue: prevYearMetrics.unitsSold.online,
      selectedValue: selectedYearMetrics.unitsSold.online,
    });

    return createSafeBoxResult({
      data: Some({
        dailyCards: {
          revenue: [
            dayRevenueTotalCardInfo,
            dayRevenueInStoreCardInfo,
            dayRevenueOnlineCardInfo,
          ],
          unitsSold: [
            dayUnitsSoldTotalCardInfo,
            dayUnitsSoldInStoreCardInfo,
            dayUnitsSoldOnlineCardInfo,
          ],
        },
        monthlyCards: {
          revenue: [
            monthRevenueTotalCardInfo,
            monthRevenueInStoreCardInfo,
            monthRevenueOnlineCardInfo,
          ],
          unitsSold: [
            monthUnitsSoldTotalCardInfo,
            monthUnitsSoldInStoreCardInfo,
            monthUnitsSoldOnlineCardInfo,
          ],
        },
        yearlyCards: {
          revenue: [
            yearRevenueTotalCardInfo,
            yearRevenueInStoreCardInfo,
            yearRevenueOnlineCardInfo,
          ],
          unitsSold: [
            yearUnitsSoldTotalCardInfo,
            yearUnitsSoldInStoreCardInfo,
            yearUnitsSoldOnlineCardInfo,
          ],
        },
      }),
      kind: "success",
    });
  } catch (error: unknown) {
    return new Err({
      data: Some(
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Unknown error",
      ),
      kind: "error",
    });
  }
}

function returnProductMetricsCards(
  {
    calendarView,
    productMetricsCards,
    productYAxisKeyToCardsKeyMap,
    subMetric,
    yAxisKey,
  }: {
    calendarView: DashboardCalendarView;
    productMetricsCards: ProductMetricsCards;
    productYAxisKeyToCardsKeyMap: Map<ProductMetricsChartKey, Set<string>>;
    subMetric: ProductSubMetric;
    yAxisKey: ProductMetricsChartKey;
  },
) {
  const cards = calendarView === "Daily"
    ? productMetricsCards.dailyCards[subMetric]
    : calendarView === "Monthly"
    ? productMetricsCards.monthlyCards[subMetric]
    : productMetricsCards.yearlyCards[subMetric];

  const cardsSet = productYAxisKeyToCardsKeyMap.get(
    yAxisKey,
  );

  return cards.reduce((acc, card) => {
    const { heading = "Total" } = card;
    card.isActive = cardsSet?.has(heading) ?? false;

    acc.set(heading, card);

    return acc;
  }, new Map());
}

export { createProductMetricsCardsSafe, returnProductMetricsCards };
export type { ProductMetricsCards };
