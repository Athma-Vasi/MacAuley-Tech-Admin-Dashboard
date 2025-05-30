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

const setFinancialMetricsWorkerLoginDispatchZod = z.object({
    action: z.literal(loginAction.setFinancialMetricsWorker),
    payload: z.instanceof(Worker),
});

const setProductMetricsWorkerLoginDispatchZod = z.object({
    action: z.literal(loginAction.setProductMetricsWorker),
    payload: z.instanceof(Worker),
});

const setRepairMetricsWorkerLoginDispatchZod = z.object({
    action: z.literal(loginAction.setRepairMetricsWorker),
    payload: z.instanceof(Worker),
});

const setCustomerMetricsWorkerLoginDispatchZod = z.object({
    action: z.literal(loginAction.setCustomerMetricsWorker),
    payload: z.instanceof(Worker),
});

const setProductMetricsGeneratedLoginDispatchZod = z.object({
    action: z.literal(loginAction.setProductMetricsGenerated),
    payload: z.boolean(),
});

const setRepairMetricsGeneratedLoginDispatchZod = z.object({
    action: z.literal(loginAction.setRepairMetricsGenerated),
    payload: z.boolean(),
});

const setFinancialMetricsGeneratedLoginDispatchZod = z.object({
    action: z.literal(loginAction.setFinancialMetricsGenerated),
    payload: z.boolean(),
});

type LoginDispatch =
    | z.infer<typeof setIsLoadingLoginDispatchZod>
    | z.infer<typeof setIsSubmittingLoginDispatchZod>
    | z.infer<typeof setIsSuccessfulLoginDispatchZod>
    | z.infer<typeof setPasswordLoginDispatchZod>
    | z.infer<typeof setUsernameLoginDispatchZod>
    | z.infer<typeof setLoginFetchWorkerLoginDispatchZod>
    | z.infer<typeof setErrorMessageLoginDispatchZod>
    | z.infer<typeof setFinancialMetricsWorkerLoginDispatchZod>
    | z.infer<typeof setProductMetricsWorkerLoginDispatchZod>
    | z.infer<typeof setRepairMetricsWorkerLoginDispatchZod>
    | z.infer<typeof setCustomerMetricsWorkerLoginDispatchZod>
    | z.infer<typeof setProductMetricsGeneratedLoginDispatchZod>
    | z.infer<typeof setRepairMetricsGeneratedLoginDispatchZod>
    | z.infer<typeof setFinancialMetricsGeneratedLoginDispatchZod>;

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
    navigate: z.function().args(z.any()).returns(z.void()),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

const handleMessageEventCustomerMetricsWorkerToMainInputZod = z.object({
    event: z.instanceof(MessageEvent),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

const handleMessageEventProductMetricsWorkerToMainInputZod = z.object({
    event: z.instanceof(MessageEvent),
    loginDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

const handleMessageEventRepairMetricsWorkerToMainInputZod = z.object({
    event: z.instanceof(MessageEvent),
    loginDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

const handleMessageEventFinancialMetricsWorkerToMainInputZod = z.object({
    event: z.instanceof(MessageEvent),
    loginDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

export {
    handleLoginClickInputZod,
    handleMessageEventCustomerMetricsWorkerToMainInputZod,
    handleMessageEventFinancialMetricsWorkerToMainInputZod,
    handleMessageEventLoginFetchWorkerToMainInputZod,
    handleMessageEventProductMetricsWorkerToMainInputZod,
    handleMessageEventRepairMetricsWorkerToMainInputZod,
    setCustomerMetricsWorkerLoginDispatchZod,
    setErrorMessageLoginDispatchZod,
    setFinancialMetricsGeneratedLoginDispatchZod,
    setFinancialMetricsWorkerLoginDispatchZod,
    setIsLoadingLoginDispatchZod,
    setIsSubmittingLoginDispatchZod,
    setIsSuccessfulLoginDispatchZod,
    setLoginFetchWorkerLoginDispatchZod,
    setPasswordLoginDispatchZod,
    setProductMetricsGeneratedLoginDispatchZod,
    setProductMetricsWorkerLoginDispatchZod,
    setRepairMetricsGeneratedLoginDispatchZod,
    setRepairMetricsWorkerLoginDispatchZod,
    setUsernameLoginDispatchZod,
};
export type { LoginDispatch };
