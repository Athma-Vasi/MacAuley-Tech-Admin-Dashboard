// describe("loginReducer", () => {
//     describe("setIsLoading", () => {
//         it("should allow valid boolean values", () => {
//             VALID_BOOLEANS.forEach((value) => {
//                 const dispatch = {
//                     action: loginAction.setIsLoading,
//                     payload: value,
//                 };
//                 const state = loginReducer_setIsLoading(
//                     initialLoginState,
//                     dispatch,
//                 );
//                 expect(state.isLoading).toBe(value);
//             });
//         });

//         it("should not allow invalid boolean values", () => {
//             const initialIsLoading = initialLoginState.isLoading;
//             INVALID_BOOLEANS.forEach((value) => {
//                 const dispatch = {
//                     action: loginAction.setIsLoading,
//                     payload: value,
//                 };
//                 const state = loginReducer_setIsLoading(
//                     initialLoginState,
//                     dispatch as any,
//                 );
//                 expect(state.isLoading).toBe(initialIsLoading);
//             });
//         });
//     });

//     describe("setIsSubmitting", () => {
//         it("should allow valid boolean values", () => {
//             VALID_BOOLEANS.forEach((value) => {
//                 const dispatch = {
//                     action: loginAction.setIsSubmitting,
//                     payload: value,
//                 };
//                 const state = loginReducer_setIsSubmitting(
//                     initialLoginState,
//                     dispatch,
//                 );
//                 expect(state.isSubmitting).toBe(value);
//             });
//         });

//         it("should not allow invalid boolean values", () => {
//             const initialIsSubmitting = initialLoginState.isSubmitting;

//             INVALID_BOOLEANS.forEach((value) => {
//                 const dispatch = {
//                     action: loginAction.setIsSubmitting,
//                     payload: value,
//                 };
//                 const state = loginReducer_setIsSubmitting(
//                     initialLoginState,
//                     dispatch as any,
//                 );
//                 expect(state.isSubmitting).toBe(initialIsSubmitting);
//             });
//         });
//     });

//     describe("setIsSuccessful", () => {
//         it("should allow valid boolean values", () => {
//             VALID_BOOLEANS.forEach((value) => {
//                 const dispatch = {
//                     action: loginAction.setIsSuccessful,
//                     payload: value,
//                 };
//                 const state = loginReducer_setIsSuccessful(
//                     initialLoginState,
//                     dispatch,
//                 );
//                 expect(state.isSuccessful).toBe(value);
//             });
//         });

//         it("should not allow invalid boolean values", () => {
//             const initialIsSuccessful = initialLoginState.isSuccessful;

//             INVALID_BOOLEANS.forEach((value) => {
//                 const dispatch = {
//                     action: loginAction.setIsSuccessful,
//                     payload: value,
//                 };
//                 const state = loginReducer_setIsSuccessful(
//                     initialLoginState,
//                     dispatch as any,
//                 );
//                 expect(state.isSuccessful).toBe(initialIsSuccessful);
//             });
//         });
//     });

//     describe("setPassword", () => {
//         it("should allow valid string values", () => {
//             const validValues = [
//                 "password123Q!",
//                 "mypasswordQ1!",
//                 "testingQ1!",
//             ];
//             validValues.forEach((value) => {
//                 const dispatch = {
//                     action: loginAction.setPassword,
//                     payload: value,
//                 };
//                 const state = loginReducer_setPassword(
//                     initialLoginState,
//                     dispatch,
//                 );
//                 expect(state.password).toBe(value);
//             });
//         });

//         it("should not allow invalid string values", () => {
//             const initialPassword = initialLoginState.password;

//             INVALID_STRINGS.forEach((value) => {
//                 const dispatch = {
//                     action: loginAction.setPassword,
//                     payload: value,
//                 };
//                 const state = loginReducer_setPassword(
//                     initialLoginState,
//                     dispatch as any,
//                 );
//                 expect(state.password).toBe(initialPassword);
//             });
//         });
//     });

//     describe("setUsername", () => {
//         it("should allow valid string values", () => {
//             const validValues = [
//                 "username123Q!",
//                 "myusernameQ1!",
//                 "testuserQ1!",
//             ];
//             validValues.forEach((value) => {
//                 const dispatch = {
//                     action: loginAction.setUsername,
//                     payload: value,
//                 };
//                 const state = loginReducer_setUsername(
//                     initialLoginState,
//                     dispatch,
//                 );
//                 expect(state.username).toBe(value);
//             });
//         });

//         it("should not allow invalid string values", () => {
//             const initialUsername = initialLoginState.username;

//             INVALID_STRINGS.forEach((value) => {
//                 const dispatch = {
//                     action: loginAction.setUsername,
//                     payload: value,
//                 };
//                 const state = loginReducer_setUsername(
//                     initialLoginState,
//                     dispatch as any,
//                 );
//                 expect(state.username).toBe(initialUsername);
//             });
//         });
//     });
// });

