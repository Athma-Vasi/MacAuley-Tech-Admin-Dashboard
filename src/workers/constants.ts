import { z } from "zod";
import { financialMetricsDocumentZod } from "../components/dashboard/financial/schemas";
import { userDocumentOptionalsZod } from "../components/usersQuery/schemas";

type RoutesZodSchemasMapKey = keyof typeof ROUTES_ZOD_SCHEMAS_MAP;

/**
 * because zod schemas are not serializable, we need to create a map of
 * schemas to be used in the worker
 */
const ROUTES_ZOD_SCHEMAS_MAP = {
    login: z.object({
        userDocument: userDocumentOptionalsZod,
        financialMetricsDocument: financialMetricsDocumentZod,
    }),
};

export { ROUTES_ZOD_SCHEMAS_MAP };
export type { RoutesZodSchemasMapKey };
