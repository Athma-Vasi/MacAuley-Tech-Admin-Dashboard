import { NavigateFunction } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { API_URL } from "../../constants";
import { authAction } from "../../context/authProvider";
import { UserDocument } from "../../types";
import { createSafeBoxResult, parseSafeSync } from "../../utils";
import { SortDirection } from "../query/types";
import { handleLoginMock, handleLogoutMock } from "../testing/utils";
import { usersQueryAction } from "./actions";
import { handleUsersQuerySubmitGET } from "./handlers";
import { userDocumentZ } from "./schemas";
import { initialUsersQueryState } from "./state";
import { UsersQueryState } from "./types";

// describe("usersQueryReducer_resetToInitial", () => {
//     it("should return the initial state", () => {
//         const dispatch: UsersQueryDispatch = {
//             action: usersQueryAction.resetToInitial,
//             payload: initialUsersQueryState,
//         };
//         const state = usersQueryReducer_resetToInitial(
//             initialUsersQueryState,
//             dispatch,
//         );
//         expect(state).toEqual(initialUsersQueryState);
//     });
// });

// describe("usersQueryReducer_setArrangeByDirection", () => {
//     it("should allow valid string values", () => {
//         ARRANGE_BY_DIRECTIONS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setArrangeByDirection,
//                 payload: value,
//             };
//             const state = usersQueryReducer_setArrangeByDirection(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.arrangeByDirection).toBe(value);
//         });
//     });
//     it("should not allow invalid string values", () => {
//         const initialArrangeByDirection =
//             initialUsersQueryState.arrangeByDirection;
//         INVALID_STRINGS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setArrangeByDirection,
//                 payload: value as any,
//             };
//             const state = usersQueryReducer_setArrangeByDirection(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.arrangeByDirection).toBe(initialArrangeByDirection);
//         });
//     });
// });

// describe("usersQueryReducer_setArrangeByField", () => {
//     it("should allow valid string values", () => {
//         const VALID_FIELDS: Array<keyof UserDocument> = [
//             "addressLine",
//             "city",
//             "country",
//             "department",
//             "email",
//             "firstName",
//             "jobPosition",
//             "lastName",
//             "orgId",
//             "parentOrgId",
//             "password",
//             "postalCodeCanada",
//             "postalCodeUS",
//             "profilePictureUrl",
//             "province",
//             "roles",
//             "state",
//             "storeLocation",
//             "username",
//             "_id",
//             "createdAt",
//             "updatedAt",
//             "__v",
//         ];
//         VALID_FIELDS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setArrangeByField,
//                 payload: value,
//             };
//             const state = usersQueryReducer_setArrangeByField(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.arrangeByField).toBe(value);
//         });
//     });
//     it("should not allow invalid string values", () => {
//         const initialArrangeByField = initialUsersQueryState.arrangeByField;
//         INVALID_STRINGS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setArrangeByField,
//                 payload: value as any,
//             };
//             const state = usersQueryReducer_setArrangeByField(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.arrangeByField).toBe(initialArrangeByField);
//         });
//     });
// });

// describe("usersQueryReducer_setCurrentPage", () => {
//     it("should allow valid number values", () => {
//         const VALID_NUMBERS = [0, 1, 2, 3, 4, 5];
//         VALID_NUMBERS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setCurrentPage,
//                 payload: value,
//             };
//             const state = usersQueryReducer_setCurrentPage(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.currentPage).toBe(value);
//         });
//     });
//     it("should not allow invalid number values", () => {
//         const initialCurrentPage = initialUsersQueryState.currentPage;

//         INVALID_NUMBERS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setCurrentPage,
//                 payload: value as any,
//             };
//             const state = usersQueryReducer_setCurrentPage(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.currentPage).toBe(initialCurrentPage);
//         });
//     });
// });

