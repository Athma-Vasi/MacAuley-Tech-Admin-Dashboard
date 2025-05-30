import { Ok, Some } from "ts-results";
import {
    FETCH_REQUEST_TIMEOUT,
    PROPERTY_DESCRIPTOR,
    ROUTES_ZOD_SCHEMAS_MAP,
    RoutesZodSchemasMapKey,
} from "../../constants";
import {
    DecodedToken,
    ResponsePayloadSafe,
    SafeResult,
    UserDocument,
} from "../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    decodeJWTSafe,
    extractJSONFromResponseSafe,
    fetchResponseSafe,
    getCachedItemAsyncSafe,
    parseResponsePayloadAsyncSafe,
    parseSyncSafe,
    setCachedItemAsyncSafe,
} from "../../utils";
import { SortDirection } from "../query/types";
import { messageEventUsersFetchMainToWorkerZod } from "./schemas";

type MessageEventUsersFetchWorkerToMain = MessageEvent<
    SafeResult<
        {
            decodedToken: DecodedToken;
            responsePayloadSafe: ResponsePayloadSafe<UserDocument>;
        }
    >
>;

type MessageEventUsersFetchMainToWorker = MessageEvent<
    {
        arrangeByDirection: SortDirection;
        arrangeByField: keyof UserDocument;
        currentPage: number;
        decodedToken: DecodedToken;
        newQueryFlag: boolean;
        queryString: string;
        requestInit: RequestInit;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        url: string;
    }
>;

self.onmessage = async (
    event: MessageEventUsersFetchMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventUsersFetchMainToWorkerZod,
    });
    if (parsedMessageResult.err) {
        self.postMessage(parsedMessageResult);
        return;
    }
    if (parsedMessageResult.val.none) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const {
        arrangeByDirection,
        arrangeByField,
        currentPage,
        decodedToken,
        newQueryFlag,
        queryString,
        requestInit,
        routesZodSchemaMapKey,
        url,
    } = parsedMessageResult.val.val;

    const controller = new AbortController();
    const timeout = setTimeout(
        () => controller.abort(),
        FETCH_REQUEST_TIMEOUT,
    );

    try {
        const cachedResponsePayloadSafeResult = await getCachedItemAsyncSafe<
            ResponsePayloadSafe<UserDocument>
        >(url);

        if (cachedResponsePayloadSafeResult.err) {
            self.postMessage(cachedResponsePayloadSafeResult);
            return;
        }

        if (cachedResponsePayloadSafeResult.val.some) {
            const responsePayloadWithModifiedUserDocResult =
                sortUserDocumentsAndAddFields(
                    cachedResponsePayloadSafeResult.val.val,
                    arrangeByDirection,
                    arrangeByField,
                );
            if (responsePayloadWithModifiedUserDocResult.err) {
                self.postMessage(
                    responsePayloadWithModifiedUserDocResult,
                );
                return;
            }
            if (responsePayloadWithModifiedUserDocResult.val.none) {
                self.postMessage(
                    createSafeErrorResult("No data found to sort"),
                );
                return;
            }

            self.postMessage(
                createSafeSuccessResult({
                    currentPage,
                    decodedToken: new Ok(Some(decodedToken)),
                    newQueryFlag,
                    responsePayloadSafe:
                        responsePayloadWithModifiedUserDocResult.val.val,
                    queryString,
                }),
            );
            return;
        }

        // if no cached data, proceed with fetch
        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err) {
            self.postMessage(responseResult);
            return;
        }
        if (responseResult.val.none) {
            self.postMessage(
                createSafeErrorResult("No response received"),
            );
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            ResponsePayloadSafe<UserDocument>
        >(responseResult.val.val);
        if (jsonResult.err) {
            self.postMessage(jsonResult);
            return;
        }
        if (jsonResult.val.none) {
            self.postMessage(
                createSafeErrorResult("No JSON response received"),
            );
            return;
        }

        const responsePayloadSafeResult = await parseResponsePayloadAsyncSafe<
            UserDocument
        >({
            object: jsonResult.val.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        if (responsePayloadSafeResult.err) {
            self.postMessage(responsePayloadSafeResult);
            return;
        }
        if (responsePayloadSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult("No parsed result received"),
            );
            return;
        }

        const { accessToken } = responsePayloadSafeResult.val.val;
        if (accessToken.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No access token found in response",
                ),
            );
            return;
        }

        const decodedTokenResult = decodeJWTSafe(accessToken.val);
        if (decodedTokenResult.err) {
            self.postMessage(decodedTokenResult);
            return;
        }
        if (decodedTokenResult.val.none) {
            self.postMessage(
                createSafeErrorResult("No decoded token received"),
            );
            return;
        }

        const setItemCacheResult = await setCachedItemAsyncSafe(
            url,
            responsePayloadSafeResult.val.val,
        );
        if (setItemCacheResult.err) {
            self.postMessage(setItemCacheResult);
            return;
        }

        const responsePayloadWithModifiedUserDocResult =
            sortUserDocumentsAndAddFields(
                responsePayloadSafeResult.val.val,
                arrangeByDirection,
                arrangeByField,
            );
        if (responsePayloadWithModifiedUserDocResult.err) {
            self.postMessage(
                responsePayloadWithModifiedUserDocResult,
            );
            return;
        }
        if (responsePayloadWithModifiedUserDocResult.val.none) {
            self.postMessage(
                createSafeErrorResult("No data found to sort"),
            );
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                currentPage,
                decodedToken: decodedTokenResult,
                newQueryFlag,
                responsePayloadSafe:
                    responsePayloadWithModifiedUserDocResult.val.val,
                queryString,
            }),
        );
    } catch (error: unknown) {
        self.postMessage(
            createSafeErrorResult(error),
        );
    } finally {
        clearTimeout(timeout);
    }
};

self.onerror = (event: string | Event) => {
    console.error("Users Query Worker error:", event);
    self.postMessage(
        createSafeErrorResult(event),
    );
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(
        createSafeErrorResult(event),
    );
});

function sortUserDocumentsAndAddFields(
    responsePayloadSafe: ResponsePayloadSafe<UserDocument>,
    arrangeByDirection: SortDirection,
    arrangeByField: keyof UserDocument,
): SafeResult<ResponsePayloadSafe<UserDocument>> {
    try {
        const cloned = structuredClone(responsePayloadSafe);
        const sorted = cloned.data.sort((a, b) => {
            const aValue = a[arrangeByField];
            const bValue = b[arrangeByField];

            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return 1;
            if (bValue === undefined) return -1;

            if (arrangeByDirection === "ascending") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        const withFUIAndPPUFieldsAdded = sorted.map(
            (userDocument) => {
                return {
                    ...userDocument,
                    fileUploadId: userDocument.fileUploadId
                        ? userDocument.fileUploadId
                        : "",
                    profilePictureUrl: userDocument.profilePictureUrl
                        ? userDocument.profilePictureUrl
                        : "",
                };
            },
        );

        Object.defineProperty(
            responsePayloadSafe,
            "data",
            {
                value: withFUIAndPPUFieldsAdded,
                ...PROPERTY_DESCRIPTOR,
            },
        );

        return createSafeSuccessResult(responsePayloadSafe);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

export type {
    MessageEventUsersFetchMainToWorker,
    MessageEventUsersFetchWorkerToMain,
};
