import { z } from "zod";
import { loginAction } from "./actions";

const setIsLoadingLoginDispatchZod = z.object({
    action: z.literal(loginAction.setIsLoading),
    payload: z.boolean(),
});
const setIsSubmittingLoginDispatchZod = z.object({
    action: z.literal(loginAction.setIsSubmitting),
    payload: z.boolean(),
});
const setIsSuccessfulLoginDispatchZod = z.object({
    action: z.literal(loginAction.setIsSuccessful),
    payload: z.boolean(),
});
const setPasswordLoginDispatchZod = z.object({
    action: z.literal(loginAction.setPassword),
    payload: z.string(),
});
const setUsernameLoginDispatchZod = z.object({
    action: z.literal(loginAction.setUsername),
    payload: z.string(),
});
const setLoginFetchWorkerLoginDispatchZod = z.object({
    action: z.literal(loginAction.setLoginFetchWorker),
    payload: z.instanceof(Worker),
});

const setErrorMessageLoginDispatchZod = z.object({
    action: z.literal(loginAction.setErrorMessage),
    payload: z.string(),
});

type LoginDispatch =
    | z.infer<typeof setIsLoadingLoginDispatchZod>
    | z.infer<typeof setIsSubmittingLoginDispatchZod>
    | z.infer<typeof setIsSuccessfulLoginDispatchZod>
    | z.infer<typeof setPasswordLoginDispatchZod>
    | z.infer<typeof setUsernameLoginDispatchZod>
    | z.infer<typeof setLoginFetchWorkerLoginDispatchZod>
    | z.infer<typeof setErrorMessageLoginDispatchZod>;

const handleLoginClickInputZod = z.object({
    isLoading: z.boolean(),
    isSubmitting: z.boolean(),
    isSuccessful: z.boolean(),
    loginDispatch: z.function().args(z.any()).returns(z.void()),
    loginFetchWorker: z.instanceof(Worker),
    schema: z.object({
        username: z.string(),
        password: z.string(),
    }),
});

const handleMessageEventLoginFetchWorkerToMainInputZod = z.object({
    authDispatch: z.function().args(z.any()).returns(z.void()),
    event: z.instanceof(MessageEvent),
    globalDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    loginDispatch: z.function().args(z.any()).returns(z.void()),
    metricsUrl: z.string().url(),
    navigate: z.function().args(z.any()).returns(z.void()),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

export {
    handleLoginClickInputZod,
    handleMessageEventLoginFetchWorkerToMainInputZod,
    setErrorMessageLoginDispatchZod,
    setIsLoadingLoginDispatchZod,
    setIsSubmittingLoginDispatchZod,
    setIsSuccessfulLoginDispatchZod,
    setLoginFetchWorkerLoginDispatchZod,
    setPasswordLoginDispatchZod,
    setUsernameLoginDispatchZod,
};
export type { LoginDispatch };