// describe("usersQueryReducer_setIsError", () => {
//     it("should allow valid boolean values", () => {
//         VALID_BOOLEANS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setIsError,
//                 payload: value,
//             };
//             const state = usersQueryReducer_setIsError(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.isError).toBe(value);
//         });
//     });
//     it("should not allow invalid boolean values", () => {
//         const initialIsError = initialUsersQueryState.isError;
//         INVALID_BOOLEANS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setIsError,
//                 payload: value as any,
//             };
//             const state = usersQueryReducer_setIsError(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.isError).toBe(initialIsError);
//         });
//     });
// });

// describe("usersQueryReducer_setIsLoading", () => {
//     it("should allow valid boolean values", () => {
//         VALID_BOOLEANS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setIsLoading,
//                 payload: value,
//             };
//             const state = usersQueryReducer_setIsLoading(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.isLoading).toBe(value);
//         });
//     });
//     it("should not allow invalid boolean values", () => {
//         const initialIsLoading = initialUsersQueryState.isLoading;
//         INVALID_BOOLEANS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setIsLoading,
//                 payload: value as any,
//             };
//             const state = usersQueryReducer_setIsLoading(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.isLoading).toBe(initialIsLoading);
//         });
//     });
// });

// describe("usersQueryReducer_setNewQueryFlag", () => {
//     it("should allow valid boolean values", () => {
//         VALID_BOOLEANS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setNewQueryFlag,
//                 payload: value,
//             };
//             const state = usersQueryReducer_setNewQueryFlag(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.newQueryFlag).toBe(value);
//         });
//     });
//     it("should not allow invalid boolean values", () => {
//         const initialNewQueryFlag = initialUsersQueryState.newQueryFlag;
//         INVALID_BOOLEANS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setNewQueryFlag,
//                 payload: value as any,
//             };
//             const state = usersQueryReducer_setNewQueryFlag(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.newQueryFlag).toBe(initialNewQueryFlag);
//         });
//     });
// });

// describe("usersQueryReducer_setPages", () => {
//     it("should allow valid number values", () => {
//         const VALID_NUMBERS = [0, 1, 2, 3, 4, 5];
//         VALID_NUMBERS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setPages,
//                 payload: value,
//             };
//             const state = usersQueryReducer_setPages(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.pages).toBe(value);
//         });
//     });
//     it("should not allow invalid number values", () => {
//         const initialPages = initialUsersQueryState.pages;
//         INVALID_NUMBERS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setPages,
//                 payload: value as any,
//             };
//             const state = usersQueryReducer_setPages(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.pages).toBe(initialPages);
//         });
//     });
// });

// describe("usersQueryReducer_setQueryString", () => {
//     it("should allow valid string values", () => {
//         const VALID_STRINGS = ["", "test", "query"];
//         VALID_STRINGS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setQueryString,
//                 payload: value,
//             };
//             const state = usersQueryReducer_setQueryString(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.queryString).toBe(value);
//         });
//     });
//     it("should not allow invalid string values", () => {
//         const initialQueryString = initialUsersQueryState.queryString;
//         INVALID_STRINGS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setQueryString,
//                 payload: value as any,
//             };
//             const state = usersQueryReducer_setQueryString(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.queryString).toBe(initialQueryString);
//         });
//     });
// });

// describe("usersQueryReducer_setResourceData", () => {
//     it("should allow valid array values", () => {
//         const VALID_ARRAYS: Array<Omit<UserDocument, "password">> = [
//             {
//                 _id: "6801a9426f9c9056d944398e",
//                 username: "manager",
//                 email: "manager@example.com",
//                 addressLine: "6662 Ocean Avenue",
//                 city: "Vancouver",
//                 country: "Canada",
//                 postalCodeCanada: "Q7A 5E3",
//                 postalCodeUS: "00000",
//                 province: "British Columbia",
//                 state: "Not Applicable",
//                 department: "Information Technology",
//                 firstName: "Miles",
//                 jobPosition: "Web Developer",
//                 lastName: "Vorkosigan",
//                 profilePictureUrl:
//                     "https://images.pexels.com/photos/4777025/pexels-photo-4777025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//                 storeLocation: "All Locations",
//                 orgId: 161,
//                 parentOrgId: 76,
//                 roles: [
//                     "Manager",
//                 ],
//                 createdAt: "2025-04-18T01:22:10.726Z",
//                 updatedAt: "2025-04-18T01:22:10.726Z",
//                 __v: 0,
//             },
//         ];

