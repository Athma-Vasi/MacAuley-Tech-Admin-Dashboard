import { NavigateFunction } from "react-router-dom";
import { shuffle } from "simple-statistics";
import { describe, expect, it, vi } from "vitest";
import {
    ALL_STORE_LOCATIONS_DATA,
    API_URL,
    LOGOUT_URL,
    METRICS_URL,
} from "../../constants";
import { AuthDispatch } from "../../context/authProvider";
import { GlobalDispatch } from "../../context/globalProvider";
import { SafeBoxResult } from "../../types";
import { createSafeBoxResult } from "../../utils";
import { ProductMetricCategory } from "../dashboard/product/types";
import { RepairMetricCategory } from "../dashboard/repair/types";
import { AllStoreLocations, DashboardMetricsView } from "../dashboard/types";
import { ALL_DEPARTMENTS_DATA } from "../directory/constants";
import { DIRECTORY_EMPLOYEE_DATA } from "../directory/data";
import {
    DepartmentsWithDefaultKey,
    DirectoryDispatch,
} from "../directory/types";
import { returnIsStoreLocationDisabled } from "../directory/utils";
import { handleLoginMock, handleLogoutMock } from "../testing/utils";
import {
    handleDirectoryClicks,
    handleLogoutButtonClick,
    handleMetricCategoryNavlinkClick,
} from "./handlers";

type DashboardTestMockInput = {
    metricsView: Lowercase<DashboardMetricsView>;
    productMetricCategory: ProductMetricCategory;
    repairMetricCategory: RepairMetricCategory;
    storeLocationView: AllStoreLocations;
    testKind: "success" | "error";
};

async function handleMetricCategoryNavlinkClickTestMock(
    {
        metricsView,
        productMetricCategory,
        repairMetricCategory,
        storeLocationView,
        testKind,
    }: DashboardTestMockInput,
): Promise<
    SafeBoxResult<[]>
