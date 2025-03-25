import { MONTHS } from "../constants";
import {
  BusinessMetric,
  BusinessMetricStoreLocation,
  RepairCategory,
} from "../types";
import { RepairMetricCategory } from "./types";

function returnDailyOverviewRepairMetrics(
  businessMetrics: BusinessMetric[],
  storeLocationView: BusinessMetricStoreLocation,
  selectedYYYYMMDD: string,
  category: RepairMetricCategory,
) {
  const defaultValue = {
    repairRevenueOverview: 0,
    repairUnitsOverview: 0,
  };

  const [year, month, day] = selectedYYYYMMDD.split("-") as [
    string,
    string,
    string,
  ];

  const repairMetrics = businessMetrics.find(
    (bmetric) => bmetric.storeLocation === storeLocationView,
  )?.repairMetrics;
  if (!repairMetrics) {
    return defaultValue;
  }

  const subMetrics = repairMetrics.find(
    (repairMetric) => repairMetric.name === category,
  );
  if (!subMetrics) {
    return defaultValue;
  }

  const yearlyMetrics = subMetrics.yearlyMetrics.find((repairMetric) =>
    repairMetric.year === year
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

  const { revenue, unitsRepaired } = dailyMetrics;
  defaultValue.repairRevenueOverview = revenue;
  defaultValue.repairUnitsOverview = unitsRepaired;

  return defaultValue;
}

export { returnDailyOverviewRepairMetrics };