//         const dispatch: UsersQueryDispatch = {
//             action: usersQueryAction.setResourceData,
//             payload: VALID_ARRAYS,
//         };
//         const state = usersQueryReducer_setResourceData(
//             initialUsersQueryState,
//             dispatch,
//         );
//         expect(state.resourceData).toEqual(VALID_ARRAYS);
//     });
//     it("should not allow invalid array values", () => {
//         const initialResourceData = initialUsersQueryState.resourceData;
//         INVALID_STRINGS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setResourceData,
//                 payload: value as any,
//             };
//             const state = usersQueryReducer_setResourceData(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.resourceData).toEqual(initialResourceData);
//         });
//     });
// });

// describe("usersQueryReducer_setTotalDocuments", () => {
//     it("should allow valid number values", () => {
//         const VALID_NUMBERS = [0, 1, 2, 3, 4, 5];
//         VALID_NUMBERS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setTotalDocuments,
//                 payload: value,
//             };
//             const state = usersQueryReducer_setTotalDocuments(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.totalDocuments).toBe(value);
//         });
//     });
//     it("should not allow invalid number values", () => {
//         const initialTotalDocuments = initialUsersQueryState.totalDocuments;
//         INVALID_NUMBERS.forEach((value) => {
//             const dispatch: UsersQueryDispatch = {
//                 action: usersQueryAction.setTotalDocuments,
//                 payload: value as any,
//             };
//             const state = usersQueryReducer_setTotalDocuments(
//                 initialUsersQueryState,
//                 dispatch,
//             );
//             expect(state.totalDocuments).toBe(initialTotalDocuments);
//         });
//     });
// });

async function handleUsersQuerySubmitGETTestMock(
    {
        arrangeByDirection,
        arrangeByField,
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
    }: {
        arrangeByDirection: SortDirection;
        arrangeByField: keyof UserDocument;
        currentPage: number;
        newQueryFlag: boolean;
        queryString: string;
        totalDocuments: number;
    },
) {
    const fetchAbortControllerRef = {
        current: null,
    } as React.RefObject<AbortController | null>;
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const authDispatch = vi.fn() as React.Dispatch<any>;
    const usersQueryDispatch = vi.fn() as React.Dispatch<any>;
    const navigate = vi.fn() as NavigateFunction;
    const showBoundary = vi.fn() as (error: unknown) => void;
    const url = API_URL;
    const usersQueryState: UsersQueryState = {
        ...initialUsersQueryState,
        arrangeByDirection,
        arrangeByField,
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
    };

    try {
        const loginResult = await handleLoginMock();
        if (loginResult.err) {
            return createSafeBoxResult({ message: "Login failed" });
        }

        const loginUnwrapped = loginResult.safeUnwrap().data;
        if (loginUnwrapped === undefined) {
            return createSafeBoxResult({ message: "Login data is undefined" });
        }

        const { accessToken } = loginUnwrapped[0];

        const usersQueryResult = await handleUsersQuerySubmitGET({
            accessToken,
            authDispatch,
            usersQueryDispatch,
            fetchAbortControllerRef,
            isComponentMountedRef,
            navigate,
            showBoundary,
            url,
            usersQueryState,
        });

        if (usersQueryResult.err) {
            return createSafeBoxResult({ message: "Users query failed" });
        }

        const usersQueryUnwrapped = usersQueryResult.safeUnwrap().data;
        if (usersQueryUnwrapped === undefined) {
            return createSafeBoxResult({
                message: "Users query data is undefined",
            });
        }

        const { newAccessToken, userDocuments } = usersQueryUnwrapped;

        const parsedResult = parseSafeSync({
            object: userDocuments,
            zSchema: userDocumentZ,
        });

        if (parsedResult.err) {
            return createSafeBoxResult({ message: "Parsing failed" });
        }

        const logoutResult = await handleLogoutMock({ newAccessToken });
        if (logoutResult.err) {
            return createSafeBoxResult({ message: "Logout failed" });
        }

        const logoutUnwrapped = logoutResult.safeUnwrap().data;
        if (logoutUnwrapped === undefined) {
            return createSafeBoxResult({ message: "Logout data is undefined" });
        }

        describe(
            `handleUsersQuerySubmitGET
               when given: 
                 arrangeByDirection: ${arrangeByDirection}
                 arrangeByField: ${arrangeByField}
                 currentPage: ${currentPage}
                 newQueryFlag: ${newQueryFlag}
                 queryString: ${queryString}
                 totalDocuments: ${totalDocuments}
            `,
            () => {
                it("should return a SafeBoxResult with kind 'success'", () => {
                    expect(usersQueryResult.safeUnwrap().kind).toBe("success");
                });

                it("should call authDispatch to set accessToken", () => {
                    expect(authDispatch).toHaveBeenCalledWith({
                        action: authAction.setAccessToken,
                        payload: newAccessToken,
                    });
                });

                it("should call usersQueryDispatch to set resourceData", () => {
                    expect(usersQueryDispatch).toHaveBeenCalledWith({
                        action: usersQueryAction.setResourceData,
                        payload: parsedResult.safeUnwrap().data,
                    });
                });
            },
        );

        return createSafeBoxResult({ kind: "success" });
    } catch (error) {
        return createSafeBoxResult({ data: error, message: "Error occurred" });
    }
}

