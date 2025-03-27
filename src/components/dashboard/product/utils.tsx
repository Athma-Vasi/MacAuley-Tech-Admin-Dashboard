import { MONTHS } from "../constants";
import {
  BusinessMetric,
  BusinessMetricStoreLocation,
  DashboardCalendarView,
} from "../types";
import { createOverviewMetricCard } from "../utilsTSX";

type OverviewAllProductsMetrics = Record<
  DashboardCalendarView,
  { revenue: number; unitsSold: number }
>;

function returnOverviewAllProductsMetrics(
  businessMetrics: BusinessMetric[],
  storeLocationView: BusinessMetricStoreLocation,
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
  const productMetrics = businessMetrics.find(
    (bmetric) => bmetric.storeLocation === storeLocationView,
  )?.productMetrics;

  if (!productMetrics) {
    return defaultValue;
  }

  const allProductsYearlyMetrics = productMetrics.find(
    (productMetric) => productMetric.name === "All Products",
  )?.yearlyMetrics.find(
    (yearlyMetric) => yearlyMetric.year === year,
  );
  if (!allProductsYearlyMetrics) {
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
  if (!allProductsMonthlyMetrics) {
    return defaultValue;
  }

  defaultValue.Monthly = {
    revenue: allProductsMonthlyMetrics.revenue.total,
    unitsSold: allProductsMonthlyMetrics.unitsSold.total,
  };

  const allProductsDailyMetrics = allProductsMonthlyMetrics.dailyMetrics.find((
    dailyMetric,
  ) => dailyMetric.day === day);

  if (!allProductsDailyMetrics) {
    return defaultValue;
  }

  defaultValue.Daily = {
    revenue: allProductsDailyMetrics.revenue.total,
    unitsSold: allProductsDailyMetrics.unitsSold.total,
  };

  return defaultValue;
}

function returnProductMetricsOverviewCards(
  {
    overviewMetrics,
    selectedYYYYMMDD,
    storeLocationView,
  }: {
    overviewMetrics: OverviewAllProductsMetrics;
    selectedYYYYMMDD: string;
    storeLocationView: BusinessMetricStoreLocation;
  },
) {
  const initialAcc: Record<DashboardCalendarView, React.JSX.Element> = {
    Daily: <></>,
    Monthly: <></>,
    Yearly: <></>,
  };

  return Object.entries(overviewMetrics).reduce((acc, [key, metrics]) => {
    const { revenue, unitsSold } = metrics;
    const overviewRevenueCard = createOverviewMetricCard({
      selectedYYYYMMDD,
      storeLocationView,
      subMetric: "Revenue",
      unit: "CAD",
      value: revenue,
    });
    const overviewUnitsSoldCard = createOverviewMetricCard({
      selectedYYYYMMDD,
      storeLocationView,
      subMetric: "Units Sold",
      unit: "Units",
      value: unitsSold,
    });

    Object.defineProperty(acc, key, {
      value: (
        <>
          {overviewRevenueCard}
          {overviewUnitsSoldCard}
        </>
      ),
      enumerable: true,
    });

    return acc;
  }, initialAcc);
}

export { returnOverviewAllProductsMetrics, returnProductMetricsOverviewCards };
export type { OverviewAllProductsMetrics };
