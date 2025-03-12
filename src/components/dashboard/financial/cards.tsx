import type { DashboardCalendarView } from "../types";
import {
  createDashboardMetricsCards,
  type CreateDashboardMetricsCardsInput,
  type DashboardCardInfo,
} from "../utilsTSX";
import type { SelectedDateFinancialMetrics } from "./chartsData";

type CreateFinancialMetricsCardsInput = {
  selectedDateFinancialMetrics: SelectedDateFinancialMetrics;
  greenColorShade: string;
  redColorShade: string;
  width: number;
};

type FinancialMetricsCards = {
  dailyCards: {
    profit: DashboardCardInfo[];
    expenses: DashboardCardInfo[];
    transactions: DashboardCardInfo[];
    revenue: DashboardCardInfo[];
    otherMetrics: DashboardCardInfo[];
  };
  monthlyCards: {
    profit: DashboardCardInfo[];
    expenses: DashboardCardInfo[];
    transactions: DashboardCardInfo[];
    revenue: DashboardCardInfo[];
    otherMetrics: DashboardCardInfo[];
  };
  yearlyCards: {
    profit: DashboardCardInfo[];
    expenses: DashboardCardInfo[];
    transactions: DashboardCardInfo[];
    revenue: DashboardCardInfo[];
    otherMetrics: DashboardCardInfo[];
  };
};

