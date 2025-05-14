import { FinancialMetricsDocument } from "../../../types";
import { MONTHS } from "../constants";
import { AllStoreLocations, DashboardCalendarView } from "../types";
import { createOverviewMetricCard } from "../utilsTSX";

type OverviewFinancialMetrics = {
  pert: Record<DashboardCalendarView, { profit: number; revenue: number }>;
  otherMetrics: Record<
    DashboardCalendarView,
    { netProfitMargin: number; averageOrderValue: number }
  >;
};

function returnOverviewFinancialMetrics(
  financialMetricsDocument: FinancialMetricsDocument,
  selectedYYYYMMDD: string,
) {
  const defaultValue: OverviewFinancialMetrics = {
    pert: {
      Daily: {
        profit: 0,
        revenue: 0,
      },
      Monthly: {
        profit: 0,
        revenue: 0,
      },
      Yearly: {
        profit: 0,
        revenue: 0,
      },
    },
    otherMetrics: {
      Daily: {
        netProfitMargin: 0,
        averageOrderValue: 0,
      },
      Monthly: {
        netProfitMargin: 0,
        averageOrderValue: 0,
      },
      Yearly: {
        netProfitMargin: 0,
        averageOrderValue: 0,
      },
    },
  };

  const [year, month, day] = selectedYYYYMMDD.split("-") as [
    string,
    string,
    string,
  ];
  // const financialMetrics = businessMetrics.find(
  //   (bmetric) => bmetric.storeLocation === storeLocation,
  // )?.financialMetrics;
  // if (financialMetrics === null || financialMetrics === undefined) {
  //   return defaultValue;
  // }

  const yearlyMetrics = financialMetricsDocument.financialMetrics.find((
    financialMetric,
  ) => financialMetric.year === year);
  if (yearlyMetrics === null || yearlyMetrics === undefined) {
    return defaultValue;
  }

  defaultValue.pert.Yearly = {
    profit: yearlyMetrics.profit.total,
    revenue: yearlyMetrics.revenue.total,
  };
  defaultValue.otherMetrics.Yearly = {
    netProfitMargin: yearlyMetrics.netProfitMargin,
    averageOrderValue: yearlyMetrics.averageOrderValue,
  };

  const monthlyMetrics = yearlyMetrics.monthlyMetrics.find((monthlyMetric) =>
    monthlyMetric.month === (MONTHS[Number(month) - 1].toString())
  );
  if (monthlyMetrics === null || monthlyMetrics === undefined) {
    return defaultValue;
  }

  defaultValue.pert.Monthly = {
    profit: monthlyMetrics.profit.total,
    revenue: monthlyMetrics.revenue.total,
  };
  defaultValue.otherMetrics.Monthly = {
    netProfitMargin: monthlyMetrics.netProfitMargin,
    averageOrderValue: monthlyMetrics.averageOrderValue,
  };

  const dailyMetrics = monthlyMetrics.dailyMetrics.find((dailyMetric) =>
    dailyMetric.day === day
  );
  if (!dailyMetrics) {
    return defaultValue;
  }

  defaultValue.pert.Daily = {
    profit: dailyMetrics.profit.total,
    revenue: dailyMetrics.revenue.total,
  };
  defaultValue.otherMetrics.Daily = {
    netProfitMargin: dailyMetrics.netProfitMargin,
    averageOrderValue: dailyMetrics.averageOrderValue,
  };

  return defaultValue;
}

function returnFinancialMetricsOverviewCards(
  {
    overviewMetrics,
    selectedYYYYMMDD,
    storeLocation,
  }: {
    overviewMetrics: OverviewFinancialMetrics;
    selectedYYYYMMDD: string;
    storeLocation: AllStoreLocations;
  },
) {
  const initialAcc: {
    pertOverviewCards: Record<DashboardCalendarView, React.JSX.Element>;
    otherMetricsOverviewCards: Record<DashboardCalendarView, React.JSX.Element>;
  } = {
    pertOverviewCards: {
      Daily: <></>,
      Monthly: <></>,
      Yearly: <></>,
    },
    otherMetricsOverviewCards: {
      Daily: <></>,
      Monthly: <></>,
      Yearly: <></>,
    },
  };

  return Object.entries(overviewMetrics).reduce(
    (acc, curr) => {
      const [category, metrics] = curr as [
        "pert" | "otherMetrics",
        | Record<DashboardCalendarView, {
          profit: number;
          revenue: number;
        }>
        | Record<DashboardCalendarView, {
          netProfitMargin: number;
          averageOrderValue: number;
        }>,
      ];

      Object.entries(metrics).forEach((entry) => {
        switch (category) {
          case "pert": {
            const [calendarView, metric] = entry as [
              DashboardCalendarView,
              { profit: number; revenue: number },
            ];
            const overviewRevenueCard = createOverviewMetricCard({
              calendarView,
              selectedYYYYMMDD,
              storeLocation,
              subMetric: "Revenue",
              unit: "CAD",
              value: metric.revenue,
            });
            const overviewProfitCard = createOverviewMetricCard({
              calendarView,
              selectedYYYYMMDD,
              storeLocation,
              subMetric: "Profit",
              unit: "CAD",
              value: metric.profit,
            });

            Object.defineProperty(acc.pertOverviewCards, calendarView, {
              value: (
                <>
                  {overviewRevenueCard}
                  {overviewProfitCard}
                </>
              ),
              enumerable: true,
            });
            break;
          }

          // otherMetrics
          default: {
            const [calendarView, metric] = entry as [
              DashboardCalendarView,
              { netProfitMargin: number; averageOrderValue: number },
            ];
            const overviewNetProfitMarginCard = createOverviewMetricCard({
              calendarView,
              selectedYYYYMMDD,
              storeLocation,
              subMetric: "Net Profit Margin",
              unit: "%",
              value: metric.netProfitMargin,
            });
            const overviewAverageOrderValueCard = createOverviewMetricCard({
              calendarView,
              selectedYYYYMMDD,
              storeLocation,
              subMetric: "Average Order Value",
              unit: "CAD",
              value: metric.averageOrderValue,
            });

            Object.defineProperty(acc.otherMetricsOverviewCards, calendarView, {
              value: (
                <>
                  {overviewNetProfitMarginCard}
                  {overviewAverageOrderValueCard}
                </>
              ),
              enumerable: true,
            });
            break;
          }
        }
      });

      return acc;
    },
    initialAcc,
  );
}

export { returnFinancialMetricsOverviewCards, returnOverviewFinancialMetrics };
export type { OverviewFinancialMetrics };
