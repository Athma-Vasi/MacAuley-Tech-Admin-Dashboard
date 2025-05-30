import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    YEARS_REGEX,
} from "../../../regexes";
import { financialMetricsAction } from "./actions";

const pertZod = z.object({
    total: z.number().default(0),
    repair: z.number().default(0),
    sales: z.object({
        total: z.number().default(0),
        inStore: z.number().default(0),
        online: z.number().default(0),
    }),
});

const financialMetricsDocumentZod = z.object({
    _id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
    storeLocation: z.string().regex(ALL_STORE_LOCATIONS_REGEX),
    financialMetrics: z.array(
        z.object({
            year: z.string().regex(YEARS_REGEX),
            averageOrderValue: z.number(),
            conversionRate: z.number(),
            netProfitMargin: z.number(),
            expenses: pertZod,
            profit: pertZod,
            revenue: pertZod,
            transactions: pertZod,
            monthlyMetrics: z.array(
                z.object({
                    month: z.string().regex(MONTHS_REGEX),
                    averageOrderValue: z.number(),
                    conversionRate: z.number(),
                    netProfitMargin: z.number(),
                    expenses: pertZod,
                    profit: pertZod,
                    revenue: pertZod,
                    transactions: pertZod,
                    dailyMetrics: z.array(
                        z.object({
                            day: z.string().regex(DAYS_REGEX),
                            averageOrderValue: z.number(),
                            conversionRate: z.number(),
                            netProfitMargin: z.number(),
                            expenses: pertZod,
                            profit: pertZod,
                            revenue: pertZod,
                            transactions: pertZod,
                        }),
                    ),
                }),
            ),
        }),
    ),
});

const financialPERTCalendarChartsZod = z.object({
    total: z.array(z.object({ day: z.string(), value: z.number() })),
    repair: z.array(z.object({ day: z.string(), value: z.number() })),
    sales: z.array(z.object({ day: z.string(), value: z.number() })),
    inStore: z.array(z.object({ day: z.string(), value: z.number() })),
    online: z.array(z.object({ day: z.string(), value: z.number() })),
});

const financialMetricsCalendarChartsZod = z.object({
    otherMetrics: z.object({
        averageOrderValue: z.array(
            z.object({ day: z.string(), value: z.number() }),
        ),
        conversionRate: z.array(
            z.object({ day: z.string(), value: z.number() }),
        ),
        netProfitMargin: z.array(
            z.object({ day: z.string(), value: z.number() }),
        ),
    }),
    expenses: financialPERTCalendarChartsZod,
    profit: financialPERTCalendarChartsZod,
    revenue: financialPERTCalendarChartsZod,
    transactions: financialPERTCalendarChartsZod,
});

const setCalendarChartsFinancialMetricsDispatchZod = z.object({
    action: z.literal(financialMetricsAction.setCalendarChartsData),
    payload: z.object({
        currentYear: financialMetricsCalendarChartsZod,
        previousYear: financialMetricsCalendarChartsZod,
    }),
});

const dailyBarAllPERTChartsZod = z.object({
    Days: z.string().regex(DAYS_REGEX),
    Repair: z.number(),
    "In-Store": z.number(),
    Online: z.number(),
});
const dailyBarInStorePERTChartsZod = z.object({
    Days: z.string().regex(DAYS_REGEX),
    "In-Store": z.number(),
});
const dailyBarOnlinePERTChartsZod = z.object({
    Days: z.string().regex(DAYS_REGEX),
    Online: z.number(),
});
const dailyBarOverviewPERTChartsZod = z.object({
    Days: z.string().regex(DAYS_REGEX),
    Repair: z.number(),
    Sales: z.number(),
});
const dailyBarRepairPERTChartsZod = z.object({
    Days: z.string().regex(DAYS_REGEX),
    Repair: z.number(),
});
const dailyBarSalesPERTChartsZod = z.object({
    Days: z.string().regex(DAYS_REGEX),
    "In-Store": z.number(),
    Online: z.number(),
});
const dailyBarTotalPERTChartsZod = z.object({
    Days: z.string().regex(DAYS_REGEX),
    Total: z.number(),
});

const dailyBarPERTChartsZod = z.object({
    total: z.array(dailyBarTotalPERTChartsZod),
    all: z.array(dailyBarAllPERTChartsZod),
    overview: z.array(dailyBarOverviewPERTChartsZod),
    repair: z.array(dailyBarRepairPERTChartsZod),
    sales: z.array(dailyBarSalesPERTChartsZod),
    inStore: z.array(dailyBarInStorePERTChartsZod),
    online: z.array(dailyBarOnlinePERTChartsZod),
});

