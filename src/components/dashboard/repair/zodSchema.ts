import { z } from "zod";
import {
    ALL_STORE_LOCATIONS_REGEX,
    DAYS_REGEX,
    MONTHS_REGEX,
    REPAIR_CATEGORY_REGEX,
    YEARS_REGEX,
} from "../../../regexes";

const repairMetricsDocumentZ = z.object({
    _id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
    storeLocation: z.string().regex(ALL_STORE_LOCATIONS_REGEX),
    metricCategory: z.string().regex(REPAIR_CATEGORY_REGEX),
    yearlyMetrics: z.array(
        z.object({
            year: z.string().regex(YEARS_REGEX),
            revenue: z.number(),
            unitsRepaired: z.number(),
            monthlyMetrics: z.array(
                z.object({
                    month: z.string().regex(MONTHS_REGEX),
                    revenue: z.number(),
                    unitsRepaired: z.number(),
                    dailyMetrics: z.array(
                        z.object({
                            day: z.string().regex(DAYS_REGEX),
                            revenue: z.number(),
                            unitsRepaired: z.number(),
                        }),
                    ),
                }),
            ),
        }),
    ),
});

export { repairMetricsDocumentZ };
