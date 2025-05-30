import { z } from "zod";
import { customerMetricsDocumentZod } from "../../components/dashboard/customer/schemas";
import { financialMetricsDocumentZod } from "../../components/dashboard/financial/schemas";
import { productMetricsDocumentZod } from "../../components/dashboard/product/schemas";
import { repairMetricsDocumentZod } from "../../components/dashboard/repair/schemas";
import { userDocumentOptionalsZod } from "../../components/usersQuery/schemas";
import {
    allStoreLocationsZod,
    customerMetricCategoryZod,
    financialMetricCategoryZod,
    productMetricCategoryZod,
    repairMetricCategoryZod,
} from "../../schemas";
import { globalAction } from "./actions";

const setCustomerMetricsCategoryGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setCustomerMetricsCategory),
    payload: customerMetricCategoryZod,
});

const setCustomerMetricsDocumentGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setCustomerMetricsDocument),
    payload: customerMetricsDocumentZod,
});

const setFinancialMetricCategoryGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setFinancialMetricCategory),
    payload: financialMetricCategoryZod,
});

const setFinancialMetricsDocumentGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setFinancialMetricsDocument),
    payload: financialMetricsDocumentZod,
});

const setIsFetchingGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setIsFetching),
    payload: z.boolean(),
});

const setIsPrefersReducedMotionGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setPrefersReducedMotion),
    payload: z.boolean(),
});

const setProductMetricCategoryGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setProductMetricCategory),
    payload: productMetricCategoryZod,
});

const setProductMetricsDocumentGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setProductMetricsDocument),
    payload: productMetricsDocumentZod,
});

const setProductSubMetricCategoryGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setProductSubMetricCategory),
    payload: z.enum(["revenue", "unitsSold"]),
});

const setRepairMetricCategoryGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setRepairMetricCategory),
    payload: repairMetricCategoryZod,
});

const setRepairMetricsDocumentGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setRepairMetricsDocument),
    payload: repairMetricsDocumentZod,
});

const setSelectedChartKindGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setSelectedChartKind),
    payload: z.enum([
        "line",
        "bar",
        "calendar",
        "pie",
        "radial",
        "sunburst",
    ]),
});

const setSelectedYYYYMMDDGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setSelectedYYYYMMDD),
    payload: z.string(),
});

const setStoreLocationViewGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setStoreLocation),
    payload: allStoreLocationsZod,
});

const setColorSchemeGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setColorScheme),
    payload: z.enum(["light", "dark"]),
});

const setDefaultGradientGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setDefaultGradient),
    payload: z.object({
        deg: z.number(),
        from: z.enum([
            "dark",
            "red",
            "blue",
            "green",
            "yellow",
            "pink",
            "orange",
            "cyan",
            "gray",
            "grape",
            "violet",
            "indigo",
            "lime",
            "teal",
        ]),
        to: z.enum([
            "dark",
            "red",
            "blue",
            "green",
            "yellow",
            "pink",
            "orange",
            "cyan",
            "gray",
            "grape",
            "violet",
            "indigo",
            "lime",
            "teal",
        ]),
    }),
});

const setPrefersReducedMotionGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setPrefersReducedMotion),
    payload: z.boolean(),
});

const setPrimaryShadeDarkGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setPrimaryShadeDark),
    payload: z.number().min(0).max(9),
});

const setPrimaryShadeLightGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setPrimaryShadeLight),
    payload: z.number().min(0).max(9),
});

const setPrimaryColorGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setPrimaryColor),
    payload: z.enum([
        "dark",
        "red",
        "blue",
        "green",
        "yellow",
        "pink",
        "orange",
        "cyan",
        "gray",
        "grape",
        "violet",
        "indigo",
        "lime",
        "teal",
    ]),
});

const setIsErrorGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setIsError),
    payload: z.boolean(),
});

const setDirectoryGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setDirectory),
    payload: z.array(userDocumentOptionalsZod),
});

export {
    setColorSchemeGlobalDispatchZod,
    setCustomerMetricsCategoryGlobalDispatchZod,
    setCustomerMetricsDocumentGlobalDispatchZod,
    setDefaultGradientGlobalDispatchZod,
    setDirectoryGlobalDispatchZod,
    setFinancialMetricCategoryGlobalDispatchZod,
    setFinancialMetricsDocumentGlobalDispatchZod,
    setIsErrorGlobalDispatchZod,
    setIsFetchingGlobalDispatchZod,
    setIsPrefersReducedMotionGlobalDispatchZod,
    setPrefersReducedMotionGlobalDispatchZod,
    setPrimaryColorGlobalDispatchZod,
    setPrimaryShadeDarkGlobalDispatchZod,
    setPrimaryShadeLightGlobalDispatchZod,
    setProductMetricCategoryGlobalDispatchZod,
    setProductMetricsDocumentGlobalDispatchZod,
    setProductSubMetricCategoryGlobalDispatchZod,
    setRepairMetricCategoryGlobalDispatchZod,
    setRepairMetricsDocumentGlobalDispatchZod,
    setSelectedChartKindGlobalDispatchZod,
    setSelectedYYYYMMDDGlobalDispatchZod,
    setStoreLocationViewGlobalDispatchZod,
};
