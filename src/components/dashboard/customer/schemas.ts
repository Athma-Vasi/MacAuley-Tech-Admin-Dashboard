import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    YEARS_REGEX,
} from "../../../regexes";
import { customerMetricsAction } from "./actions";

const customersZ = z.object({
    churnRate: z.number().default(0),
    retentionRate: z.number().default(0),
    new: z.object({
        total: z.number().default(0),
        repair: z.number().default(0),
        sales: z.object({
            inStore: z.number().default(0),
            online: z.number().default(0),
            total: z.number().default(0),
        }),
    }),
    returning: z.object({
        total: z.number().default(0),
        repair: z.number().default(0),
        sales: z.object({
            inStore: z.number().default(0),
            online: z.number().default(0),
            total: z.number().default(0),
        }),
    }),
    total: z.number().default(0),
});

const customerMetricsDocumentZ = z.object({
    _id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
    storeLocation: z.string().regex(ALL_STORE_LOCATIONS_REGEX).default(
        "All Locations",
    ),
    customerMetrics: z.object({
        lifetimeValue: z.number().default(0),
        totalCustomers: z.number().default(0),
        yearlyMetrics: z.array(
            z.object({
                year: z.string().regex(YEARS_REGEX),
                customers: customersZ,
                monthlyMetrics: z.array(
                    z.object({
                        month: z.string().regex(MONTHS_REGEX),
                        customers: customersZ,
                        dailyMetrics: z.array(
                            z.object({
                                day: z.string().regex(DAYS_REGEX),
                                customers: customersZ,
                            }),
                        ),
                    }),
                ),
            }),
        ),
    }),
});

const calendarChartDataZod = z.object({
    day: z.string(),
    value: z.number(),
});

const newReturningCalendarChartZod = z.object({
    total: z.array(calendarChartDataZod),
    repair: z.array(calendarChartDataZod),
    sales: z.array(calendarChartDataZod),
    inStore: z.array(calendarChartDataZod),
    online: z.array(calendarChartDataZod),
});

const customerCalendarChartsZod = z.object({
    new: newReturningCalendarChartZod,
    returning: newReturningCalendarChartZod,
    churn: z.object({
        churnRate: z.array(calendarChartDataZod),
        retentionRate: z.array(calendarChartDataZod),
    }),
});

const setCustomerCalendarChartsDispatchZod = z.object({
    action: z.literal(customerMetricsAction.setCalendarChartsData),
    payload: z.object({
        currentYear: customerCalendarChartsZod,
        previousYear: customerCalendarChartsZod,
    }),
});

const customerNewReturningBarChartsZod = z.object({
    total: z.array(z.object({})),
    all: z.array(z.object({})),
    overview: z.array(z.object({})),
    sales: z.array(z.object({})),
    online: z.array(z.object({})),
    inStore: z.array(z.object({})),
    repair: z.array(z.object({})),
});

const lineChartsDataZod = z.object({
    id: z.string(),
    data: z.array(
        z.object({
            x: z.string(),
            y: z.number(),
        }),
    ),
});

const customerNewReturningLineChartsZod = z.object({
    total: z.array(lineChartsDataZod),
    all: z.array(lineChartsDataZod),
    overview: z.array(lineChartsDataZod),
    sales: z.array(lineChartsDataZod),
    online: z.array(lineChartsDataZod),
    inStore: z.array(lineChartsDataZod),
    repair: z.array(lineChartsDataZod),
});

const pieChartsDataZod = z.object({
    id: z.string(),
    label: z.string(),
    value: z.number(),
});

const customerNewReturningPieChartsZod = z.object({
    overview: z.array(pieChartsDataZod),
    all: z.array(pieChartsDataZod),
});

const customerChurnBarChartsZod = z.object({
    overview: z.array(z.object({})),
    churnRate: z.array(z.object({})),
    retentionRate: z.array(z.object({})),
});

const customerChurnLineChartsZod = z.object({
    overview: z.array(lineChartsDataZod),
    churnRate: z.array(lineChartsDataZod),
    retentionRate: z.array(lineChartsDataZod),
});

const customerChurnPieCharts = z.array(pieChartsDataZod);

const customerChartsBaseZod = z.object({
    new: z.object({
        bar: customerNewReturningBarChartsZod,
        line: customerNewReturningLineChartsZod,
        pie: customerNewReturningPieChartsZod,
    }),
    returning: z.object({
        bar: customerNewReturningBarChartsZod,
        line: customerNewReturningLineChartsZod,
        pie: customerNewReturningPieChartsZod,
    }),
    churnRetention: z.object({
        bar: customerChurnBarChartsZod,
        line: customerChurnLineChartsZod,
        pie: customerChurnPieCharts,
    }),
});

const customerChartsZod = z.object({
    dailyCharts: customerChartsBaseZod,
    monthlyCharts: customerChartsBaseZod,
    yearlyCharts: customerChartsBaseZod,
});

const setCustomerChartsDispatch = z.object({
    action: z.literal(customerMetricsAction.setCharts),
    payload: customerChartsZod,
});

const setCustomerIsGeneratingDispatch = z.object({
    action: z.literal(customerMetricsAction.setIsGenerating),
    payload: z.boolean(),
});

export {
    customerMetricsDocumentZ,
    setCustomerCalendarChartsDispatchZod,
    setCustomerChartsDispatch,
    setCustomerIsGeneratingDispatch,
};
