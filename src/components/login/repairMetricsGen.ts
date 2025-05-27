/**
 *repairMetrics: {
    name: RepairCategory;
    yearlyMetrics: {
      year: string;
      revenue: number;
      unitsRepaired: number;

      monthlyMetrics: {
        month: string;
        revenue: number;
        unitsRepaired: number;

        dailyMetrics: {
          day: string;
          revenue: number;
          unitsRepaired: number;
        }[];
      }[];
    }[];
  }[]
 */

import { SafeResult, StoreLocation } from "../../types";
import { createSafeErrorResult, createSafeSuccessResult } from "../../utils";
import {
    BusinessMetric,
    DaysInMonthsInYears,
    LocationYearSpread,
    RepairCategory,
    RepairDailyMetric,
    RepairMetric,
    RepairMonthlyMetric,
    RepairYearlyMetric,
} from "../dashboard/types";
import { createRepairCategoryUnitsRepairedRevenueTuple } from "../dashboard/utils";

function createRandomRepairMetrics({
    daysInMonthsInYears,
    repairCategories,
    storeLocation,
}: {
    daysInMonthsInYears: DaysInMonthsInYears;
    repairCategories: RepairCategory[];
    storeLocation: StoreLocation;
}): SafeResult<RepairMetric[]> {
    /**
     * - random daily unitsRepaired spread between [min, max] per year
     */
    const YEAR_UNITS_REPAIRED_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [1, 2],
            "2014": [1, 3],
            "2015": [2, 4],
            "2016": [3, 5],
            "2017": [5, 7],
            "2018": [5, 9],
            "2019": [7, 11],
            "2020": [6, 8],
            "2021": [5, 8],
            "2022": [7, 11],
            "2023": [10, 13],
            "2024": [9, 12],
            "2025": [8, 11],
        },
        Calgary: {
            "2017": [2, 4],
            "2018": [2, 5],
            "2019": [6, 9],
            "2020": [5, 8],
            "2021": [4, 7],
            "2022": [6, 9],
            "2023": [8, 11],
            "2024": [7, 10],
            "2025": [6, 9],
        },
        Vancouver: {
            "2019": [3, 5],
            "2020": [6, 9],
            "2021": [5, 8],
            "2022": [6, 9],
            "2023": [9, 11],
            "2024": [8, 10],
            "2025": [7, 9],
        },
    };

    try {
        const randomRepairMetrics = repairCategories.map((repairCategory) => {
            const yearlyRepairMetrics = Array.from(daysInMonthsInYears)
                .map(
                    (yearTuple) => {
                        const [year, daysInMonthsMap] = yearTuple;

                        const monthlyRepairMetrics = Array.from(
                            daysInMonthsMap,
                        ).map(
                            (monthTuple) => {
                                const [month, daysRange] = monthTuple;

                                const dailyRepairMetrics = daysRange
                                    .map((day) => {
                                        const [
                                            dailyRepairUnits,
                                            dailyRepairRevenue,
                                        ] = createRepairCategoryUnitsRepairedRevenueTuple(
                                            {
                                                repairCategory,
                                                storeLocation,
                                                year,
                                                yearUnitsRepairedSpread:
                                                    YEAR_UNITS_REPAIRED_SPREAD,
                                            },
                                        );

                                        const dailyRepairMetric:
                                            RepairDailyMetric = {
                                                day,
                                                unitsRepaired: dailyRepairUnits,
                                                revenue: dailyRepairRevenue,
                                            };

                                        return dailyRepairMetric;
                                    });

                                const [
                                    monthlyRepairTotalUnitsRepaired,
                                    monthlyRepairTotalRevenue,
                                ] = dailyRepairMetrics.reduce(
                                    (
                                        monthlyRepairMetricsAcc,
                                        dailyRepairMetric,
                                    ) => {
                                        monthlyRepairMetricsAcc[0] +=
                                            dailyRepairMetric
                                                .unitsRepaired;
                                        monthlyRepairMetricsAcc[1] +=
                                            dailyRepairMetric.revenue;

                                        return monthlyRepairMetricsAcc;
                                    },
                                    [0, 0],
                                );

                                const monthlyRepairMetric: RepairMonthlyMetric =
                                    {
                                        month,
                                        unitsRepaired:
                                            monthlyRepairTotalUnitsRepaired,
                                        revenue: monthlyRepairTotalRevenue,
                                        dailyMetrics: dailyRepairMetrics,
                                    };

                                return monthlyRepairMetric;
                            },
                        );

                        const [
                            yearlyRepairTotalUnitsRepaired,
                            yearlyRepairTotalRevenue,
                        ] = monthlyRepairMetrics.reduce(
                            (
                                yearlyRepairMetricsAcc,
                                monthlyRepairMetric,
                            ) => {
                                yearlyRepairMetricsAcc[0] +=
                                    monthlyRepairMetric.unitsRepaired;
                                yearlyRepairMetricsAcc[1] +=
                                    monthlyRepairMetric.revenue;

                                return yearlyRepairMetricsAcc;
                            },
                            [0, 0],
                        );

                        const yearlyRepairMetric: RepairYearlyMetric = {
                            year,
                            unitsRepaired: yearlyRepairTotalUnitsRepaired,
                            revenue: yearlyRepairTotalRevenue,
                            monthlyMetrics: monthlyRepairMetrics,
                        };

                        return yearlyRepairMetric;
                    },
                );

            const randomRepairMetrics: RepairMetric = {
                name: repairCategory,
                yearlyMetrics: yearlyRepairMetrics,
            };

            return randomRepairMetrics;
        });

        return createSafeSuccessResult(randomRepairMetrics);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

/**
 * - aggregate repair metrics for each store location into 'All Repairs' metrics
 */
function createAggregatedRepairMetrics(
    repairMetrics: Omit<RepairMetric[], "All Repairs">,
): SafeResult<RepairMetric> {
    const REPAIR_METRIC_TEMPLATE: RepairMetric = {
        name: "All Repairs",
        yearlyMetrics: [],
    };

    try {
        const aggregatedRepairMetrics = repairMetrics.reduce<RepairMetric>(
            (repairMetricsAcc, repairMetric) => {
                const REPAIR_METRIC_TEMPLATE_DAILY: RepairDailyMetric = {
                    day: "",
                    revenue: 0,
                    unitsRepaired: 0,
                };
                const REPAIR_METRIC_TEMPLATE_MONTHLY: RepairMonthlyMetric = {
                    month: "January",
                    revenue: 0,
                    unitsRepaired: 0,
                    dailyMetrics: [],
                };
                const REPAIR_METRIC_TEMPLATE_YEARLY: RepairYearlyMetric = {
                    year: "2021",
                    revenue: 0,
                    unitsRepaired: 0,
                    monthlyMetrics: [],
                };

                const { yearlyMetrics } = repairMetric;

                const aggregatedYearlyRepairMetrics = yearlyMetrics.map(
                    (repairYearlyMetric) => {
                        const {
                            year,
                            revenue,
                            unitsRepaired,
                            monthlyMetrics,
                        } = repairYearlyMetric;

                        const existingYearlyMetric =
                            repairMetricsAcc.yearlyMetrics.find(
                                (repairYearlyMetricAcc) =>
                                    repairYearlyMetricAcc.year === year,
                            ) ?? { ...REPAIR_METRIC_TEMPLATE_YEARLY, year };

                        const aggregatedYearlyMetric = {
                            ...existingYearlyMetric,
                            revenue: existingYearlyMetric.revenue + revenue,
                            unitsRepaired: existingYearlyMetric.unitsRepaired +
                                unitsRepaired,
                        };

                        const aggregatedMonthlyRepairMetrics = monthlyMetrics
                            .map(
                                (repairMonthlyMetric) => {
                                    const {
                                        month,
                                        dailyMetrics,
                                        revenue,
                                        unitsRepaired,
                                    } = repairMonthlyMetric;

                                    const existingMonthlyMetric =
                                        aggregatedYearlyMetric
                                            .monthlyMetrics.find(
                                                (repairMonthlyMetricAcc) =>
                                                    repairMonthlyMetricAcc
                                                        .month === month,
                                            ) ??
                                            {
                                                ...REPAIR_METRIC_TEMPLATE_MONTHLY,
                                                month,
                                            };

                                    const aggregatedDailyRepairMetrics =
                                        dailyMetrics
                                            .map(
                                                (repairDailyMetric) => {
                                                    const {
                                                        day,
                                                        revenue,
                                                        unitsRepaired,
                                                    } = repairDailyMetric;

                                                    const existingDailyMetric =
                                                        existingMonthlyMetric
                                                            .dailyMetrics.find(
                                                                (
                                                                    repairDailyMetricAcc,
                                                                ) => repairDailyMetricAcc
                                                                    .day ===
                                                                    day,
                                                            ) ??
                                                            {
                                                                ...REPAIR_METRIC_TEMPLATE_DAILY,
                                                                day,
                                                            };

                                                    const aggregatedDailyMetric =
                                                        {
                                                            ...existingDailyMetric,
                                                            revenue:
                                                                existingDailyMetric
                                                                    .revenue +
                                                                revenue,
                                                            unitsRepaired:
                                                                existingDailyMetric
                                                                    .unitsRepaired +
                                                                unitsRepaired,
                                                        };

                                                    return aggregatedDailyMetric;
                                                },
                                            );

                                    const aggregatedMonthlyMetric = {
                                        ...existingMonthlyMetric,
                                        revenue: existingMonthlyMetric.revenue +
                                            revenue,
                                        unitsRepaired: existingMonthlyMetric
                                            .unitsRepaired +
                                            unitsRepaired,
                                        dailyMetrics:
                                            aggregatedDailyRepairMetrics,
                                    };

                                    return aggregatedMonthlyMetric;
                                },
                            );
                        aggregatedYearlyMetric.monthlyMetrics =
                            aggregatedMonthlyRepairMetrics;

                        return aggregatedYearlyMetric;
                    },
                );

                repairMetricsAcc.yearlyMetrics = aggregatedYearlyRepairMetrics;

                return repairMetricsAcc;
            },
            REPAIR_METRIC_TEMPLATE,
        );

        return createSafeSuccessResult(aggregatedRepairMetrics);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

function createAllLocationsAggregatedRepairMetrics(
    businessMetrics: BusinessMetric[],
): SafeResult<RepairMetric[]> {
    try { // find all repair metrics for each store location
        const initialRepairMetrics: Record<string, RepairMetric[]> = {
            edmontonRepairMetrics: [],
            calgaryRepairMetrics: [],
            vancouverRepairMetrics: [],
        };

        const {
            calgaryRepairMetrics,
            edmontonRepairMetrics,
            vancouverRepairMetrics,
        } = businessMetrics.reduce((repairMetricsAcc, businessMetric) => {
            const { storeLocation, repairMetrics } = businessMetric;

            switch (storeLocation) {
                case "Calgary": {
                    repairMetricsAcc.calgaryRepairMetrics = repairMetrics;
                    break;
                }
                case "Edmonton": {
                    repairMetricsAcc.edmontonRepairMetrics = structuredClone(
                        repairMetrics,
                    );
                    break;
                }
                // case "Vancouver"
                default: {
                    repairMetricsAcc.vancouverRepairMetrics = repairMetrics;
                    break;
                }
            }

            return repairMetricsAcc;
        }, initialRepairMetrics);

        // as edmonton metrics are a superset of all other stores' metrics, it is being used as
        // the base to which all other store locations' metrics are aggregated into

        const aggregatedBaseRepairMetrics =
            aggregateStoresIntoBaseRepairMetrics({
                baseRepairMetrics: edmontonRepairMetrics,
                storeRepairMetrics: calgaryRepairMetrics,
            });

        const aggregatedAllLocationsRepairMetrics =
            aggregateStoresIntoBaseRepairMetrics({
                baseRepairMetrics: aggregatedBaseRepairMetrics,
                storeRepairMetrics: vancouverRepairMetrics,
            });

        function aggregateStoresIntoBaseRepairMetrics({
            baseRepairMetrics,
            storeRepairMetrics,
        }: {
            baseRepairMetrics: RepairMetric[];
            storeRepairMetrics: RepairMetric[];
        }) {
            return storeRepairMetrics.reduce<RepairMetric[]>(
                (baseRepairMetricsAcc, storeRepairMetric) => {
                    const { name, yearlyMetrics } = storeRepairMetric;

                    const baseRepairMetric = baseRepairMetricsAcc.find(
                        (baseRepairMetric) => baseRepairMetric.name === name,
                    );
                    if (!baseRepairMetric) {
                        return baseRepairMetricsAcc;
                    }

                    yearlyMetrics.forEach((storeYearlyMetric) => {
                        const {
                            year,
                            revenue: yearlyRevenue,
                            unitsRepaired: yearlyUnitsRepaired,
                            monthlyMetrics,
                        } = storeYearlyMetric;

                        const baseYearlyMetric = baseRepairMetric
                            .yearlyMetrics.find(
                                (baseYearlyMetric) =>
                                    baseYearlyMetric.year === year,
                            );
                        if (!baseYearlyMetric) {
                            return baseRepairMetricsAcc;
                        }

                        baseYearlyMetric.revenue += yearlyRevenue;
                        baseYearlyMetric.unitsRepaired += yearlyUnitsRepaired;

                        monthlyMetrics.forEach((storeMonthlyMetric) => {
                            const {
                                month,
                                revenue: monthlyRevenue,
                                unitsRepaired: monthlyUnitsRepaired,
                                dailyMetrics,
                            } = storeMonthlyMetric;

                            const baseMonthlyMetric = baseYearlyMetric
                                .monthlyMetrics.find(
                                    (baseMonthlyMetric) =>
                                        baseMonthlyMetric.month === month,
                                );
                            if (!baseMonthlyMetric) {
                                return baseRepairMetricsAcc;
                            }

                            baseMonthlyMetric.revenue += monthlyRevenue;
                            baseMonthlyMetric.unitsRepaired +=
                                monthlyUnitsRepaired;

                            dailyMetrics.forEach((storeDailyMetric) => {
                                const { day, revenue, unitsRepaired } =
                                    storeDailyMetric;

                                const baseDailyMetric = baseMonthlyMetric
                                    .dailyMetrics.find(
                                        (baseDailyMetric) =>
                                            baseDailyMetric.day === day,
                                    );
                                if (!baseDailyMetric) {
                                    return baseRepairMetricsAcc;
                                }

                                baseDailyMetric.revenue += revenue;
                                baseDailyMetric.unitsRepaired += unitsRepaired;
                            });
                        });
                    });

                    return baseRepairMetricsAcc;
                },
                baseRepairMetrics,
            );
        }

        return createSafeSuccessResult(aggregatedAllLocationsRepairMetrics);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

export {
    createAggregatedRepairMetrics,
    createAllLocationsAggregatedRepairMetrics,
    createRandomRepairMetrics,
};
