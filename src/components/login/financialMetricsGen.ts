/**
 * financialMetrics: {
    year: Year;
    averageOrderValue: number;
    conversionRate: number;
    netProfitMargin: number;

    expenses: {
      total: number;
      repair: number;
      sales: {
        total: number;
        inStore: number;
        online: number;
      };
    };

    profit: {
      total: number;
      repair: number;
      sales: {
        total: number;
        inStore: number;
        online: number;
      };
    };

    revenue: {
      total: number;
      repair: number;
      sales: {
        total: number;
        inStore: number;
        online: number;
      };
    };

    transactions: {
      total: number;
      repair: number;
      sales: {
        total: number;
        inStore: number;
        online: number;
      };
    };

    monthlyMetrics: {
      month: Month;
      averageOrderValue: number;
      conversionRate: number;
      netProfitMargin: number;

      expenses: {
        total: number;
        repair: number;
        sales: {
          total: number;
          inStore: number;
          online: number;
        };
      };

      profit: {
        total: number;
        repair: number;
        sales: {
          total: number;
          inStore: number;
          online: number;
        };
      };

      revenue: {
        total: number;
        repair: number;
        sales: {
          total: number;
          inStore: number;
          online: number;
        };
      };

      transactions: {
        total: number;
        repair: number;
        sales: {
          total: number;
          inStore: number;
          online: number;
        };
      };

      dailyMetrics: {
        day: string;
        averageOrderValue: number;
        conversionRate: number;
        netProfitMargin: number;

        // generated
        expenses: {
          total: number;
          repair: number;
          sales: {
            total: number;
            inStore: number;
            online: number;
          };
        };

        // calculated from expenses and revenue
        profit: {
          total: number;
          repair: number;
          sales: {
            total: number;
            inStore: number;
            online: number;
          };
        };

        // aggregated from metrics
        revenue: {
          total: number;
          repair: number;
          sales: {
            total: number;
            inStore: number;
            online: number;
          };
        };

        // aggregated from metrics
        transactions: {
          total: number;
          repair: number;
          sales: {
            total: number;
            inStore: number;
            online: number;
          };
        };
      }[];
    }[];
  }[];
 */

import { STORE_LOCATIONS } from "../../constants";
import { SafeResult, StoreLocation } from "../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    toFixedFloat,
} from "../../utils";
import { DAYS_PER_MONTH, MONTHS } from "../dashboard/constants";
import {
    BusinessMetric,
    DailyFinancialMetric,
    FinancialMetricCategories,
    LocationYearSpread,
    MonthlyFinancialMetric,
    YearlyFinancialMetric,
} from "../dashboard/types";
import {
    createRandomNumber,
    returnDaysInMonthsInYears,
} from "../dashboard/utils";

function createRandomFinancialMetricsSafe(
    businessMetrics: BusinessMetric[],
): SafeResult<
    (StoreLocation | YearlyFinancialMetric[])[][]
