import { ProductMetricsDocument } from "../../../types";
import { MONTHS } from "../constants";
import { AllStoreLocations, DashboardCalendarView } from "../types";
import { createOverviewMetricCard } from "../utilsTSX";

type OverviewAllProductsMetrics = Record<
  DashboardCalendarView,
  { revenue: number; unitsSold: number }
>;

function returnOverviewAllProductsMetrics(
  productMetricsDocument: ProductMetricsDocument,
  selectedYYYYMMDD: string,
) {
  const defaultValue: OverviewAllProductsMetrics = {
    Daily: {
      revenue: 0,
      unitsSold: 0,
    },
    Monthly: {
      revenue: 0,
      unitsSold: 0,
    },
    Yearly: {
      revenue: 0,
      unitsSold: 0,
    },
  };

  const [year, month, day] = selectedYYYYMMDD.split("-") as [
    string,
    string,
    string,
  ];

  const allProductsYearlyMetrics = productMetricsDocument.yearlyMetrics.find(
    (yearlyMetric) => yearlyMetric.year === year,
  );
  if (
    allProductsYearlyMetrics === null || allProductsYearlyMetrics === undefined
  ) {
    return defaultValue;
  }

  defaultValue.Yearly = {
    revenue: allProductsYearlyMetrics.revenue.total,
    unitsSold: allProductsYearlyMetrics.unitsSold.total,
  };

  const allProductsMonthlyMetrics = allProductsYearlyMetrics.monthlyMetrics
    .find((monthlyMetric) =>
      monthlyMetric.month === (MONTHS[Number(month) - 1].toString())
    );
  if (
    allProductsMonthlyMetrics === null ||
    allProductsMonthlyMetrics === undefined
  ) {
    return defaultValue;
  }

  defaultValue.Monthly = {
    revenue: allProductsMonthlyMetrics.revenue.total,
    unitsSold: allProductsMonthlyMetrics.unitsSold.total,
  };

  const allProductsDailyMetrics = allProductsMonthlyMetrics.dailyMetrics.find((
    dailyMetric,
  ) => dailyMetric.day === day);
  if (
    allProductsDailyMetrics === null || allProductsDailyMetrics === undefined
  ) {
    return defaultValue;
  }

  defaultValue.Daily = {
    revenue: allProductsDailyMetrics.revenue.total,
    unitsSold: allProductsDailyMetrics.unitsSold.total,
  };

  return defaultValue;
}

function returnProductMetricsOverviewCards(
  { overviewMetrics, selectedYYYYMMDD, storeLocation }: {
    overviewMetrics: OverviewAllProductsMetrics;
    selectedYYYYMMDD: string;
    storeLocation: AllStoreLocations;
  },
) {
  const initialAcc: Record<DashboardCalendarView, React.JSX.Element> = {
    Daily: <></>,
    Monthly: <></>,
    Yearly: <></>,
  };

  return Object.entries(overviewMetrics).reduce(
    (acc, curr) => {
      const [calendarView, metrics] = curr as [
        DashboardCalendarView,
        { revenue: number; unitsSold: number },
      ];
      const { revenue, unitsSold } = metrics;

      const overviewRevenueCard = createOverviewMetricCard({
        calendarView,
        selectedYYYYMMDD,
        storeLocation,
        subMetric: "Revenue",
        unit: "CAD",
        value: revenue,
      });
      const overviewUnitsSoldCard = createOverviewMetricCard({
        calendarView,
        selectedYYYYMMDD,
        storeLocation,
        subMetric: "Units Sold",
        unit: "Units",
        value: unitsSold,
      });

      Object.defineProperty(acc, calendarView, {
        value: (
          <>
            {overviewRevenueCard}
            {overviewUnitsSoldCard}
          </>
        ),
        enumerable: true,
      });

      return acc;
    },
    initialAcc,
  );
}

export { returnOverviewAllProductsMetrics, returnProductMetricsOverviewCards };
export type { OverviewAllProductsMetrics };
