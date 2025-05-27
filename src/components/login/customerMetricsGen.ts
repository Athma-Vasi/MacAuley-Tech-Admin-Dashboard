/**
 * customerMetrics: {
    totalCustomers: number;
    lifetimeValue: number;

    yearlyMetrics: {
      year: Year;
      customers: {
        total: number;
        new: {
          total: number;
          sales: {
            total: number;
            online: number;
            inStore: number;
          };
          repair: number;
        };
        returning: {
          total: number;
          sales: {
            total: number;
            online: number;
            inStore: number;
          };
          repair: number;
        };
        churnRate: number;
        retentionRate: number;
      };


      monthlyMetrics: {
        month: Month;
        customers: {
          total: number;
          new: {
            total: number;
            sales: {
              total: number;
              online: number;
              inStore: number;
            };
            repair: number;
          };
          returning: {
            total: number;
            sales: {
              total: number;
              online: number;
              inStore: number;
            };
            repair: number;
          };
          churnRate: number;
          retentionRate: number;
        };

        dailyMetrics: {
          day: string;
          customers: {
            total: number;
            new: {
              total: number;
              sales: {
                total: number;
                online: number;
                inStore: number;
              };
              repair: number;
            };
            returning: {
              total: number;
              sales: {
                total: number;
                online: number;
                inStore: number;
              };
              repair: number;
            };
            churnRate: number;
            retentionRate: number;
          };
        }[]
      }
    }
  }
 */

import { SafeResult, StoreLocation } from "../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    toFixedFloat,
} from "../../utils";
import {
    CustomerDailyMetric,
    CustomerMetrics,
    CustomerMonthlyMetric,
    CustomerYearlyMetric,
    DaysInMonthsInYears,
    LocationYearSpread,
} from "../dashboard/types";
import { createRandomNumber } from "../dashboard/utils";