const testInput: Array<UsersQueryState> = [
    {
        ...initialUsersQueryState,
        arrangeByDirection: "ascending",
        arrangeByField: "username",
        currentPage: 1,
        newQueryFlag: true,
        queryString: "?",
        totalDocuments: 0,
    },
];

await Promise.all(
    testInput.map(
        async ({
            arrangeByDirection,
            arrangeByField,
            currentPage,
            newQueryFlag,
            queryString,
            totalDocuments,
        }) => {
            await handleUsersQuerySubmitGETTestMock({
                arrangeByDirection,
                arrangeByField,
                currentPage,
                newQueryFlag,
                queryString,
                totalDocuments,
            });
        },
    ),
);

/**
 * async function handleUsersQuerySubmitGET(
    {
        accessToken,
        authDispatch,
        dispatch,
        fetchAbortControllerRef,
        isComponentMountedRef,
        navigate,
        showBoundary,
        url,
        usersQueryState,
    }: {
        accessToken: string;
        authDispatch: React.Dispatch<AuthDispatch>;
        dispatch: React.Dispatch<any>;
        fetchAbortControllerRef: React.RefObject<
            AbortController | null
        >;
        isComponentMountedRef: React.RefObject<boolean>;
        navigate: NavigateFunction;
        showBoundary: (error: unknown) => void;
        url: RequestInfo | URL;
        usersQueryState: UsersQueryState;
    },
) {
    fetchAbortControllerRef.current?.abort(
        "Previous request cancelled",
    );
    fetchAbortControllerRef.current = new AbortController();
    const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    const {
        arrangeByDirection,
        arrangeByField,
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
    } = usersQueryState;

    const requestInit: RequestInit = {
        method: "GET",
        signal: fetchAbortController.signal,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
    };

    const urlWithQuery = new URL(
        `${url}/user/${queryString}&totalDocuments=${totalDocuments}&newQueryFlag=${newQueryFlag}&page=${currentPage}`,
    );

    dispatch({
        action: usersQueryAction.setIsLoading,
        payload: true,
    });

    try {
        const responseResult = await fetchSafe(
            urlWithQuery,
            requestInit,
        );

        if (!isComponentMounted) {
            return;
        }

        if (responseResult.err) {
            showBoundary(responseResult.val.data);
            return;
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return;
        }

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<UserDocument>
        >(
            responseUnwrapped,
        );

        if (!isComponentMounted) {
            return;
        }

        if (jsonResult.err) {
            showBoundary(jsonResult.val.data);
            return;
        }

        const serverResponse = jsonResult.safeUnwrap().data;

        if (serverResponse === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return;
        }

        console.time("--PARSING--");
        const parsedResult = await parseServerResponseSafeAsync({
            object: serverResponse,
            zSchema: userDocumentZ,
        });
        console.timeEnd("--PARSING--");

        if (!isComponentMounted) {
            return;
        }
        if (parsedResult.err) {
            showBoundary(parsedResult.val.data);
            return;
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return;
        }

        const { accessToken, kind, message, triggerLogout } =
            parsedServerResponse;

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
            navigate("/");
            return;
        }

        if (kind === "error") {
            showBoundary(
                new Error(
                    `Server error: ${message}`,
                ),
            );
            return;
        }

        const decodedTokenResult = await decodeJWTSafe(
            accessToken,
        );

        if (!isComponentMounted) {
            return;
        }

        if (decodedTokenResult.err) {
            showBoundary(decodedTokenResult.val.data);
            return;
        }

        const decodedToken = decodedTokenResult.safeUnwrap().data;
        if (!decodedToken) {
            showBoundary(new Error("Invalid token"));
            return;
        }

        authDispatch({
            action: authAction.setAccessToken,
            payload: accessToken,
        });
        authDispatch({
            action: authAction.setDecodedToken,
            payload: decodedToken,
        });

        const data = parsedServerResponse.data as unknown as UserDocument[];

        const sorted = data.sort((a, b) => {
            if (arrangeByDirection === "ascending") {
                return a[arrangeByField] >
                        b[arrangeByField]
                    ? 1
                    : -1;
            } else {
                return a[arrangeByField] < b[arrangeByField] ? 1 : -1;
            }
        });

        dispatch({
            action: usersQueryAction.setResourceData,
            payload: sorted,
        });

        dispatch({
            action: usersQueryAction.setTotalDocuments,
            payload: serverResponse.totalDocuments,
        });

        dispatch({
            action: usersQueryAction.setIsLoading,
            payload: false,
        });

        dispatch({
            action: usersQueryAction.setPages,
            payload: serverResponse.pages,
        });

        dispatch({
            action: usersQueryAction.setNewQueryFlag,
            payload: true,
        });

        dispatch({
            action: usersQueryAction.setCurrentPage,
            payload: currentPage,
        });
    } catch (error: unknown) {
        if (
            !isComponentMounted ||
            fetchAbortController.signal.aborted
        ) {
            return;
        }
        showBoundary(error);
    }
}
 */