const monthlyBarAllPERTChartsZod = z.object({
    Months: z.string().regex(MONTHS_REGEX),
    Repair: z.number(),
    "In-Store": z.number(),
    Online: z.number(),
});
const monthlyBarInStorePERTChartsZod = z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "In-Store": z.number(),
});
const monthlyBarOnlinePERTChartsZod = z.object({
    Months: z.string().regex(MONTHS_REGEX),
    Online: z.number(),
});
const monthlyBarOverviewPERTChartsZod = z.object({
    Months: z.string().regex(MONTHS_REGEX),
    Repair: z.number(),
    Sales: z.number(),
});
const monthlyBarRepairPERTChartsZod = z.object({
    Months: z.string().regex(MONTHS_REGEX),
    Repair: z.number(),
});
const monthlyBarSalesPERTChartsZod = z.object({
    Months: z.string().regex(MONTHS_REGEX),
    "In-Store": z.number(),
    Online: z.number(),
});
const monthlyBarTotalPERTChartsZod = z.object({
    Months: z.string().regex(MONTHS_REGEX),
    Total: z.number(),
});
const monthlyBarPERTChartsZod = z.object({
    total: z.array(monthlyBarTotalPERTChartsZod),
    all: z.array(monthlyBarAllPERTChartsZod),
    overview: z.array(monthlyBarOverviewPERTChartsZod),
    repair: z.array(monthlyBarRepairPERTChartsZod),
    sales: z.array(monthlyBarSalesPERTChartsZod),
    inStore: z.array(monthlyBarInStorePERTChartsZod),
    online: z.array(monthlyBarOnlinePERTChartsZod),
});

const yearlyBarAllPERTChartsZod = z.object({
    Years: z.string().regex(YEARS_REGEX),
    Repair: z.number(),
    "In-Store": z.number(),
    Online: z.number(),
});
const yearlyBarInStorePERTChartsZod = z.object({
    Years: z.string().regex(YEARS_REGEX),
    "In-Store": z.number(),
});
const yearlyBarOnlinePERTChartsZod = z.object({
    Years: z.string().regex(YEARS_REGEX),
    Online: z.number(),
});
const yearlyBarOverviewPERTChartsZod = z.object({
    Years: z.string().regex(YEARS_REGEX),
    Repair: z.number(),
    Sales: z.number(),
});
const yearlyBarRepairPERTChartsZod = z.object({
    Years: z.string().regex(YEARS_REGEX),
    Repair: z.number(),
});
const yearlyBarSalesPERTChartsZod = z.object({
    Years: z.string().regex(YEARS_REGEX),
    "In-Store": z.number(),
    Online: z.number(),
});
const yearlyBarTotalPERTChartsZod = z.object({
    Years: z.string().regex(YEARS_REGEX),
    Total: z.number(),
});
const yearlyBarPERTChartsZod = z.object({
    total: z.array(yearlyBarTotalPERTChartsZod),
    all: z.array(yearlyBarAllPERTChartsZod),
    overview: z.array(yearlyBarOverviewPERTChartsZod),
    repair: z.array(yearlyBarRepairPERTChartsZod),
    sales: z.array(yearlyBarSalesPERTChartsZod),
    inStore: z.array(yearlyBarInStorePERTChartsZod),
    online: z.array(yearlyBarOnlinePERTChartsZod),
});

const linePERTChartsZod = z.object({
    total: z.array(z.object({
        id: z.literal("Total"),
        data: z.array(z.object({ x: z.string(), y: z.number() })),
    })),
    all: z.array(z.object({
        id: z.union([
            z.literal("Repair"),
            z.literal("In-Store"),
            z.literal("Online"),
        ]),
        data: z.array(z.object({ x: z.string(), y: z.number() })),
    })),
    overview: z.array(z.object({
        id: z.union([z.literal("Repair"), z.literal("Sales")]),
        data: z.array(z.object({ x: z.string(), y: z.number() })),
    })),
    repair: z.array(z.object({
        id: z.literal("Repair"),
        data: z.array(z.object({ x: z.string(), y: z.number() })),
    })),
    sales: z.array(z.object({
        id: z.union([z.literal("In-Store"), z.literal("Online")]),
        data: z.array(z.object({ x: z.string(), y: z.number() })),
    })),
    inStore: z.array(z.object({
        id: z.literal("In-Store"),
        data: z.array(z.object({ x: z.string(), y: z.number() })),
    })),
    online: z.array(z.object({
        id: z.literal("Online"),
        data: z.array(z.object({ x: z.string(), y: z.number() })),
    })),
});

const piePERTChartsZod = z.object({
    overview: z.array(z.object({
        id: z.string(),
        label: z.string(),
        value: z.number(),
    })),
    all: z.array(z.object({
        id: z.string(),
        label: z.string(),
        value: z.number(),
    })),
});