> {
    /**
     * - random daily profitMargin spread between [min, max] per year
     */
    const YEAR_PROFIT_MARGIN_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [0.03, 0.13],
            "2014": [0.04, 0.14],
            "2015": [0.05, 0.15],
            "2016": [0.06, 0.16],
            "2017": [0.11, 0.21],
            "2018": [0.13, 0.23],
            "2019": [0.15, 0.25],
            "2020": [0.25, 0.35],
            "2021": [0.27, 0.37],
            "2022": [0.27, 0.37],
            "2023": [0.23, 0.33],
            "2024": [0.21, 0.31],
            "2025": [0.2, 0.3],
        },
        Calgary: {
            "2017": [0.07, 0.17],
            "2018": [0.08, 0.18],
            "2019": [0.09, 0.19],
            "2020": [0.15, 0.25],
            "2021": [0.17, 0.27],
            "2022": [0.17, 0.27],
            "2023": [0.13, 0.23],
            "2024": [0.12, 0.22],
            "2025": [0.11, 0.21],
        },
        Vancouver: {
            "2019": [0.09, 0.19],
            "2020": [0.13, 0.23],
            "2021": [0.17, 0.27],
            "2022": [0.17, 0.27],
            "2023": [0.15, 0.25],
            "2024": [0.14, 0.24],
            "2025": [0.13, 0.23],
        },
    };

    /**
     * ratio of repair profit to total profit spread between [min, max] per year
     */
    const YEAR_REPAIR_PROFIT_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [0, 0.01],
            "2014": [0.01, 0.015],
            "2015": [0.015, 0.02],
            "2016": [0.02, 0.025],
            "2017": [0.05, 0.055],
            "2018": [0.055, 0.06],
            "2019": [0.06, 0.065],
            "2020": [0.08, 0.085],
            "2021": [0.085, 0.09],
            "2022": [0.085, 0.09],
            "2023": [0.075, 0.08],
            "2024": [0.07, 0.075],
            "2025": [0.065, 0.07],
        },
        Calgary: {
            "2017": [0.02, 0.025],
            "2018": [0.025, 0.03],
            "2019": [0.03, 0.035],
            "2020": [0.05, 0.055],
            "2021": [0.055, 0.06],
            "2022": [0.055, 0.06],
            "2023": [0.045, 0.05],
            "2024": [0.04, 0.045],
            "2025": [0.035, 0.04],
        },
        Vancouver: {
            "2019": [0.03, 0.035],
            "2020": [0.045, 0.05],
            "2021": [0.055, 0.06],
            "2022": [0.055, 0.06],
            "2023": [0.05, 0.055],
            "2024": [0.045, 0.05],
            "2025": [0.04, 0.045],
        },
    };

    /**
     * ratio of online profit to (total profit - repair profit) spread between [min, max] per year
     */
    const YEAR_ONLINE_PROFIT_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [0.3, 0.35],
            "2014": [0.35, 0.4],
            "2015": [0.4, 0.45],
            "2016": [0.45, 0.5],
            "2017": [0.5, 0.55],
            "2018": [0.55, 0.6],
            "2019": [0.6, 0.65],
            "2020": [0.65, 0.7],
            "2021": [0.7, 0.75],
            "2022": [0.7, 0.75],
            "2023": [0.65, 0.7],
            "2024": [0.6, 0.65],
            "2025": [0.55, 0.6],
        },
        Calgary: {
            "2017": [0.4, 0.45],
            "2018": [0.45, 0.5],
            "2019": [0.5, 0.55],
            "2020": [0.55, 0.6],
            "2021": [0.6, 0.65],
            "2022": [0.6, 0.65],
            "2023": [0.55, 0.6],
            "2024": [0.5, 0.55],
            "2025": [0.45, 0.5],
        },
        Vancouver: {
            "2019": [0.45, 0.5],
            "2020": [0.55, 0.6],
            "2021": [0.6, 0.65],
            "2022": [0.6, 0.65],
            "2023": [0.55, 0.6],
            "2024": [0.5, 0.55],
            "2025": [0.45, 0.5],
        },
    };

    /**
     * ratio of repair expenses to total expenses spread between [min, max] per year
     */
    const YEAR_REPAIR_EXPENSES_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [0.23, 0.25],
            "2014": [0.21, 0.23],
            "2015": [0.19, 0.21],
            "2016": [0.17, 0.19],
            "2017": [0.15, 0.17],
            "2018": [0.13, 0.15],
            "2019": [0.11, 0.13],
            "2020": [0.1, 0.12],
            "2021": [0.09, 0.11],
            "2022": [0.09, 0.1],
            "2023": [0.1, 0.11],
            "2024": [0.1, 0.11],
            "2025": [0.1, 0.10],
        },
        Calgary: {
            "2017": [0.15, 0.17],
            "2018": [0.13, 0.15],
            "2019": [0.11, 0.13],
            "2020": [0.1, 0.12],
            "2021": [0.09, 0.11],
            "2022": [0.09, 0.1],
            "2023": [0.1, 0.11],
            "2024": [0.1, 0.11],
            "2025": [0.1, 0.11],
        },
        Vancouver: {
            "2019": [0.11, 0.13],
            "2020": [0.1, 0.12],
            "2021": [0.09, 0.11],
            "2022": [0.09, 0.1],
            "2023": [0.1, 0.11],
            "2024": [0.1, 0.11],
            "2025": [0.1, 0.11],
        },
    };

    /**
     * ratio of online expenses to sales expenses spread between [min, max] per year
     */
    const YEAR_ONLINE_EXPENSES_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [0.2, 0.22],
            "2014": [0.18, 0.2],
            "2015": [0.16, 0.18],
            "2016": [0.14, 0.16],
            "2017": [0.1, 0.12],
            "2018": [0.08, 0.1],
            "2019": [0.06, 0.08],
            "2020": [0.05, 0.07],
            "2021": [0.04, 0.06],
            "2022": [0.04, 0.06],
            "2023": [0.05, 0.07],
            "2024": [0.05, 0.07],
            "2025": [0.05, 0.07],
        },
        Calgary: {
            "2017": [0.14, 0.16],
            "2018": [0.12, 0.14],
            "2019": [0.1, 0.12],
            "2020": [0.08, 0.1],
            "2021": [0.06, 0.08],
            "2022": [0.06, 0.08],
            "2023": [0.05, 0.07],
            "2024": [0.05, 0.07],
            "2025": [0.05, 0.07],
        },
        Vancouver: {
            "2019": [0.1, 0.12],
            "2020": [0.08, 0.1],
            "2021": [0.06, 0.08],
            "2022": [0.06, 0.08],
            "2023": [0.05, 0.07],
            "2024": [0.05, 0.07],
            "2025": [0.05, 0.07],
        },
    };

    /**
     * conversion rate spread between [min, max] per year
     * @see https://www.ruleranalytics.com/blog/insight/conversion-rate-by-industry/
     */
    const YEAR_CONVERSION_RATE_SPREAD: LocationYearSpread = {
        Edmonton: {
            "2013": [0.01, 0.011],
            "2014": [0.011, 0.012],
            "2015": [0.012, 0.013],
            "2016": [0.013, 0.014],
            "2017": [0.02, 0.025],
            "2018": [0.025, 0.03],
            "2019": [0.03, 0.035],
            "2020": [0.035, 0.04],
            "2021": [0.04, 0.045],
            "2022": [0.04, 0.045],
            "2023": [0.035, 0.04],
            "2024": [0.03, 0.035],
            "2025": [0.025, 0.03],
        },
        Calgary: {
            "2017": [0.02, 0.025],
            "2018": [0.025, 0.03],
            "2019": [0.03, 0.035],
            "2020": [0.035, 0.04],
            "2021": [0.04, 0.045],
            "2022": [0.04, 0.045],
            "2023": [0.035, 0.04],
            "2024": [0.03, 0.035],
            "2025": [0.025, 0.03],
        },
        Vancouver: {
            "2019": [0.03, 0.035],
            "2020": [0.035, 0.04],
            "2021": [0.04, 0.045],
            "2022": [0.04, 0.045],
            "2023": [0.035, 0.04],
            "2024": [0.03, 0.035],
            "2025": [0.025, 0.03],
        },
    };

    const YEARLY_FINANCIAL_METRICS_TEMPLATE: YearlyFinancialMetric = {
        year: "2013",
        averageOrderValue: 0,
        conversionRate: 0,
        netProfitMargin: 0,

        expenses: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        profit: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        revenue: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        transactions: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        monthlyMetrics: [],
    };

    const MONTHLY_FINANCIAL_METRICS_TEMPLATE: MonthlyFinancialMetric = {
        month: "January",
        averageOrderValue: 0,
        conversionRate: 0,
        netProfitMargin: 0,

        expenses: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        profit: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        revenue: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        transactions: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        dailyMetrics: [],
    };

    const DAILY_FINANCIAL_METRICS_TEMPLATE: DailyFinancialMetric = {
        day: "2021-01-01",
        averageOrderValue: 0,
        conversionRate: 0,
        netProfitMargin: 0,

        expenses: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        profit: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        revenue: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },

        transactions: {
            total: 0,
            repair: 0,
            sales: {
                total: 0,
                online: 0,
                inStore: 0,
            },
        },
    };

    try {
        const randomFinancialMetrics = STORE_LOCATIONS.map(
            ({ value: storeLocation }) => {
                // for this store location, find the created product and repair metrics
                const businessMetric = businessMetrics.find(
                    (businessMetric) =>
                        businessMetric.storeLocation === storeLocation,
                );
                if (!businessMetric) {
                    return [];
                }

                const { productMetrics, repairMetrics } = businessMetric;

                // 'All Products' category in productMetrics is already aggregated from other product categories
                const allProductsCategory = productMetrics.find(
                    (productMetric) => productMetric.name === "All Products",
                );
                // 'All Repairs' category in repairMetrics is already aggregated from other repair categories
                const allRepairsCategory = repairMetrics.find(
                    (repairMetric) => repairMetric.name === "All Repairs",
                );
                if (!allProductsCategory || !allRepairsCategory) {
                    return [];
                }

                const daysInMonthsInYears = returnDaysInMonthsInYears({
                    daysPerMonth: DAYS_PER_MONTH,
                    months: MONTHS,
                    storeLocation,
                });

                const yearlyFinancialMetrics = Array.from(daysInMonthsInYears)
                    .map(
                        (yearTuple) => {
                            const [year, daysInMonthsMap] = yearTuple;

                            const yearlyProductMetrics = allProductsCategory
                                .yearlyMetrics.find(
                                    (yearlyProductMetric) =>
                                        yearlyProductMetric.year === year,
                                );
                            const yearlyRepairMetrics = allRepairsCategory
                                .yearlyMetrics
                                .find(
                                    (yearlyRepairMetric) =>
                                        yearlyRepairMetric.year === year,
                                );
                            if (!yearlyProductMetrics || !yearlyRepairMetrics) {
                                return YEARLY_FINANCIAL_METRICS_TEMPLATE;
                            }

                            const monthlyFinancialMetrics = Array.from(
                                daysInMonthsMap,
                            )
                                .map(
                                    (monthTuple) => {
                                        const [month, daysRange] = monthTuple;

                                        const monthlyProductMetrics =
                                            yearlyProductMetrics
                                                .monthlyMetrics.find(
                                                    (monthlyProductMetric) =>
                                                        monthlyProductMetric
                                                            .month ===
                                                            month,
                                                );
                                        const monthlyRepairMetrics =
                                            yearlyRepairMetrics
                                                .monthlyMetrics.find(
                                                    (monthlyRepairMetric) =>
                                                        monthlyRepairMetric
                                                            .month === month,
                                                );
                                        if (
                                            !monthlyProductMetrics ||
                                            !monthlyRepairMetrics
                                        ) {
                                            return MONTHLY_FINANCIAL_METRICS_TEMPLATE;
                                        }

                                        const dailyFinancialMetrics = daysRange
                                            .map(
                                                (day) => {
                                                    const dailyProductMetrics =
                                                        monthlyProductMetrics
                                                            .dailyMetrics.find(
                                                                (
                                                                    dailyProductMetric,
                                                                ) => dailyProductMetric
                                                                    .day ===
                                                                    day,
                                                            );
                                                    const dailyRepairMetrics =
                                                        monthlyRepairMetrics
                                                            .dailyMetrics.find(
                                                                (
                                                                    dailyRepairMetric,
                                                                ) => dailyRepairMetric
                                                                    .day ===
                                                                    day,
                                                            );
                                                    if (
                                                        !dailyProductMetrics ||
                                                        !dailyRepairMetrics
                                                    ) {
                                                        return DAILY_FINANCIAL_METRICS_TEMPLATE;
                                                    }

                                                    const dailyTransactions:
                                                        FinancialMetricCategories =
                                                            {
                                                                total:
                                                                    dailyProductMetrics
                                                                        .unitsSold
                                                                        .total +
                                                                    dailyRepairMetrics
                                                                        .unitsRepaired,
                                                                repair:
                                                                    dailyRepairMetrics
                                                                        .unitsRepaired,
                                                                sales: {
                                                                    total:
                                                                        dailyProductMetrics
                                                                            .unitsSold
                                                                            .total,
                                                                    inStore:
                                                                        dailyProductMetrics
                                                                            .unitsSold
                                                                            .inStore,
                                                                    online:
                                                                        dailyProductMetrics
                                                                            .unitsSold
                                                                            .online,
                                                                },
                                                            };

                                                    const dailyRevenues:
                                                        FinancialMetricCategories =
                                                            {
                                                                total:
                                                                    dailyProductMetrics
                                                                        .revenue
                                                                        .total +
                                                                    dailyRepairMetrics
                                                                        .revenue,
                                                                repair:
                                                                    dailyRepairMetrics
                                                                        .revenue,
                                                                sales: {
                                                                    total:
                                                                        dailyProductMetrics
                                                                            .revenue
                                                                            .total,
                                                                    inStore:
                                                                        dailyProductMetrics
                                                                            .revenue
                                                                            .inStore,
                                                                    online:
                                                                        dailyProductMetrics
                                                                            .revenue
                                                                            .inStore,
                                                                },
                                                            };

                                                    const dailyAverageOrderValue =
                                                        Math
                                                            .round(
                                                                dailyRevenues
                                                                    .total /
                                                                    dailyTransactions
                                                                        .total,
                                                            );

                                                    let dailyConversionRate =
                                                        createRandomNumber({
                                                            storeLocation,
                                                            year,
                                                            yearUnitsSpread:
                                                                YEAR_CONVERSION_RATE_SPREAD,
                                                            defaultMax: 0.03,
                                                            defaultMin: 0.01,
                                                            isFraction: true,
                                                        });
                                                    dailyConversionRate =
                                                        toFixedFloat(
                                                            dailyConversionRate,
                                                        );

                                                    // generate expenses to calculate profit

                                                    let dailyNetProfitMargin =
                                                        createRandomNumber({
                                                            storeLocation,
                                                            year,
                                                            yearUnitsSpread:
                                                                YEAR_PROFIT_MARGIN_SPREAD,
                                                            defaultMax: 0.3,
                                                            defaultMin: 0.1,
                                                            isFraction: true,
                                                        });
                                                    dailyNetProfitMargin =
                                                        toFixedFloat(
                                                            dailyNetProfitMargin,
                                                        );

                                                    const dailyProfit = Math
                                                        .round(
                                                            dailyRevenues
                                                                .total *
                                                                dailyNetProfitMargin,
                                                        );

                                                    const dailyRepairProfitFraction =
                                                        createRandomNumber({
                                                            storeLocation,
                                                            year,
                                                            yearUnitsSpread:
                                                                YEAR_REPAIR_PROFIT_SPREAD,
                                                            defaultMax: 0.3,
                                                            defaultMin: 0.1,
                                                            isFraction: true,
                                                        });
                                                    const dailyRepairProfit =
                                                        Math.round(
                                                            dailyRepairProfitFraction *
                                                                dailyProfit,
                                                        );

                                                    const dailySalesProfit =
                                                        Math.round(
                                                            dailyProfit -
                                                                dailyRepairProfit,
                                                        );

                                                    const dailyOnlineProfitFraction =
                                                        createRandomNumber({
                                                            storeLocation,
                                                            year,
                                                            yearUnitsSpread:
                                                                YEAR_ONLINE_PROFIT_SPREAD,
                                                            defaultMax: 0.03,
                                                            defaultMin: 0.01,
                                                            isFraction: true,
                                                        });
                                                    const dailyOnlineProfit =
                                                        Math.round(
                                                            dailySalesProfit *
                                                                dailyOnlineProfitFraction,
                                                        );

                                                    const dailyInStoreProfit =
                                                        dailySalesProfit -
                                                        dailyOnlineProfit;

                                                    const dailyProfits:
                                                        FinancialMetricCategories =
                                                            {
                                                                total:
                                                                    dailyProfit,
                                                                repair:
                                                                    dailyRepairProfit,
                                                                sales: {
                                                                    total:
                                                                        dailySalesProfit,
                                                                    inStore:
                                                                        dailyInStoreProfit,
                                                                    online:
                                                                        dailyOnlineProfit,
                                                                },
                                                            };

                                                    const dailyExpense = Math
                                                        .round(
                                                            dailyRevenues
                                                                .total -
                                                                dailyProfit,
                                                        );

                                                    const dailyRepairExpenseFraction =
                                                        createRandomNumber({
                                                            storeLocation,
                                                            year,
                                                            yearUnitsSpread:
                                                                YEAR_REPAIR_EXPENSES_SPREAD,
                                                            defaultMax: 0.3,
                                                            defaultMin: 0.1,
                                                            isFraction: true,
                                                        });
                                                    const dailyRepairExpense =
                                                        Math.round(
                                                            dailyRepairExpenseFraction *
                                                                dailyExpense,
                                                        );

                                                    const dailySalesExpense =
                                                        dailyExpense -
                                                        dailyRepairExpense;

                                                    const dailyOnlineExpenseFraction =
                                                        createRandomNumber({
                                                            storeLocation,
                                                            year,
                                                            yearUnitsSpread:
                                                                YEAR_ONLINE_EXPENSES_SPREAD,
                                                            defaultMax: 0.03,
                                                            defaultMin: 0.01,
                                                            isFraction: true,
                                                        });
                                                    const dailyOnlineExpense =
                                                        Math.round(
                                                            dailySalesExpense *
                                                                dailyOnlineExpenseFraction,
                                                        );

                                                    const dailyInStoreExpense =
                                                        dailySalesExpense -
                                                        dailyOnlineExpense;

                                                    const dailyExpenses:
                                                        FinancialMetricCategories =
                                                            {
                                                                total:
                                                                    dailyExpense,
                                                                repair:
                                                                    dailyRepairExpense,
                                                                sales: {
                                                                    total:
                                                                        dailySalesExpense,
                                                                    inStore:
                                                                        dailyInStoreExpense,
                                                                    online:
                                                                        dailyOnlineExpense,
                                                                },
                                                            };

                                                    const dailyFinancialMetric:
                                                        DailyFinancialMetric = {
                                                            day,
                                                            averageOrderValue:
                                                                dailyAverageOrderValue,
                                                            conversionRate:
                                                                dailyConversionRate,
                                                            netProfitMargin:
                                                                dailyNetProfitMargin,
                                                            expenses:
                                                                dailyExpenses,
                                                            profit:
                                                                dailyProfits,
                                                            revenue:
                                                                dailyRevenues,
                                                            transactions:
                                                                dailyTransactions,
                                                        };

                                                    return dailyFinancialMetric;
                                                },
                                            );

                                        // aggregate created daily financial metrics into monthly financial metrics

                                        const monthlyFinancialMetric =
                                            dailyFinancialMetrics
                                                .reduce<MonthlyFinancialMetric>(
                                                    (
                                                        monthlyFinancialMetricAcc,
                                                        dailyFinancialMetric,
                                                    ) => {
                                                        monthlyFinancialMetricAcc
                                                            .month = month;

                                                        monthlyFinancialMetricAcc
                                                            .averageOrderValue +=
                                                                dailyFinancialMetric
                                                                    .averageOrderValue;
                                                        monthlyFinancialMetricAcc
                                                            .conversionRate +=
                                                                dailyFinancialMetric
                                                                    .conversionRate;
                                                        monthlyFinancialMetricAcc
                                                            .netProfitMargin +=
                                                                dailyFinancialMetric
                                                                    .netProfitMargin;

                                                        monthlyFinancialMetricAcc
                                                            .expenses
                                                            .total +=
                                                                dailyFinancialMetric
                                                                    .expenses
                                                                    .total;
                                                        monthlyFinancialMetricAcc
                                                            .expenses
                                                            .repair +=
                                                                dailyFinancialMetric
                                                                    .expenses
                                                                    .repair;
                                                        monthlyFinancialMetricAcc
                                                            .expenses.sales
                                                            .total +=
                                                                dailyFinancialMetric
                                                                    .expenses
                                                                    .sales
                                                                    .total;
                                                        monthlyFinancialMetricAcc
                                                            .expenses.sales
                                                            .inStore +=
                                                                dailyFinancialMetric
                                                                    .expenses
                                                                    .sales
                                                                    .inStore;
                                                        monthlyFinancialMetricAcc
                                                            .expenses.sales
                                                            .online +=
                                                                dailyFinancialMetric
                                                                    .expenses
                                                                    .sales
                                                                    .online;

                                                        monthlyFinancialMetricAcc
                                                            .profit
                                                            .total +=
                                                                dailyFinancialMetric
                                                                    .profit
                                                                    .total;
                                                        monthlyFinancialMetricAcc
                                                            .profit
                                                            .repair +=
                                                                dailyFinancialMetric
                                                                    .profit
                                                                    .repair;
                                                        monthlyFinancialMetricAcc
                                                            .profit
                                                            .sales
                                                            .total +=
                                                                dailyFinancialMetric
                                                                    .profit
                                                                    .sales
                                                                    .total;
                                                        monthlyFinancialMetricAcc
                                                            .profit
                                                            .sales
                                                            .inStore +=
                                                                dailyFinancialMetric
                                                                    .profit
                                                                    .sales
                                                                    .inStore;
                                                        monthlyFinancialMetricAcc
                                                            .profit
                                                            .sales
                                                            .online +=
                                                                dailyFinancialMetric
                                                                    .profit
                                                                    .sales
                                                                    .online;

                                                        monthlyFinancialMetricAcc
                                                            .revenue
                                                            .total +=
                                                                dailyFinancialMetric
                                                                    .revenue
                                                                    .total;
                                                        monthlyFinancialMetricAcc
                                                            .revenue
                                                            .repair +=
                                                                dailyFinancialMetric
                                                                    .revenue
                                                                    .repair;
                                                        monthlyFinancialMetricAcc
                                                            .revenue.sales
                                                            .total +=
                                                                dailyFinancialMetric
                                                                    .revenue
                                                                    .sales
                                                                    .total;
                                                        monthlyFinancialMetricAcc
                                                            .revenue.sales
                                                            .inStore +=
                                                                dailyFinancialMetric
                                                                    .revenue
                                                                    .sales
                                                                    .inStore;
                                                        monthlyFinancialMetricAcc
                                                            .revenue.sales
                                                            .online +=
                                                                dailyFinancialMetric
                                                                    .revenue
                                                                    .sales
                                                                    .online;

                                                        monthlyFinancialMetricAcc
                                                            .transactions
                                                            .total +=
                                                                dailyFinancialMetric
                                                                    .transactions
                                                                    .total;
                                                        monthlyFinancialMetricAcc
                                                            .transactions
                                                            .repair +=
                                                                dailyFinancialMetric
                                                                    .transactions
                                                                    .repair;
                                                        monthlyFinancialMetricAcc
                                                            .transactions
                                                            .sales
                                                            .total +=
                                                                dailyFinancialMetric
                                                                    .transactions
                                                                    .sales
                                                                    .total;
                                                        monthlyFinancialMetricAcc
                                                            .transactions
                                                            .sales
                                                            .inStore +=
                                                                dailyFinancialMetric
                                                                    .transactions
                                                                    .sales
                                                                    .inStore;
                                                        monthlyFinancialMetricAcc
                                                            .transactions
                                                            .sales
                                                            .online +=
                                                                dailyFinancialMetric
                                                                    .transactions
                                                                    .sales
                                                                    .online;

                                                        return monthlyFinancialMetricAcc;
                                                    },
                                                    structuredClone(
                                                        MONTHLY_FINANCIAL_METRICS_TEMPLATE,
                                                    ),
                                                );

                                        monthlyFinancialMetric
                                            .averageOrderValue = Math
                                                .round(
                                                    monthlyFinancialMetric
                                                        .averageOrderValue /
                                                        dailyFinancialMetrics
                                                            .length,
                                                );
                                        monthlyFinancialMetric.conversionRate =
                                            toFixedFloat(
                                                monthlyFinancialMetric
                                                    .conversionRate /
                                                    dailyFinancialMetrics
                                                        .length,
                                            );
                                        monthlyFinancialMetric.netProfitMargin =
                                            toFixedFloat(
                                                monthlyFinancialMetric
                                                    .netProfitMargin /
                                                    dailyFinancialMetrics
                                                        .length,
                                                2,
                                            );
                                        monthlyFinancialMetric.dailyMetrics =
                                            dailyFinancialMetrics;

                                        return monthlyFinancialMetric;
                                    },
                                );

                            // aggregate created monthly financial metrics into yearly financial metrics

                            const yearlyFinancialMetric =
                                monthlyFinancialMetrics
                                    .reduce<YearlyFinancialMetric>(
                                        (
                                            yearlyFinancialMetricAcc,
                                            monthlyFinancialMetric,
                                        ) => {
                                            yearlyFinancialMetricAcc.year =
                                                year;

                                            yearlyFinancialMetricAcc
                                                .averageOrderValue +=
                                                    monthlyFinancialMetric
                                                        .averageOrderValue;
                                            yearlyFinancialMetricAcc
                                                .conversionRate +=
                                                    monthlyFinancialMetric
                                                        .conversionRate;
                                            yearlyFinancialMetricAcc
                                                .netProfitMargin +=
                                                    monthlyFinancialMetric
                                                        .netProfitMargin;

                                            yearlyFinancialMetricAcc.expenses
                                                .total +=
                                                    monthlyFinancialMetric
                                                        .expenses.total;
                                            yearlyFinancialMetricAcc.expenses
                                                .repair +=
                                                    monthlyFinancialMetric
                                                        .expenses.repair;
                                            yearlyFinancialMetricAcc.expenses
                                                .sales.total +=
                                                    monthlyFinancialMetric
                                                        .expenses.sales.total;
                                            yearlyFinancialMetricAcc.expenses
                                                .sales
                                                .inStore +=
                                                    monthlyFinancialMetric
                                                        .expenses.sales
                                                        .inStore;
                                            yearlyFinancialMetricAcc.expenses
                                                .sales
                                                .online +=
                                                    monthlyFinancialMetric
                                                        .expenses.sales
                                                        .online;

                                            yearlyFinancialMetricAcc.profit
                                                .total +=
                                                    monthlyFinancialMetric
                                                        .profit.total;
                                            yearlyFinancialMetricAcc.profit
                                                .repair +=
                                                    monthlyFinancialMetric
                                                        .profit.repair;
                                            yearlyFinancialMetricAcc.profit
                                                .sales.total +=
                                                    monthlyFinancialMetric
                                                        .profit.sales.total;
                                            yearlyFinancialMetricAcc.profit
                                                .sales.inStore +=
                                                    monthlyFinancialMetric
                                                        .profit.sales.inStore;
                                            yearlyFinancialMetricAcc.profit
                                                .sales.online +=
                                                    monthlyFinancialMetric
                                                        .profit.sales.online;

                                            yearlyFinancialMetricAcc.revenue
                                                .total +=
                                                    monthlyFinancialMetric
                                                        .revenue.total;
                                            yearlyFinancialMetricAcc.revenue
                                                .repair +=
                                                    monthlyFinancialMetric
                                                        .revenue.repair;
                                            yearlyFinancialMetricAcc.revenue
                                                .sales.total +=
                                                    monthlyFinancialMetric
                                                        .revenue.sales.total;
                                            yearlyFinancialMetricAcc.revenue
                                                .sales
                                                .inStore +=
                                                    monthlyFinancialMetric
                                                        .revenue.sales
                                                        .inStore;
                                            yearlyFinancialMetricAcc.revenue
                                                .sales.online +=
                                                    monthlyFinancialMetric
                                                        .revenue.sales.online;

                                            yearlyFinancialMetricAcc
                                                .transactions.total +=
                                                    monthlyFinancialMetric
                                                        .transactions.total;
                                            yearlyFinancialMetricAcc
                                                .transactions.repair +=
                                                    monthlyFinancialMetric
                                                        .transactions.repair;
                                            yearlyFinancialMetricAcc
                                                .transactions.sales
                                                .total +=
                                                    monthlyFinancialMetric
                                                        .transactions
                                                        .sales.total;
                                            yearlyFinancialMetricAcc
                                                .transactions.sales
                                                .inStore +=
                                                    monthlyFinancialMetric
                                                        .transactions
                                                        .sales
                                                        .inStore;
                                            yearlyFinancialMetricAcc
                                                .transactions.sales
                                                .online +=
                                                    monthlyFinancialMetric
                                                        .transactions
                                                        .sales
                                                        .online;

                                            return yearlyFinancialMetricAcc;
                                        },
                                        structuredClone(
                                            YEARLY_FINANCIAL_METRICS_TEMPLATE,
                                        ),
                                    );

                            yearlyFinancialMetric.averageOrderValue = Math
                                .round(
                                    yearlyFinancialMetric.averageOrderValue /
                                        monthlyFinancialMetrics.length,
                                );
                            yearlyFinancialMetric.conversionRate = toFixedFloat(
                                yearlyFinancialMetric.conversionRate /
                                    monthlyFinancialMetrics.length,
                            );
                            yearlyFinancialMetric.netProfitMargin =
                                toFixedFloat(
                                    yearlyFinancialMetric.netProfitMargin /
                                        monthlyFinancialMetrics.length,
                                    2,
                                );
                            yearlyFinancialMetric.monthlyMetrics =
                                monthlyFinancialMetrics;

                            return yearlyFinancialMetric;
                        },
                    );

                return [storeLocation, yearlyFinancialMetrics];
            },
        );

        return createSafeSuccessResult(randomFinancialMetrics);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

function createAllLocationsAggregatedFinancialMetricsSafe(
    businessMetrics: BusinessMetric[],
): SafeResult<YearlyFinancialMetric[]> {
    // find all financial metrics for each store location
    const initialFinancialMetrics: Record<string, YearlyFinancialMetric[]> = {
        edmontonFinancialMetrics: [],
        calgaryFinancialMetrics: [],
        vancouverFinancialMetrics: [],
    };

    try {
        const {
            calgaryFinancialMetrics,
            edmontonFinancialMetrics,
            vancouverFinancialMetrics,
        } = businessMetrics.reduce((financialMetricsAcc, businessMetric) => {
            const { storeLocation, financialMetrics } = businessMetric;

            switch (storeLocation) {
                case "Calgary": {
                    financialMetricsAcc.calgaryFinancialMetrics =
                        financialMetrics;
                    break;
                }
                case "Edmonton": {
                    financialMetricsAcc.edmontonFinancialMetrics =
                        structuredClone(
                            financialMetrics,
                        );
                    break;
                }
                // case "Vancouver"
                default: {
                    financialMetricsAcc.vancouverFinancialMetrics =
                        financialMetrics;
                    break;
                }
            }

            return financialMetricsAcc;
        }, initialFinancialMetrics);

        // as edmonton metrics are a superset of all other stores' metrics, it is being used as
        // the base to which all other store locations' metrics are aggregated into

        const aggregatedBaseFinancialMetrics =
            aggregateStoresIntoBaseFinancialMetrics({
                baseFinancialMetrics: edmontonFinancialMetrics,
                storeFinancialMetrics: calgaryFinancialMetrics,
            });

        const aggregatedAllLocationsFinancialMetrics =
            aggregateStoresIntoBaseFinancialMetrics({
                baseFinancialMetrics: aggregatedBaseFinancialMetrics,
                storeFinancialMetrics: vancouverFinancialMetrics,
            });

        function aggregateStoresIntoBaseFinancialMetrics({
            baseFinancialMetrics,
            storeFinancialMetrics,
        }: {
            baseFinancialMetrics: YearlyFinancialMetric[];
            storeFinancialMetrics: YearlyFinancialMetric[];
        }) {
            return storeFinancialMetrics.reduce<YearlyFinancialMetric[]>(
                (baseFinancialMetricsAcc, storeFinancialMetric) => {
                    const {
                        year,
                        averageOrderValue,
                        conversionRate,
                        netProfitMargin,
                        expenses,
                        monthlyMetrics,
                        profit,
                        revenue,
                        transactions,
                    } = storeFinancialMetric;

                    const baseYearlyMetric = baseFinancialMetricsAcc.find(
                        (baseYearlyMetric) => baseYearlyMetric.year === year,
                    );
                    if (!baseYearlyMetric) {
                        return baseFinancialMetricsAcc;
                    }

                    baseYearlyMetric.averageOrderValue =
                        (baseYearlyMetric.averageOrderValue +
                            averageOrderValue) /
                        2;
                    baseYearlyMetric.conversionRate =
                        (baseYearlyMetric.conversionRate + conversionRate) / 2;
                    baseYearlyMetric.netProfitMargin =
                        (baseYearlyMetric.netProfitMargin + netProfitMargin) /
                        2;

                    baseYearlyMetric.expenses.total += expenses.total;
                    baseYearlyMetric.expenses.repair += expenses.repair;
                    baseYearlyMetric.expenses.sales.total +=
                        expenses.sales.total;
                    baseYearlyMetric.expenses.sales.inStore +=
                        expenses.sales.inStore;
                    baseYearlyMetric.expenses.sales.online +=
                        expenses.sales.online;

                    baseYearlyMetric.profit.total += profit.total;
                    baseYearlyMetric.profit.repair += profit.repair;
                    baseYearlyMetric.profit.sales.total += profit.sales.total;
                    baseYearlyMetric.profit.sales.inStore +=
                        profit.sales.inStore;
                    baseYearlyMetric.profit.sales.online += profit.sales.online;

                    baseYearlyMetric.revenue.total += revenue.total;
                    baseYearlyMetric.revenue.repair += revenue.repair;
                    baseYearlyMetric.revenue.sales.total += revenue.sales.total;
                    baseYearlyMetric.revenue.sales.inStore +=
                        revenue.sales.inStore;
                    baseYearlyMetric.revenue.sales.online +=
                        revenue.sales.online;

                    baseYearlyMetric.transactions.total += transactions.total;
                    baseYearlyMetric.transactions.repair += transactions.repair;
                    baseYearlyMetric.transactions.sales.total +=
                        transactions.sales.total;
                    baseYearlyMetric.transactions.sales.inStore +=
                        transactions.sales.inStore;
                    baseYearlyMetric.transactions.sales.online +=
                        transactions.sales.online;

                    monthlyMetrics.forEach((storeMonthlyMetric) => {
                        const {
                            month,
                            averageOrderValue,
                            conversionRate,
                            netProfitMargin,
                            expenses,
                            profit,
                            revenue,
                            transactions,
                            dailyMetrics,
                        } = storeMonthlyMetric;

                        const baseMonthlyMetric = baseYearlyMetric
                            .monthlyMetrics
                            .find(
                                (baseMonthlyMetric) =>
                                    baseMonthlyMetric.month === month,
                            );
                        if (!baseMonthlyMetric) {
                            return;
                        }

                        baseMonthlyMetric.averageOrderValue +=
                            (baseMonthlyMetric.averageOrderValue +
                                averageOrderValue) / 2;
                        baseMonthlyMetric.conversionRate +=
                            (baseMonthlyMetric.conversionRate +
                                conversionRate) / 2;
                        baseMonthlyMetric.netProfitMargin +=
                            (baseMonthlyMetric.netProfitMargin +
                                netProfitMargin) /
                            2;

                        baseMonthlyMetric.expenses.total += expenses.total;
                        baseMonthlyMetric.expenses.repair += expenses.repair;
                        baseMonthlyMetric.expenses.sales.total +=
                            expenses.sales.total;
                        baseMonthlyMetric.expenses.sales.inStore +=
                            expenses.sales.inStore;
                        baseMonthlyMetric.expenses.sales.online +=
                            expenses.sales.online;

                        baseMonthlyMetric.profit.total += profit.total;
                        baseMonthlyMetric.profit.repair += profit.repair;
                        baseMonthlyMetric.profit.sales.total +=
                            profit.sales.total;
                        baseMonthlyMetric.profit.sales.inStore +=
                            profit.sales.inStore;
                        baseMonthlyMetric.profit.sales.online +=
                            profit.sales.online;

                        baseMonthlyMetric.revenue.total += revenue.total;
                        baseMonthlyMetric.revenue.repair += revenue.repair;
                        baseMonthlyMetric.revenue.sales.total +=
                            revenue.sales.total;
                        baseMonthlyMetric.revenue.sales.inStore +=
                            revenue.sales.inStore;
                        baseMonthlyMetric.revenue.sales.online +=
                            revenue.sales.online;

                        baseMonthlyMetric.transactions.total +=
                            transactions.total;
                        baseMonthlyMetric.transactions.repair +=
                            transactions.repair;
                        baseMonthlyMetric.transactions.sales.total +=
                            transactions.sales.total;
                        baseMonthlyMetric.transactions.sales.inStore +=
                            transactions.sales.inStore;
                        baseMonthlyMetric.transactions.sales.online +=
                            transactions.sales.online;

                        dailyMetrics.forEach((storeDailyMetric) => {
                            const {
                                day,
                                averageOrderValue,
                                conversionRate,
                                netProfitMargin,
                                expenses,
                                profit,
                                revenue,
                                transactions,
                            } = storeDailyMetric;

                            const baseDailyMetric = baseMonthlyMetric
                                .dailyMetrics
                                .find(
                                    (baseDailyMetric) =>
                                        baseDailyMetric.day === day,
                                );
                            if (!baseDailyMetric) {
                                return;
                            }

                            baseDailyMetric.averageOrderValue +=
                                (baseDailyMetric.averageOrderValue +
                                    averageOrderValue) / 2;
                            baseDailyMetric.conversionRate +=
                                (baseDailyMetric.conversionRate +
                                    conversionRate) /
                                2;
                            baseDailyMetric.netProfitMargin +=
                                (baseDailyMetric.netProfitMargin +
                                    netProfitMargin) / 2;

                            baseDailyMetric.expenses.total += expenses.total;
                            baseDailyMetric.expenses.repair += expenses.repair;
                            baseDailyMetric.expenses.sales.total +=
                                expenses.sales.total;
                            baseDailyMetric.expenses.sales.inStore +=
                                expenses.sales.inStore;
                            baseDailyMetric.expenses.sales.online +=
                                expenses.sales.online;

                            baseDailyMetric.profit.total += profit.total;
                            baseDailyMetric.profit.repair += profit.repair;
                            baseDailyMetric.profit.sales.total +=
                                profit.sales.total;
                            baseDailyMetric.profit.sales.inStore +=
                                profit.sales.inStore;
                            baseDailyMetric.profit.sales.online +=
                                profit.sales.online;

                            baseDailyMetric.revenue.total += revenue.total;
                            baseDailyMetric.revenue.repair += revenue.repair;
                            baseDailyMetric.revenue.sales.total +=
                                revenue.sales.total;
                            baseDailyMetric.revenue.sales.inStore +=
                                revenue.sales.inStore;
                            baseDailyMetric.revenue.sales.online +=
                                revenue.sales.online;

                            baseDailyMetric.transactions.total +=
                                transactions.total;
                            baseDailyMetric.transactions.repair +=
                                transactions.repair;
                            baseDailyMetric.transactions.sales.total +=
                                transactions.sales.total;
                            baseDailyMetric.transactions.sales.inStore +=
                                transactions.sales.inStore;
                            baseDailyMetric.transactions.sales.online +=
                                transactions.sales.online;
                        });
                    });

                    return baseFinancialMetricsAcc;
                },
                baseFinancialMetrics,
            );
        }

        return createSafeSuccessResult(aggregatedAllLocationsFinancialMetrics);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

export {
    createAllLocationsAggregatedFinancialMetricsSafe,
    createRandomFinancialMetricsSafe,
};