function createFinancialMetricsCards({
  selectedDateFinancialMetrics,
  greenColorShade,
  redColorShade,
  width,
}: CreateFinancialMetricsCardsInput): Promise<FinancialMetricsCards> {
  const {
    dayFinancialMetrics: { prevDayMetrics, selectedDayMetrics },
    monthFinancialMetrics: { prevMonthMetrics, selectedMonthMetrics },
    yearFinancialMetrics: { prevYearMetrics, selectedYearMetrics },
  } = selectedDateFinancialMetrics;

  if (
    !selectedYearMetrics ||
    !prevYearMetrics ||
    !selectedMonthMetrics ||
    !prevMonthMetrics ||
    !selectedDayMetrics ||
    !prevDayMetrics
  ) {
    return new Promise<FinancialMetricsCards>((resolve) => {
      resolve({
        dailyCards: {
          profit: [],
          expenses: [],
          transactions: [],
          revenue: [],
          otherMetrics: [],
        },
        monthlyCards: {
          profit: [],
          expenses: [],
          transactions: [],
          revenue: [],
          otherMetrics: [],
        },
        yearlyCards: {
          profit: [],
          expenses: [],
          transactions: [],
          revenue: [],
          otherMetrics: [],
        },
      });
    });
  }

  return new Promise<FinancialMetricsCards>((resolve) => {
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
        heading: "Total",
        kind: "day",
        prevDay,
        prevMonth,
        prevValue: 1,
        prevYear,
        redColorShade,
        selectedValue: 1,
        width,
      };

      // daily

      // daily -> profit

      const dayProfitTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.profit.total,
        selectedValue: selectedDayMetrics.profit.total,
      });

      const dayProfitRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.profit.repair,
        selectedValue: selectedDayMetrics.profit.repair,
      });

      const dayProfitSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.profit.sales.total,
        selectedValue: selectedDayMetrics.profit.sales.total,
      });

      const dayProfitSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.profit.sales.online,
        selectedValue: selectedDayMetrics.profit.sales.online,
      });

      const dayProfitSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.profit.sales.inStore,
        selectedValue: selectedDayMetrics.profit.sales.inStore,
      });

      // daily -> expenses

      const dayExpensesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "day",
        prevValue: prevDayMetrics.expenses.total,
        selectedValue: selectedDayMetrics.expenses.total,
      });

      const dayExpensesRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "day",
        prevValue: prevDayMetrics.expenses.repair,
        selectedValue: selectedDayMetrics.expenses.repair,
      });

      const dayExpensesSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "day",
        prevValue: prevDayMetrics.expenses.sales.total,
        selectedValue: selectedDayMetrics.expenses.sales.total,
      });

      const dayExpensesSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "day",
        prevValue: prevDayMetrics.expenses.sales.online,
        selectedValue: selectedDayMetrics.expenses.sales.online,
      });

      const dayExpensesSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "day",
        prevValue: prevDayMetrics.expenses.sales.inStore,
        selectedValue: selectedDayMetrics.expenses.sales.inStore,
      });

      // daily -> transactions

      const dayUnitsSoldTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        kind: "day",
        prevValue: prevDayMetrics.transactions.total,
        selectedValue: selectedDayMetrics.transactions.total,
      });

      const dayUnitsSoldRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        kind: "day",
        prevValue: prevDayMetrics.transactions.repair,
        selectedValue: selectedDayMetrics.transactions.repair,
      });

      const dayUnitsSoldSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        kind: "day",
        prevValue: prevDayMetrics.transactions.sales.total,
        selectedValue: selectedDayMetrics.transactions.sales.total,
      });

      const dayUnitsSoldSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        kind: "day",
        prevValue: prevDayMetrics.transactions.sales.online,
        selectedValue: selectedDayMetrics.transactions.sales.online,
      });

      const dayUnitsSoldSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        kind: "day",
        prevValue: prevDayMetrics.transactions.sales.inStore,
        selectedValue: selectedDayMetrics.transactions.sales.inStore,
      });

      // daily -> revenue

      const dayRevenueTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.revenue.total,
        selectedValue: selectedDayMetrics.revenue.total,
      });

      const dayRevenueRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.revenue.repair,
        selectedValue: selectedDayMetrics.revenue.repair,
      });

      const dayRevenueSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.revenue.sales.total,
        selectedValue: selectedDayMetrics.revenue.sales.total,
      });

      const dayRevenueSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.revenue.sales.online,
        selectedValue: selectedDayMetrics.revenue.sales.online,
      });

      const dayRevenueSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.revenue.sales.inStore,
        selectedValue: selectedDayMetrics.revenue.sales.inStore,
      });

      // daily -> average order value
      const dayAverageOrderValueCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Average Order Value",
        isDisplayValueAsCurrency: true,
        kind: "day",
        prevValue: prevDayMetrics.averageOrderValue,
        selectedValue: selectedDayMetrics.averageOrderValue,
      });

      // daily -> conversion rate
      const dayConversionRateCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Conversion Rate",
        isDisplayValueAsPercentage: true,
        kind: "day",
        prevValue: prevDayMetrics.conversionRate,
        selectedValue: selectedDayMetrics.conversionRate,
      });

      // daily -> net profit margin
      const dayNetProfitMarginCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Net Profit Margin",
        isDisplayValueAsPercentage: true,
        kind: "day",
        prevValue: prevDayMetrics.netProfitMargin,
        selectedValue: selectedDayMetrics.netProfitMargin,
      });

      // month

      // month -> profit

      const monthProfitTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.profit.total,
        selectedValue: selectedMonthMetrics.profit.total,
      });

      const monthProfitRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.profit.repair,
        selectedValue: selectedMonthMetrics.profit.repair,
      });

      const monthProfitSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.profit.sales.total,
        selectedValue: selectedMonthMetrics.profit.sales.total,
      });

      const monthProfitSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.profit.sales.online,
        selectedValue: selectedMonthMetrics.profit.sales.online,
      });

      const monthProfitSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.profit.sales.inStore,
        selectedValue: selectedMonthMetrics.profit.sales.inStore,
      });

      // month -> expenses

      const monthExpensesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "month",
        prevValue: prevMonthMetrics.expenses.total,
        selectedValue: selectedMonthMetrics.expenses.total,
      });

      const monthExpensesRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "month",
        prevValue: prevMonthMetrics.expenses.repair,
        selectedValue: selectedMonthMetrics.expenses.repair,
      });

      const monthExpensesSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "month",
        prevValue: prevMonthMetrics.expenses.sales.total,
        selectedValue: selectedMonthMetrics.expenses.sales.total,
      });

      const monthExpensesSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "month",
        prevValue: prevMonthMetrics.expenses.sales.online,
        selectedValue: selectedMonthMetrics.expenses.sales.online,
      });

      const monthExpensesSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "month",
        prevValue: prevMonthMetrics.expenses.sales.inStore,
        selectedValue: selectedMonthMetrics.expenses.sales.inStore,
      });

      // month -> transactions

      const monthUnitsSoldTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        kind: "month",
        prevValue: prevMonthMetrics.transactions.total,
        selectedValue: selectedMonthMetrics.transactions.total,
      });

      const monthUnitsSoldRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        kind: "month",
        prevValue: prevMonthMetrics.transactions.repair,
        selectedValue: selectedMonthMetrics.transactions.repair,
      });

      const monthUnitsSoldSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        kind: "month",
        prevValue: prevMonthMetrics.transactions.sales.total,
        selectedValue: selectedMonthMetrics.transactions.sales.total,
      });

      const monthUnitsSoldSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        kind: "month",
        prevValue: prevMonthMetrics.transactions.sales.online,
        selectedValue: selectedMonthMetrics.transactions.sales.online,
      });

      const monthUnitsSoldSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        kind: "month",
        prevValue: prevMonthMetrics.transactions.sales.inStore,
        selectedValue: selectedMonthMetrics.transactions.sales.inStore,
      });

      // month -> revenue

      const monthRevenueTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.revenue.total,
        selectedValue: selectedMonthMetrics.revenue.total,
      });

      const monthRevenueRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.revenue.repair,
        selectedValue: selectedMonthMetrics.revenue.repair,
      });

      const monthRevenueSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.revenue.sales.total,
        selectedValue: selectedMonthMetrics.revenue.sales.total,
      });

      const monthRevenueSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.revenue.sales.online,
        selectedValue: selectedMonthMetrics.revenue.sales.online,
      });

      const monthRevenueSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.revenue.sales.inStore,
        selectedValue: selectedMonthMetrics.revenue.sales.inStore,
      });

      // month -> average order value
      const monthAverageOrderValueCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Average Order Value",
        isDisplayValueAsCurrency: true,
        kind: "month",
        prevValue: prevMonthMetrics.averageOrderValue,
        selectedValue: selectedMonthMetrics.averageOrderValue,
      });

      // month -> conversion rate
      const monthConversionRateCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Conversion Rate",
        isDisplayValueAsPercentage: true,
        kind: "month",
        prevValue: prevMonthMetrics.conversionRate,
        selectedValue: selectedMonthMetrics.conversionRate,
      });

      // month -> net profit margin
      const monthNetProfitMarginCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Net Profit Margin",
        isDisplayValueAsPercentage: true,
        kind: "month",
        prevValue: prevMonthMetrics.netProfitMargin,
        selectedValue: selectedMonthMetrics.netProfitMargin,
      });

      // year

      // year -> profit

      const yearProfitTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.profit.total,
        selectedValue: selectedYearMetrics.profit.total,
      });

      const yearProfitRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.profit.repair,
        selectedValue: selectedYearMetrics.profit.repair,
      });

      const yearProfitSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.profit.sales.total,
        selectedValue: selectedYearMetrics.profit.sales.total,
      });

      const yearProfitSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.profit.sales.online,
        selectedValue: selectedYearMetrics.profit.sales.online,
      });

      const yearProfitSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.profit.sales.inStore,
        selectedValue: selectedYearMetrics.profit.sales.inStore,
      });

      // year -> expenses

      const yearExpensesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "year",
        prevValue: prevYearMetrics.expenses.total,
        selectedValue: selectedYearMetrics.expenses.total,
      });

      const yearExpensesRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "year",
        prevValue: prevYearMetrics.expenses.repair,
        selectedValue: selectedYearMetrics.expenses.repair,
      });

      const yearExpensesSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "year",
        prevValue: prevYearMetrics.expenses.sales.total,
        selectedValue: selectedYearMetrics.expenses.sales.total,
      });

      const yearExpensesSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "year",
        prevValue: prevYearMetrics.expenses.sales.online,
        selectedValue: selectedYearMetrics.expenses.sales.online,
      });

      const yearExpensesSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        isDisplayValueAsCurrency: true,
        isFlipColor: true,
        kind: "year",
        prevValue: prevYearMetrics.expenses.sales.inStore,
        selectedValue: selectedYearMetrics.expenses.sales.inStore,
      });

      // year -> transactions

      const yearUnitsSoldTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        kind: "year",
        prevValue: prevYearMetrics.transactions.total,
        selectedValue: selectedYearMetrics.transactions.total,
      });

      const yearUnitsSoldRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        kind: "year",
        prevValue: prevYearMetrics.transactions.repair,
        selectedValue: selectedYearMetrics.transactions.repair,
      });

      const yearUnitsSoldSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        kind: "year",
        prevValue: prevYearMetrics.transactions.sales.total,
        selectedValue: selectedYearMetrics.transactions.sales.total,
      });

      const yearUnitsSoldSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        kind: "year",
        prevValue: prevYearMetrics.transactions.sales.online,
        selectedValue: selectedYearMetrics.transactions.sales.online,
      });

      const yearUnitsSoldSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        kind: "year",
        prevValue: prevYearMetrics.transactions.sales.inStore,
        selectedValue: selectedYearMetrics.transactions.sales.inStore,
      });

      // year -> revenue

      const yearRevenueTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Total",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.revenue.total,
        selectedValue: selectedYearMetrics.revenue.total,
      });

      const yearRevenueRepairCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Repair",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.revenue.repair,
        selectedValue: selectedYearMetrics.revenue.repair,
      });

      const yearRevenueSalesTotalCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Total",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.revenue.sales.total,
        selectedValue: selectedYearMetrics.revenue.sales.total,
      });

      const yearRevenueSalesOnlineCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales Online",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.revenue.sales.online,
        selectedValue: selectedYearMetrics.revenue.sales.online,
      });

      const yearRevenueSalesInStoreCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Sales In-Store",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.revenue.sales.inStore,
        selectedValue: selectedYearMetrics.revenue.sales.inStore,
      });

      // year -> average order value
      const yearAverageOrderValueCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Average Order Value",
        isDisplayValueAsCurrency: true,
        kind: "year",
        prevValue: prevYearMetrics.averageOrderValue,
        selectedValue: selectedYearMetrics.averageOrderValue,
      });

      // year -> conversion rate
      const yearConversionRateCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Conversion Rate",
        isDisplayValueAsPercentage: true,
        kind: "year",
        prevValue: prevYearMetrics.conversionRate,
        selectedValue: selectedYearMetrics.conversionRate,
      });

      // year -> net profit margin
      const yearNetProfitMarginCardInfo = createDashboardMetricsCards({
        ...DASHBOARD_CARD_TEMPLATE,
        heading: "Net Profit Margin",
        isDisplayValueAsPercentage: true,
        kind: "year",
        prevValue: prevYearMetrics.netProfitMargin,
        selectedValue: selectedYearMetrics.netProfitMargin,
      });

      resolve({
        dailyCards: {
          profit: [
            dayProfitTotalCardInfo,
            dayProfitRepairCardInfo,
            dayProfitSalesTotalCardInfo,
            dayProfitSalesOnlineCardInfo,
            dayProfitSalesInStoreCardInfo,
          ],
          revenue: [
            dayRevenueTotalCardInfo,
            dayRevenueRepairCardInfo,
            dayRevenueSalesTotalCardInfo,
            dayRevenueSalesOnlineCardInfo,
            dayRevenueSalesInStoreCardInfo,
          ],
          expenses: [
            dayExpensesTotalCardInfo,
            dayExpensesRepairCardInfo,
            dayExpensesSalesTotalCardInfo,
            dayExpensesSalesOnlineCardInfo,
            dayExpensesSalesInStoreCardInfo,
          ],
          transactions: [
            dayUnitsSoldTotalCardInfo,
            dayUnitsSoldRepairCardInfo,
            dayUnitsSoldSalesTotalCardInfo,
            dayUnitsSoldSalesOnlineCardInfo,
            dayUnitsSoldSalesInStoreCardInfo,
          ],
          otherMetrics: [
            dayAverageOrderValueCardInfo,
            dayConversionRateCardInfo,
            dayNetProfitMarginCardInfo,
          ],
        },
        monthlyCards: {
          profit: [
            monthProfitTotalCardInfo,
            monthProfitRepairCardInfo,
            monthProfitSalesTotalCardInfo,
            monthProfitSalesOnlineCardInfo,
            monthProfitSalesInStoreCardInfo,
          ],
          revenue: [
            monthRevenueTotalCardInfo,
            monthRevenueRepairCardInfo,
            monthRevenueSalesTotalCardInfo,
            monthRevenueSalesOnlineCardInfo,
            monthRevenueSalesInStoreCardInfo,
          ],
          expenses: [
            monthExpensesTotalCardInfo,
            monthExpensesRepairCardInfo,
            monthExpensesSalesTotalCardInfo,
            monthExpensesSalesOnlineCardInfo,
            monthExpensesSalesInStoreCardInfo,
          ],
          transactions: [
            monthUnitsSoldTotalCardInfo,
            monthUnitsSoldRepairCardInfo,
            monthUnitsSoldSalesTotalCardInfo,
            monthUnitsSoldSalesOnlineCardInfo,
            monthUnitsSoldSalesInStoreCardInfo,
          ],
          otherMetrics: [
            monthAverageOrderValueCardInfo,
            monthConversionRateCardInfo,
            monthNetProfitMarginCardInfo,
          ],
        },
        yearlyCards: {
          profit: [
            yearProfitTotalCardInfo,
            yearProfitRepairCardInfo,
            yearProfitSalesTotalCardInfo,
            yearProfitSalesOnlineCardInfo,
            yearProfitSalesInStoreCardInfo,
          ],
          revenue: [
            yearRevenueTotalCardInfo,
            yearRevenueRepairCardInfo,
            yearRevenueSalesTotalCardInfo,
            yearRevenueSalesOnlineCardInfo,
            yearRevenueSalesInStoreCardInfo,
          ],
          expenses: [
            yearExpensesTotalCardInfo,
            yearExpensesRepairCardInfo,
            yearExpensesSalesTotalCardInfo,
            yearExpensesSalesOnlineCardInfo,
            yearExpensesSalesInStoreCardInfo,
          ],
          transactions: [
            yearUnitsSoldTotalCardInfo,
            yearUnitsSoldRepairCardInfo,
            yearUnitsSoldSalesTotalCardInfo,
            yearUnitsSoldSalesOnlineCardInfo,
            yearUnitsSoldSalesInStoreCardInfo,
          ],
          otherMetrics: [
            yearAverageOrderValueCardInfo,
            yearConversionRateCardInfo,
            yearNetProfitMarginCardInfo,
          ],
        },
      });
    }, 0);
  });
}

function returnCalendarViewFinancialCards(
  calendarView: DashboardCalendarView,
  financialMetricsCards: FinancialMetricsCards,
) {
  return calendarView === "Daily"
    ? financialMetricsCards.dailyCards
    : calendarView === "Monthly"
    ? financialMetricsCards.monthlyCards
    : financialMetricsCards.yearlyCards;
}

export { createFinancialMetricsCards, returnCalendarViewFinancialCards };
export type { FinancialMetricsCards };
