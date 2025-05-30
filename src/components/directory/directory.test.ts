import "@vitest/web-worker";
import { describe, expect, it } from "vitest";
import { ALL_STORE_LOCATIONS_DATA, INVALID_STRINGS } from "../../constants";
import { directoryAction } from "./actions";
import { DEPARTMENTS_DATA, ORIENTATIONS_DATA } from "./constants";

import {
    directoryReducer_setClickedInput,
    directoryReducer_setDepartment,
    directoryReducer_setDirectoryFetchWorker,
    directoryReducer_setIsLoading,
    directoryReducer_setOrientation,
    directoryReducer_setStoreLocation,
} from "./reducers";
import { initialDirectoryState } from "./state";
import { DirectoryDispatch } from "./types";

describe("Directory Reducers", () => {
    describe(directoryAction.setDepartment, () => {
        it("should allow valid empty payload", () => {
            DEPARTMENTS_DATA.forEach(({ value }) => {
                const dispatch: DirectoryDispatch = {
                    action: directoryAction.setDepartment,
                    payload: value,
                };
                const state = directoryReducer_setDepartment(
                    initialDirectoryState,
                    dispatch,
                );
                expect(state.department).toBe(value);
            });
        });

        it("should not allow invalid payload", () => {
            INVALID_STRINGS.forEach((value) => {
                const dispatch: DirectoryDispatch = {
                    action: directoryAction.setDepartment,
                    payload: value as any,
                };
                const state = directoryReducer_setDepartment(
                    initialDirectoryState,
                    dispatch,
                );
                expect(state.department).toBe(
                    initialDirectoryState.department,
                );
            });
        });
    });

    describe(directoryAction.setDirectoryFetchWorker, () => {
        it("should set the directory fetch worker", () => {
            const dispatch: DirectoryDispatch = {
                action: directoryAction.setDirectoryFetchWorker,
                payload: new Worker(""),
            };
            const state = directoryReducer_setDirectoryFetchWorker(
                initialDirectoryState,
                dispatch,
            );
            expect(state.directoryFetchWorker).toBeInstanceOf(Worker);
        });
    });

    describe(directoryAction.setIsLoading, () => {
        it("should allow valid payload", () => {
            const dispatch: DirectoryDispatch = {
                action: directoryAction.setIsLoading,
                payload: true,
            };
            const state = directoryReducer_setIsLoading(
                initialDirectoryState,
                dispatch,
            );
            expect(state.isLoading).toBe(true);
        });

        it("should not allow invalid payload", () => {
            INVALID_STRINGS.forEach((value) => {
                const dispatch: DirectoryDispatch = {
                    action: directoryAction.setIsLoading,
                    payload: value as any,
                };
                const state = directoryReducer_setIsLoading(
                    initialDirectoryState,
                    dispatch,
                );
                expect(state.isLoading).toBe(initialDirectoryState.isLoading);
            });
        });
    });

    describe(directoryAction.setOrientation, () => {
        it("should allow valid payload", () => {
            ORIENTATIONS_DATA.forEach(({ value }) => {
                const dispatch: DirectoryDispatch = {
                    action: directoryAction.setOrientation,
                    payload: value,
                };
                const state = directoryReducer_setOrientation(
                    initialDirectoryState,
                    dispatch,
                );
                expect(state.orientation).toBe(value);
            });
        });

        it("should not allow invalid payload", () => {
            INVALID_STRINGS.forEach((value) => {
                const dispatch: DirectoryDispatch = {
                    action: directoryAction.setOrientation,
                    payload: value as any,
                };
                const state = directoryReducer_setOrientation(
                    initialDirectoryState,
                    dispatch,
                );
                expect(state.orientation).toBe(
                    initialDirectoryState.orientation,
                );
            });
        });
    });

    describe(directoryAction.setStoreLocation, () => {
        it("should allow valid payload", () => {
            ALL_STORE_LOCATIONS_DATA.forEach(({ value }) => {
                const dispatch: DirectoryDispatch = {
                    action: directoryAction.setStoreLocation,
                    payload: value,
                };
                const state = directoryReducer_setStoreLocation(
                    initialDirectoryState,
                    dispatch,
                );
                expect(state.storeLocation).toBe(value);
            });
        });

        it("should not allow invalid payload", () => {
            INVALID_STRINGS.forEach((value) => {
                const dispatch: DirectoryDispatch = {
                    action: directoryAction.setStoreLocation,
                    payload: value as any,
                };
                const state = directoryReducer_setStoreLocation(
                    initialDirectoryState,
                    dispatch,
                );
                expect(state.storeLocation).toBe(
                    initialDirectoryState.storeLocation,
                );
            });
        });
    });

    describe(directoryAction.setClickedInput, () => {
        it("should allow valid payload", () => {
            const validInputs = ["department", "storeLocation", ""] as const;
            validInputs.forEach((input) => {
                const dispatch: DirectoryDispatch = {
                    action: directoryAction.setClickedInput,
                    payload: input,
                };
                const state = directoryReducer_setClickedInput(
                    initialDirectoryState,
                    dispatch,
                );
                expect(state.clickedInput).toBe(input);
            });
        });

        it("should not allow invalid payload", () => {
            INVALID_STRINGS.forEach((value) => {
                const dispatch: DirectoryDispatch = {
                    action: directoryAction.setClickedInput,
                    payload: value as any,
                };
                const state = directoryReducer_setClickedInput(
                    initialDirectoryState,
                    dispatch,
                );
                expect(state.clickedInput).toBe(
                    initialDirectoryState.clickedInput,
                );
            });
        });
    });
});
