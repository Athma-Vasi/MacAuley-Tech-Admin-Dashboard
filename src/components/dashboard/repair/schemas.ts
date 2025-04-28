import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    REPAIR_CATEGORY_REGEX,
    YEARS_REGEX,
} from "../../../regexes";
import { repairMetricsAction } from "./actions";

const repairMetricsDocumentZ = z.object({
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

const setRepairCalendarChartsDataDispatchZod = z.object({
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

const repairMetricsBarChartsZod = z.object({
    revenue: z.array(
        z.object({}),
    ),
    unitsRepaired: z.array(
        z.object({}),
    ),
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

const setRepairChartsDispatchZod = z.object({
    action: z.literal(repairMetricsAction.setCharts),
    payload: z.object({
        dailyCharts: z.object({
            bar: repairMetricsBarChartsZod,
            line: repairMetricsLineChartsZod,
        }),
        monthlyCharts: z.object({
            bar: repairMetricsBarChartsZod,
            line: repairMetricsLineChartsZod,
        }),
        yearlyCharts: z.object({
            bar: repairMetricsBarChartsZod,
            line: repairMetricsLineChartsZod,
        }),
    }),
});

const setIsGeneratingDispatchZod = z.object({
    action: z.literal(repairMetricsAction.setIsGenerating),
    payload: z.boolean(),
});

export {
    setIsGeneratingDispatchZod,
    setRepairCalendarChartsDataDispatchZod,
    setRepairChartsDispatchZod,
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

export { repairMetricsDocumentZ };
