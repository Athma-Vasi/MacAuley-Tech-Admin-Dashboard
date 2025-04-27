import { Err, Ok } from "ts-results";
import { LOGIN_URL, LOGOUT_URL, METRICS_URL } from "../../constants";
import {
    BusinessMetricsDocument,
    FinancialMetricsDocument,
    HttpServerResponse,
    SafeBoxResult,
    UserDocument,
} from "../../types";
import {
    fetchSafe,
    parseServerResponseSafeAsync,
    responseToJSONSafe,
} from "../../utils";
import { customerMetricsDocumentZ } from "../dashboard/customer/zodSchema";
import { financialMetricsDocumentZ } from "../dashboard/financial/zodSchema";
import { productMetricsDocumentZ } from "../dashboard/product/schemas";
import { ProductMetricCategory } from "../dashboard/product/types";
import { repairMetricsDocumentZ } from "../dashboard/repair/schemas";
import { RepairMetricCategory } from "../dashboard/repair/types";
import { AllStoreLocations, DashboardMetricsView } from "../dashboard/types";

async function handleLoginMock(): Promise<
    SafeBoxResult<
        Array<{
            accessToken: string;
            userDocument: UserDocument;
            financialMetricsDocument: FinancialMetricsDocument;
        }>
    >
> {
    const schema = {
        username: "manager",
        password: "passwordQ1!",
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
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
            return new Err({
                data: [],
                kind: "error",
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
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const serverResponse = jsonResult.safeUnwrap().data;

        if (serverResponse === undefined) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const { accessToken, triggerLogout } = serverResponse;

        if (triggerLogout) {
            return new Err({
                data: [],
                kind: "error",
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
        return new Err({
            data: [],
            kind: "error",
        });
    }
}

async function handleLogoutMock(
    { accessToken }: { accessToken: string },
): Promise<
    SafeBoxResult<[]>
> {
    const requestInit: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
    };

    try {
        const responseResult = await fetchSafe(
            new URL(LOGOUT_URL),
            requestInit,
        );

        if (responseResult.err) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse
        >(
            responseUnwrapped,
        );

        if (jsonResult.err) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const serverResponse = jsonResult.safeUnwrap().data;

        if (serverResponse === undefined) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        return new Ok({
            data: [],
            kind: "success",
        });
    } catch (error: unknown) {
        return new Err({
            data: [],
            kind: "error",
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
        const loginResult = await handleLoginMock();
        if (loginResult.err) {
            return new Err({
                data: [],
                kind: "error",
            });
        }
        const loginUnwrapped = loginResult.safeUnwrap().data;
        if (loginUnwrapped === undefined) {
            return new Err({
                data: [],
                kind: "error",
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
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<BusinessMetricsDocument>
        >(
            responseUnwrapped,
        );

        if (jsonResult.err) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const serverResponse = jsonResult.safeUnwrap().data;

        if (serverResponse === undefined) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const parsedResult = await parseServerResponseSafeAsync({
            object: serverResponse,
            zSchema: metricsView === "customers"
                ? customerMetricsDocumentZ
                : metricsView === "financials"
                ? financialMetricsDocumentZ
                : metricsView === "products"
                ? productMetricsDocumentZ
                : repairMetricsDocumentZ,
        });

        if (parsedResult.err) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        const { accessToken: newAccessToken, triggerLogout } =
            parsedServerResponse;

        const logoutResult = await handleLogoutMock({
            accessToken: newAccessToken,
        });

        if (logoutResult.err || triggerLogout) {
            return new Err({
                data: [],
                kind: "error",
            });
        }

        return new Ok({
            data: serverResponse.data,
            kind: "success",
        });
    } catch (error) {
        return new Err({
            data: [],
            kind: "error",
        });
    }
}

export { handleLoginMock, handleLogoutMock, handleMetricsMock };
