import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    YEARS_REGEX,
} from "../../../regexes";
import { customerMetricsAction } from "./actions";

const customersZod = z.object({
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

const customerMetricsDocumentZod = z.object({
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
                customers: customersZod,
                monthlyMetrics: z.array(
                    z.object({
                        month: z.string().regex(MONTHS_REGEX),
                        customers: customersZod,
                        dailyMetrics: z.array(
                            z.object({
                                day: z.string().regex(DAYS_REGEX),
                                customers: customersZod,
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

const customerDailyNRAllBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    "In Store": z.number(),
    Online: z.number(),
    Repair: z.number(),
}));
const customerDailyNRInStoreBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    "In Store": z.number(),
}));
const customerDailyNROnlineBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    Online: z.number(),
}));
const customerDailyNROverviewBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    Sales: z.number(),
    Repair: z.number(),
}));
const customerDailyNRRepairBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    Repair: z.number(),
}));
const customerDailyNRSalesBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    "In Store": z.number(),
    Online: z.number(),
}));
const customerDailyNRTotalBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    Total: z.number(),
}));
const customerDailyNRBarChartsZod = z.object({
    all: customerDailyNRAllBarChartsZod,
    inStore: customerDailyNRInStoreBarChartsZod,
    online: customerDailyNROnlineBarChartsZod,
    overview: customerDailyNROverviewBarChartsZod,
    repair: customerDailyNRRepairBarChartsZod,
    sales: customerDailyNRSalesBarChartsZod,
    total: customerDailyNRTotalBarChartsZod,
});

const customerDailyCRChurnBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    "Churn Rate": z.number(),
}));
const customerDailyCRRetentionBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    "Retention Rate": z.number(),
}));
const customerDailyCROverviewBarChartsZod = z.array(z.object({
    Days: z.string().regex(DAYS_REGEX),
    "Churn Rate": z.number(),
    "Retention Rate": z.number(),
}));

const customerMonthlyNRAllBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "In Store": z.number(),
    Online: z.number(),
    Repair: z.number(),
}));
const customerMonthlyNRInStoreBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "In Store": z.number(),
}));
const customerMonthlyNROnlineBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    Online: z.number(),
}));
const customerMonthlyNROverviewBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    Sales: z.number(),
    Repair: z.number(),
}));
const customerMonthlyNRRepairBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    Repair: z.number(),
}));
const customerMonthlyNRSalesBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "In Store": z.number(),
    Online: z.number(),
}));
const customerMonthlyNRTotalBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    Total: z.number(),
}));

const customerMonthlyNRBarChartsZod = z.object({
    all: customerMonthlyNRAllBarChartsZod,
    inStore: customerMonthlyNRInStoreBarChartsZod,
    online: customerMonthlyNROnlineBarChartsZod,
    overview: customerMonthlyNROverviewBarChartsZod,
    repair: customerMonthlyNRRepairBarChartsZod,
    sales: customerMonthlyNRSalesBarChartsZod,
    total: customerMonthlyNRTotalBarChartsZod,
});

const customerMonthlyCRChurnBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "Churn Rate": z.number(),
}));
const customerMonthlyCRRetentionBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "Retention Rate": z.number(),
}));
const customerMonthlyCROverviewBarChartsZod = z.array(z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "Churn Rate": z.number(),
    "Retention Rate": z.number(),
}));

const customerYearlyNRAllBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    "In Store": z.number(),
    Online: z.number(),
    Repair: z.number(),
}));
const customerYearlyNRInStoreBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    "In Store": z.number(),
}));
const customerYearlyNROnlineBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    Online: z.number(),
}));
const customerYearlyNROverviewBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    Sales: z.number(),
    Repair: z.number(),
}));
const customerYearlyNRRepairBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    Repair: z.number(),
}));
const customerYearlyNRSalesBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    "In Store": z.number(),
    Online: z.number(),
}));
const customerYearlyNRTotalBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    Total: z.number(),
}));

const customerYearlyNRBarChartsZod = z.object({
    all: customerYearlyNRAllBarChartsZod,
    inStore: customerYearlyNRInStoreBarChartsZod,
    online: customerYearlyNROnlineBarChartsZod,
    overview: customerYearlyNROverviewBarChartsZod,
    repair: customerYearlyNRRepairBarChartsZod,
    sales: customerYearlyNRSalesBarChartsZod,
    total: customerYearlyNRTotalBarChartsZod,
});

const customerYearlyCRChurnBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    "Churn Rate": z.number(),
}));
const customerYearlyCRRetentionBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    "Retention Rate": z.number(),
}));
const customerYearlyCROverviewBarChartsZod = z.array(z.object({
    Years: z.string().regex(YEARS_REGEX),
    "Churn Rate": z.number(),
    "Retention Rate": z.number(),
}));

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

const customerChurnLineChartsZod = z.object({
    overview: z.array(lineChartsDataZod),
    churnRate: z.array(lineChartsDataZod),
    retentionRate: z.array(lineChartsDataZod),
});

const customerChurnPieCharts = z.array(pieChartsDataZod);

const customerChartsZod = z.object({
    dailyCharts: z.object({
        churnRetention: z.object({
            bar: z.object({
                churnRate: customerDailyCRChurnBarChartsZod,
                retentionRate: customerDailyCRRetentionBarChartsZod,
                overview: customerDailyCROverviewBarChartsZod,
            }),
            line: customerChurnLineChartsZod,
            pie: customerChurnPieCharts,
        }),
        new: z.object({
            bar: customerDailyNRBarChartsZod,
            line: customerNewReturningLineChartsZod,
            pie: customerNewReturningPieChartsZod,
        }),
        returning: z.object({
            bar: customerDailyNRBarChartsZod,
            line: customerNewReturningLineChartsZod,
            pie: customerNewReturningPieChartsZod,
        }),
    }),
    monthlyCharts: z.object({
        churnRetention: z.object({
            bar: z.object({
                churnRate: customerMonthlyCRChurnBarChartsZod,
                retentionRate: customerMonthlyCRRetentionBarChartsZod,
                overview: customerMonthlyCROverviewBarChartsZod,
            }),
            line: customerChurnLineChartsZod,
            pie: customerChurnPieCharts,
        }),
        new: z.object({
            bar: customerMonthlyNRBarChartsZod,
            line: customerNewReturningLineChartsZod,
            pie: customerNewReturningPieChartsZod,
        }),
        returning: z.object({
            bar: customerMonthlyNRBarChartsZod,
            line: customerNewReturningLineChartsZod,
            pie: customerNewReturningPieChartsZod,
        }),
    }),
    yearlyCharts: z.object({
        churnRetention: z.object({
            bar: z.object({
                churnRate: customerYearlyCRChurnBarChartsZod,
                retentionRate: customerYearlyCRRetentionBarChartsZod,
                overview: customerYearlyCROverviewBarChartsZod,
            }),
            line: customerChurnLineChartsZod,
            pie: customerChurnPieCharts,
        }),
        new: z.object({
            bar: customerYearlyNRBarChartsZod,
            line: customerNewReturningLineChartsZod,
            pie: customerNewReturningPieChartsZod,
        }),
        returning: z.object({
            bar: customerYearlyNRBarChartsZod,
            line: customerNewReturningLineChartsZod,
            pie: customerNewReturningPieChartsZod,
        }),
    }),
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
    customerMetricsDocumentZod,
    setCustomerCalendarChartsDispatchZod,
    setCustomerChartsDispatch,
    setCustomerIsGeneratingDispatch,
};
