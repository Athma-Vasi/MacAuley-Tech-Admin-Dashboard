import { z } from "zod";

const httpResponseSchema = z.object({
  accessToken: z.string(),
  // data field is an array of objects that will be merged
  // data: z.array(),
  kind: z.string(),
  message: z.string(),
  pages: z.number(),
  status: z.number(),
  totalDocuments: z.number(),
  triggerLogout: z.boolean(),
});

const HttpResponseKindZodEnum = ["success", "error"] as const;

const UserRolesZodEnum = ["Admin", "Employee", "Manager"] as const;

export { HttpResponseKindZodEnum, httpResponseSchema, UserRolesZodEnum };
