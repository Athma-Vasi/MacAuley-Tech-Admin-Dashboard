import { z } from "zod";
import { DashboardMetricsView } from "../components/dashboard/types";
import { FETCH_REQUEST_TIMEOUT } from "../constants";
import { HttpServerResponse } from "../types";
import {
    createSafeBoxResult,
    decodeJWTSafe,
    fetchSafe,
    parseServerResponseAsyncSafe,
    responseToJSONSafe,
} from "../utils";
import { ROUTES_ZOD_SCHEMAS_MAP, RoutesZodSchemasMapKey } from "./constants";

self.onmessage = async (
    event: MessageEvent<
        {
            metricsView?: Lowercase<DashboardMetricsView>;
            requestInit: RequestInit;
            routesZodSchemaMapKey: RoutesZodSchemasMapKey;
            url: string;
        }
    >,
) => {
    console.log(
        "Worker received message in self:",
        JSON.stringify(event.data, null, 2),
    );
    const { requestInit, url, routesZodSchemaMapKey, metricsView } = event.data;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
        const responseResult = await fetchSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err) {
            self.postMessage(createSafeBoxResult({
                message: responseResult.val.message ??
                    "Error fetching response",
            }));
            return;
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;
        if (responseUnwrapped === undefined) {
            self.postMessage(createSafeBoxResult({
                message: "Response is undefined",
            }));
            return;
        }

        const zSchema = ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey];

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<
                z.infer<typeof zSchema>
            >
        >(responseUnwrapped);

        if (jsonResult.err) {
            self.postMessage(createSafeBoxResult({
                message: jsonResult.val.message ??
                    "Error parsing JSON",
            }));
            return;
        }

        const serverResponse = jsonResult.safeUnwrap().data;
        if (serverResponse === undefined) {
            self.postMessage(createSafeBoxResult({
                message: "No data returned from server",
            }));
            return;
        }

        if (serverResponse.message === "User not found") {
            self.postMessage(createSafeBoxResult({
                kind: "notFound",
                message: "User not found",
                data: serverResponse,
            }));

            return;
        }

        const parsedResult = await parseServerResponseAsyncSafe({
            object: serverResponse,
            zSchema,
        });

        if (parsedResult.err) {
            self.postMessage(createSafeBoxResult({
                message: parsedResult.val.message ??
                    "Error parsing server response",
            }));
            return;
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            self.postMessage(createSafeBoxResult({
                message: "No data returned from server",
            }));
            return;
        }

        const { accessToken } = parsedServerResponse;

        const decodedTokenResult = await decodeJWTSafe(accessToken);
        if (decodedTokenResult.err) {
            self.postMessage(createSafeBoxResult({
                message: decodedTokenResult.val.message ??
                    "Error decoding JWT",
            }));
            return;
        }

        const decodedToken = decodedTokenResult.safeUnwrap().data;
        if (decodedToken === undefined) {
            self.postMessage(createSafeBoxResult({
                message: "No data returned from JWT",
            }));
            return;
        }

        self.postMessage(createSafeBoxResult({
            data: { parsedServerResponse, decodedToken, metricsView },
            kind: "success",
        }));
    } catch (err) {
        self.postMessage(createSafeBoxResult({
            data: err,
            kind: "error",
        }));
    } finally {
        clearTimeout(timeout);
    }
};
