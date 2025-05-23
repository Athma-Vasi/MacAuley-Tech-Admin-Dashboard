import { SafeResult } from "../../../types";
import { createSafeErrorResult, createSafeSuccessResult } from "../../../utils";
import type { DashboardCalendarView } from "../types";
import { createDashboardMetricsCards } from "../utils";
import {
  type CreateDashboardMetricsCardsInput,
  type DashboardCardInfo,
} from "../utilsTSX";
import type {
  CustomerMetricsChurnRetentionChartsKey,
  CustomerMetricsNewReturningChartsKey,
  SelectedDateCustomerMetrics,
} from "./chartsData";
import { CustomerNewReturningYAxisKey } from "./types";

type CreateCustomerMetricsCardsInput = {
  cardBgGradient: string;
  greenColorShade: string;
  redColorShade: string;
  selectedDateCustomerMetrics: SelectedDateCustomerMetrics;
};

type CustomerMetricsCards = {
  dailyCards: {
    overview: DashboardCardInfo[];
    new: DashboardCardInfo[];
    returning: DashboardCardInfo[];
    churnRate: DashboardCardInfo[];
    retentionRate: DashboardCardInfo[];
  };
  monthlyCards: {
    overview: DashboardCardInfo[];
    new: DashboardCardInfo[];
    returning: DashboardCardInfo[];
    churnRate: DashboardCardInfo[];
    retentionRate: DashboardCardInfo[];
  };
  yearlyCards: {
    overview: DashboardCardInfo[];
    new: DashboardCardInfo[];
    returning: DashboardCardInfo[];
    churnRate: DashboardCardInfo[];
    retentionRate: DashboardCardInfo[];
  };
};

