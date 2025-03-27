import { MONTHS } from "../constants";
import {
  BusinessMetric,
  BusinessMetricStoreLocation,
  DashboardCalendarView,
} from "../types";
import { createOverviewMetricCard } from "../utilsTSX";
import { RepairMetricCategory } from "./types";

type OverviewRevenueMetrics = Record<
  DashboardCalendarView,
  { revenue: number; unitsRepaired: number }
>;

function returnOverviewRepairMetrics(
  businessMetrics: BusinessMetric[],
  storeLocationView: BusinessMetricStoreLocation,
  selectedYYYYMMDD: string,
  category: RepairMetricCategory,
) {
  const defaultValue: OverviewRevenueMetrics = {
    Daily: {
      revenue: 0,
      unitsRepaired: 0,
    },
    Monthly: {
      revenue: 0,
      unitsRepaired: 0,
    },
    Yearly: {
      revenue: 0,
      unitsRepaired: 0,
    },
  };

  const [year, month, day] = selectedYYYYMMDD.split("-") as [
    string,
    string,
    string,
  ];

  const repairMetrics = businessMetrics.find(
    (bmetric) => bmetric.storeLocation === storeLocationView,
  )?.repairMetrics;
  if (repairMetrics === null || repairMetrics === undefined) {
    return defaultValue;
  }

  const subMetrics = repairMetrics.find(
    (repairMetric) => repairMetric.name === category,
  );
  if (subMetrics === null || subMetrics === undefined) {
    return defaultValue;
  }

  const yearlyMetrics = subMetrics.yearlyMetrics.find((repairMetric) =>
    repairMetric.year === year
  );
  if (yearlyMetrics === null || yearlyMetrics === undefined) {
    return defaultValue;
  }

  defaultValue.Yearly = {
    revenue: yearlyMetrics.revenue,
    unitsRepaired: yearlyMetrics.unitsRepaired,
  };

  const monthlyMetrics = yearlyMetrics.monthlyMetrics.find((monthlyMetric) =>
    monthlyMetric.month === (MONTHS[Number(month) - 1].toString())
  );
  if (monthlyMetrics === null || monthlyMetrics === undefined) {
    return defaultValue;
  }

  defaultValue.Monthly = {
    revenue: monthlyMetrics.revenue,
    unitsRepaired: monthlyMetrics.unitsRepaired,
  };

  const dailyMetrics = monthlyMetrics.dailyMetrics.find((dailyMetric) =>
    dailyMetric.day === day
  );
  if (dailyMetrics === null || dailyMetrics === undefined) {
    return defaultValue;
  }

  defaultValue.Daily = {
    revenue: dailyMetrics.revenue,
    unitsRepaired: dailyMetrics.unitsRepaired,
  };

  return defaultValue;
}

function createOverviewRepairMetricsCards(
  { overviewMetrics, selectedYYYYMMDD, storeLocationView }: {
    overviewMetrics: OverviewRevenueMetrics;
    selectedYYYYMMDD: string;
    storeLocationView: BusinessMetricStoreLocation;
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
        { revenue: number; unitsRepaired: number },
      ];
      const { revenue, unitsRepaired } = metrics;
      const overviewRevenueCard = createOverviewMetricCard({
        calendarView,
        selectedYYYYMMDD,
        storeLocationView,
        subMetric: "Repairs",
        unit: "CAD",
        value: revenue,
      });
      const overviewUnitsRepairedCard = createOverviewMetricCard({
        calendarView,
        selectedYYYYMMDD,
        storeLocationView,
        subMetric: "Units Repaired",
        unit: "Units",
        value: unitsRepaired,
      });

      Object.defineProperty(acc, calendarView, {
        value: (
          <>
            {overviewRevenueCard}
            {overviewUnitsRepairedCard}
          </>
        ),
        enumerable: true,
      });

      return acc;
    },
    initialAcc,
  );
}

export { createOverviewRepairMetricsCards, returnOverviewRepairMetrics };
export type { OverviewRevenueMetrics };
