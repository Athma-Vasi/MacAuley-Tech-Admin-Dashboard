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

const productMetricsCalendarChartsZod = z.object({
    revenue: z.array(
        z.object({
            total: z.array(z.object({
                day: z.string(),
                value: z.number(),
            })),
            online: z.array(z.object({
                day: z.string(),
                value: z.number(),
            })),
            inStore: z.array(z.object({
                day: z.string(),
                value: z.number(),
            })),
        }),
    ),
    unitsSold: z.array(
        z.object({
            total: z.array(z.object({
                day: z.string(),
                value: z.number(),
            })),
            online: z.array(z.object({
                day: z.string(),
                value: z.number(),
            })),
            inStore: z.array(z.object({
                day: z.string(),
                value: z.number(),
            })),
        }),
    ),
});

const setProductCalendarChartsDataDispatchZod = z.object({
    action: z.literal(productMetricsAction.setCalendarChartsData),
    payload: z.object({
        currentYear: productMetricsCalendarChartsZod,
        previousYear: productMetricsCalendarChartsZod,
    }),
});

const barLinePieChartsZod = z.object({
    bar: z.object({
        total: z.array(z.object({})),
        overview: z.array(z.object({})),
        online: z.array(z.object({})),
        inStore: z.array(z.object({})),
    }),
    line: z.object({
        total: z.array(z.object({
            id: z.literal("Total"),
            data: z.array(z.object({
                x: z.string(),
                y: z.number(),
            })),
        })),
        overview: z.array(z.object({
            id: z.union([z.literal("Online"), z.literal("In-Store")]),
            data: z.array(z.object({
                x: z.string(),
                y: z.number(),
            })),
        })),
        online: z.array(z.object({
            id: z.literal("Online"),
            data: z.array(z.object({
                x: z.string(),
                y: z.number(),
            })),
        })),
        inStore: z.array(z.object({
            id: z.literal("In-Store"),
            data: z.array(z.object({
                x: z.string(),
                y: z.number(),
            })),
        })),
    }),
    pie: z.array(z.object({
        id: z.string(),
        label: z.string(),
        value: z.number(),
    })),
});

const setProductChartsDispatchZod = z.object({
    action: z.literal(productMetricsAction.setCharts),
    payload: z.object({
        dailyCharts: z.object({
            unitsSold: barLinePieChartsZod,
            revenue: barLinePieChartsZod,
        }),
        monthlyCharts: z.object({
            unitsSold: barLinePieChartsZod,
            revenue: barLinePieChartsZod,
        }),
        yearlyCharts: z.object({
            unitsSold: barLinePieChartsZod,
            revenue: barLinePieChartsZod,
        }),
    }),
});

const setIsGeneratingDispatchZod = z.object({
    action: z.literal(productMetricsAction.setIsGenerating),
    payload: z.boolean(),
});

export {
    productMetricsDocumentZ,
    setIsGeneratingDispatchZod,
    setProductCalendarChartsDataDispatchZod,
    setProductChartsDispatchZod,
};
