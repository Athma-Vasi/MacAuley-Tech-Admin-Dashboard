import { NavigateFunction } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { METRICS_URL } from "../../constants";
import { AuthDispatch } from "../../context/authProvider";
import { GlobalDispatch } from "../../context/globalProvider";
import { SafeBoxResult } from "../../types";
import {
    createSafeBoxResult,
    getForageItemSafe,
    setForageItemSafe,
} from "../../utils";
import { generateDashbaordQueryParamsPermutations } from "../sidebar/spec.test";
import { handleLoginMock, handleLogoutMock } from "../testing/utils";
import { handleStoreCategoryClick } from "./handlers";
import { ProductMetricCategory } from "./product/types";
import { RepairMetricCategory } from "./repair/types";
import {
    AllStoreLocations,
    DashboardDispatch,
    DashboardMetricsView,
} from "./types";

type DashboardTestMockInput = {
    metricsView: Lowercase<DashboardMetricsView>;
    productMetricCategory: ProductMetricCategory;
    repairMetricCategory: RepairMetricCategory;
    storeLocationView: AllStoreLocations;
    testKind: "success" | "error";
};

async function handleStoreCategoryClickTestMock(
    {
        metricsView,
        productMetricCategory,
        repairMetricCategory,
        storeLocationView,
        testKind,
    }: DashboardTestMockInput,
): Promise<
    SafeBoxResult<boolean>
> {
    const fetchAbortControllerRef = {
        current: null,
    } as React.RefObject<AbortController | null>;
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const authDispatch = vi.fn() as React.Dispatch<AuthDispatch>;
    const dashboardDispatch = vi.fn() as React.Dispatch<DashboardDispatch>;
    const globalDispatch = vi.fn() as React.Dispatch<GlobalDispatch>;
    const showBoundary = vi.fn() as (error: any) => void;
    const navigateFn = vi.fn() as NavigateFunction;
    const metricsUrl = METRICS_URL;

    try {
        const loginResult = await handleLoginMock({});
        if (loginResult.err) {
            return createSafeBoxResult({ message: "Login failed" });
        }

        const loginUnwrapped = loginResult.safeUnwrap().data;
        if (loginUnwrapped === undefined) {
            return createSafeBoxResult({ message: "Login data is undefined" });
        }

        const { accessToken } = loginUnwrapped[0];

        const handleStoreCategoryClickResult = await handleStoreCategoryClick({
            accessToken,
            authDispatch,
            dashboardDispatch,
            fetchAbortControllerRef,
            getForageItemSafe,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl,
            metricsView,
            navigateFn,
            productMetricCategory,
            repairMetricCategory,
            setForageItemSafe,
            showBoundary,
            storeLocationView,
        });
        if (handleStoreCategoryClickResult.err) {
            return createSafeBoxResult({
                message: handleStoreCategoryClickResult.val.message ??
                    "Handle store category click failed",
            });
        }

        const unwrappedResult =
            handleStoreCategoryClickResult.safeUnwrap().data;
        if (unwrappedResult === undefined) {
            return createSafeBoxResult({
                message: "Unwrapped result is undefined",
            });
        }

        const { newAccessToken, businessMetricsDocument } = unwrappedResult;

        const logoutResult = await handleLogoutMock({ newAccessToken });
        if (logoutResult.err) {
            return createSafeBoxResult({
                message: logoutResult.val.message ?? "Logout failed",
            });
        }

        describe(
            `given ${testKind === "success" ? "valid" : "invalid"} data,
               metricsView: ${metricsView}
               productMetricCategory: ${productMetricCategory}
               repairMetricCategory: ${repairMetricCategory}
               storeLocationView: ${storeLocationView}
            `,
            () => {
                if (testKind === "success") {
                    it("should not equal null", () => {
                        expect(businessMetricsDocument).to.not
                            .equal(null);
                    });
                    it("should have storeLocation property", () => {
                        expect(businessMetricsDocument).to.have
                            .property("storeLocation");
                        expect(businessMetricsDocument.storeLocation)
                            .to.equal(storeLocationView);
                    });
                } else {
                    it("should return undefined", () => {
                        expect(
                            handleStoreCategoryClickResult.val.data
                                ?.businessMetricsDocument,
                        )
                            .toBe(undefined);
                    });
                }
            },
        );

        return createSafeBoxResult({
            kind: "success",
        });
    } catch (error) {
        return createSafeBoxResult({
            message: "Unknown error",
        });
    }
}

