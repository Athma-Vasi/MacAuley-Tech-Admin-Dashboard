import "@vitest/web-worker";
import { describe, expect, it } from "vitest";
import { INVALID_STRINGS } from "../../constants";
import { DashboardMetricsView } from "../dashboard/types";
import { sidebarAction } from "./actions";
import {
    sidebarReducer_setClickedNavlink,
    sidebarReducer_setDirectoryFetchWorker,
    sidebarReducer_setLogoutFetchWorker,
    sidebarReducer_setMetricsFetchWorker,
    sidebarReducer_setMetricsView,
} from "./reducers";
import { initialSidebarState } from "./state";
import { SidebarDispatch, SidebarNavlinks } from "./types";

describe("Sidebar", () => {
    describe("sidebarReducer", () => {
        describe(sidebarAction.setClickedNavlink, () => {
            const validValues: SidebarNavlinks[] = [
                "directory",
                "users",
                "financials",
                "products",
                "customers",
                "repairs",
                "logout",
            ];

            validValues.forEach((value) => {
                it(`should allow valid value: ${value}`, () => {
                    const dispatch: SidebarDispatch = {
                        action: sidebarAction.setClickedNavlink,
                        payload: value,
                    };
                    const state = sidebarReducer_setClickedNavlink(
                        initialSidebarState,
                        dispatch,
                    );
                    expect(state.clickedNavlink).toBe(value);
                });
            });

            INVALID_STRINGS.forEach((value) => {
                it(`should not allow invalid value: ${value}`, () => {
                    const dispatch: SidebarDispatch = {
                        action: sidebarAction.setClickedNavlink,
                        payload: value as any,
                    };
                    const state = sidebarReducer_setClickedNavlink(
                        initialSidebarState,
                        dispatch,
                    );
                    expect(state.clickedNavlink).toBe(
                        initialSidebarState.clickedNavlink,
                    );
                });
            });
        });

        describe(sidebarAction.setDirectoryFetchWorker, () => {
            it("should allow valid value", () => {
                const dispatch: SidebarDispatch = {
                    action: sidebarAction.setDirectoryFetchWorker,
                    payload: new Worker(""),
                };
                const state = sidebarReducer_setDirectoryFetchWorker(
                    initialSidebarState,
                    dispatch,
                );
                expect(state.directoryFetchWorker).toBeInstanceOf(Worker);
            });

            it("should not allow invalid value", () => {
                const dispatch: SidebarDispatch = {
                    action: sidebarAction.setDirectoryFetchWorker,
                    payload: {} as any,
                };
                const state = sidebarReducer_setDirectoryFetchWorker(
                    initialSidebarState,
                    dispatch,
                );
                expect(state.directoryFetchWorker).toBe(
                    initialSidebarState.directoryFetchWorker,
                );
            });
        });

        describe(sidebarAction.setLogoutFetchWorker, () => {
            it("should allow valid value", () => {
                const dispatch: SidebarDispatch = {
                    action: sidebarAction.setLogoutFetchWorker,
                    payload: new Worker(""),
                };
                const state = sidebarReducer_setLogoutFetchWorker(
                    initialSidebarState,
                    dispatch,
                );
                expect(state.logoutFetchWorker).toBeInstanceOf(Worker);
            });

            it("should not allow invalid value", () => {
                const dispatch: SidebarDispatch = {
                    action: sidebarAction.setLogoutFetchWorker,
                    payload: {} as any,
                };
                const state = sidebarReducer_setLogoutFetchWorker(
                    initialSidebarState,
                    dispatch,
                );
                expect(state.logoutFetchWorker).toBe(
                    initialSidebarState.logoutFetchWorker,
                );
            });
        });

        describe(sidebarAction.setMetricsFetchWorker, () => {
            it("should allow valid value", () => {
                const dispatch: SidebarDispatch = {
                    action: sidebarAction.setMetricsFetchWorker,
                    payload: new Worker(""),
                };
                const state = sidebarReducer_setMetricsFetchWorker(
                    initialSidebarState,
                    dispatch,
                );
                expect(state.metricsFetchWorker).toBeInstanceOf(Worker);
            });

            it("should not allow invalid value", () => {
                const dispatch: SidebarDispatch = {
                    action: sidebarAction.setMetricsFetchWorker,
                    payload: {} as any,
                };
                const state = sidebarReducer_setMetricsFetchWorker(
                    initialSidebarState,
                    dispatch,
                );
                expect(state.metricsFetchWorker).toBe(
                    initialSidebarState.metricsFetchWorker,
                );
            });
        });

        describe(sidebarAction.setMetricsView, () => {
            const validValues: Lowercase<DashboardMetricsView>[] = [
                "financials",
                "products",
                "customers",
                "repairs",
            ];

            validValues.forEach((value) => {
                it(`should allow valid value: ${value}`, () => {
                    const dispatch: SidebarDispatch = {
                        action: sidebarAction.setMetricsView,
                        payload: value,
                    };
                    const state = sidebarReducer_setMetricsView(
                        initialSidebarState,
                        dispatch,
                    );
                    expect(state.metricsView).toBe(value);
                });
            });

            INVALID_STRINGS.forEach((value) => {
                it(`should not allow invalid value: ${value}`, () => {
                    const dispatch: SidebarDispatch = {
                        action: sidebarAction.setMetricsView,
                        payload: value as any,
                    };
                    const state = sidebarReducer_setMetricsView(
                        initialSidebarState,
                        dispatch,
                    );
                    expect(state.metricsView).toBe(
                        initialSidebarState.metricsView,
                    );
                });
            });
        });
    });
});
