import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    PRODUCT_CATEGORY_REGEX,
    YEARS_REGEX,
} from "../../../regexes";
import { productMetricsAction } from "./actions";

const rusZod = z.object({
    total: z.number().default(0),
    online: z.number().default(0),
    inStore: z.number().default(0),
});

const productMetricsDocumentZod = z.object({
    _id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
    storeLocation: z.string().regex(ALL_STORE_LOCATIONS_REGEX),
    metricCategory: z.string().regex(PRODUCT_CATEGORY_REGEX),
    yearlyMetrics: z.array(
        z.object({
            year: z.string().regex(YEARS_REGEX),
            revenue: rusZod,
            unitsSold: rusZod,
            monthlyMetrics: z.array(
                z.object({
                    month: z.string().regex(MONTHS_REGEX),
                    revenue: rusZod,
                    unitsSold: rusZod,
                    dailyMetrics: z.array(
                        z.object({
                            day: z.string().regex(DAYS_REGEX),
                            revenue: rusZod,
                            unitsSold: rusZod,
                        }),
                    ).optional(),
                }),
            ).optional(),
        }),
    ).optional(),
});

const productMetricsRUSCalendarChartsZod = z.object({
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
});

const productMetricsCalendarChartsZod = z.object({
    revenue: productMetricsRUSCalendarChartsZod,
    unitsSold: productMetricsRUSCalendarChartsZod,
});

const setCalendarChartsDataProductMetricsDispatchZod = z.object({
    action: z.literal(productMetricsAction.setCalendarChartsData),
    payload: z.object({
        currentYear: productMetricsCalendarChartsZod,
        previousYear: productMetricsCalendarChartsZod,
    }),
});

const productLineChartsZod = z.object({
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
});

const productPieChartsZod = z.array(z.object({
    id: z.string(),
    label: z.string(),
    value: z.number(),
}));

const productDailyInStoreBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    "In-Store": z.number(),
}));
const productDailyOnlineBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    "Online": z.number(),
}));
const productDailyOverviewBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    "In-Store": z.number(),
    "Online": z.number(),
}));
const productDailyTotalBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    Total: z.number(),
}));
const productDailyRUSBarChartsZod = z.object({
    total: productDailyTotalBarChartsZod,
    online: productDailyOnlineBarChartsZod,
    inStore: productDailyInStoreBarChartsZod,
    overview: productDailyOverviewBarChartsZod,
});

const productMonthlyInStoreBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "In-Store": z.number(),
}));
const productMonthlyOnlineBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "Online": z.number(),
}));
const productMonthlyOverviewBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "In-Store": z.number(),
    "Online": z.number(),
}));
const productMonthlyTotalBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    Total: z.number(),
}));
const productMonthlyRUSBarChartsZod = z.object({
    total: productMonthlyTotalBarChartsZod,
    online: productMonthlyOnlineBarChartsZod,
    inStore: productMonthlyInStoreBarChartsZod,
    overview: productMonthlyOverviewBarChartsZod,
});

const productYearlyInStoreBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    "In-Store": z.number(),
}));
const productYearlyOnlineBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    "Online": z.number(),
}));
const productYearlyOverviewBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    "In-Store": z.number(),
    "Online": z.number(),
}));
const productYearlyTotalBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    Total: z.number(),
}));
const productYearlyRUSBarChartsZod = z.object({
    total: productYearlyTotalBarChartsZod,
    online: productYearlyOnlineBarChartsZod,
    inStore: productYearlyInStoreBarChartsZod,
    overview: productYearlyOverviewBarChartsZod,
});

const setChartsProductMetricsDispatchZod = z.object({
    action: z.literal(productMetricsAction.setCharts),
    payload: z.object({
        dailyCharts: z.object({
            revenue: z.object({
                bar: productDailyRUSBarChartsZod,
                line: productLineChartsZod,
                pie: productPieChartsZod,
            }),
            unitsSold: z.object({
                bar: productDailyRUSBarChartsZod,
                line: productLineChartsZod,
                pie: productPieChartsZod,
            }),
        }),
        monthlyCharts: z.object({
            revenue: z.object({
                bar: productMonthlyRUSBarChartsZod,
                line: productLineChartsZod,
                pie: productPieChartsZod,
            }),
            unitsSold: z.object({
                bar: productMonthlyRUSBarChartsZod,
                line: productLineChartsZod,
                pie: productPieChartsZod,
            }),
        }),
        yearlyCharts: z.object({
            revenue: z.object({
                bar: productYearlyRUSBarChartsZod,
                line: productLineChartsZod,
                pie: productPieChartsZod,
            }),
            unitsSold: z.object({
                bar: productYearlyRUSBarChartsZod,
                line: productLineChartsZod,
                pie: productPieChartsZod,
            }),
        }),
    }),
});

const setIsGeneratingProductMetricsDispatchZod = z.object({
    action: z.literal(productMetricsAction.setIsGenerating),
    payload: z.boolean(),
});

const setChartsWorkerProductMetricsDispatchZod = z.object({
    action: z.literal(productMetricsAction.setProductChartsWorker),
    payload: z.instanceof(Worker),
});

export {
    productMetricsDocumentZod,
    setCalendarChartsDataProductMetricsDispatchZod,
    setChartsProductMetricsDispatchZod,
    setChartsWorkerProductMetricsDispatchZod,
    setIsGeneratingProductMetricsDispatchZod,
};
