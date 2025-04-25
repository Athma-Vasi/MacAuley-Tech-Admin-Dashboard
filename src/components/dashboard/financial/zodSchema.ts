import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    YEARS_REGEX,
} from "../../../regexes";

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

export { financialMetricsDocumentZ };
