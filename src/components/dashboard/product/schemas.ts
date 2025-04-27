import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    PRODUCT_CATEGORY_REGEX,
    YEARS_REGEX,
} from "../../../regexes";
import { productMetricsAction } from "./actions";

const rusZ = z.object({
    total: z.number().default(0),
    online: z.number().default(0),
    inStore: z.number().default(0),
});

const productMetricsDocumentZ = z.object({
    _id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
    storeLocation: z.string().regex(ALL_STORE_LOCATIONS_REGEX),
    metricCategory: z.string().regex(PRODUCT_CATEGORY_REGEX),
    yearlyMetrics: z.array(
        z.object({
            year: z.string().regex(YEARS_REGEX),
            revenue: rusZ,
            unitsSold: rusZ,
            monthlyMetrics: z.array(
                z.object({
                    month: z.string().regex(MONTHS_REGEX),
                    revenue: rusZ,
                    unitsSold: rusZ,
                    dailyMetrics: z.array(
                        z.object({
                            day: z.string().regex(DAYS_REGEX),
                            revenue: rusZ,
                            unitsSold: rusZ,
                        }),
                    ).optional(),
                }),
            ).optional(),
        }),
    ).optional(),
});

const setProductCalendarChartsDataDispatchZod = z.object({
    action: z.literal(productMetricsAction.setCalendarChartsData),
    payload: [],
});

/**
 * const setRepairCalendarChartsDataDispatchZod = z.object({
    action: z.literal(repairMetricsAction.setCalendarChartsData),
    payload: z.object({
        currentYear: z.object({
            revenue: z.array(
                z.object({
                    day: z.string().regex(DAYS_REGEX),
                    value: z.number(),
                }),
            ),
            unitsRepaired: z.array(
                z.object({
                    day: z.string().regex(DAYS_REGEX),
                    value: z.number(),
                }),
            ),
        }),
        previousYear: z.object({
            revenue: z.array(
                z.object({
                    day: z.string().regex(DAYS_REGEX),
                    value: z.number(),
                }),
            ),
            unitsRepaired: z.array(
                z.object({
                    day: z.string().regex(DAYS_REGEX),
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
 */

export { productMetricsDocumentZ };
