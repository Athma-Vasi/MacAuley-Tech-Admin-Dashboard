import { None, Option } from "ts-results";
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
    handleErrorResultAndNoneOptionInWorker,
    parseResponsePayloadAsyncSafe,
    parseSyncSafe,
    setCachedItemAsyncSafe,
} from "../../utils";
import { SortDirection } from "../query/types";
import { messageEventUsersFetchMainToWorkerZod } from "./schemas";

type MessageEventUsersFetchWorkerToMain = MessageEvent<
    SafeResult<
        {
            decodedToken: Option<DecodedToken>;
            // accessToken is not cached, only kept in memory
            from: "fetch" | "cache";
            responsePayloadSafe: ResponsePayloadSafe<UserDocument>;
        }
    >
>;

type MessageEventUsersFetchMainToWorker = MessageEvent<
    {
        arrangeByDirection: SortDirection;
        arrangeByField: keyof UserDocument;
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
        requestInit,
        routesZodSchemaMapKey,
        url,
    } = parsedMessageResult.val.val;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

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
                sortAndModifyUserDocumentsSafe(
                    arrangeByDirection,
                    arrangeByField,
                    cachedResponsePayloadSafeResult.val.val,
                );
            const responsePayloadWithModifiedUserDocOption =
                handleErrorResultAndNoneOptionInWorker(
                    responsePayloadWithModifiedUserDocResult,
                    "No data found to sort",
                );
            if (responsePayloadWithModifiedUserDocOption.none) {
                return;
            }

            self.postMessage(
                createSafeSuccessResult({
                    decodedToken: None,
                    from: "cache",
                    responsePayloadSafe:
                        responsePayloadWithModifiedUserDocOption.val,
                }),
            );
            return;
        }

        // if there is no cached data, proceed with fetch
        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        const responseOption = handleErrorResultAndNoneOptionInWorker(
            responseResult,
            "No response received",
        );
        if (responseOption.none) {
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            ResponsePayloadSafe<UserDocument>
        >(responseOption.val);
        const jsonOption = handleErrorResultAndNoneOptionInWorker(
            jsonResult,
            "No JSON response received",
        );
        if (jsonOption.none) {
            return;
        }

        const responsePayloadSafeResult = await parseResponsePayloadAsyncSafe<
            UserDocument
        >({
            object: jsonOption.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        const responsePayloadSafeOption =
            handleErrorResultAndNoneOptionInWorker(
                responsePayloadSafeResult,
                "No parsed result received",
            );
        if (responsePayloadSafeOption.none) {
            return;
        }

        const { accessToken } = responsePayloadSafeOption.val;
        if (accessToken.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No access token found in response",
                ),
            );
            return;
        }

        const decodedTokenResult = decodeJWTSafe(accessToken.val);
        const decodedTokenOption = handleErrorResultAndNoneOptionInWorker(
            decodedTokenResult,
            "No decoded token received",
        );
        if (decodedTokenOption.none) {
            return;
        }

        const sortedAndModifiedUserDocsResult = sortAndModifyUserDocumentsSafe(
            arrangeByDirection,
            arrangeByField,
            responsePayloadSafeOption.val,
        );
        const sortedAndModifiedUserDocsOption =
            handleErrorResultAndNoneOptionInWorker(
                sortedAndModifiedUserDocsResult,
                "No data found to sort",
            );
        if (sortedAndModifiedUserDocsOption.none) {
            return;
        }

        const responseWithoutAccessToken = {
            ...sortedAndModifiedUserDocsOption.val,
            accessToken: None,
        };
        const setItemCacheResult = await setCachedItemAsyncSafe(
            url,
            responseWithoutAccessToken,
        );
        if (setItemCacheResult.err) {
            self.postMessage(setItemCacheResult);
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                decodedToken: decodedTokenOption,
                kind: "fetched",
                responsePayloadSafe: sortedAndModifiedUserDocsOption.val,
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

function sortAndModifyUserDocumentsSafe(
    arrangeByDirection: SortDirection,
    arrangeByField: keyof UserDocument,
    responsePayloadSafe: ResponsePayloadSafe<UserDocument>,
): SafeResult<ResponsePayloadSafe<UserDocument>> {
    try {
        const modifiedAndSorted = Object.entries(responsePayloadSafe).reduce<
            ResponsePayloadSafe<UserDocument>
        >(
            (acc, [key, value]) => {
                if (key === "data" && Array.isArray(value)) {
                    const sorted = value.sort((a, b) => {
                        const aValue = a[arrangeByField];
                        const bValue = b[arrangeByField];
                        if (aValue === undefined && bValue === undefined) {
                            return 0;
                        }
                        if (aValue === undefined) {
                            return 1;
                        }
                        if (bValue === undefined) {
                            return -1;
                        }
                        if (arrangeByDirection === "ascending") {
                            return aValue > bValue ? 1 : -1;
                        }

                        return aValue < bValue ? 1 : -1;
                    });
                    const withFUIAndPPUFieldsAdded = sorted.map(
                        (userDocument) => {
                            return {
                                ...userDocument,
                                fileUploadId: userDocument.fileUploadId
                                    ? userDocument.fileUploadId
                                    : "",
                                profilePictureUrl:
                                    userDocument.profilePictureUrl
                                        ? userDocument.profilePictureUrl
                                        : "",
                            };
                        },
                    );

                    Object.defineProperty(
                        acc,
                        key,
                        {
                            value: withFUIAndPPUFieldsAdded,
                            ...PROPERTY_DESCRIPTOR,
                        },
                    );
                }

                Object.defineProperty(
                    acc,
                    key,
                    {
                        value: value,
                        ...PROPERTY_DESCRIPTOR,
                    },
                );

                return acc;
            },
            Object.create(null),
        );

        return createSafeSuccessResult(modifiedAndSorted);
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}

export type {
    MessageEventUsersFetchMainToWorker,
    MessageEventUsersFetchWorkerToMain,
};
