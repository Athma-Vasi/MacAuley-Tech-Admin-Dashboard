/**
 * isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  password: string;
  username: string;
 */

import { z } from "zod";

const setIsLoadingDispatchZod = z.object({
    action: z.literal("setIsLoading"),
    payload: z.boolean(),
});
const setIsSubmittingDispatchZod = z.object({
    action: z.literal("setIsSubmitting"),
    payload: z.boolean(),
});
const setIsSuccessfulDispatchZod = z.object({
    action: z.literal("setIsSuccessful"),
    payload: z.boolean(),
});
const setPasswordDispatchZod = z.object({
    action: z.literal("setPassword"),
    payload: z.string(),
});
const setUsernameDispatchZod = z.object({
    action: z.literal("setUsername"),
    payload: z.string(),
});

type LoginDispatchZod =
    | z.infer<typeof setIsLoadingDispatchZod>
    | z.infer<typeof setIsSubmittingDispatchZod>
    | z.infer<typeof setIsSuccessfulDispatchZod>
    | z.infer<typeof setPasswordDispatchZod>
    | z.infer<typeof setUsernameDispatchZod>;

export {
    setIsLoadingDispatchZod,
    setIsSubmittingDispatchZod,
    setIsSuccessfulDispatchZod,
    setPasswordDispatchZod,
    setUsernameDispatchZod,
};
export type { LoginDispatchZod };
