import "@vitest/web-worker";
import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
    VALID_STRINGS,
} from "../../constants";
import { dashboardAction } from "./actions";
import {
    dashboardReducer_setCalendarView,
    dashboardReducer_setDashboardCacheWorker,
    dashboardReducer_setIsLoading,
    dashboardReducer_setLoadingMessage,
} from "./reducers";
import { initialDashboardState } from "./state";
import { DashboardCalendarView, DashboardDispatch } from "./types";

describe("dashboardReducer", () => {
    describe(dashboardAction.setCalendarView, () => {
        it("should allow valid calendar view values", () => {
            const validCalendarViews: DashboardCalendarView[] = [
                "Daily",
                "Monthly",
                "Yearly",
            ];
            validCalendarViews.forEach((view) => {
                const dispatch: DashboardDispatch = {
                    action: dashboardAction.setCalendarView,
                    payload: view,
                };
                const state = dashboardReducer_setCalendarView(
                    initialDashboardState,
                    dispatch,
                );
                expect(state.calendarView).toBe(view);
            });
        });

        it("should not allow invalid calendar view values", () => {
            const initialCalendarView = initialDashboardState.calendarView;
            INVALID_STRINGS.forEach((view) => {
                const dispatch: DashboardDispatch = {
                    action: dashboardAction.setCalendarView,
                    payload: view as any,
                };
                const state = dashboardReducer_setCalendarView(
                    initialDashboardState,
                    dispatch,
                );
                expect(state.calendarView).toBe(initialCalendarView);
            });
        });
    });

    describe(dashboardAction.setDashboardCacheWorker, () => {
        it("should set the dashboard fetch worker", () => {
            const dispatch: DashboardDispatch = {
                action: dashboardAction.setDashboardCacheWorker,
                payload: new Worker(""),
            };
            const state = dashboardReducer_setDashboardCacheWorker(
                initialDashboardState,
                dispatch,
            );
            expect(state.dashboardCacheWorker).toBeInstanceOf(Worker);
        });
    });

    describe(dashboardAction.setIsLoading, () => {
        it("should set the loading state", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: DashboardDispatch = {
                    action: dashboardAction.setIsLoading,
                    payload: value,
                };
                const state = dashboardReducer_setIsLoading(
                    initialDashboardState,
                    dispatch,
                );
                expect(state.isLoading).toBe(value);
            });
        });

        it("should not allow invalid loading state values", () => {
            const initialLoadingState = initialDashboardState.isLoading;
            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: DashboardDispatch = {
                    action: dashboardAction.setIsLoading,
                    payload: value as any,
                };
                const state = dashboardReducer_setIsLoading(
                    initialDashboardState,
                    dispatch,
                );
                expect(state.isLoading).toBe(initialLoadingState);
            });
        });
    });

    describe(dashboardAction.setLoadingMessage, () => {
        it("should set the loading message", () => {
            VALID_STRINGS.forEach((message) => {
                const dispatch: DashboardDispatch = {
                    action: dashboardAction.setLoadingMessage,
                    payload: message,
                };
                const state = dashboardReducer_setLoadingMessage(
                    initialDashboardState,
                    dispatch,
                );
                expect(state.loadingMessage).toBe(message);
            });
        });

        it("should not allow invalid loading message values", () => {
            const initialLoadingMessage = initialDashboardState.loadingMessage;
            INVALID_STRINGS.forEach((message) => {
                const dispatch: DashboardDispatch = {
                    action: dashboardAction.setLoadingMessage,
                    payload: message as any,
                };
                const state = dashboardReducer_setLoadingMessage(
                    initialDashboardState,
                    dispatch,
                );
                expect(state.loadingMessage).toBe(initialLoadingMessage);
            });
        });
    });
});
