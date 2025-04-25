import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    PRODUCT_CATEGORY_REGEX,
    YEARS_REGEX,
} from "../../../regexes";

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

export { productMetricsDocumentZ };
