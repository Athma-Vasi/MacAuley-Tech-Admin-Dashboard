// global schemas

import { z } from "zod";

const productMetricCategoryZod = z.enum([
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
]);

const repairMetricCategoryZod = z.enum([
    "All Repairs",
    "Computer Component",
    "Peripheral",
    "Electronic Device",
    "Mobile Device",
    "Audio/Video",
    "Accessory",
]);

const allStoreLocationsZod = z.enum([
    "All Locations",
    "Edmonton",
    "Calgary",
    "Vancouver",
]);

const financialMetricCategoryZod = z.enum([
    "expenses",
    "profit",
    "revenue",
    "transactions",
    "otherMetrics",
]);

const customerMetricCategoryZod = z.enum(["new", "returning", "churn"]);

const metricsViewZod = z.enum([
    "financials",
    "products",
    "customers",
    "repairs",
]);

const allDepartmentsZod = z.enum([
    "All Departments",
    "Executive Management",
    "Human Resources",
    "Store Administration",
    "Office Administration",
    "Accounting",
    "Sales",
    "Marketing",
    "Information Technology",
    "Repair Technicians",
    "Field Service Technicians",
    "Logistics and Inventory",
    "Customer Service",
    "Maintenance",
]);

export {
    allDepartmentsZod,
    allStoreLocationsZod,
    customerMetricCategoryZod,
    financialMetricCategoryZod,
    metricsViewZod,
    productMetricCategoryZod,
    repairMetricCategoryZod,
};
