import { CustomerMetricsDocument } from "../../../types";
import { MONTHS } from "../constants";
import { AllStoreLocations, DashboardCalendarView } from "../types";
import { createOverviewMetricCard } from "../utilsTSX";

type OverviewCustomerMetrics = {
  newOverview: Record<DashboardCalendarView, { total: number; sales: number }>;
  returningOverview: Record<
    DashboardCalendarView,
    { total: number; sales: number }
  >;
  churnOverview: Record<DashboardCalendarView, {
    churnRate: number;
    retentionRate: number;
  }>;
};

function returnOverviewCustomerMetrics(
  customerMetricsDocument: CustomerMetricsDocument,
  selectedYYYYMMDD: string,
) {
  const defaultValue: OverviewCustomerMetrics = {
    newOverview: {
      Daily: {
        total: 0,
        sales: 0,
      },
      Monthly: {
        total: 0,
        sales: 0,
      },
      Yearly: {
        total: 0,
        sales: 0,
      },
    },
    returningOverview: {
      Daily: {
        total: 0,
        sales: 0,
      },
      Monthly: {
        total: 0,
        sales: 0,
      },
      Yearly: {
        total: 0,
        sales: 0,
      },
    },
    churnOverview: {
      Daily: {
        churnRate: 0,
        retentionRate: 0,
      },
      Monthly: {
        churnRate: 0,
        retentionRate: 0,
      },
      Yearly: {
        churnRate: 0,
        retentionRate: 0,
      },
    },
  };

  const [year, month, day] = selectedYYYYMMDD.split("-") as [
    string,
    string,
    string,
  ];
  // const customerMetrics = businessMetrics.find(
  //   (bmetric) => bmetric.storeLocation === storeLocationView,
  // )?.customerMetrics;
  // if (customerMetrics === null || customerMetrics === undefined) {
  //   return defaultValue;
  // }

  const yearlyMetrics = customerMetricsDocument.customerMetrics.yearlyMetrics
    .find((customerMetric) => customerMetric.year === year);
  if (yearlyMetrics === null || yearlyMetrics === undefined) {
    return defaultValue;
  }

  defaultValue.newOverview.Yearly.total = yearlyMetrics.customers.new.total;
  defaultValue.newOverview.Yearly.sales =
    yearlyMetrics.customers.new.sales.total;
  defaultValue.returningOverview.Yearly.total =
    yearlyMetrics.customers.returning.total;
  defaultValue.returningOverview.Yearly.sales =
    yearlyMetrics.customers.returning.sales.total;
  defaultValue.churnOverview.Yearly.churnRate =
    yearlyMetrics.customers.churnRate;
  defaultValue.churnOverview.Yearly.retentionRate =
    yearlyMetrics.customers.retentionRate;

  const monthlyMetrics = yearlyMetrics.monthlyMetrics.find((monthlyMetric) =>
    monthlyMetric.month === (MONTHS[Number(month) - 1].toString())
  );
  if (monthlyMetrics === null || monthlyMetrics === undefined) {
    return defaultValue;
  }

  defaultValue.newOverview.Monthly.total = monthlyMetrics.customers.new.total;
  defaultValue.newOverview.Monthly.sales =
    monthlyMetrics.customers.new.sales.total;
  defaultValue.returningOverview.Monthly.total =
    monthlyMetrics.customers.returning.total;
  defaultValue.returningOverview.Monthly.sales =
    monthlyMetrics.customers.returning.sales.total;
  defaultValue.churnOverview.Monthly.churnRate =
    monthlyMetrics.customers.churnRate;
  defaultValue.churnOverview.Monthly.retentionRate =
    monthlyMetrics.customers.retentionRate;

  const dailyMetrics = monthlyMetrics.dailyMetrics.find((dailyMetric) =>
    dailyMetric.day === day
  );
  if (dailyMetrics === null || dailyMetrics === undefined) {
    return defaultValue;
  }

  defaultValue.newOverview.Daily.total = dailyMetrics.customers.new.total;
  defaultValue.newOverview.Daily.sales = dailyMetrics.customers.new.sales.total;
  defaultValue.returningOverview.Daily.total =
    dailyMetrics.customers.returning.total;
  defaultValue.returningOverview.Daily.sales =
    dailyMetrics.customers.returning.sales.total;
  defaultValue.churnOverview.Daily.churnRate = dailyMetrics.customers.churnRate;
  defaultValue.churnOverview.Daily.retentionRate =
    dailyMetrics.customers.retentionRate;

  return defaultValue;
}