function createRandomCustomerMetricsSafe({
    daysInMonthsInYears,
    storeLocation,
}: {
    daysInMonthsInYears: DaysInMonthsInYears;
    storeLocation: StoreLocation;
}): SafeResult<CustomerMetrics> {
    /**
     * churn rate spread between [min, max] per year
     * @see https://customergauge.com/blog/average-churn-rate-by-industry
     */
    const YEAR_CHURN_RATE_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [0.3, 0.4],
            "2014": [0.25, 0.3],
            "2015": [0.2, 0.25],
            "2016": [0.18, 0.22],
            "2017": [0.16, 0.2],
            "2018": [0.15, 0.18],
            "2019": [0.13, 0.16],
            "2020": [0.1, 0.12],
            "2021": [0.09, 0.11],
            "2022": [0.09, 0.11],
            "2023": [0.1, 0.12],
            "2024": [0.1, 0.12],
            "2025": [0.1, 0.12],
        },
        Calgary: {
            "2017": [0.18, 0.22],
            "2018": [0.15, 0.18],
            "2019": [0.13, 0.16],
            "2020": [0.1, 0.12],
            "2021": [0.09, 0.11],
            "2022": [0.09, 0.11],
            "2023": [0.1, 0.12],
            "2024": [0.1, 0.12],
            "2025": [0.1, 0.12],
        },
        Vancouver: {
            "2019": [0.13, 0.16],
            "2020": [0.1, 0.12],
            "2021": [0.09, 0.11],
            "2022": [0.09, 0.11],
            "2023": [0.1, 0.12],
            "2024": [0.1, 0.12],
            "2025": [0.1, 0.12],
        },
    };

    /**
     * - random daily customers spread between [min, max] per year
     */
    const YEAR_CUSTOMERS_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [60, 260],
            "2014": [80, 280],
            "2015": [100, 300],
            "2016": [120, 320],
            "2017": [220, 420],
            "2018": [260, 460],
            "2019": [300, 500],
            "2020": [500, 700],
            "2021": [540, 740],
            "2022": [540, 740],
            "2023": [460, 660],
            "2024": [420, 620],
            "2025": [400, 600],
        },
        Calgary: {
            "2017": [60, 260],
            "2018": [80, 280],
            "2019": [100, 300],
            "2020": [120, 320],
            "2021": [220, 420],
            "2022": [260, 460],
            "2023": [300, 500],
            "2024": [260, 460],
            "2025": [240, 440],
        },
        Vancouver: {
            "2019": [80, 280],
            "2020": [180, 380],
            "2021": [340, 460],
            "2022": [460, 540],
            "2023": [300, 460],
            "2024": [260, 420],
            "2025": [240, 400],
        },
    };

    /**
     * - random daily new customers fraction spread between [min, max] per year
     */
    const YEAR_NEW_CUSTOMERS_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [0.6, 0.7],
            "2014": [0.5, 0.7],
            "2015": [0.4, 0.6],
            "2016": [0.35, 0.55],
            "2017": [0.3, 0.5],
            "2018": [0.25, 0.45],
            "2019": [0.25, 0.4],
            "2020": [0.2, 0.35],
            "2021": [0.2, 0.35],
            "2022": [0.2, 0.35],
            "2023": [0.15, 0.3],
            "2024": [0.1, 0.25],
            "2025": [0.1, 0.25],
        },
        Calgary: {
            "2017": [0.6, 0.7],
            "2018": [0.5, 0.7],
            "2019": [0.4, 0.6],
            "2020": [0.35, 0.55],
            "2021": [0.3, 0.5],
            "2022": [0.25, 0.45],
            "2023": [0.25, 0.4],
            "2024": [0.2, 0.35],
            "2025": [0.2, 0.35],
        },
        Vancouver: {
            "2019": [0.6, 0.7],
            "2020": [0.5, 0.7],
            "2021": [0.4, 0.6],
            "2022": [0.35, 0.55],
            "2023": [0.3, 0.5],
            "2024": [0.25, 0.45],
            "2025": [0.25, 0.4],
        },
    };

    try {
        const yearlyCustomersMetrics = Array.from(daysInMonthsInYears).map(
            (yearTuple) => {
                const [year, daysInMonthsMap] = yearTuple;

                const monthlyCustomersMetrics = Array.from(daysInMonthsMap)
                    .map(
                        (monthTuple) => {
                            const [month, daysRange] = monthTuple;

                            const dailyCustomersMetrics = daysRange.map(
                                (day) => {
                                    const dailyTotalCustomers =
                                        createRandomNumber({
                                            storeLocation,
                                            year,
                                            yearUnitsSpread:
                                                YEAR_CUSTOMERS_SPREAD,
                                            defaultMax: 15,
                                            defaultMin: 5,
                                        });

                                    const dailyNewCustomersFraction =
                                        createRandomNumber({
                                            storeLocation,
                                            year,
                                            yearUnitsSpread:
                                                YEAR_NEW_CUSTOMERS_SPREAD,
                                            defaultMax: 0.2,
                                            defaultMin: 0.1,
                                            isFraction: true,
                                        });
                                    const dailyNewCustomers = Math.round(
                                        dailyTotalCustomers *
                                            dailyNewCustomersFraction,
                                    );

                                    const dailyNewCustomersRepairFraction =
                                        Math.random() * (0.15 - 0.05) +
                                        0.05;
                                    const dailyNewCustomersRepair = Math
                                        .round(
                                            dailyNewCustomers *
                                                dailyNewCustomersRepairFraction,
                                        );

                                    const dailyNewCustomersSales =
                                        dailyNewCustomers -
                                        dailyNewCustomersRepair;

                                    const dailyNewCustomersOnlineFraction =
                                        Math.random() * (0.9 - 0.7) + 0.7;
                                    const dailyNewCustomersOnline = Math
                                        .round(
                                            dailyNewCustomersSales *
                                                dailyNewCustomersOnlineFraction,
                                        );

                                    const dailyNewCustomersInStore =
                                        dailyNewCustomersSales -
                                        dailyNewCustomersOnline;

                                    const dailyReturningCustomers =
                                        dailyTotalCustomers -
                                        dailyNewCustomers;

                                    const dailyReturningCustomersRepairFraction =
                                        Math.random() * (0.15 - 0.05) +
                                        0.05;
                                    const dailyReturningCustomersRepair = Math
                                        .round(
                                            dailyReturningCustomers *
                                                dailyReturningCustomersRepairFraction,
                                        );

                                    const dailyReturningCustomersSales =
                                        dailyReturningCustomers -
                                        dailyReturningCustomersRepair;

                                    const dailyReturningCustomersOnlineFraction =
                                        Math.random() * (0.9 - 0.7) + 0.7;
                                    const dailyReturningCustomersOnline = Math
                                        .round(
                                            dailyReturningCustomersSales *
                                                dailyReturningCustomersOnlineFraction,
                                        );

                                    const dailyReturningCustomersInStore =
                                        dailyReturningCustomersSales -
                                        dailyReturningCustomersOnline;

                                    const dailyCustomersChurnRate =
                                        createRandomNumber({
                                            storeLocation,
                                            year,
                                            yearUnitsSpread:
                                                YEAR_CHURN_RATE_SPREAD,
                                            defaultMax: 0.3,
                                            defaultMin: 0.1,
                                            isFraction: true,
                                        });

                                    const dailyCustomersRetentionRate = 1 -
                                        dailyCustomersChurnRate;

                                    const dailyCustomersMetric:
                                        CustomerDailyMetric = {
                                            day,
                                            customers: {
                                                total: dailyTotalCustomers,
                                                new: {
                                                    total: dailyNewCustomers,
                                                    sales: {
                                                        total:
                                                            dailyNewCustomersSales,
                                                        online:
                                                            dailyNewCustomersOnline,
                                                        inStore:
                                                            dailyNewCustomersInStore,
                                                    },
                                                    repair:
                                                        dailyNewCustomersRepair,
                                                },
                                                returning: {
                                                    total:
                                                        dailyReturningCustomers,
                                                    sales: {
                                                        total:
                                                            dailyReturningCustomersSales,
                                                        online:
                                                            dailyReturningCustomersOnline,
                                                        inStore:
                                                            dailyReturningCustomersInStore,
                                                    },
                                                    repair:
                                                        dailyReturningCustomersRepair,
                                                },
                                                churnRate:
                                                    dailyCustomersChurnRate,
                                                retentionRate:
                                                    dailyCustomersRetentionRate,
                                            },
                                        };

                                    return dailyCustomersMetric;
                                },
                            );

                            const initialMonthlyCustomersMetrics:
                                CustomerMonthlyMetric = {
                                    month,
                                    customers: {
                                        new: {
                                            repair: 0,
                                            sales: {
                                                inStore: 0,
                                                online: 0,
                                                total: 0,
                                            },
                                            total: 0,
                                        },
                                        returning: {
                                            repair: 0,
                                            sales: {
                                                inStore: 0,
                                                online: 0,
                                                total: 0,
                                            },
                                            total: 0,
                                        },
                                        total: 0,
                                        churnRate: 0,
                                        retentionRate: 0,
                                    },
                                    dailyMetrics: dailyCustomersMetrics,
                                };

                            const monthlyCustomersMetrics =
                                dailyCustomersMetrics
                                    .reduce(
                                        (
                                            monthlyCustomersMetricsAcc,
                                            dailyCustomersMetric,
                                        ) => {
                                            monthlyCustomersMetricsAcc.customers
                                                .total += dailyCustomersMetric
                                                    .customers.total;

                                            monthlyCustomersMetricsAcc.customers
                                                .new.total +=
                                                    dailyCustomersMetric
                                                        .customers.new.total;
                                            monthlyCustomersMetricsAcc.customers
                                                .new.repair +=
                                                    dailyCustomersMetric
                                                        .customers.new.repair;
                                            monthlyCustomersMetricsAcc.customers
                                                .new.sales.total +=
                                                    dailyCustomersMetric
                                                        .customers.new.sales
                                                        .total;
                                            monthlyCustomersMetricsAcc.customers
                                                .new.sales.online +=
                                                    dailyCustomersMetric
                                                        .customers.new.sales
                                                        .online;
                                            monthlyCustomersMetricsAcc.customers
                                                .new.sales.inStore +=
                                                    dailyCustomersMetric
                                                        .customers.new.sales
                                                        .inStore;

                                            monthlyCustomersMetricsAcc.customers
                                                .returning.total +=
                                                    dailyCustomersMetric
                                                        .customers.returning
                                                        .total;
                                            monthlyCustomersMetricsAcc.customers
                                                .returning.repair +=
                                                    dailyCustomersMetric
                                                        .customers.returning
                                                        .repair;
                                            monthlyCustomersMetricsAcc.customers
                                                .returning.sales.total +=
                                                    dailyCustomersMetric
                                                        .customers.returning
                                                        .sales.total;
                                            monthlyCustomersMetricsAcc.customers
                                                .returning.sales.online +=
                                                    dailyCustomersMetric
                                                        .customers.returning
                                                        .sales.online;
                                            monthlyCustomersMetricsAcc.customers
                                                .returning.sales
                                                .inStore += dailyCustomersMetric
                                                    .customers.returning
                                                    .sales.inStore;

                                            monthlyCustomersMetricsAcc.customers
                                                .churnRate +=
                                                    dailyCustomersMetric
                                                        .customers.churnRate;
                                            monthlyCustomersMetricsAcc.customers
                                                .retentionRate +=
                                                    dailyCustomersMetric
                                                        .customers
                                                        .retentionRate;

                                            return monthlyCustomersMetricsAcc;
                                        },
                                        initialMonthlyCustomersMetrics,
                                    );

                            monthlyCustomersMetrics.customers.churnRate =
                                toFixedFloat(
                                    monthlyCustomersMetrics.customers
                                        .churnRate /
                                        dailyCustomersMetrics.length,
                                );

                            monthlyCustomersMetrics.customers
                                .retentionRate = toFixedFloat(
                                    monthlyCustomersMetrics.customers
                                        .retentionRate /
                                        dailyCustomersMetrics.length,
                                );

                            return monthlyCustomersMetrics;
                        },
                    );

                const initialYearlyCustomersMetrics: CustomerYearlyMetric = {
                    year,
                    customers: {
                        total: 0,
                        new: {
                            repair: 0,
                            sales: {
                                inStore: 0,
                                online: 0,
                                total: 0,
                            },
                            total: 0,
                        },
                        returning: {
                            repair: 0,
                            sales: {
                                inStore: 0,
                                online: 0,
                                total: 0,
                            },
                            total: 0,
                        },
                        churnRate: 0,
                        retentionRate: 0,
                    },
                    monthlyMetrics: monthlyCustomersMetrics,
                };

                const yearlyCustomersMetrics = monthlyCustomersMetrics
                    .reduce(
                        (
                            yearlyCustomersMetricsAcc,
                            monthlyCustomersMetric,
                        ) => {
                            yearlyCustomersMetricsAcc.customers.total +=
                                monthlyCustomersMetric.customers.total;

                            yearlyCustomersMetricsAcc.customers.new.total +=
                                monthlyCustomersMetric.customers.new.total;
                            yearlyCustomersMetricsAcc.customers.new
                                .repair += monthlyCustomersMetric.customers.new
                                    .repair;
                            yearlyCustomersMetricsAcc.customers.new.sales
                                .total += monthlyCustomersMetric.customers.new
                                    .sales.total;
                            yearlyCustomersMetricsAcc.customers.new.sales
                                .online += monthlyCustomersMetric.customers.new
                                    .sales.online;
                            yearlyCustomersMetricsAcc.customers.new.sales
                                .inStore += monthlyCustomersMetric.customers.new
                                    .sales.inStore;

                            yearlyCustomersMetricsAcc.customers.returning
                                .total += monthlyCustomersMetric.customers
                                    .returning.total;
                            yearlyCustomersMetricsAcc.customers.returning
                                .repair += monthlyCustomersMetric.customers
                                    .returning.repair;
                            yearlyCustomersMetricsAcc.customers.returning
                                .sales.total += monthlyCustomersMetric.customers
                                    .returning.sales.total;
                            yearlyCustomersMetricsAcc.customers.returning
                                .sales.online +=
                                    monthlyCustomersMetric.customers
                                        .returning.sales.online;
                            yearlyCustomersMetricsAcc.customers.returning
                                .sales.inStore +=
                                    monthlyCustomersMetric.customers
                                        .returning.sales.inStore;

                            yearlyCustomersMetricsAcc.customers.churnRate +=
                                monthlyCustomersMetric.customers.churnRate;
                            yearlyCustomersMetricsAcc.customers
                                .retentionRate +=
                                    monthlyCustomersMetric.customers
                                        .retentionRate;

                            return yearlyCustomersMetricsAcc;
                        },
                        initialYearlyCustomersMetrics,
                    );

                yearlyCustomersMetrics.customers.churnRate = toFixedFloat(
                    yearlyCustomersMetrics.customers.churnRate /
                        monthlyCustomersMetrics.length,
                );

                yearlyCustomersMetrics.customers.retentionRate = toFixedFloat(
                    yearlyCustomersMetrics.customers.retentionRate /
                        monthlyCustomersMetrics.length,
                );
                return yearlyCustomersMetrics;
            },
        );

        const randomLifetimeValue = Math.round(
            Math.random() * (2000 - 1000) + 1000,
        );
        const randomTotalCustomers = yearlyCustomersMetrics.reduce(
            (
                totalCustomersAcc,
                yearlyCustomersMetric,
                // was changed from +=
            ) => (totalCustomersAcc + yearlyCustomersMetric.customers.total),
            0,
        );

        const randomCustomerMetrics: CustomerMetrics = {
            totalCustomers: randomTotalCustomers,
            lifetimeValue: randomLifetimeValue,
            yearlyMetrics: yearlyCustomersMetrics,
        };

        return createSafeSuccessResult(randomCustomerMetrics);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

function createAllLocationsAggregatedCustomerMetricsSafe(
    {
        calgaryCustomerMetrics,
        edmontonCustomerMetrics,
        vancouverCustomerMetrics,
    }: {
        calgaryCustomerMetrics: CustomerMetrics;
        edmontonCustomerMetrics: CustomerMetrics;
        vancouverCustomerMetrics: CustomerMetrics;
    },
): SafeResult<CustomerMetrics> {
    try {
        // as edmonton metrics overlaps other stores' metrics, it is being used as
        // the base to which all other store locations' metrics are aggregated into

        const aggregatedBaseCustomerMetrics =
            aggregateStoresIntoBaseCustomerMetrics({
                baseCustomerMetrics: edmontonCustomerMetrics,
                storeCustomerMetrics: calgaryCustomerMetrics,
            });

        const aggregatedAllLocationsCustomerMetrics =
            aggregateStoresIntoBaseCustomerMetrics({
                baseCustomerMetrics: aggregatedBaseCustomerMetrics,
                storeCustomerMetrics: vancouverCustomerMetrics,
            });

        function aggregateStoresIntoBaseCustomerMetrics({
            baseCustomerMetrics,
            storeCustomerMetrics,
        }: {
            baseCustomerMetrics: CustomerMetrics;
            storeCustomerMetrics: CustomerMetrics;
        }) {
            const { lifetimeValue, totalCustomers, yearlyMetrics } =
                storeCustomerMetrics;

            baseCustomerMetrics.lifetimeValue =
                (baseCustomerMetrics.lifetimeValue + lifetimeValue) / 2;
            baseCustomerMetrics.totalCustomers += totalCustomers;

            return yearlyMetrics.reduce<CustomerMetrics>(
                (baseCustomerMetricsAcc, storeCustomerMetric) => {
                    const { year, customers, monthlyMetrics } =
                        storeCustomerMetric;
                    const {
                        total,
                        new: newCustomers,
                        returning: returningCustomers,
                        churnRate,
                        retentionRate,
                    } = customers;

                    const baseYearlyMetric = baseCustomerMetricsAcc
                        .yearlyMetrics.find(
                            (baseYearlyMetric) =>
                                baseYearlyMetric.year === year,
                        );
                    if (!baseYearlyMetric) {
                        return baseCustomerMetricsAcc;
                    }

                    baseYearlyMetric.customers.total += total;
                    baseYearlyMetric.customers.new.total += newCustomers.total;
                    baseYearlyMetric.customers.new.repair +=
                        newCustomers.repair;
                    baseYearlyMetric.customers.new.sales.total +=
                        newCustomers.sales.total;
                    baseYearlyMetric.customers.new.sales.online +=
                        newCustomers.sales.online;
                    baseYearlyMetric.customers.new.sales.inStore +=
                        newCustomers.sales.inStore;

                    baseYearlyMetric.customers.returning.total +=
                        returningCustomers.total;
                    baseYearlyMetric.customers.returning.repair +=
                        returningCustomers.repair;
                    baseYearlyMetric.customers.returning.sales.total +=
                        returningCustomers.sales.total;
                    baseYearlyMetric.customers.returning.sales.online +=
                        returningCustomers.sales.online;
                    baseYearlyMetric.customers.returning.sales.inStore +=
                        returningCustomers.sales.inStore;

                    baseYearlyMetric.customers.churnRate =
                        (baseYearlyMetric.customers.churnRate + churnRate) /
                        2;
                    baseYearlyMetric.customers.retentionRate =
                        (baseYearlyMetric.customers.retentionRate +
                            retentionRate) / 2;

                    monthlyMetrics.forEach((storeMonthlyMetric) => {
                        const { month, customers, dailyMetrics } =
                            storeMonthlyMetric;
                        const {
                            total,
                            new: newCustomers,
                            returning: returningCustomers,
                            churnRate,
                            retentionRate,
                        } = customers;

                        const baseMonthlyMetric = baseYearlyMetric
                            .monthlyMetrics.find(
                                (baseMonthlyMetric) =>
                                    baseMonthlyMetric.month === month,
                            );
                        if (!baseMonthlyMetric) {
                            return baseCustomerMetricsAcc;
                        }

                        baseMonthlyMetric.customers.total += total;
                        baseMonthlyMetric.customers.new.total +=
                            newCustomers.total;
                        baseMonthlyMetric.customers.new.repair +=
                            newCustomers.repair;
                        baseMonthlyMetric.customers.new.sales.total +=
                            newCustomers.sales.total;
                        baseMonthlyMetric.customers.new.sales.online +=
                            newCustomers.sales.online;
                        baseMonthlyMetric.customers.new.sales.inStore +=
                            newCustomers.sales.inStore;

                        baseMonthlyMetric.customers.returning.total +=
                            returningCustomers.total;
                        baseMonthlyMetric.customers.returning.repair +=
                            returningCustomers.repair;
                        baseMonthlyMetric.customers.returning.sales.total +=
                            returningCustomers.sales.total;
                        baseMonthlyMetric.customers.returning.sales
                            .online += returningCustomers.sales.online;
                        baseMonthlyMetric.customers.returning.sales
                            .inStore += returningCustomers.sales.inStore;

                        baseMonthlyMetric.customers.churnRate =
                            (baseMonthlyMetric.customers.churnRate +
                                churnRate) / 2;
                        baseMonthlyMetric.customers.retentionRate =
                            (baseMonthlyMetric.customers.retentionRate +
                                retentionRate) / 2;

                        dailyMetrics.forEach((storeDailyMetric) => {
                            const { day, customers } = storeDailyMetric;
                            const {
                                total,
                                new: newCustomers,
                                returning: returningCustomers,
                            } = customers;

                            const baseDailyMetric = baseMonthlyMetric
                                .dailyMetrics.find(
                                    (baseDailyMetric) =>
                                        baseDailyMetric.day === day,
                                );
                            if (!baseDailyMetric) {
                                return baseCustomerMetricsAcc;
                            }

                            baseDailyMetric.customers.total += total;
                            baseDailyMetric.customers.new.total +=
                                newCustomers.total;
                            baseDailyMetric.customers.new.repair +=
                                newCustomers.repair;
                            baseDailyMetric.customers.new.sales.total +=
                                newCustomers.sales.total;
                            baseDailyMetric.customers.new.sales.online +=
                                newCustomers.sales.online;
                            baseDailyMetric.customers.new.sales.inStore +=
                                newCustomers.sales.inStore;

                            baseDailyMetric.customers.returning.total +=
                                returningCustomers.total;
                            baseDailyMetric.customers.returning.repair +=
                                returningCustomers.repair;
                            baseDailyMetric.customers.returning.sales
                                .total += returningCustomers.sales.total;
                            baseDailyMetric.customers.returning.sales
                                .online += returningCustomers.sales.online;
                            baseDailyMetric.customers.returning.sales
                                .inStore += returningCustomers.sales.inStore;
                        });
                    });

                    return baseCustomerMetricsAcc;
                },
                baseCustomerMetrics,
            );
        }

        return createSafeSuccessResult(
            aggregatedAllLocationsCustomerMetrics,
        );
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

export {
    createAllLocationsAggregatedCustomerMetricsSafe,
    createRandomCustomerMetricsSafe,
};