// describe("Login", () => {
//     const password = "passwordQ1!";
//     const username = "0manager";

//     const loginState: LoginState = {
//         isLoading: false,
//         isSubmitting: false,
//         isSuccessful: false,
//         loginFetchWorker: null,
//         password,
//         username,
//     };
//     const loginDispatch = vi.fn() as React.Dispatch<LoginDispatch>;
//     const authDispatch = vi.fn() as React.Dispatch<AuthDispatch>;
//     const isComponentMountedRef = {
//         current: true,
//     } as React.RefObject<boolean>;
//     const globalDispatch = vi.fn() as React.Dispatch<GlobalDispatch>;
//     const navigate = vi.fn() as NavigateFunction;
//     const showBoundary = vi.fn() as (error: unknown) => void;
//     const localforage = {
//         clear: vi.fn(),
//     } as any;

//     let loginFetchWorker = new FetchParseWorker();

//     loginFetchWorker.onmessage = async function loginFetchWorkerCB(
//         event: LoginMessageEvent,
//     ) {
//         const loginDispatch = vi.fn() as React.Dispatch<LoginDispatch>;
//         const authDispatch = vi.fn() as React.Dispatch<AuthDispatch>;
//         const isComponentMountedRef = {
//             current: true,
//         } as React.RefObject<boolean>;
//         const globalDispatch = vi.fn() as React.Dispatch<
//             GlobalDispatch
//         >;
//         const navigate = vi.fn() as NavigateFunction;
//         const showBoundary = vi.fn() as (error: unknown) => void;
//         const localforage = {
//             clear: vi.fn(),
//         } as any;

//         const loginOnmessageCallbackResult = await loginOnmessageCallback({
//             event,
//             authDispatch,
//             globalDispatch,
//             isComponentMountedRef,
//             localforage,
//             loginDispatch,
//             navigate,
//             showBoundary,
//         });

//         console.log(
//             "loginOnmessageCallbackResult",
//             loginOnmessageCallbackResult,
//         );

//         if (loginOnmessageCallbackResult.err) {
//             return createSafeBoxResult({
//                 message: loginOnmessageCallbackResult.val.message ??
//                     "Error logging in",
//             });
//         }

//         const parsedServerResponse =
//             loginOnmessageCallbackResult.safeUnwrap().data;

//         if (parsedServerResponse === undefined) {
//             return createSafeBoxResult({
//                 message: "No data returned from server",
//             });
//         }

//         if (
//             parsedServerResponse.kind === "success"
//         ) {
//             const { accessToken: newAccessToken } = parsedServerResponse;

//             const logoutResult = await handleLogoutMock({
//                 newAccessToken,
//             });

//             if (logoutResult.err) {
//                 return createSafeBoxResult({
//                     message: logoutResult.val.message ??
//                         "Logout failed",
//                 });
//             }
//         }

//         describe(
//             `handleLoginButtonClickTestMock - login
//                given username: ${username}
//                and password: ${password}
//                     `,
//             () => {
//                 it("should login successfully", () => {
//                     expect(parsedServerResponse.data.length)
//                         .toBeGreaterThanOrEqual(1);
//                 });
//             },
//         );
//     };

//     it("should handle login button click", async () => {
//         async function handleLoginClickTestMock(
//             { password, testKind, username }: {
//                 password: string;
//                 testKind: "error" | "success";
//                 username: string;
//             },
//         ) {
//             // const sampleServerResponse: HttpServerResponse = {
//             //     data: [{
//             //         userDocument: {},
//             //         financialMetricsDocument: {},
//             //     }],
//             //     accessToken: "",
//             //     kind: "success",
//             //     message: "",
//             //     status: 200,
//             //     pages: 0,
//             //     totalDocuments: 0,
//             //     triggerLogout: false,
//             // };
//             // const decodedToken = {} as any;
//             // const workerResponseSuccess = createSafeBoxResult({
//             //     data: sampleServerResponse,
//             //     kind: "success",
//             // });

//             // const mainWorkerPostMessage = {
//             //     postMessage: vi.fn(),
//             // };
//             // const lmEvent = {
//             //     data: createSafeBoxResult({
//             //         data: { parsedServerResponse: workerResponseSuccess, decodedToken },
//             //         kind: "success",
//             //     }),
//             // } as any;

//             try {
//                 const handleLoginClickResult = await handleLoginClick({
//                     loginState,
//                     loginDispatch,
//                     loginFetchWorker,
//                     schema: { username, password },
//                 });

//                 console.log(
//                     "handleLoginClickResult",
//                     handleLoginClickResult,
//                 );

