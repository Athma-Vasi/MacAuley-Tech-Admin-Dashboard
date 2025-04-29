import { NavigateFunction } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LOGIN_URL } from "../../constants";
import { AuthDispatch } from "../../context/authProvider";
import { GlobalDispatch } from "../../context/globalProvider";
import { createSafeBoxResult } from "../../utils";
import { DIRECTORY_EMPLOYEE_DATA } from "../directory/data";
import { handleLogoutMock } from "../testing/utils";
import { handleLoginButtonClick } from "./handlers";
import { LoginDispatch } from "./schemas";

// describe("loginReducer_setIsLoading", () => {
//     it("should allow valid boolean values", () => {
//         VALID_BOOLEANS.forEach((value) => {
//             const dispatch = {
//                 action: loginAction.setIsLoading,
//                 payload: value,
//             };
//             const state = loginReducer_setIsLoading(
//                 initialLoginState,
//                 dispatch,
//             );
//             expect(state.isLoading).toBe(value);
//         });
//     });

//     it("should not allow invalid boolean values", () => {
//         const initialIsLoading = initialLoginState.isLoading;
//         INVALID_BOOLEANS.forEach((value) => {
//             const dispatch = {
//                 action: loginAction.setIsLoading,
//                 payload: value,
//             };
//             const state = loginReducer_setIsLoading(
//                 initialLoginState,
//                 dispatch as any,
//             );
//             expect(state.isLoading).toBe(initialIsLoading);
//         });
//     });
// });

// describe("loginReducer_setIsSubmitting", () => {
//     it("should allow valid boolean values", () => {
//         VALID_BOOLEANS.forEach((value) => {
//             const dispatch = {
//                 action: loginAction.setIsSubmitting,
//                 payload: value,
//             };
//             const state = loginReducer_setIsSubmitting(
//                 initialLoginState,
//                 dispatch,
//             );
//             expect(state.isSubmitting).toBe(value);
//         });
//     });

//     it("should not allow invalid boolean values", () => {
//         const initialIsSubmitting = initialLoginState.isSubmitting;

//         INVALID_BOOLEANS.forEach((value) => {
//             const dispatch = {
//                 action: loginAction.setIsSubmitting,
//                 payload: value,
//             };
//             const state = loginReducer_setIsSubmitting(
//                 initialLoginState,
//                 dispatch as any,
//             );
//             expect(state.isSubmitting).toBe(initialIsSubmitting);
//         });
//     });
// });

// describe("loginReducer_setIsSuccessful", () => {
//     it("should allow valid boolean values", () => {
//         VALID_BOOLEANS.forEach((value) => {
//             const dispatch = {
//                 action: loginAction.setIsSuccessful,
//                 payload: value,
//             };
//             const state = loginReducer_setIsSuccessful(
//                 initialLoginState,
//                 dispatch,
//             );
//             expect(state.isSuccessful).toBe(value);
//         });
//     });

//     it("should not allow invalid boolean values", () => {
//         const initialIsSuccessful = initialLoginState.isSuccessful;

//         INVALID_BOOLEANS.forEach((value) => {
//             const dispatch = {
//                 action: loginAction.setIsSuccessful,
//                 payload: value,
//             };
//             const state = loginReducer_setIsSuccessful(
//                 initialLoginState,
//                 dispatch as any,
//             );
//             expect(state.isSuccessful).toBe(initialIsSuccessful);
//         });
//     });
// });

// describe("loginReducer_setPassword", () => {
//     it("should allow valid string values", () => {
//         const validValues = ["password123Q!", "mypasswordQ1!", "testingQ1!"];
//         validValues.forEach((value) => {
//             const dispatch = {
//                 action: loginAction.setPassword,
//                 payload: value,
//             };
//             const state = loginReducer_setPassword(
//                 initialLoginState,
//                 dispatch,
//             );
//             expect(state.password).toBe(value);
//         });
//     });

//     it("should not allow invalid string values", () => {
//         const initialPassword = initialLoginState.password;

//         INVALID_STRINGS.forEach((value) => {
//             const dispatch = {
//                 action: loginAction.setPassword,
//                 payload: value,
//             };
//             const state = loginReducer_setPassword(
//                 initialLoginState,
//                 dispatch as any,
//             );
//             expect(state.password).toBe(initialPassword);
//         });
//     });
// });

// describe("loginReducer_setUsername", () => {
//     it("should allow valid string values", () => {
//         const validValues = ["username123Q!", "myusernameQ1!", "testuserQ1!"];
//         validValues.forEach((value) => {
//             const dispatch = {
//                 action: loginAction.setUsername,
//                 payload: value,
//             };
//             const state = loginReducer_setUsername(
//                 initialLoginState,
//                 dispatch,
//             );
//             expect(state.username).toBe(value);
//         });
//     });

