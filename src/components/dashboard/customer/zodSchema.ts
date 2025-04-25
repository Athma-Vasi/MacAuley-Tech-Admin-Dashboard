import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    YEARS_REGEX,
} from "../../../regexes";

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

export { customerMetricsDocumentZ, customersZ };