/**
 * type UsersQueryState = {
    arrangeByDirection: SortDirection;
    arrangeByField: keyof UserDocument;
    currentPage: number;
    isError: boolean;
    isLoading: boolean;
    newQueryFlag: boolean;
    pages: number;
    queryString: string;
    resourceData: Array<UserDocument>;
    totalDocuments: number;
};

describe("registerReducer_setConfirmPassword", () => {
    it("should allow valid string values", () => {
        VALID_PASSWORDS.forEach((value) => {
            const dispatch: RegisterDispatch = {
                action: registerAction.setConfirmPassword,
                payload: value,
            };
            const state = registerReducer_setConfirmPassword(
                initialRegisterState,
                dispatch,
            );
            expect(state.confirmPassword).toBe(value);
        });
    });
    it("should not allow invalid string values", () => {
        const initialConfirmPassword = initialRegisterState.confirmPassword;
        INVALID_STRINGS.forEach((value) => {
            const dispatch: RegisterDispatch = {
                action: registerAction.setConfirmPassword,
                payload: value as any,
            };
            const state = registerReducer_setConfirmPassword(
                initialRegisterState,
                dispatch,
            );
            expect(state.confirmPassword).toBe(initialConfirmPassword);
        });
    });
});

export {
    usersQueryReducer,
    usersQueryReducer_resetToInitial,
    usersQueryReducer_setArrangeByDirection,
    usersQueryReducer_setArrangeByField,
    usersQueryReducer_setCurrentPage,
    usersQueryReducer_setIsError,
    usersQueryReducer_setIsLoading,
    usersQueryReducer_setNewQueryFlag,
    usersQueryReducer_setPages,
    usersQueryReducer_setQueryString,
    usersQueryReducer_setResourceData,
    usersQueryReducer_setTotalDocuments,
};
 */
