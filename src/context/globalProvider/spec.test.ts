import { MantineColor } from "@mantine/core";
import { describe, expect, it } from "vitest";
import {
    PRODUCT_METRICS_DATA,
    REPAIR_METRICS_DATA,
} from "../../components/dashboard/constants";
import { CUSTOMER_METRICS_CATEGORY_DATA } from "../../components/dashboard/customer/constants";
import { FINANCIAL_METRICS_CATEGORY_DATA } from "../../components/dashboard/financial/constants";
import { PRODUCT_METRICS_SUB_CATEGORY_DATA } from "../../components/dashboard/product/constants";
import {
    ALL_STORE_LOCATIONS_DATA,
    INVALID_BOOLEANS,
    INVALID_NUMBERS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../constants";
import { globalAction } from "./actions";
import {
    globalReducer_setColorScheme,
    globalReducer_setCustomerMetricsCategory,
    globalReducer_setCustomerMetricsDocument,
    globalReducer_setDefaultGradient,
    globalReducer_setFinancialMetricCategory,
    globalReducer_setFinancialMetricsDocument,
    globalReducer_setIsError,
    globalReducer_setIsFetching,
    globalReducer_setPrefersReducedMotion,
    globalReducer_setPrimaryColor,
    globalReducer_setPrimaryShadeDark,
    globalReducer_setPrimaryShadeLight,
    globalReducer_setProductMetricCategory,
    globalReducer_setProductMetricsDocument,
    globalReducer_setProductSubMetricCategory,
    globalReducer_setRepairMetricCategory,
    globalReducer_setRepairMetricsDocument,
    globalReducer_setSelectedYYYYMMDD,
    globalReducer_setStoreLocationView,
} from "./reducers";
import { initialGlobalState } from "./state";
import { ColorScheme, GlobalDispatch, Shade } from "./types";

/**
 * describe("usersQueryReducer_setCurrentPage", () => {
        it("should allow valid number values", () => {
            const VALID_NUMBERS = [0, 1, 2, 3, 4, 5];
            VALID_NUMBERS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setCurrentPage,
                    payload: value,
                };
                const state = usersQueryReducer_setCurrentPage(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.currentPage).toBe(value);
            });
        });
        it("should not allow invalid number values", () => {
            const initialCurrentPage = initialUsersQueryState.currentPage;

            INVALID_NUMBERS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setCurrentPage,
                    payload: value as any,
                };
                const state = usersQueryReducer_setCurrentPage(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.currentPage).toBe(initialCurrentPage);
            });
        });
    });
 */

describe("globalReducer", () => {
    describe("setProductMetricCategory", () => {
        it("should allow valid string values", () => {
            PRODUCT_METRICS_DATA.forEach(({ value }) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setProductMetricCategory,
                    payload: value,
                };
                const state = globalReducer_setProductMetricCategory(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.productMetricCategory).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialProductMetricCategory =
                initialGlobalState.productMetricCategory;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setProductMetricCategory,
                    payload: value as any,
                };
                const state = globalReducer_setProductMetricCategory(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.productMetricCategory).toBe(
                    initialProductMetricCategory,
                );
            });
        });
    });

    describe("setProductSubMetricCategory", () => {
        it("should allow valid string values", () => {
            PRODUCT_METRICS_SUB_CATEGORY_DATA.forEach(({ value }) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setProductSubMetricCategory,
                    payload: value,
                };
                const state = globalReducer_setProductSubMetricCategory(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.productSubMetricCategory).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialProductSubMetricCategory =
                initialGlobalState.productSubMetricCategory;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setProductSubMetricCategory,
                    payload: value as any,
                };
                const state = globalReducer_setProductSubMetricCategory(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.productSubMetricCategory).toBe(
                    initialProductSubMetricCategory,
                );
            });
        });
    });

    describe("setRepairMetricCategory", () => {
        it("should allow valid string values", () => {
            REPAIR_METRICS_DATA.forEach(({ value }) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setRepairMetricCategory,
                    payload: value,
                };
                const state = globalReducer_setRepairMetricCategory(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.repairMetricCategory).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialRepairMetricCategory =
                initialGlobalState.repairMetricCategory;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setRepairMetricCategory,
                    payload: value as any,
                };
                const state = globalReducer_setRepairMetricCategory(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.repairMetricCategory).toBe(
                    initialRepairMetricCategory,
                );
            });
        });
    });

    describe("setFinancialMetricCategory", () => {
        it("should allow valid string values", () => {
            FINANCIAL_METRICS_CATEGORY_DATA.forEach(({ value }) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setFinancialMetricCategory,
                    payload: value,
                };
                const state = globalReducer_setFinancialMetricCategory(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.financialMetricCategory).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialFinancialMetricCategory =
                initialGlobalState.financialMetricCategory;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setFinancialMetricCategory,
                    payload: value as any,
                };
                const state = globalReducer_setFinancialMetricCategory(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.financialMetricCategory).toBe(
                    initialFinancialMetricCategory,
                );
            });
        });
    });

    describe("setCustomerMetricsCategory", () => {
        it("should allow valid string values", () => {
            CUSTOMER_METRICS_CATEGORY_DATA.forEach(({ value }) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setCustomerMetricsCategory,
                    payload: value,
                };
                const state = globalReducer_setCustomerMetricsCategory(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.customerMetricsCategory).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialCustomerMetricsCategory =
                initialGlobalState.customerMetricsCategory;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setCustomerMetricsCategory,
                    payload: value as any,
                };
                const state = globalReducer_setCustomerMetricsCategory(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.customerMetricsCategory).toBe(
                    initialCustomerMetricsCategory,
                );
            });
        });
    });

    describe("setFinancialMetricsDocument", () => {
        it("should allow valid object values", () => {
            const dispatch: GlobalDispatch = {
                action: globalAction.setFinancialMetricsDocument,
                payload: {} as any,
            };
            const state = globalReducer_setFinancialMetricsDocument(
                initialGlobalState,
                dispatch,
            );
            expect(state.financialMetricsDocument).to.equal(
                null,
            );
        });
        it("should not allow invalid object values", () => {
            const initialFinancialMetricsDocument =
                initialGlobalState.financialMetricsDocument;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setFinancialMetricsDocument,
                    payload: value as any,
                };
                const state = globalReducer_setFinancialMetricsDocument(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.financialMetricsDocument).toBe(
                    initialFinancialMetricsDocument,
                );
            });
        });
    });

    describe("setProductMetricsDocument", () => {
        it("should allow valid object values", () => {
            const dispatch: GlobalDispatch = {
                action: globalAction.setProductMetricsDocument,
                payload: {} as any,
            };
            const state = globalReducer_setProductMetricsDocument(
                initialGlobalState,
                dispatch,
            );
            expect(state.productMetricsDocument).to.equal(
                null,
            );
        });
        it("should not allow invalid object values", () => {
            const initialProductMetricsDocument =
                initialGlobalState.productMetricsDocument;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setProductMetricsDocument,
                    payload: value as any,
                };
                const state = globalReducer_setProductMetricsDocument(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.productMetricsDocument).toBe(
                    initialProductMetricsDocument,
                );
            });
        });
    });

    describe("setCustomerMetricsDocument", () => {
        it("should allow valid object values", () => {
            const dispatch: GlobalDispatch = {
                action: globalAction.setCustomerMetricsDocument,
                payload: {} as any,
            };
            const state = globalReducer_setCustomerMetricsDocument(
                initialGlobalState,
                dispatch,
            );
            expect(state.customerMetricsDocument).to.equal(
                null,
            );
        });
        it("should not allow invalid object values", () => {
            const initialCustomerMetricsDocument =
                initialGlobalState.customerMetricsDocument;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setCustomerMetricsDocument,
                    payload: value as any,
                };
                const state = globalReducer_setCustomerMetricsDocument(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.customerMetricsDocument).toBe(
                    initialCustomerMetricsDocument,
                );
            });
        });
    });

    describe("setRepairMetricsDocument", () => {
        it("should allow valid object values", () => {
            const dispatch: GlobalDispatch = {
                action: globalAction.setRepairMetricsDocument,
                payload: {} as any,
            };
            const state = globalReducer_setRepairMetricsDocument(
                initialGlobalState,
                dispatch,
            );
            expect(state.repairMetricsDocument).to.equal(
                null,
            );
        });
        it("should not allow invalid object values", () => {
            const initialRepairMetricsDocument =
                initialGlobalState.repairMetricsDocument;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setRepairMetricsDocument,
                    payload: value as any,
                };
                const state = globalReducer_setRepairMetricsDocument(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.repairMetricsDocument).toBe(
                    initialRepairMetricsDocument,
                );
            });
        });
    });

    describe("setColorScheme", () => {
        it("should allow valid string values", () => {
            ["light", "dark"].forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setColorScheme,
                    payload: value as ColorScheme,
                };
                const state = globalReducer_setColorScheme(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.themeObject.colorScheme).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialColorScheme =
                initialGlobalState.themeObject.colorScheme;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setColorScheme,
                    payload: value as any,
                };
                const state = globalReducer_setColorScheme(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.themeObject.colorScheme).toBe(initialColorScheme);
            });
        });
    });

    describe("setSelectedYYYYMMDD", () => {
        it("should allow valid string values", () => {
            const validDates = [
                "2023-01-01",
                "2023-02-28",
                "2023-03-15",
                "2023-12-31",
            ];

            validDates.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setSelectedYYYYMMDD,
                    payload: value,
                };
                const state = globalReducer_setSelectedYYYYMMDD(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.selectedYYYYMMDD).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialSelectedYYYYMMDD = initialGlobalState.selectedYYYYMMDD;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setSelectedYYYYMMDD,
                    payload: value as any,
                };
                const state = globalReducer_setSelectedYYYYMMDD(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.selectedYYYYMMDD).toBe(initialSelectedYYYYMMDD);
            });
        });
    });

    describe("setDefaultGradient", () => {
        it("should allow valid string values", () => {
            const validGradientPayloads = [
                { deg: 0, from: "red", to: "blue" },
                { deg: 90, from: "green", to: "yellow" },
                { deg: 180, from: "red", to: "pink" },
                { deg: 270, from: "orange", to: "cyan" },
            ];

            validGradientPayloads.forEach((payload) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setDefaultGradient,
                    payload,
                };
                const state = globalReducer_setDefaultGradient(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.themeObject.defaultGradient).toStrictEqual(
                    payload,
                );
            });
        });
        it("should not allow invalid string values", () => {
            const initialDefaultGradient =
                initialGlobalState.themeObject.defaultGradient;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setDefaultGradient,
                    payload: value as any,
                };
                const state = globalReducer_setDefaultGradient(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.themeObject.defaultGradient).toBe(
                    initialDefaultGradient,
                );
            });
        });
    });

    describe("setPrefersReducedMotion", () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setPrefersReducedMotion,
                    payload: value,
                };
                const state = globalReducer_setPrefersReducedMotion(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.isPrefersReducedMotion).toBe(value);
            });
        });
        it("should not allow invalid boolean values", () => {
            const initialPrefersReducedMotion =
                initialGlobalState.isPrefersReducedMotion;

            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setPrefersReducedMotion,
                    payload: value as any,
                };
                const state = globalReducer_setPrefersReducedMotion(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.isPrefersReducedMotion).toBe(
                    initialPrefersReducedMotion,
                );
            });
        });
    });

    describe("setPrimaryColor", () => {
        it("should allow valid string values", () => {
            const validColors: Array<MantineColor> = [
                "dark",
                "red",
                "blue",
                "green",
                "yellow",
                "pink",
                "orange",
                "cyan",
                "gray",
                "grape",
                "violet",
                "indigo",
                "lime",
                "teal",
            ];

            validColors.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setPrimaryColor,
                    payload: value,
                };
                const state = globalReducer_setPrimaryColor(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.themeObject.primaryColor).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialPrimaryColor =
                initialGlobalState.themeObject.primaryColor;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setPrimaryColor,
                    payload: value as any,
                };
                const state = globalReducer_setPrimaryColor(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.themeObject.primaryColor).toBe(
                    initialPrimaryColor,
                );
            });
        });
    });

    describe("setPrimaryShadeDark", () => {
        it("should allow valid number values", () => {
            const validShades: Array<Shade> = Array.from(
                { length: 10 },
                (_, i) => i as Shade,
            );

            validShades.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setPrimaryShadeDark,
                    payload: value,
                };
                const state = globalReducer_setPrimaryShadeDark(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.themeObject.primaryShade.dark).toBe(value);
            });
        });
        it("should not allow invalid number values", () => {
            const initialPrimaryShadeDark =
                initialGlobalState.themeObject.primaryShade.dark;

            INVALID_NUMBERS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setPrimaryShadeDark,
                    payload: value as any,
                };
                const state = globalReducer_setPrimaryShadeDark(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.themeObject.primaryShade.dark).toBe(
                    initialPrimaryShadeDark,
                );
            });
        });
    });

    describe("setPrimaryShadeLight", () => {
        it("should allow valid number values", () => {
            const validShades: Array<Shade> = Array.from(
                { length: 10 },
                (_, i) => i as Shade,
            );

            validShades.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setPrimaryShadeLight,
                    payload: value,
                };
                const state = globalReducer_setPrimaryShadeLight(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.themeObject.primaryShade.light).toBe(value);
            });
        });
        it("should not allow invalid number values", () => {
            const initialPrimaryShadeLight =
                initialGlobalState.themeObject.primaryShade.light;

            INVALID_NUMBERS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setPrimaryShadeLight,
                    payload: value as any,
                };
                const state = globalReducer_setPrimaryShadeLight(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.themeObject.primaryShade.light).toBe(
                    initialPrimaryShadeLight,
                );
            });
        });
    });

    describe("setIsError", () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setIsError,
                    payload: value,
                };
                const state = globalReducer_setIsError(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.isError).toBe(value);
            });
        });
        it("should not allow invalid boolean values", () => {
            const initialIsError = initialGlobalState.isError;

            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setIsError,
                    payload: value as any,
                };
                const state = globalReducer_setIsError(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.isError).toBe(initialIsError);
            });
        });
    });

    describe("setIsFetching", () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setIsFetching,
                    payload: value,
                };
                const state = globalReducer_setIsFetching(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.isFetching).toBe(value);
            });
        });
        it("should not allow invalid boolean values", () => {
            const initialIsFetching = initialGlobalState.isFetching;

            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setIsFetching,
                    payload: value as any,
                };
                const state = globalReducer_setIsFetching(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.isFetching).toBe(initialIsFetching);
            });
        });
    });

    describe("setStoreLocationView", () => {
        it("should allow valid string values", () => {
            ALL_STORE_LOCATIONS_DATA.forEach(({ value }) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setStoreLocationView,
                    payload: value,
                };
                const state = globalReducer_setStoreLocationView(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.storeLocationView).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialStoreLocationView =
                initialGlobalState.storeLocationView;

            INVALID_STRINGS.forEach((value) => {
                const dispatch: GlobalDispatch = {
                    action: globalAction.setStoreLocationView,
                    payload: value as any,
                };
                const state = globalReducer_setStoreLocationView(
                    initialGlobalState,
                    dispatch,
                );
                expect(state.storeLocationView).toBe(initialStoreLocationView);
            });
        });
    });
});