const { invalidPermutations, validPermutations } =
    generateDashbaordQueryParamsPermutations();
const TEST_SIZE = 1;
const slicedValids = validPermutations.slice(0, TEST_SIZE);
const slicedInvalids = invalidPermutations.slice(0, TEST_SIZE);

await Promise.all(
    slicedValids.map(
        async ({
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            storeLocationView,
            testKind,
        }) => {
            await handleStoreCategoryClickTestMock({
                metricsView,
                productMetricCategory,
                repairMetricCategory,
                storeLocationView,
                testKind,
            });
        },
    ),
);

await Promise.all(
    slicedInvalids.map(
        async ({
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            storeLocationView,
            testKind,
        }) => {
            await handleStoreCategoryClickTestMock({
                metricsView,
                productMetricCategory,
                repairMetricCategory,
                storeLocationView,
                testKind,
            });
        },
    ),
);

/**
 * async function handleStoreCategoryClick(
    {
        accessToken,
        authDispatch,
        dashboardDispatch,
        fetchAbortControllerRef,
        globalDispatch,
        isComponentMountedRef,
        metricsUrl,
        navigateFn,
        metricsView,
        productMetricCategory,
        repairMetricCategory,
        showBoundary,
        storeLocationView,
    }: {
        accessToken: string;
        authDispatch: React.Dispatch<AuthDispatch>;
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        fetchAbortControllerRef: React.RefObject<AbortController | null>;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
        metricsUrl: string;
        metricsView: Lowercase<DashboardMetricsView>;
        navigateFn: NavigateFunction;
        productMetricCategory: ProductMetricCategory;
        repairMetricCategory: RepairMetricCategory;
        showBoundary: (error: any) => void;
        storeLocationView: AllStoreLocations;
    },
): Promise<SafeBoxResult<boolean[]>> {
    fetchAbortControllerRef.current?.abort("Previous request cancelled");
    fetchAbortControllerRef.current = new AbortController();
    const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    const requestInit: RequestInit = {
        method: "GET",
        signal: fetchAbortController.signal,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const storeLocationQuery = `&storeLocation[$eq]=${storeLocationView}`;

    const metricCategoryQuery = metricsView === "products"
        ? `&metricCategory[$eq]=${productMetricCategory}`
        : metricsView === "repairs"
        ? `&metricCategory[$eq]=${repairMetricCategory}`
        : "";

    const urlWithQuery = new URL(
        `${metricsUrl}/${metricsView}/?${storeLocationQuery}${metricCategoryQuery}`,
    );

    const forageKey = createMetricsForageKey({
        metricsView,
        productMetricCategory,
        repairMetricCategory,
        storeLocationView,
    });

    dashboardDispatch({
        action: dashboardAction.setIsLoading,
        payload: true,
    });

    try {
        const metricsDocumentResult = await getForageItemSafe<
            BusinessMetricsDocument
        >(forageKey);

        if (metricsDocumentResult.err) {
            showBoundary(metricsDocumentResult.val.data);
            return createSafeBoxResult({
                message: metricsDocumentResult.val.message ??
                    "Unable to get forage item",
            });
        }
        const unwrapped = metricsDocumentResult.safeUnwrap();
        const metricsDocument = unwrapped.data;

        if (
            unwrapped.kind === "success"
        ) {
            if (metricsView === "customers") {
                globalDispatch({
                    action: globalAction.setCustomerMetricsDocument,
                    payload: metricsDocument as CustomerMetricsDocument,
                });
            }

            if (metricsView === "financials") {
                globalDispatch({
                    action: globalAction.setFinancialMetricsDocument,
                    payload: metricsDocument as FinancialMetricsDocument,
                });
            }

            if (metricsView === "products") {
                globalDispatch({
                    action: globalAction.setProductMetricsDocument,
                    payload: metricsDocument as ProductMetricsDocument,
                });
            }

            if (metricsView === "repairs") {
                globalDispatch({
                    action: globalAction.setRepairMetricsDocument,
                    payload: metricsDocument as RepairMetricsDocument,
                });
            }

            dashboardDispatch({
                action: dashboardAction.setIsLoading,
                payload: false,
            });

            return createSafeBoxResult({
                data: [true],
                kind: "success",
            });
        }

        const responseResult = await fetchSafe(urlWithQuery, requestInit);
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        if (responseResult.err) {
            showBoundary(responseResult.val.data);
            return createSafeBoxResult({
                message: responseResult.val.message ??
                    "Unable to fetch data",
            });
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;
        if (responseUnwrapped === undefined) {
            showBoundary(new Error("No data returned from server"));
            return createSafeBoxResult({
                message: "No data returned from server",
            });
        }

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<BusinessMetricsDocument>
        >(
            responseUnwrapped,
        );

        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        if (jsonResult.err) {
            showBoundary(jsonResult.val.data);
            return createSafeBoxResult({
                message: jsonResult.val.message ??
                    "Unable to parse response",
            });
        }

        const serverResponse = jsonResult.safeUnwrap().data;
        if (serverResponse === undefined) {
            showBoundary(new Error("No data returned from server"));
            return createSafeBoxResult({
                message: "No data returned from server",
            });
        }

        console.time("--PARSING--");
        const parsedResult = await parseServerResponseAsyncSafe({
            object: serverResponse,
            zSchema: metricsView === "customers"
                ? customerMetricsDocumentZod
                : metricsView === "financials"
                ? financialMetricsDocumentZod
                : metricsView === "products"
                ? productMetricsDocumentZod
                : repairMetricsDocumentZod,
        });
        console.timeEnd("--PARSING--");

        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }
        if (parsedResult.err) {
            showBoundary(parsedResult.val.data);
            return createSafeBoxResult({
                message: parsedResult.val.message ??
                    "Unable to parse response",
            });
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return createSafeBoxResult({
                message: "No data returned from server",
            });
        }

        const { accessToken, triggerLogout } = parsedServerResponse;

        if (triggerLogout) {
            authDispatch({
                action: authAction.setAccessToken,
                payload: "",
            });
            authDispatch({
                action: authAction.setIsLoggedIn,
                payload: false,
            });
            authDispatch({
                action: authAction.setDecodedToken,
                payload: Object.create(null),
            });
            authDispatch({
                action: authAction.setUserDocument,
                payload: Object.create(null),
            });

            await localforage.clear();
            navigateFn("/");
            return createSafeBoxResult({
                data: [false],
                kind: "success",
            });
        }

        const decodedTokenResult = await decodeJWTSafe(accessToken);

        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        if (decodedTokenResult.err) {
            showBoundary(decodedTokenResult.val.data);
            return createSafeBoxResult({
                message: decodedTokenResult.val.message ??
                    "Unable to decode token",
            });
        }

        const decodedToken = decodedTokenResult.safeUnwrap().data;
        if (decodedToken === undefined) {
            showBoundary(new Error("Invalid token"));
            return createSafeBoxResult({
                message: "Invalid token",
            });
        }

        authDispatch({
            action: authAction.setAccessToken,
            payload: accessToken,
        });
        authDispatch({
            action: authAction.setDecodedToken,
            payload: decodedToken,
        });

        const payload = parsedServerResponse.data[0];

        if (metricsView === "financials") {
            globalDispatch({
                action: globalAction.setFinancialMetricsDocument,
                payload: payload as FinancialMetricsDocument,
            });
        }

        if (metricsView === "products") {
            globalDispatch({
                action: globalAction.setProductMetricsDocument,
                payload: payload as ProductMetricsDocument,
            });
        }

        if (metricsView === "customers") {
            globalDispatch({
                action: globalAction.setCustomerMetricsDocument,
                payload: payload as CustomerMetricsDocument,
            });
        }

        if (metricsView === "repairs") {
            globalDispatch({
                action: globalAction.setRepairMetricsDocument,
                payload: payload as RepairMetricsDocument,
            });
        }

        await setForageItemSafe<BusinessMetricsDocument>(
            forageKey,
            payload,
        );

        dashboardDispatch({
            action: dashboardAction.setIsLoading,
            payload: false,
        });

        return createSafeBoxResult({
            data: [true],
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !isComponentMounted || fetchAbortController?.signal.aborted
        ) {
            return createSafeBoxResult({
                message: "Component unmounted or request aborted",
            });
        }

        showBoundary(error);
        return createSafeBoxResult({
            message: (error as Error)?.message ?? "Unknown error",
        });
    }
}
 */