function returnCustomerMetricsOverviewCards(
  { overviewMetrics, selectedYYYYMMDD, storeLocationView }: {
    overviewMetrics: OverviewCustomerMetrics;
    selectedYYYYMMDD: string;
    storeLocationView: AllStoreLocations;
  },
) {
  const initialAcc: {
    newOverviewCards: Record<DashboardCalendarView, React.JSX.Element>;
    returningOverviewCards: Record<DashboardCalendarView, React.JSX.Element>;
    churnOverviewCards: Record<DashboardCalendarView, React.JSX.Element>;
  } = {
    newOverviewCards: {
      Daily: <></>,
      Monthly: <></>,
      Yearly: <></>,
    },
    returningOverviewCards: {
      Daily: <></>,
      Monthly: <></>,
      Yearly: <></>,
    },
    churnOverviewCards: {
      Daily: <></>,
      Monthly: <></>,
      Yearly: <></>,
    },
  };

  return Object.entries(overviewMetrics).reduce((acc, entry) => {
    const [metricType, metricCards] = entry as [
      "newOverview" | "returningOverview" | "churnOverview",
      Record<
        DashboardCalendarView,
        { total: number; sales: number } | {
          churnRate: number;
          retentionRate: number;
        }
      >,
    ];

    Object.entries(metricCards).forEach((card) => {
      if (metricType === "newOverview" || metricType === "returningOverview") {
        const [calendarView, metrics] = card as [
          DashboardCalendarView,
          { total: number; sales: number },
        ];

        const overviewTotalCard = createOverviewMetricCard({
          calendarView,
          selectedYYYYMMDD,
          storeLocationView,
          subMetric: metricType === "newOverview"
            ? "New Customers"
            : "Returning Customers",
          unit: "",
          value: metrics.total,
        });

        const overviewSalesCard = createOverviewMetricCard({
          calendarView,
          selectedYYYYMMDD,
          storeLocationView,
          subMetric: metricType === "newOverview"
            ? "New Customers Sales"
            : "Returning Customers Sales",
          unit: "",
          value: metrics.sales,
        });

        Object.defineProperty(acc[`${metricType}Cards`], calendarView, {
          value: (
            <>
              {overviewTotalCard}
              {overviewSalesCard}
            </>
          ),
          enumerable: true,
        });
      }

      if (metricType === "churnOverview") {
        const [calendarView, metrics] = card as [
          DashboardCalendarView,
          { churnRate: number; retentionRate: number },
        ];

        const overviewChurnRateCard = createOverviewMetricCard({
          calendarView,
          selectedYYYYMMDD,
          storeLocationView,
          subMetric: "Churn Rate",
          unit: "",
          value: metrics.churnRate,
        });

        const overviewRetentionRateCard = createOverviewMetricCard({
          calendarView,
          selectedYYYYMMDD,
          storeLocationView,
          subMetric: "Retention Rate",
          unit: "",
          value: metrics.retentionRate,
        });

        Object.defineProperty(acc.churnOverviewCards, calendarView, {
          value: (
            <>
              {overviewChurnRateCard}
              {overviewRetentionRateCard}
            </>
          ),
          enumerable: true,
        });
      }
    });

    return acc;
  }, initialAcc);
}

export { returnCustomerMetricsOverviewCards, returnOverviewCustomerMetrics };
export type { OverviewCustomerMetrics };
