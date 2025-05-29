import { Ok, Some } from "ts-results";
import {
    FETCH_REQUEST_TIMEOUT,
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
import { AllStoreLocations } from "../dashboard/types";
import { messageEventDirectoryFetchMainToWorkerZod } from "./schemas";
import { DepartmentsWithDefaultKey } from "./types";

type MessageEventDirectoryFetchWorkerToMain = MessageEvent<
    SafeResult<
        {
            decodedToken: DecodedToken;
            responsePayloadSafe: ResponsePayloadSafe<UserDocument>;
        }
    >
>;

type MessageEventDirectoryFetchMainToWorker = MessageEvent<
    {
        accessToken: string;
        decodedToken: DecodedToken;
        department: DepartmentsWithDefaultKey;
        requestInit: RequestInit;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        storeLocation: AllStoreLocations;
        url: string;
    }
>;

self.onmessage = async (
    event: MessageEventDirectoryFetchMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventDirectoryFetchMainToWorkerZod,
    });
    if (parsedMessageResult.err) {
        self.postMessage(parsedMessageResult);
        return;
    }
    if (parsedMessageResult.val.none) {
        self.postMessage(
            createSafeErrorResult("Error parsing input"),
        );
        return;
    }

    const {
        accessToken: accessTokenFromMessage,
        decodedToken,
        department,
        requestInit,
        routesZodSchemaMapKey,
        storeLocation,
        url,
    } = parsedMessageResult.val.val;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
        const userDocumentsResult = await getCachedItemAsyncSafe<
            UserDocument[]
        >(url);
        if (userDocumentsResult.err) {
            self.postMessage(userDocumentsResult);
            return;
        }
        if (userDocumentsResult.val.some) {
            const userDocuments = userDocumentsResult.val.val;
            const unparsedResponsePayload = createHttpResponseSuccess<
                UserDocument[]
            >({
                safeSuccessResult: new Ok(
                    Some(userDocuments),
                ),
                accessToken: accessTokenFromMessage,
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

            const setItemCacheResult = await setCachedItemAsyncSafe(
                url,
                data,
            );
            if (setItemCacheResult.err) {
                self.postMessage(setItemCacheResult);
                return;
            }

            self.postMessage(
                createSafeSuccessResult({
                    decodedToken: new Ok(Some(decodedToken)),
                    department,
                    responsePayloadSafe:
                        parsedResponsePayloadSafeResult.val.val,
                    storeLocation,
                }),
            );
            return;
        }

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
                createSafeErrorResult("Error fetching response"),
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
                createSafeErrorResult("Error extracting JSON from response"),
            );
            return;
        }

        const parsedResult = await parseResponsePayloadAsyncSafe<UserDocument>({
            object: jsonResult.val.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        if (parsedResult.err) {
            self.postMessage(parsedResult);
            return;
        }
        if (parsedResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Error parsing server response",
                ),
            );
            return;
        }

        const setItemCacheResult = await setCachedItemAsyncSafe(
            url,
            parsedResult.val.val.data,
        );
        if (setItemCacheResult.err) {
            self.postMessage(setItemCacheResult);
            return;
        }

        const { accessToken } = parsedResult.val.val;
        if (accessToken.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Access token not found in response",
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
                createSafeErrorResult("Error decoding JWT"),
            );
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                decodedToken: decodedTokenResult.val.val,
                department,
                responsePayloadSafe: parsedResult.val.val,
                storeLocation,
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
    console.error("Directory Fetch Worker error:", event);
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

export type {
    MessageEventDirectoryFetchMainToWorker,
    MessageEventDirectoryFetchWorkerToMain,
};