function createCustomerMetricsCardsSafe(
  {
    cardBgGradient,
    greenColorShade,
    redColorShade,
    selectedDateCustomerMetrics,
  }: CreateCustomerMetricsCardsInput,
): SafeResult<CustomerMetricsCards> {
  if (!selectedDateCustomerMetrics) {
    return createSafeErrorResult(
      "Selected date customer metrics not found",
    );
  }

  try {
    const {
      dayCustomerMetrics: { prevDayMetrics, selectedDayMetrics },
      monthCustomerMetrics: { prevMonthMetrics, selectedMonthMetrics },
      yearCustomerMetrics: { prevYearMetrics, selectedYearMetrics },
    } = selectedDateCustomerMetrics;

    if (!selectedYearMetrics) {
      return createSafeErrorResult(
        "Selected year metrics not found",
      );
    }
    if (!prevYearMetrics) {
      return createSafeErrorResult(
        "Previous year metrics not found",
      );
    }
    if (!selectedMonthMetrics) {
      return createSafeErrorResult(
        "Selected month metrics not found",
      );
    }
    if (!prevMonthMetrics) {
      return createSafeErrorResult(
        "Previous month metrics not found",
      );
    }
    if (!selectedDayMetrics) {
      return createSafeErrorResult(
        "Selected day metrics not found",
      );
    }
    if (!prevDayMetrics) {
      return createSafeErrorResult(
        "Previous day metrics not found",
      );
    }

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

    // daily -> overview

    const dayTotalCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total",
      kind: "day",
      prevValue: prevDayMetrics.customers.total,
      selectedValue: selectedDayMetrics.customers.total,
    });

    const dayTotalNewCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total New",
      kind: "day",
      prevValue: prevDayMetrics.customers.new.total,
      selectedValue: selectedDayMetrics.customers.new.total,
    });

    const dayTotalReturningCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total Returning",
      kind: "day",
      prevValue: prevDayMetrics.customers.returning.total,
      selectedValue: selectedDayMetrics.customers.returning.total,
    });

    // daily -> new

    // daily new total already created above

    const dayTotalNewRepairCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Repair",
      kind: "day",
      prevValue: prevDayMetrics.customers.new.repair,
      selectedValue: selectedDayMetrics.customers.new.repair,
    });

    const dayTotalNewSalesCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Sales",
      kind: "day",
      prevValue: prevDayMetrics.customers.new.sales.total,
      selectedValue: selectedDayMetrics.customers.new.sales.total,
    });

    const dayTotalNewSalesOnlineCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Sales Online",
      kind: "day",
      prevValue: prevDayMetrics.customers.new.sales.online,
      selectedValue: selectedDayMetrics.customers.new.sales.online,
    });

    const dayTotalNewSalesInStoreCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Sales In-Store",
      kind: "day",
      prevValue: prevDayMetrics.customers.new.sales.inStore,
      selectedValue: selectedDayMetrics.customers.new.sales.inStore,
    });

    // daily -> returning

    // daily returning total already created above

    const dayTotalReturningRepairCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Repair",
      kind: "day",
      prevValue: prevDayMetrics.customers.returning.repair,
      selectedValue: selectedDayMetrics.customers.returning.repair,
    });

    const dayTotalReturningSalesCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Sales",
      kind: "day",
      prevValue: prevDayMetrics.customers.returning.sales.total,
      selectedValue: selectedDayMetrics.customers.returning.sales.total,
    });

    const dayTotalReturningSalesOnlineCustomersCard =
      createDashboardMetricsCards(
        {
          ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
          heading: "Sales Online",
          kind: "day",
          prevValue: prevDayMetrics.customers.returning.sales.online,
          selectedValue: selectedDayMetrics.customers.returning.sales.online,
        },
      );

    const dayTotalReturningSalesInStoreCustomersCard =
      createDashboardMetricsCards({
        ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
        heading: "Sales In-Store",
        kind: "day",
        prevValue: prevDayMetrics.customers.returning.sales.inStore,
        selectedValue: selectedDayMetrics.customers.returning.sales.inStore,
      });

    // daily -> churn rate
    const dayChurnRateCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Churn Rate",
      isFlipColor: true,
      kind: "day",
      prevValue: prevDayMetrics.customers.churnRate,
      selectedValue: selectedDayMetrics.customers.churnRate,
      isDisplayValueAsPercentage: true,
    });

    // daily -> retention rate
    const dayRetentionRateCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Retention Rate",
      kind: "day",
      prevValue: prevDayMetrics.customers.retentionRate,
      selectedValue: selectedDayMetrics.customers.retentionRate,
      isDisplayValueAsPercentage: true,
    });

    // month

    // month -> overview

    const monthTotalCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total",
      kind: "month",
      prevValue: prevMonthMetrics.customers.total,
      selectedValue: selectedMonthMetrics.customers.total,
    });

    const monthTotalNewCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total New",
      kind: "month",
      prevValue: prevMonthMetrics.customers.new.total,
      selectedValue: selectedMonthMetrics.customers.new.total,
    });

    const monthTotalReturningCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total Returning",
      kind: "month",
      prevValue: prevMonthMetrics.customers.returning.total,
      selectedValue: selectedMonthMetrics.customers.returning.total,
    });

    // month -> new

    // month new total already created above

    const monthTotalNewRepairCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Repair",
      kind: "month",
      prevValue: prevMonthMetrics.customers.new.repair,
      selectedValue: selectedMonthMetrics.customers.new.repair,
    });

    const monthTotalNewSalesCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Sales",
      kind: "month",
      prevValue: prevMonthMetrics.customers.new.sales.total,
      selectedValue: selectedMonthMetrics.customers.new.sales.total,
    });

    const monthTotalNewSalesOnlineCustomersCard = createDashboardMetricsCards(
      {
        ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
        heading: "Sales Online",
        kind: "month",
        prevValue: prevMonthMetrics.customers.new.sales.online,
        selectedValue: selectedMonthMetrics.customers.new.sales.online,
      },
    );

    const monthTotalNewSalesInStoreCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Sales In-Store",
      kind: "month",
      prevValue: prevMonthMetrics.customers.new.sales.inStore,
      selectedValue: selectedMonthMetrics.customers.new.sales.inStore,
    });

    // month -> returning

    // month returning total already created above

    const monthTotalReturningRepairCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Repair",
      kind: "month",
      prevValue: prevMonthMetrics.customers.returning.repair,
      selectedValue: selectedMonthMetrics.customers.returning.repair,
    });

    const monthTotalReturningSalesCustomersCard = createDashboardMetricsCards(
      {
        ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
        heading: "Sales",
        kind: "month",
        prevValue: prevMonthMetrics.customers.returning.sales.total,
        selectedValue: selectedMonthMetrics.customers.returning.sales.total,
      },
    );

    const monthTotalReturningSalesOnlineCustomersCard =
      createDashboardMetricsCards({
        ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
        heading: "Sales Online",
        kind: "month",
        prevValue: prevMonthMetrics.customers.returning.sales.online,
        selectedValue: selectedMonthMetrics.customers.returning.sales.online,
      });

    const monthTotalReturningSalesInStoreCustomersCard =
      createDashboardMetricsCards({
        ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
        heading: "Sales In-Store",
        kind: "month",
        prevValue: prevMonthMetrics.customers.returning.sales.inStore,
        selectedValue: selectedMonthMetrics.customers.returning.sales.inStore,
      });

    // month -> churn rate
    const monthChurnRateCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Churn Rate",
      isFlipColor: true,
      kind: "month",
      prevValue: prevMonthMetrics.customers.churnRate,
      selectedValue: selectedMonthMetrics.customers.churnRate,
      isDisplayValueAsPercentage: true,
    });

    // month -> retention rate
    const monthRetentionRateCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Retention Rate",
      kind: "month",
      prevValue: prevMonthMetrics.customers.retentionRate,
      selectedValue: selectedMonthMetrics.customers.retentionRate,
      isDisplayValueAsPercentage: true,
    });

    // year

    // year -> overview

    const yearTotalCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total",
      kind: "year",
      prevValue: prevYearMetrics.customers.total,
      selectedValue: selectedYearMetrics.customers.total,
    });

    const yearTotalNewCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total New",
      kind: "year",
      prevValue: prevYearMetrics.customers.new.total,
      selectedValue: selectedYearMetrics.customers.new.total,
    });

    const yearTotalReturningCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Total Returning",
      kind: "year",
      prevValue: prevYearMetrics.customers.returning.total,
      selectedValue: selectedYearMetrics.customers.returning.total,
    });

    // year -> new

    // year new total already created above

    const yearTotalNewRepairCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Repair",
      kind: "year",
      prevValue: prevYearMetrics.customers.new.repair,
      selectedValue: selectedYearMetrics.customers.new.repair,
    });

    const yearTotalNewSalesCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Sales",
      kind: "year",
      prevValue: prevYearMetrics.customers.new.sales.total,
      selectedValue: selectedYearMetrics.customers.new.sales.total,
    });

    const yearTotalNewSalesOnlineCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Sales Online",
      kind: "year",
      prevValue: prevYearMetrics.customers.new.sales.online,
      selectedValue: selectedYearMetrics.customers.new.sales.online,
    });

    const yearTotalNewSalesInStoreCustomersCard = createDashboardMetricsCards(
      {
        ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
        heading: "Sales In-Store",
        kind: "year",
        prevValue: prevYearMetrics.customers.new.sales.inStore,
        selectedValue: selectedYearMetrics.customers.new.sales.inStore,
      },
    );

    // year -> returning

    // year returning total already created above

    const yearTotalReturningRepairCustomersCard = createDashboardMetricsCards(
      {
        ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
        heading: "Repair",
        kind: "year",
        prevValue: prevYearMetrics.customers.returning.repair,
        selectedValue: selectedYearMetrics.customers.returning.repair,
      },
    );

    const yearTotalReturningSalesCustomersCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Sales",
      kind: "year",
      prevValue: prevYearMetrics.customers.returning.sales.total,
      selectedValue: selectedYearMetrics.customers.returning.sales.total,
    });

    const yearTotalReturningSalesOnlineCustomersCard =
      createDashboardMetricsCards({
        ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
        heading: "Sales Online",
        kind: "year",
        prevValue: prevYearMetrics.customers.returning.sales.online,
        selectedValue: selectedYearMetrics.customers.returning.sales.online,
      });

    const yearTotalReturningSalesInStoreCustomersCard =
      createDashboardMetricsCards({
        ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
        heading: "Sales In-Store",
        kind: "year",
        prevValue: prevYearMetrics.customers.returning.sales.inStore,
        selectedValue: selectedYearMetrics.customers.returning.sales.inStore,
      });

    // year -> churn rate
    const yearChurnRateCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Churn Rate",
      isFlipColor: true,
      kind: "year",
      prevValue: prevYearMetrics.customers.churnRate,
      selectedValue: selectedYearMetrics.customers.churnRate,
      isDisplayValueAsPercentage: true,
    });

    // year -> retention rate
    const yearRetentionRateCard = createDashboardMetricsCards({
      ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
      heading: "Retention Rate",
      kind: "year",
      prevValue: prevYearMetrics.customers.retentionRate,
      selectedValue: selectedYearMetrics.customers.retentionRate,
      isDisplayValueAsPercentage: true,
    });

    return createSafeSuccessResult({
      dailyCards: {
        overview: [
          dayTotalCustomersCard,
          dayTotalNewCustomersCard,
          dayTotalReturningCustomersCard,
        ],
        new: [
          dayTotalNewCustomersCard,
          dayTotalNewRepairCustomersCard,
          dayTotalNewSalesCustomersCard,
          dayTotalNewSalesOnlineCustomersCard,
          dayTotalNewSalesInStoreCustomersCard,
        ],
        returning: [
          dayTotalReturningCustomersCard,
          dayTotalReturningRepairCustomersCard,
          dayTotalReturningSalesCustomersCard,
          dayTotalReturningSalesOnlineCustomersCard,
          dayTotalReturningSalesInStoreCustomersCard,
        ],
        churnRate: [dayChurnRateCard],
        retentionRate: [dayRetentionRateCard],
      },
      monthlyCards: {
        overview: [
          monthTotalCustomersCard,
          monthTotalNewCustomersCard,
          monthTotalReturningCustomersCard,
        ],
        new: [
          monthTotalNewCustomersCard,
          monthTotalNewRepairCustomersCard,
          monthTotalNewSalesCustomersCard,
          monthTotalNewSalesOnlineCustomersCard,
          monthTotalNewSalesInStoreCustomersCard,
        ],
        returning: [
          monthTotalReturningCustomersCard,
          monthTotalReturningRepairCustomersCard,
          monthTotalReturningSalesCustomersCard,
          monthTotalReturningSalesOnlineCustomersCard,
          monthTotalReturningSalesInStoreCustomersCard,
        ],
        churnRate: [monthChurnRateCard],
        retentionRate: [monthRetentionRateCard],
      },
      yearlyCards: {
        overview: [
          yearTotalCustomersCard,
          yearTotalNewCustomersCard,
          yearTotalReturningCustomersCard,
        ],
        new: [
          yearTotalNewCustomersCard,
          yearTotalNewRepairCustomersCard,
          yearTotalNewSalesCustomersCard,
          yearTotalNewSalesOnlineCustomersCard,
          yearTotalNewSalesInStoreCustomersCard,
        ],
        returning: [
          yearTotalReturningCustomersCard,
          yearTotalReturningRepairCustomersCard,
          yearTotalReturningSalesCustomersCard,
          yearTotalReturningSalesOnlineCustomersCard,
          yearTotalReturningSalesInStoreCustomersCard,
        ],
        churnRate: [yearChurnRateCard],
        retentionRate: [yearRetentionRateCard],
      },
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

function returnCalendarViewCustomerCards(
  calendarView: DashboardCalendarView,
  customerMetricsCards: CustomerMetricsCards,
) {
  return calendarView === "Daily"
    ? customerMetricsCards.dailyCards
    : calendarView === "Monthly"
    ? customerMetricsCards.monthlyCards
    : customerMetricsCards.yearlyCards;
}

function returnCustomerMetricsCardsMap(
  {
    calendarView,
    customerMetricsCards,
    customerYAxisKeyToCardsKeyMap,
    yAxisKey,
  }: {
    calendarView: DashboardCalendarView;
    customerMetricsCards: CustomerMetricsCards;
    customerYAxisKeyToCardsKeyMap: Map<
      | CustomerMetricsNewReturningChartsKey
      | CustomerMetricsChurnRetentionChartsKey,
      Set<string>
    >;
    yAxisKey:
      | CustomerNewReturningYAxisKey
      | CustomerMetricsChurnRetentionChartsKey;
  },
) {
  const cards = calendarView === "Daily"
    ? customerMetricsCards.dailyCards
    : calendarView === "Monthly"
    ? customerMetricsCards.monthlyCards
    : customerMetricsCards.yearlyCards;

  return Object.entries(cards).reduce(
    (acc, [key, cards]) => {
      const cardsSet = customerYAxisKeyToCardsKeyMap.get(
        yAxisKey,
      );

      if (key === "churnRate" || key === "retentionRate") {
        const churnRetentionMap = acc.get("churn") ?? new Map();

        cards.forEach((card) => {
          const heading = card.heading ?? "Churn Rate";
          card.isActive = cardsSet?.has(heading) ?? false;
          churnRetentionMap.set(heading, card);
        });
      } else if (key === "new") {
        const newMap = acc.get("new") ?? new Map();
        cards.forEach((card) => {
          const heading = card.heading ?? "Total New";
          card.isActive = cardsSet?.has(heading) ?? false;
          newMap.set(heading, card);
        });
      } else if (key === "returning") {
        const returningMap = acc.get("returning") ?? new Map();
        cards.forEach((card) => {
          const heading = card.heading ?? "Total Returning";
          card.isActive = cardsSet?.has(heading) ?? false;
          returningMap.set(heading, card);
        });
      }

      return acc;
    },
    new Map<string, Map<string, DashboardCardInfo[]>>([
      ["churn", new Map()],
      ["new", new Map()],
      ["returning", new Map()],
    ]),
  );
}

export {
  createCustomerMetricsCardsSafe,
  returnCalendarViewCustomerCards,
  returnCustomerMetricsCardsMap,
};
export type { CustomerMetricsCards };
