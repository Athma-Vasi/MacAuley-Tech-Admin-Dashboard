import { MONTHS } from "../constants";
import { BusinessMetric, BusinessMetricStoreLocation } from "../types";

function returnDailyOverviewFinancialMetrics(
  businessMetrics: BusinessMetric[],
  storeLocationView: BusinessMetricStoreLocation,
  selectedYYYYMMDD: string,
) {
  const defaultValue = {
    pert: {
      dailyExpenses: 0,
      dailyProfit: 0,
      dailyRevenue: 0,
      dailyTransactions: 0,
    },
    otherMetrics: {
      dailyAverageOrderValue: 0,
      dailyConversionRate: 0,
      dailyNetProfitMargin: 0,
    },
  };

  const [year, month, day] = selectedYYYYMMDD.split("-") as [
    string,
    string,
    string,
  ];
  const financialMetrics = businessMetrics.find(
    (bmetric) => bmetric.storeLocation === storeLocationView,
  )?.financialMetrics;

  if (!financialMetrics) {
    return defaultValue;
  }

  const yearlyMetrics = financialMetrics.find((financialMetric) =>
    financialMetric.year === year
  );
  if (!yearlyMetrics) {
    return defaultValue;
  }
  const monthlyMetrics = yearlyMetrics.monthlyMetrics.find((monthlyMetric) =>
    monthlyMetric.month === (MONTHS[Number(month) - 1].toString())
  );
  if (!monthlyMetrics) {
    return defaultValue;
  }
  const dailyMetrics = monthlyMetrics.dailyMetrics.find((dailyMetric) =>
    dailyMetric.day === day
  );
  if (!dailyMetrics) {
    return defaultValue;
  }

  const {
    averageOrderValue,
    conversionRate,
    expenses,
    netProfitMargin,
    profit,
    revenue,
    transactions,
  } = dailyMetrics;

  const otherMetrics = {
    dailyAverageOrderValue: averageOrderValue,
    dailyConversionRate: conversionRate,
    dailyNetProfitMargin: netProfitMargin,
  };

  const pert = {
    dailyExpenses: expenses.total,
    dailyProfit: profit.total,
    dailyRevenue: revenue.total,
    dailyTransactions: transactions.total,
  };

  return {
    ...defaultValue,
    otherMetrics,
    pert,
  };
}

export { returnDailyOverviewFinancialMetrics };
