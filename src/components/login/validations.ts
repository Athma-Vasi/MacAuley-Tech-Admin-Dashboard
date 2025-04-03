import { z } from "zod";
import { HttpResponseKindZodEnum, UserRolesZodEnum } from "../../parse";

const loginResponseZodSchema = z.object({
  accessToken: z.string(),
  data: z.array(
    z.object({
      _id: z.string(),
      username: z.string(),
      email: z.string(),
      roles: z.array(z.enum(UserRolesZodEnum)),
      createdAt: z.string(),
      updatedAt: z.string(),
      __v: z.number(),
    }),
  ),
  kind: z.enum(HttpResponseKindZodEnum),
  message: z.string(),
  pages: z.number(),
  status: z.number(),
  totalDocuments: z.number(),
  triggerLogout: z.boolean(),
});

export { loginResponseZodSchema };