//     it("should not allow invalid string values", () => {
//         const initialUsername = initialLoginState.username;

//         INVALID_STRINGS.forEach((value) => {
//             const dispatch = {
//                 action: loginAction.setUsername,
//                 payload: value,
//             };
//             const state = loginReducer_setUsername(
//                 initialLoginState,
//                 dispatch as any,
//             );
//             expect(state.username).toBe(initialUsername);
//         });
//     });
// });

/**
 *
async function handleLoginButtonClick(
  {
    authDispatch,
    fetchAbortControllerRef,
    globalDispatch,
    isComponentMountedRef,
    loginDispatch,
    navigateFn,
    navigateTo,
    schema,
    showBoundary,
    url,
  }: {
    authDispatch: React.Dispatch<AuthDispatch>;
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    loginDispatch: React.Dispatch<LoginDispatch>;
    navigateFn: NavigateFunction;
    navigateTo: string;
    schema: { username: string; password: string };
    showBoundary: (error: unknown) => void;
    url: RequestInfo | URL;
  },
) {
  fetchAbortControllerRef.current?.abort("Previous request cancelled");
  fetchAbortControllerRef.current = new AbortController();
  const fetchAbortController = fetchAbortControllerRef.current;

  isComponentMountedRef.current = true;
  const isComponentMounted = isComponentMountedRef.current;

  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ schema }),
    signal: fetchAbortController.signal,
  };

  loginDispatch({
    action: loginAction.setIsSubmitting,
    payload: true,
  });

  try {
    const responseResult = await fetchSafe(url, requestInit);

    if (!isComponentMounted) {
      return;
    }

    if (responseResult.err) {
      showBoundary(responseResult.val.data);
      return;
    }

    const responseUnwrapped = responseResult.safeUnwrap().data;

    if (responseUnwrapped === undefined) {
      showBoundary(new Error("No data returned from server"));
      return;
    }

    const jsonResult = await responseToJSONSafe<
      HttpServerResponse<
        {
          userDocument: UserDocument;
          financialMetricsDocument: FinancialMetricsDocument;
        }
      >
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
      showBoundary(new Error("No data returned from server"));
      return;
    }

    console.time("parsing");
    const parsedResult = await parseServerResponseSafeAsync({
      object: serverResponse,
      zSchema: z.object({
        userDocument: userDocumentZ,
        financialMetricsDocument: financialMetricsDocumentZod,
      }),
    });
    console.timeEnd("parsing");

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
      return;
    }

    const decodedTokenResult = await decodeJWTSafe(accessToken);

    if (!isComponentMounted) {
      return;
    }

    if (decodedTokenResult.err) {
      showBoundary(decodedTokenResult.val.data);
      return;
    }

    const decodedToken = decodedTokenResult.safeUnwrap().data;
    if (decodedToken === undefined) {
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
    authDispatch({
      action: authAction.setIsLoggedIn,
      payload: true,
    });
    authDispatch({
      action: authAction.setUserDocument,
      payload: parsedServerResponse.data[0].userDocument,
    });

    globalDispatch({
      action: globalAction.setFinancialMetricsDocument,
      payload: parsedServerResponse.data[0].financialMetricsDocument,
    });

    const setForageItemResult = await setItemForageSafe<
      FinancialMetricsDocument
    >(
      "Financials-All Locations",
      parsedServerResponse.data[0].financialMetricsDocument,
    );

    if (!isComponentMounted) {
      return;
    }
    if (setForageItemResult.err) {
      showBoundary(setForageItemResult.val.data);
      return;
    }

    loginDispatch({
      action: loginAction.setIsSubmitting,
      payload: false,
    });
    loginDispatch({
      action: loginAction.setIsSuccessful,
      payload: true,
    });

    navigateFn(navigateTo);
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController?.signal.aborted
    ) {
      return;
    }
    showBoundary(error);
  }
}
 */