> {
    const authDispatch = vi.fn() as React.Dispatch<AuthDispatch>;
    const fetchAbortControllerRef = {
        current: null,
    } as React.RefObject<AbortController | null>;
    const globalDispatch = vi.fn() as React.Dispatch<GlobalDispatch>;
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const metricsUrl = METRICS_URL;
    const navigate = vi.fn() as NavigateFunction;
    const toLocation = "/dashboard";
    const showBoundary = vi.fn() as (error: any) => void;

    try {
        const loginResult = await handleLoginMock({});
        if (loginResult.err) {
            return createSafeBoxResult({
                message: loginResult.val.message ?? "Login failed",
            });
        }

        const loginUnwrapped = loginResult.safeUnwrap().data;
        if (loginUnwrapped === undefined) {
            return createSafeBoxResult({ message: "Login data is undefined" });
        }

        const { accessToken } = loginUnwrapped[0];

        const handleMetricCategoryNavlinkClickResult =
            await handleMetricCategoryNavlinkClick({
                accessToken,
                authDispatch,
                fetchAbortControllerRef,
                globalDispatch,
                isComponentMountedRef,
                metricsUrl,
                metricsView,
                navigate,
                toLocation,
                productMetricCategory,
                repairMetricCategory,
                showBoundary,
                storeLocationView,
            });

        if (handleMetricCategoryNavlinkClickResult.err) {
            return createSafeBoxResult({
                message: handleMetricCategoryNavlinkClickResult.val.message ??
                    "Failed to handle metric category navlink click",
            });
        }

        const handleResultUnwrapped =
            handleMetricCategoryNavlinkClickResult.safeUnwrap().data;
        if (handleResultUnwrapped === undefined) {
            return createSafeBoxResult({
                message: "handleResultUnwrapped is undefined",
            });
        }

        const { accessToken: newAccessToken, businessMetricsDocument } =
            handleResultUnwrapped;

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
                            handleMetricCategoryNavlinkClickResult.val.data
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

type DashboardQueryParamsPermutations = {
    validPermutations: Array<DashboardTestMockInput>;
    invalidPermutations: Array<DashboardTestMockInput>;
};

function generateDashbaordQueryParamsPermutations(): DashboardQueryParamsPermutations {
    const metricsViews: Array<Lowercase<DashboardMetricsView>> = [
        "products",
        "repairs",
        "customers",
        "financials",
    ];
    const shuffledMetricsViews = shuffle(metricsViews);
    const productMetricCategories: Array<ProductMetricCategory> = [
        "Accessory",
        "All Products",
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
    ];
    const shuffledProductMetricCategories = shuffle(productMetricCategories);
    const repairMetricCategories: Array<RepairMetricCategory> = [
        "Accessory",
        "All Repairs",
        "Audio/Video",
        "Computer Component",
        "Electronic Device",
        "Mobile Device",
        "Peripheral",
    ];
    const shuffledRepairMetricCategories = shuffle(repairMetricCategories);
    const storeLocationViews: Array<AllStoreLocations> = [
        "All Locations",
        "Calgary",
        "Edmonton",
        "Vancouver",
    ];
    const shuffledStoreLocationViews = shuffle(storeLocationViews);

    return shuffledMetricsViews.reduce(
        (
            acc,
            metricsView,
        ) => {
            shuffledProductMetricCategories.forEach((productMetricCategory) => {
                shuffledRepairMetricCategories.forEach(
                    (repairMetricCategory) => {
                        shuffledStoreLocationViews.forEach(
                            (storeLocationView) => {
                                acc.validPermutations.push({
                                    metricsView,
                                    productMetricCategory,
                                    repairMetricCategory,
                                    storeLocationView,
                                    testKind: "success",
                                });

                                // wrong typings due to test
                                acc.invalidPermutations.push({
                                    metricsView: `${
                                        metricsView.charAt(0).toUpperCase()
                                    }${metricsView.slice(1)}` as Lowercase<
                                        DashboardMetricsView
                                    >,
                                    productMetricCategory: productMetricCategory
                                        .toLowerCase() as ProductMetricCategory,
                                    repairMetricCategory: repairMetricCategory
                                        .toLowerCase() as RepairMetricCategory,
                                    storeLocationView: storeLocationView
                                        .toLowerCase() as AllStoreLocations,
                                    testKind: "error",
                                });
                            },
                        );
                    },
                );
            });
            //
            //
            return acc;
        },
        {
            validPermutations: [] as Array<
                DashboardTestMockInput
            >,
            invalidPermutations: [] as Array<
                DashboardTestMockInput
            >,
        },
    );
}

const { validPermutations, invalidPermutations } =
    generateDashbaordQueryParamsPermutations();
const TEST_SIZE = 20;
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
            await handleMetricCategoryNavlinkClickTestMock({
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
            await handleMetricCategoryNavlinkClickTestMock({
                metricsView,
                productMetricCategory,
                repairMetricCategory,
                storeLocationView,
                testKind,
            });
        },
    ),
);

type HandleLogoutButtonClickTestMockInput = {
    testKind: "success" | "error";
    username: string;
    password: string;
};
async function handleLogoutButtonClickTestMock(
    { testKind, password, username }: HandleLogoutButtonClickTestMockInput,
) {
    const fetchAbortControllerRef = {
        current: null,
    } as React.RefObject<AbortController | null>;
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const globalDispatch = vi.fn() as React.Dispatch<GlobalDispatch>;
    const navigate = vi.fn() as NavigateFunction;
    const showBoundary = vi.fn() as (error: any) => void;
    const logoutUrl = LOGOUT_URL;
    const localforage = { clear: vi.fn() as any } as LocalForage;

    try {
        const loginResult = await handleLoginMock({ username, password });
        if (loginResult.err) {
            return createSafeBoxResult({
                message: loginResult.val.message ?? "Login failed",
            });
        }

        const loginUnwrapped = loginResult.safeUnwrap().data;
        if (loginUnwrapped === undefined) {
            return createSafeBoxResult({ message: "Login data is undefined" });
        }

        const { accessToken } = loginUnwrapped[0];

        const handleLogoutButtonClickResult = await handleLogoutButtonClick({
            accessToken: testKind === "success"
                ? accessToken
                : "invalidAccessToken",
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            localforage,
            logoutUrl,
            navigate,
            showBoundary,
        });

        if (testKind === "success" && handleLogoutButtonClickResult.err) {
            return createSafeBoxResult({
                message: handleLogoutButtonClickResult.val.message ??
                    "Failed to handle logout button click",
            });
        }

        describe(
            `given ${testKind === "success" ? "valid" : "invalid"} data,
            username: ${username}
            password: ${password}
            `,
            () => {
                if (testKind === "success") {
                    it("should not equal null", () => {
                        expect(handleLogoutButtonClickResult.val).to.not
                            .equal(null);
                    });
                }
                if (testKind === "error") {
                    it("should return an error HttpServerResponse", () => {
                        expect(handleLogoutButtonClickResult.val.kind)
                            .toBe("error");
                    });
                }
            },
        );
    } catch (error) {
        return createSafeBoxResult({
            message: "Unknown error",
        });
    }
}

function generateLogoutButtonClickInputPermutations(): {
    validLogoutPermutations: Array<HandleLogoutButtonClickTestMockInput>;
    invalidLogoutPermutations: Array<HandleLogoutButtonClickTestMockInput>;
} {
    return shuffle(DIRECTORY_EMPLOYEE_DATA).reduce(
        (acc, employee) => {
            const { username } = employee;
            acc.validLogoutPermutations.push({
                testKind: "success",
                username,
                password: "passwordQ1!",
            });
            acc.invalidLogoutPermutations.push({
                testKind: "error",
                username,
                password: "PasswordQ1!",
            });

            return acc;
        },
        {
            validLogoutPermutations: [] as Array<
                HandleLogoutButtonClickTestMockInput
            >,
            invalidLogoutPermutations: [] as Array<
                HandleLogoutButtonClickTestMockInput
            >,
        },
    );
}

const {
    validLogoutPermutations,
    invalidLogoutPermutations,
} = generateLogoutButtonClickInputPermutations();

const TEST_SIZE_LOGOUT = 20;
const slicedValidLogoutPermutations = validLogoutPermutations.slice(
    0,
    TEST_SIZE_LOGOUT,
);
const slicedInvalidLogoutPermutations = invalidLogoutPermutations.slice(
    0,
    TEST_SIZE_LOGOUT,
);

await Promise.all(
    slicedValidLogoutPermutations.map(
        async ({ testKind, username, password }) => {
            await handleLogoutButtonClickTestMock({
                testKind,
                username,
                password,
            });
        },
    ),
);

await Promise.all(
    slicedInvalidLogoutPermutations.map(
        async ({ testKind, username, password }) => {
            await handleLogoutButtonClickTestMock({
                testKind,
                username,
                password,
            });
        },
    ),
);

async function handleDirectoryClicksTestMock(
    { department, storeLocation, testKind }: {
        department: DepartmentsWithDefaultKey;
        storeLocation: AllStoreLocations;
        testKind: "success" | "error";
    },
) {
    const authDispatch = vi.fn() as React.Dispatch<AuthDispatch>;
    const fetchAbortControllerRef = {
        current: null,
    } as React.RefObject<AbortController | null>;
    const globalDispatch = vi.fn() as React.Dispatch<GlobalDispatch>;
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const directoryUrl = API_URL;
    const navigate = vi.fn() as NavigateFunction;
    const showBoundary = vi.fn() as (error: any) => void;
    const directoryDispatch = vi.fn() as React.Dispatch<DirectoryDispatch>;

    try {
        const loginResult = await handleLoginMock({});
        if (loginResult.err) {
            return createSafeBoxResult({
                message: loginResult.val.message ?? "Login failed",
            });
        }

        const loginUnwrapped = loginResult.safeUnwrap().data;
        if (loginUnwrapped === undefined) {
            return createSafeBoxResult({ message: "Login data is undefined" });
        }

        const { accessToken } = loginUnwrapped[0];

        const handleDirectoryClicksResult = await handleDirectoryClicks({
            accessToken,
            authDispatch,
            department,
            directoryDispatch,
            directoryUrl,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            navigate,
            showBoundary,
            storeLocation,
        });

        if (handleDirectoryClicksResult.err) {
            return createSafeBoxResult({
                message: handleDirectoryClicksResult.val.message ??
                    "Failed to handle directory clicks",
            });
        }

        const handleResultUnwrapped =
            handleDirectoryClicksResult.safeUnwrap().data;
        if (handleResultUnwrapped === undefined) {
            return createSafeBoxResult({
                message: "handleResultUnwrapped is undefined",
            });
        }

        const { newAccessToken, userDocuments } = handleResultUnwrapped;

        if (userDocuments.length === 0 && testKind === "success") {
            return createSafeBoxResult({
                message: "User Documents are empty",
            });
        }

        const logoutResult = await handleLogoutMock({ newAccessToken });
        if (logoutResult.err) {
            return createSafeBoxResult({
                message: logoutResult.val.message ?? "Logout failed",
            });
        }

        describe(
            `given ${testKind === "success" ? "valid" : "invalid"} data,
            department: ${department}
            storeLocation: ${storeLocation}
            `,
            () => {
                if (testKind === "success") {
                    it("should not equal null", () => {
                        expect(handleDirectoryClicksResult.val).to.not
                            .equal(null);
                    });

                    it("should not be an empty array", () => {
                        expect(userDocuments).to.not
                            .equal([]);
                        expect(userDocuments).to.not
                            .equal(null);
                        expect(userDocuments).to.not
                            .equal(undefined);
                    });
                }

                if (testKind === "error") {
                    it("should return empty array", () => {
                        expect(userDocuments).to
                            .toStrictEqual([]);
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

function generateDirectoryClicksInputPermutations(): {
    validDirectoryClicksPermutations: Array<{
        department: DepartmentsWithDefaultKey;
        storeLocation: AllStoreLocations;
        testKind: "success" | "error";
    }>;
    invalidDirectoryClicksPermutations: Array<{
        department: DepartmentsWithDefaultKey;
        storeLocation: AllStoreLocations;
        testKind: "error";
    }>;
} {
    return ALL_DEPARTMENTS_DATA.reduce(
        (acc, { value: department }, dptIdx) => {
            const isStoreLocationDisabled = returnIsStoreLocationDisabled(
                department,
            );

            ALL_STORE_LOCATIONS_DATA.forEach(
                ({ value: storeLocation }, slIdx) => {
                    acc.validDirectoryClicksPermutations.push({
                        department,
                        storeLocation: isStoreLocationDisabled
                            ? "All Locations"
                            : storeLocation as AllStoreLocations,
                        testKind: "success",
                    });

                    acc.invalidDirectoryClicksPermutations.push({
                        department:
                            `${dptIdx}${slIdx}${department}` as DepartmentsWithDefaultKey,
                        storeLocation:
                            `${dptIdx}${slIdx}${storeLocation}` as AllStoreLocations,
                        testKind: "error",
                    });
                },
            );

            return acc;
        },
        {
            validDirectoryClicksPermutations: [] as Array<{
                department: DepartmentsWithDefaultKey;
                storeLocation: AllStoreLocations;
                testKind: "success" | "error";
            }>,
            invalidDirectoryClicksPermutations: [] as Array<{
                department: DepartmentsWithDefaultKey;
                storeLocation: AllStoreLocations;
                testKind: "error";
            }>,
        },
    );
}

const {
    validDirectoryClicksPermutations,
    invalidDirectoryClicksPermutations,
} = generateDirectoryClicksInputPermutations();
const TEST_SIZE_DIRECTORY = 5;
const slicedInvalidDirectoryClicksPermutations = shuffle(
    invalidDirectoryClicksPermutations,
).slice(0, TEST_SIZE_DIRECTORY);

await Promise.all(
    validDirectoryClicksPermutations.map(
        async ({ department, storeLocation, testKind }) => {
            await handleDirectoryClicksTestMock({
                department,
                storeLocation,
                testKind,
            });
        },
    ),
);

await Promise.all(
    slicedInvalidDirectoryClicksPermutations.map(
        async ({ department, storeLocation, testKind }) => {
            await handleDirectoryClicksTestMock({
                department,
                storeLocation,
                testKind,
            });
        },
    ),
);

export { generateDashbaordQueryParamsPermutations };
export type { DashboardQueryParamsPermutations, DashboardTestMockInput };
