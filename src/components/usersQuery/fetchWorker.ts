import { Ok, Some } from "ts-results";
import { FETCH_REQUEST_TIMEOUT, PROPERTY_DESCRIPTOR } from "../../constants";
import {
    DecodedToken,
    ResponsePayloadSafe,
    SafeResult,
    UserDocument,
} from "../../types";
import {
    createHttpResponseSuccess,
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
import {
    ROUTES_ZOD_SCHEMAS_MAP,
    RoutesZodSchemasMapKey,
} from "../../workers/constants";
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
        accessToken: string;
        arrangeByDirection: SortDirection;
        arrangeByField: keyof UserDocument;
        currentPage: number;
        decodedToken: DecodedToken;
        newQueryFlag: boolean;
        queryString: string;
        requestInit: RequestInit;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        totalDocuments: number;
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
        accessToken: accessTokenFromMessage,
        arrangeByDirection,
        arrangeByField,
        currentPage,
        decodedToken,
        newQueryFlag,
        queryString,
        requestInit,
        routesZodSchemaMapKey,
        totalDocuments,
        url,
    } = parsedMessageResult.val.val;

    const controller = new AbortController();
    const timeout = setTimeout(
        () => controller.abort(),
        FETCH_REQUEST_TIMEOUT,
    );

    try {
        const userDocumentsResult = await getCachedItemAsyncSafe<
            UserDocument[]
        >(url);

        if (userDocumentsResult.err) {
            self.postMessage(userDocumentsResult);
            return;
        }

        if (userDocumentsResult.val.some) {
            const queryParams = new URLSearchParams(queryString);
            const limit = queryParams.get("limit");
            if (limit == null) {
                self.postMessage(
                    createSafeErrorResult("No limit found in query string"),
                );
                return;
            }

            const userDocuments = userDocumentsResult.val.val;
            const unparsedResponsePayload = createHttpResponseSuccess<
                UserDocument[]
            >({
                safeSuccessResult: new Ok(
                    Some(userDocuments),
                ),
                accessToken: accessTokenFromMessage,
                message: "Cached user documents retrieved successfully",
                pages: totalDocuments / parseInt(limit, 10),
                totalDocuments,
            });

            const parsedResponsePayloadSafeResult =
                await parseResponsePayloadAsyncSafe<UserDocument>({
                    object: unparsedResponsePayload,
                    zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
                });
            if (parsedResponsePayloadSafeResult.err) {
                self.postMessage(parsedResponsePayloadSafeResult);
                return;
            }
            if (parsedResponsePayloadSafeResult.val.none) {
                self.postMessage(
                    createSafeErrorResult("No parsed result received"),
                );
                return;
            }

            const {
                data,
            } = parsedResponsePayloadSafeResult.val.val;

            const withFUIAndPPUFieldsAdded = sortUserDocumentsAndAddFields(
                data,
                arrangeByDirection,
                arrangeByField,
            );

            const setItemCacheResult = await setCachedItemAsyncSafe(
                url,
                withFUIAndPPUFieldsAdded,
            );
            if (setItemCacheResult.err) {
                self.postMessage(setItemCacheResult);
                return;
            }

            Object.defineProperty(
                parsedResponsePayloadSafeResult.val.val,
                "data",
                {
                    value: withFUIAndPPUFieldsAdded,
                    ...PROPERTY_DESCRIPTOR,
                },
            );

            self.postMessage(
                createSafeSuccessResult({
                    currentPage,
                    decodedToken: new Ok(Some(decodedToken)),
                    newQueryFlag,
                    responsePayloadSafe:
                        parsedResponsePayloadSafeResult.val.val,
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

        const {
            data,
            accessToken,
        } = responsePayloadSafeResult.val.val;

        if (accessToken.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No access token found in response",
                ),
            );
            return;
        }

        const withFUIAndPPUFieldsAdded = sortUserDocumentsAndAddFields(
            data,
            arrangeByDirection,
            arrangeByField,
        );

        const setItemCacheResult = await setCachedItemAsyncSafe(
            url,
            withFUIAndPPUFieldsAdded,
        );
        if (setItemCacheResult.err) {
            self.postMessage(setItemCacheResult);
            return;
        }

        Object.defineProperty(
            responsePayloadSafeResult.val.val,
            "data",
            {
                value: withFUIAndPPUFieldsAdded,
                ...PROPERTY_DESCRIPTOR,
            },
        );

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

        self.postMessage(
            createSafeSuccessResult({
                currentPage,
                decodedToken: decodedTokenResult,
                newQueryFlag,
                responsePayloadSafe: responsePayloadSafeResult.val.val,
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
    userDocuments: UserDocument[],
    arrangeByDirection: SortDirection,
    arrangeByField: keyof UserDocument,
): UserDocument[] {
    const sorted = userDocuments.sort((a, b) => {
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

    return sorted.map(
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
}

export type {
    MessageEventUsersFetchMainToWorker,
    MessageEventUsersFetchWorkerToMain,
};
