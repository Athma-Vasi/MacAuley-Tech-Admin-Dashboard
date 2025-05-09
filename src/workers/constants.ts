import { z } from "zod";
import { customerMetricsDocumentZod } from "../components/dashboard/customer/schemas";
import { financialMetricsDocumentZod } from "../components/dashboard/financial/schemas";
import { productMetricsDocumentZod } from "../components/dashboard/product/schemas";
import { repairMetricsDocumentZod } from "../components/dashboard/repair/schemas";
import { userDocumentOptionalsZod } from "../components/usersQuery/schemas";

type RoutesZodSchemasMapKey = keyof typeof ROUTES_ZOD_SCHEMAS_MAP;

/**
 * because zod schemas are not serializable, we need to create a map of
 * schemas to be used in the worker
 */
const ROUTES_ZOD_SCHEMAS_MAP = {
    directory: userDocumentOptionalsZod,
    login: z.object({
        userDocument: userDocumentOptionalsZod,
        financialMetricsDocument: financialMetricsDocumentZod,
    }),
    productMetrics: productMetricsDocumentZod,
    financialMetrics: financialMetricsDocumentZod,
    customerMetrics: customerMetricsDocumentZod,
    repairMetrics: repairMetricsDocumentZod,
    users: userDocumentOptionalsZod,
    checkUsername: z.boolean(),
    checkEmail: z.boolean(),
};

export { ROUTES_ZOD_SCHEMAS_MAP };
export type { RoutesZodSchemasMapKey };
