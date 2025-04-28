import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    YEARS_REGEX,
} from "../../../regexes";
import { financialMetricsAction } from "./actions";

const pertZ = z.object({
    total: z.number().default(0),
    repair: z.number().default(0),
    sales: z.object({
        total: z.number().default(0),
        inStore: z.number().default(0),
        online: z.number().default(0),
    }),
});

const financialMetricsDocumentZ = z.object({
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
            expenses: pertZ,
            profit: pertZ,
            revenue: pertZ,
            transactions: pertZ,
            monthlyMetrics: z.array(
                z.object({
                    month: z.string().regex(MONTHS_REGEX),
                    averageOrderValue: z.number(),
                    conversionRate: z.number(),
                    netProfitMargin: z.number(),
                    expenses: pertZ,
                    profit: pertZ,
                    revenue: pertZ,
                    transactions: pertZ,
                    dailyMetrics: z.array(
                        z.object({
                            day: z.string().regex(DAYS_REGEX),
                            averageOrderValue: z.number(),
                            conversionRate: z.number(),
                            netProfitMargin: z.number(),
                            expenses: pertZ,
                            profit: pertZ,
                            revenue: pertZ,
                            transactions: pertZ,
                        }),
                    ),
                }),
            ),
        }),
    ),
});

const pertZCharts = z.object({
    total: z.array(z.object({ day: z.string(), value: z.number() })),
    repair: z.array(z.object({ day: z.string(), value: z.number() })),
    sales: z.array(z.object({ day: z.string(), value: z.number() })),
    inStore: z.array(z.object({ day: z.string(), value: z.number() })),
    online: z.array(z.object({ day: z.string(), value: z.number() })),
});

const financialMetricsCalendarChartsZ = z.object({
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
    expenses: pertZCharts,
    profit: pertZCharts,
    revenue: pertZCharts,
    transactions: pertZCharts,
});

const setFinancialCalendarChartsDispatchZod = z.object({
    action: z.literal(financialMetricsAction.setCalendarChartsData),
    payload: z.object({
        currentYear: financialMetricsCalendarChartsZ,
        previousYear: financialMetricsCalendarChartsZ,
    }),
});

const barPERTChartsZod = z.object({
    total: z.array(z.object({})),
    all: z.array(z.object({})),
    overview: z.array(z.object({})),
    repair: z.array(z.object({})),
    sales: z.array(z.object({})),
    inStore: z.array(z.object({})),
    online: z.array(z.object({})),
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

const barOtherMetricsChartsZod = z.object({
    averageOrderValue: z.array(z.object({})),
    conversionRate: z.array(z.object({})),
    netProfitMargin: z.array(z.object({})),
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

const financialChartZod = z.object({
    profit: z.object({
        bar: barPERTChartsZod,
        line: linePERTChartsZod,
        pie: piePERTChartsZod,
    }),
    revenue: z.object({
        bar: barPERTChartsZod,
        line: linePERTChartsZod,
        pie: piePERTChartsZod,
    }),
    expenses: z.object({
        bar: barPERTChartsZod,
        line: linePERTChartsZod,
        pie: piePERTChartsZod,
    }),
    transactions: z.object({
        bar: barPERTChartsZod,
        line: linePERTChartsZod,
        pie: piePERTChartsZod,
    }),
    otherMetrics: z.object({
        bar: barOtherMetricsChartsZod,
        line: lineOtherMetricsChartsZod,
    }),
});

const financialChartsZod = z.object({
    dailyCharts: financialChartZod,
    monthlyCharts: financialChartZod,
    yearlyCharts: financialChartZod,
});

const setFinancialChartsDispatchZod = z.object({
    action: z.literal(financialMetricsAction.setCharts),
    payload: financialChartsZod,
});

const setIsGeneratingDispatchZod = z.object({
    action: z.literal(financialMetricsAction.setIsGenerating),
    payload: z.boolean(),
});

export {
    financialMetricsDocumentZ,
    setFinancialCalendarChartsDispatchZod,
    setFinancialChartsDispatchZod,
    setIsGeneratingDispatchZod,
};
