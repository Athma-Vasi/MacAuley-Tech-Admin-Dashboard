import { z } from "zod";
import { customerMetricsDocumentZod } from "../../components/dashboard/customer/schemas";
import { financialMetricsDocumentZod } from "../../components/dashboard/financial/schemas";
import { repairMetricsDocumentZod } from "../../components/dashboard/repair/schemas";
import { globalAction } from "./actions";

const setCustomerMetricsCategoryGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setCustomerMetricsCategory),
    payload: z.enum(["new", "returning", "churn"]),
});

const setCustomerMetricsDocumentGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setCustomerMetricsDocument),
    payload: customerMetricsDocumentZod,
});

const setFinancialMetricCategoryGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setFinancialMetricCategory),
    payload: z.enum([
        "expenses",
        "profit",
        "revenue",
        "transactions",
        "otherMetrics",
    ]),
});

const setFinancialMetricsDocumentGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setFinancialMetricsDocument),
    payload: financialMetricsDocumentZod,
});

const isErrorGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setIsError),
    payload: z.boolean(),
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
    payload: z.enum([
        "All Products",
        "Accessory",
        "Central Processing Unit (CPU)",
        "Computer Case",
        "Desktop Computer",
        "Display",
        "Graphics Processing Unit (GPU)",
        "Headphone",
        "Keyboard",
        "Memory (RAM)",
        "Microphone",
        "Motherboard",
        "Mouse",
        "Power Supply Unit (PSU)",
        "Speaker",
        "Storage",
        "Webcam",
    ]),
});

const setProductSubMetricCategoryGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setProductSubMetricCategory),
    payload: z.enum(["revenue", "unitsSold"]),
});

const setRepairMetricCategoryGlobalDispatchZod = z.object({
    action: z.literal(globalAction.setRepairMetricCategory),
    payload: z.enum([
        "All Repairs",
        "Computer Component",
        "Peripheral",
        "Electronic Device",
        "Mobile Device",
        "Audio/Video",
        "Accessory",
    ]),
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
    action: z.literal(globalAction.setStoreLocationView),
    payload: z.enum([
        "All Locations",
        "Calgary",
        "Edmonton",
        "Vancouver",
    ]),
});

export {
    isErrorGlobalDispatchZod,
    setCustomerMetricsCategoryGlobalDispatchZod,
    setCustomerMetricsDocumentGlobalDispatchZod,
    setFinancialMetricCategoryGlobalDispatchZod,
    setFinancialMetricsDocumentGlobalDispatchZod,
    setIsFetchingGlobalDispatchZod,
    setIsPrefersReducedMotionGlobalDispatchZod,
    setProductMetricCategoryGlobalDispatchZod,
    setProductSubMetricCategoryGlobalDispatchZod,
    setRepairMetricCategoryGlobalDispatchZod,
    setRepairMetricsDocumentGlobalDispatchZod,
    setSelectedChartKindGlobalDispatchZod,
    setSelectedYYYYMMDDGlobalDispatchZod,
    setStoreLocationViewGlobalDispatchZod,
};
