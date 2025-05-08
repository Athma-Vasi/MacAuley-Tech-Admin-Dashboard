import { z } from "zod";
import { loginAction } from "./actions";

const setIsLoadingDispatchZod = z.object({
    action: z.literal(loginAction.setIsLoading),
    payload: z.boolean(),
});
const setIsSubmittingDispatchZod = z.object({
    action: z.literal(loginAction.setIsSubmitting),
    payload: z.boolean(),
});
const setIsSuccessfulDispatchZod = z.object({
    action: z.literal(loginAction.setIsSuccessful),
    payload: z.boolean(),
});
const setPasswordDispatchZod = z.object({
    action: z.literal(loginAction.setPassword),
    payload: z.string(),
});
const setUsernameDispatchZod = z.object({
    action: z.literal(loginAction.setUsername),
    payload: z.string(),
});
const setFetchParseWorkerDispatchZod = z.object({
    action: z.literal(loginAction.setFetchParseWorker),
    payload: z.instanceof(Worker),
});

type LoginDispatch =
    | z.infer<typeof setIsLoadingDispatchZod>
    | z.infer<typeof setIsSubmittingDispatchZod>
    | z.infer<typeof setIsSuccessfulDispatchZod>
    | z.infer<typeof setPasswordDispatchZod>
    | z.infer<typeof setUsernameDispatchZod>
    | z.infer<typeof setFetchParseWorkerDispatchZod>;

export {
    setFetchParseWorkerDispatchZod,
    setIsLoadingDispatchZod,
    setIsSubmittingDispatchZod,
    setIsSuccessfulDispatchZod,
    setPasswordDispatchZod,
    setUsernameDispatchZod,
};
export type { LoginDispatch };
