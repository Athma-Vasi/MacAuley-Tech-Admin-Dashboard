import { Ok } from "ts-results";
import { z } from "zod";
import { LOGIN_URL, LOGOUT_URL, METRICS_URL } from "../../constants";
import {
    BusinessMetricsDocument,
    FinancialMetricsDocument,
    HttpServerResponse,
    SafeBoxResult,
    UserDocument,
} from "../../types";
import {
    createSafeBoxResult,
    fetchSafe,
    parseServerResponseSafeAsync,
    responseToJSONSafe,
} from "../../utils";
import { customerMetricsDocumentZod } from "../dashboard/customer/schemas";
import { financialMetricsDocumentZod } from "../dashboard/financial/schemas";
import { productMetricsDocumentZod } from "../dashboard/product/schemas";
import { ProductMetricCategory } from "../dashboard/product/types";
import { repairMetricsDocumentZod } from "../dashboard/repair/schemas";
import { RepairMetricCategory } from "../dashboard/repair/types";
import { AllStoreLocations, DashboardMetricsView } from "../dashboard/types";
import { userDocumentZ } from "../usersQuery/schemas";

async function handleLoginMock(
    { username = "manager", password = "passwordQ1!" }: {
        username?: string;
        password?: string;
    },
): Promise<
    SafeBoxResult<
        Array<{
            accessToken: string;
            userDocument: UserDocument;
            financialMetricsDocument: FinancialMetricsDocument;
        }>
    >
> {
    const schema = {
        username,
        password,
    };

    const requestInit: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ schema }),
    };

    try {
        const responseResult = await fetchSafe(
            new URL(LOGIN_URL),
            requestInit,
        );

        if (responseResult.err) {
            return createSafeBoxResult({
                message: responseResult.val.message ?? "Error fetching data",
            });
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;
        if (responseUnwrapped === undefined) {
            return createSafeBoxResult({
                message: "Response is undefined",
            });
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

        if (jsonResult.err) {
            return createSafeBoxResult({
                message: jsonResult.val.message ?? "Error parsing response",
            });
        }

        const serverResponse = jsonResult.safeUnwrap().data;
        if (serverResponse === undefined) {
            return createSafeBoxResult({
                message: "Server response is undefined",
            });
        }

        const parsedResult = await parseServerResponseSafeAsync({
            object: serverResponse,
            zSchema: z.object({
                userDocument: userDocumentZ,
                financialMetricsDocument: financialMetricsDocumentZod,
            }),
        });

        if (parsedResult.err) {
            return createSafeBoxResult({
                message: parsedResult.val.message ?? "Error parsing response",
            });
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            return createSafeBoxResult({
                message: "Parsed server response is undefined",
            });
        }

        const { accessToken, triggerLogout, kind } = parsedServerResponse;

        if (triggerLogout || kind === "error") {
            return createSafeBoxResult({
                message: "Trigger logout or error",
            });
        }

        return new Ok({
            data: [{
                accessToken,
                userDocument: serverResponse.data[0].userDocument,
                financialMetricsDocument:
                    serverResponse.data[0].financialMetricsDocument,
            }],
            kind: "success",
        });
    } catch (error) {
        return createSafeBoxResult({
            message: "Unknown error",
        });
    }
}

async function handleLogoutMock(
    { newAccessToken }: { newAccessToken: string },
): Promise<
    SafeBoxResult<[]>
> {
    const requestInit: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newAccessToken}`,
        },
        mode: "cors",
    };

    try {
        const responseResult = await fetchSafe(
            new URL(LOGOUT_URL),
            requestInit,
        );

        if (responseResult.err) {
            return createSafeBoxResult({
                message: responseResult.val.message ?? "Error fetching data",
            });
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
            return createSafeBoxResult({
                message: "Response is undefined",
            });
        }

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse
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
                message: "Server response is undefined",
            });
        }

        const parsedResult = await parseServerResponseSafeAsync({
            object: serverResponse,
            zSchema: z.object({}),
        });

        if (parsedResult.err) {
            return createSafeBoxResult({
                message: parsedResult.val.message ?? "Error parsing response",
            });
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            return createSafeBoxResult({
                message: "Parsed server response is undefined",
            });
        }

        return createSafeBoxResult({
            data: [],
            kind: "success",
        });
    } catch (error: unknown) {
        return createSafeBoxResult({
            message: "Unknown error",
        });
    }
}

async function handleMetricsMock(
    { metricsView, productMetricCategory, repairMetricCategory, storeLocation }:
        {
            metricsView: Lowercase<DashboardMetricsView>;
            storeLocation: AllStoreLocations;
            productMetricCategory: ProductMetricCategory;
            repairMetricCategory: RepairMetricCategory;
        },
): Promise<
    SafeBoxResult<
        Array<
            BusinessMetricsDocument
        >
    >
> {
    try {
        const loginResult = await handleLoginMock({});
        if (loginResult.err) {
            return createSafeBoxResult({
                message: loginResult.val.message ?? "Login failed",
            });
        }

        const loginUnwrapped = loginResult.safeUnwrap().data;
        if (loginUnwrapped === undefined) {
            return createSafeBoxResult({
                message: "Login unwrapped is undefined",
            });
        }

        const { accessToken } = loginUnwrapped[0];
        const requestInit: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const storeLocationQuery = `&storeLocation[$eq]=${storeLocation}`;

        const metricCategoryQuery = metricsView === "products"
            ? `&metricCategory[$eq]=${productMetricCategory}`
            : metricsView === "repairs"
            ? `&metricCategory[$eq]=${repairMetricCategory}`
            : "";

        const urlWithQuery = new URL(
            `${METRICS_URL}/${metricsView}/?${storeLocationQuery}${metricCategoryQuery}`,
        );

        const responseResult = await fetchSafe(urlWithQuery, requestInit);

        if (responseResult.err) {
            return createSafeBoxResult({
                message: responseResult.val.message ?? "Error fetching data",
            });
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;
        if (responseUnwrapped === undefined) {
            return createSafeBoxResult({
                message: "Response is undefined",
            });
        }

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<BusinessMetricsDocument>
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
                message: "Server response is undefined",
            });
        }

        const parsedResult = await parseServerResponseSafeAsync({
            object: serverResponse,
            zSchema: metricsView === "customers"
                ? customerMetricsDocumentZod
                : metricsView === "financials"
                ? financialMetricsDocumentZod
                : metricsView === "products"
                ? productMetricsDocumentZod
                : repairMetricsDocumentZod,
        });

        if (parsedResult.err) {
            return createSafeBoxResult({
                message: parsedResult.val.message ?? "Error parsing response",
            });
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            return createSafeBoxResult({
                message: "Parsed server response is undefined",
            });
        }

        const { accessToken: newAccessToken, triggerLogout } =
            parsedServerResponse;

        const logoutResult = await handleLogoutMock({
            newAccessToken,
        });

        if (logoutResult.err || triggerLogout) {
            return createSafeBoxResult({
                message: logoutResult.val.message ?? "Error logging out",
            });
        }

        return new Ok({
            data: serverResponse.data,
            kind: "success",
        });
    } catch (error) {
        return createSafeBoxResult({
            message: "Error handling metrics",
        });
    }
}

export { handleLoginMock, handleLogoutMock, handleMetricsMock };