//                 if (handleLoginClickResult.err) {
//                     return createSafeBoxResult({
//                         message: handleLoginClickResult.val.message ??
//                             "Error logging in",
//                     });
//                 }

//                 return createSafeBoxResult({
//                     data: true,
//                     kind: "success",
//                 });
//             } catch (error) {
//                 return createSafeBoxResult({ message: "Login error" });
//             }
//         }

//         const TEST_SIZE = 1;

//         const EXISTING_USERNAMES = shuffle(DIRECTORY_EMPLOYEE_DATA).map(
//             (employee) => employee.username,
//         );
//         const slicedValids = EXISTING_USERNAMES.slice(0, TEST_SIZE);
//         await Promise.all(
//             slicedValids.map(
//                 async (username) => {
//                     await handleLoginClickTestMock({
//                         password: "passwordQ1!",
//                         testKind: "success",
//                         username,
//                     });
//                 },
//             ),
//         );
//     });
// });

// async function handleLoginButtonClickTestMock(
//     schema: { username: string; password: string },
//     testKind: "error" | "success" = "success",
// ) {
//     const authDispatch = vi.fn() as React.Dispatch<AuthDispatch>;
//     const fetchAbortControllerRef = {
//         current: null,
//     } as React.RefObject<AbortController | null>;
//     const globalDispatch = vi.fn() as React.Dispatch<GlobalDispatch>;
//     const isComponentMountedRef = {
//         current: true,
//     } as React.RefObject<boolean>;
//     const loginDispatch = vi.fn() as React.Dispatch<LoginDispatch>;
//     const navigate = vi.fn() as NavigateFunction;
//     const toLocation = "/dashboard/financials";
//     const showBoundary = vi.fn() as (error: unknown) => void;
//     const url = LOGIN_URL;

//     try {
//         const handleLoginButtonClickResult = await handleLoginButtonClick({
//             authDispatch,
//             fetchAbortControllerRef,
//             globalDispatch,
//             isComponentMountedRef,
//             loginDispatch,
//             navigate,
//             schema,
//             showBoundary,
//             toLocation,
//             url,
//         });

//         if (handleLoginButtonClickResult.err) {
//             return createSafeBoxResult({
//                 message: handleLoginButtonClickResult.val.message ??
//                     "Error logging in",
//             });
//         }

//         const parsedServerResponse =
//             handleLoginButtonClickResult.safeUnwrap().data;
//         if (parsedServerResponse === undefined) {
//             return createSafeBoxResult({
//                 message: "No data returned from server",
//             });
//         }

//         if (testKind === "success" && parsedServerResponse.kind === "success") {
//             const { accessToken: newAccessToken } = parsedServerResponse;

//             const logoutResult = await handleLogoutMock({
//                 newAccessToken,
//             });

//             if (logoutResult.err) {
//                 return createSafeBoxResult({
//                     message: logoutResult.val.message ?? "Logout failed",
//                 });
//             }
//         }

//         describe(
//             `handleLoginButtonClickTestMock - ${testKind} - login
//             given
//             ${
//                 testKind === "success"
//                     ? "valid"
//                     : "invalid"
//             } username: ${schema.username}
//          and password: ${schema.password}
//             `,
//             () => {
//                 if (testKind === "success") {
//                     it("should login successfully", () => {
//                         expect(parsedServerResponse.data.length)
//                             .toBeGreaterThanOrEqual(1);
//                     });
//                 } else {
//                     it("should login unsuccessfully", () => {
//                         expect(parsedServerResponse.data)
//                             .toBe(void 0);
//                     });
//                 }
//             },
//         );

//         return createSafeBoxResult({
//             data: true,
//             kind: "success",
//         });
//     } catch (error) {
//         return createSafeBoxResult({ message: "Login error" });
//     }
// }

// const TEST_SIZE = 1;

// const EXISTING_USERNAMES = shuffle(DIRECTORY_EMPLOYEE_DATA).map(
//     (employee) => employee.username,
// );
// const slicedValids = EXISTING_USERNAMES.slice(0, TEST_SIZE);
// await Promise.all(
//     slicedValids.map(
//         async (username) => {
//             await handleLoginClickTestMock({
//                 password: "passwordQ1!",
//                 testKind: "success",
//                 username,
//             });
//         },
//     ),
// );

// const NON_EXISTING_USERNAMES = Array.from({ length: TEST_SIZE }, (_, idx) => {
//     return `${idx}${SAMPLE_USER_DOCUMENT.username}`;
// });
// const slicedInvalids = NON_EXISTING_USERNAMES.slice(0, TEST_SIZE);
// await Promise.all(
//     slicedInvalids.map(
//         async (username) => {
//             await handleLoginClickTestMockHOC({
//                 password: "passwordQ1!",
//                 testKind: "error",
//                 username,
//             });
//         },
//     ),
// );