async function handleLoginButtonClickTestMock(
    schema: { username: string; password: string },
    testKind: "error" | "success" = "success",
) {
    const authDispatch = vi.fn() as React.Dispatch<AuthDispatch>;
    const fetchAbortControllerRef = {
        current: null,
    } as React.RefObject<AbortController | null>;
    const globalDispatch = vi.fn() as React.Dispatch<GlobalDispatch>;
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const loginDispatch = vi.fn() as React.Dispatch<LoginDispatch>;
    const navigate = vi.fn() as NavigateFunction;
    const toLocation = "/dashboard/financials";
    const showBoundary = vi.fn() as (error: unknown) => void;
    const url = LOGIN_URL;

    try {
        const handleLoginButtonClickResult = await handleLoginButtonClick({
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            loginDispatch,
            navigate,
            schema,
            showBoundary,
            toLocation,
            url,
        });

        if (handleLoginButtonClickResult.err) {
            return createSafeBoxResult({
                message: handleLoginButtonClickResult.val.message ??
                    "Error logging in",
            });
        }

        const loginResponseUnwrapped =
            handleLoginButtonClickResult.safeUnwrap().data;
        if (loginResponseUnwrapped === undefined) {
            return createSafeBoxResult({
                message: "No data returned from server",
            });
        }

        const { accessToken: newAccessToken, kind } = loginResponseUnwrapped;

        const logoutResult = await handleLogoutMock({
            newAccessToken,
        });

        if (logoutResult.err) {
            return createSafeBoxResult({
                message: logoutResult.val.message ?? "Logout failed",
            });
        }

        describe(
            `given 
            ${
                testKind === "success"
                    ? "valid"
                    : "invalid"
            } username: ${schema.username}
         and password: ${schema.password}
            `,
            () => {
                if (testKind === "success") {
                    it("should check successfully", () => {
                        expect(kind).toBe("success");
                    });
                } else {
                    it("should check unsuccessfully", () => {
                        expect(kind).toBe("error");
                    });
                }
            },
        );

        return createSafeBoxResult({
            data: loginResponseUnwrapped,
            kind: "success",
        });
    } catch (error) {
        return createSafeBoxResult({ message: "Login error" });
    }
}

const EXISTING_USERNAMES = DIRECTORY_EMPLOYEE_DATA.map(
    (employee) => employee.username,
);
await Promise.all(
    EXISTING_USERNAMES.map(
        async (username) => {
            const schema = {
                username,
                password: "passwordQ1!",
            };
            await handleLoginButtonClickTestMock(schema, "success");
        },
    ),
);

/**
 * async function handleRegisterButtonClickTestMock(
  schema: UserSchema,
): Promise<SafeBoxResult<UserDocument>> {
  const fetchAbortControllerRef = {
    current: null,
  } as React.RefObject<AbortController | null>;
  const isComponentMountedRef = {
    current: true,
  } as React.RefObject<boolean>;
  const registerDispatch = vi.fn() as React.Dispatch<any>;
  const navigateFn = vi.fn() as NavigateFunction;
  const showBoundary = vi.fn() as (error: unknown) => void;

  try {
    const handleRegisterButtonClickResult = await handleRegisterButtonClick(
      {
        fetchAbortControllerRef,
        isComponentMountedRef,
        navigateFn,
        navigateTo: "/register",
        registerDispatch,
        schema,
        showBoundary,
        url: REGISTER_URL,
      },
    );

    if (
      handleRegisterButtonClickResult.err
    ) {
      return createSafeBoxResult({
        message: handleRegisterButtonClickResult.val.message ??
          "Error registering",
      });
    }

    const userDocumentUnwrapped =
      handleRegisterButtonClickResult.safeUnwrap().data;
    if (userDocumentUnwrapped === undefined) {
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

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
    const [userDocument] = userDocumentUnwrapped;

    const url = new URL(`${API_URL}/user/${userDocument._id}`);
    const requestInit: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "DELETE",
      mode: "cors",
    };

    const deleteUserResult = await fetchSafe(url, requestInit);

    if (deleteUserResult.err) {
      return createSafeBoxResult({
        message: deleteUserResult.val.message ?? "Unable to delete user",
      });
    }

    const responseUnwrapped = deleteUserResult.safeUnwrap().data;
    if (responseUnwrapped === undefined) {
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const jsonResult = await responseToJSONSafe<
      HttpServerResponse<boolean>
    >(
      responseUnwrapped,
    );

    if (jsonResult.err) {
      return createSafeBoxResult({
        message: jsonResult.val.message ?? "Error parsing response",
      });
    }

    const serverResponse = jsonResult.safeUnwrap().data;
    if (serverResponse === undefined) {
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const { accessToken: newAccessToken } = serverResponse;

    const logoutResult = await handleLogoutMock({
      newAccessToken,
    });

    if (logoutResult.err) {
      return createSafeBoxResult({
        message: logoutResult.val.message ?? "Logout failed",
      });
    }

    describe("userDocument", () => {
      Object.entries(schema).forEach(([key, value]) => {
        if (key === "password") {
          return;
        }

        it(
          `should check successfully
                        given:
                        ${key}: ${value.toString()?.slice(0, 19)} ...
                        `,
          () => {
            expect(userDocument[key as keyof UserSchema]).toStrictEqual(
              value,
            );
          },
        );
      });
    });

    return createSafeBoxResult({
      data: userDocument,
      kind: "success",
    });
  } catch (error) {
    return createSafeBoxResult({ message: "Registration error" });
  }
}
 */
