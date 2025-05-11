import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    REPAIR_CATEGORY_REGEX,
    YEARS_REGEX,
} from "../../../regexes";
import { repairMetricsAction } from "./actions";

const repairMetricsDocumentZod = z.object({
    _id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
    storeLocation: z.string().regex(ALL_STORE_LOCATIONS_REGEX),
    metricCategory: z.string().regex(REPAIR_CATEGORY_REGEX),
    yearlyMetrics: z.array(
        z.object({
            year: z.string().regex(YEARS_REGEX),
            revenue: z.number(),
            unitsRepaired: z.number(),
            monthlyMetrics: z.array(
                z.object({
                    month: z.string().regex(MONTHS_REGEX),
                    revenue: z.number(),
                    unitsRepaired: z.number(),
                    dailyMetrics: z.array(
                        z.object({
                            day: z.string().regex(DAYS_REGEX),
                            revenue: z.number(),
                            unitsRepaired: z.number(),
                        }),
                    ),
                }),
            ),
        }),
    ),
});

const setCalendarChartsDataRepairMetricsDispatchZod = z.object({
    action: z.literal(repairMetricsAction.setCalendarChartsData),
    payload: z.object({
        currentYear: z.object({
            revenue: z.array(
                z.object({
                    day: z.string(),
                    value: z.number(),
                }),
            ),
            unitsRepaired: z.array(
                z.object({
                    day: z.string(),
                    value: z.number(),
                }),
            ),
        }),
        previousYear: z.object({
            revenue: z.array(
                z.object({
                    day: z.string(),
                    value: z.number(),
                }),
            ),
            unitsRepaired: z.array(
                z.object({
                    day: z.string(),
                    value: z.number(),
                }),
            ),
        }),
    }),
});

const repairDailyRevenueBarChartsZod = z.array(
    z.object({
        Days: z.string().regex(DAYS_REGEX),
        Revenue: z.number(),
    }),
);
const repairDailyUnitsRepairedBarChartsZod = z.array(
    z.object({
        Days: z.string().regex(DAYS_REGEX),
        "Units Repaired": z.number(),
    }),
);
const repairDailyRURBarChartsZod = z.object({
    revenue: repairDailyRevenueBarChartsZod,
    unitsRepaired: repairDailyUnitsRepairedBarChartsZod,
});

const repairMonthlyRevenueBarChartsZod = z.array(
    z.object({
        Months: z.string().regex(MONTHS_REGEX),
        Revenue: z.number(),
    }),
);
const repairMonthlyUnitsRepairedBarChartsZod = z.array(
    z.object({
        Months: z.string().regex(MONTHS_REGEX),
        "Units Repaired": z.number(),
    }),
);
const repairMonthlyRURBarChartsZod = z.object({
    revenue: repairMonthlyRevenueBarChartsZod,
    unitsRepaired: repairMonthlyUnitsRepairedBarChartsZod,
});

const repairYearlyRevenueBarChartsZod = z.array(
    z.object({
        Years: z.string().regex(YEARS_REGEX),
        Revenue: z.number(),
    }),
);
const repairYearlyUnitsRepairedBarChartsZod = z.array(
    z.object({
        Years: z.string().regex(YEARS_REGEX),
        "Units Repaired": z.number(),
    }),
);
const repairYearlyRURBarChartsZod = z.object({
    revenue: repairYearlyRevenueBarChartsZod,
    unitsRepaired: repairYearlyUnitsRepairedBarChartsZod,
});

const repairMetricsLineChartsZod = z.object({
    revenue: z.array(
        z.object({
            id: z.literal("Revenue"),
            data: z.array(
                z.object({
                    x: z.string(),
                    y: z.number(),
                }),
            ),
        }),
    ),
    unitsRepaired: z.array(
        z.object({
            id: z.literal("Units Repaired"),
            data: z.array(
                z.object({
                    x: z.string(),
                    y: z.number(),
                }),
            ),
        }),
    ),
});

const setChartsRepairMetricsDispatchZod = z.object({
    action: z.literal(repairMetricsAction.setCharts),
    payload: z.object({
        dailyCharts: z.object({
            bar: repairDailyRURBarChartsZod,
            line: repairMetricsLineChartsZod,
        }),
        monthlyCharts: z.object({
            bar: repairMonthlyRURBarChartsZod,
            line: repairMetricsLineChartsZod,
        }),
        yearlyCharts: z.object({
            bar: repairYearlyRURBarChartsZod,
            line: repairMetricsLineChartsZod,
        }),
    }),
});

const setIsGeneratingRepairMetricsDispatchZod = z.object({
    action: z.literal(repairMetricsAction.setIsGenerating),
    payload: z.boolean(),
});

const setChartsWorkerRepairMetricsDispatchZod = z.object({
    action: z.literal(repairMetricsAction.setRepairChartsWorker),
    payload: z.instanceof(Worker),
});

export {
    setCalendarChartsDataRepairMetricsDispatchZod,
    setChartsRepairMetricsDispatchZod,
    setChartsWorkerRepairMetricsDispatchZod,
    setIsGeneratingRepairMetricsDispatchZod,
};

/**
 * calendarChartsData: {
    currentYear: RepairMetricCalendarCharts | null;
    previousYear: RepairMetricCalendarCharts | null;
  };
  cards: RepairMetricsCards | null;
  charts: RepairMetricsCharts | null;
  isGenerating: boolean;
 */

export { repairMetricsDocumentZod };