const dailyBarOtherMetricsChartsZod = z.object({
    averageOrderValue: z.array(z.object({
        Days: z.string().regex(DAYS_REGEX),
        "Average Order Value": z.number(),
    })),
    conversionRate: z.array(z.object({
        Days: z.string().regex(DAYS_REGEX),
        "Conversion Rate": z.number(),
    })),
    netProfitMargin: z.array(z.object({
        Days: z.string().regex(DAYS_REGEX),
        "Net Profit Margin": z.number(),
    })),
});

const monthlyBarOtherMetricsChartsZod = z.object({
    averageOrderValue: z.array(z.object({
        Months: z.string().regex(MONTHS_REGEX),
        "Average Order Value": z.number(),
    })),
    conversionRate: z.array(z.object({
        Months: z.string().regex(MONTHS_REGEX),
        "Conversion Rate": z.number(),
    })),
    netProfitMargin: z.array(z.object({
        Months: z.string().regex(MONTHS_REGEX),
        "Net Profit Margin": z.number(),
    })),
});

const yearlyBarOtherMetricsChartsZod = z.object({
    averageOrderValue: z.array(z.object({
        Years: z.string().regex(YEARS_REGEX),
        "Average Order Value": z.number(),
    })),
    conversionRate: z.array(z.object({
        Years: z.string().regex(YEARS_REGEX),
        "Conversion Rate": z.number(),
    })),
    netProfitMargin: z.array(z.object({
        Years: z.string().regex(YEARS_REGEX),
        "Net Profit Margin": z.number(),
    })),
});

const lineOtherMetricsChartsZod = z.object({
    averageOrderValue: z.array(z.object({
        id: z.literal("Average Order Value"),
        data: z.array(z.object({ x: z.string(), y: z.number() })),
    })),
    conversionRate: z.array(z.object({
        id: z.literal("Conversion Rate"),
        data: z.array(z.object({ x: z.string(), y: z.number() })),
    })),
    netProfitMargin: z.array(z.object({
        id: z.literal("Net Profit Margin"),
        data: z.array(z.object({ x: z.string(), y: z.number() })),
    })),
});

const financialChartsZod = z.object({
    dailyCharts: z.object({
        profit: z.object({
            bar: dailyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        revenue: z.object({
            bar: dailyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        expenses: z.object({
            bar: dailyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        transactions: z.object({
            bar: dailyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        otherMetrics: z.object({
            bar: dailyBarOtherMetricsChartsZod,
            line: lineOtherMetricsChartsZod,
        }),
    }),
    monthlyCharts: z.object({
        profit: z.object({
            bar: monthlyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        revenue: z.object({
            bar: monthlyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        expenses: z.object({
            bar: monthlyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        transactions: z.object({
            bar: monthlyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        otherMetrics: z.object({
            bar: monthlyBarOtherMetricsChartsZod,
            line: lineOtherMetricsChartsZod,
        }),
    }),
    yearlyCharts: z.object({
        profit: z.object({
            bar: yearlyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        revenue: z.object({
            bar: yearlyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        expenses: z.object({
            bar: yearlyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        transactions: z.object({
            bar: yearlyBarPERTChartsZod,
            line: linePERTChartsZod,
            pie: piePERTChartsZod,
        }),
        otherMetrics: z.object({
            bar: yearlyBarOtherMetricsChartsZod,
            line: lineOtherMetricsChartsZod,
        }),
    }),
});

const setChartsFinancialMetricsDispatchZod = z.object({
    action: z.literal(financialMetricsAction.setCharts),
    payload: financialChartsZod,
});

const setIsGeneratingFinancialMetricsDispatchZod = z.object({
    action: z.literal(financialMetricsAction.setIsGenerating),
    payload: z.boolean(),
});

const setChartsWorkerFinancialMetricsDispatchZod = z.object({
    action: z.literal(financialMetricsAction.setFinancialChartsWorker),
    payload: z.instanceof(Worker),
});

const handleMessageEventFinancialWorkerToMainInputZod = z.object({
    event: z.instanceof(MessageEvent),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    financialMetricsDispatch: z.function().args(z.any()).returns(z.void()),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

const messageEventFinancialChartsMainToWorkerZod = z.object({
    calendarView: z.string(),
    grayBorderShade: z.string(),
    financialMetricsDocument: financialMetricsDocumentZod,
    greenColorShade: z.string(),
    redColorShade: z.string(),
    selectedDate: z.string(),
    selectedMonth: z.string().regex(MONTHS_REGEX),
    selectedYYYYMMDD: z.string(),
    selectedYear: z.string().regex(YEARS_REGEX),
});

export {
    financialChartsZod,
    financialMetricsDocumentZod,
    handleMessageEventFinancialWorkerToMainInputZod,
    messageEventFinancialChartsMainToWorkerZod,
    setCalendarChartsFinancialMetricsDispatchZod,
    setChartsFinancialMetricsDispatchZod,
    setChartsWorkerFinancialMetricsDispatchZod,
    setIsGeneratingFinancialMetricsDispatchZod,
};
