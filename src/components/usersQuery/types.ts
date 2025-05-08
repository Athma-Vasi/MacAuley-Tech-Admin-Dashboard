import {
    DecodedToken,
    HttpServerResponse,
    SafeBoxResult,
    UserDocument,
} from "../../types";
import { DashboardMetricsView } from "../dashboard/types";
import { SortDirection } from "../query/types";

type UsersQueryState = {
    arrangeByDirection: SortDirection;
    arrangeByField: keyof Omit<UserDocument, "password">;
    currentPage: number;
    usersFetchWorker: Worker | null;
    isError: boolean;
    isLoading: boolean;
    newQueryFlag: boolean;
    pages: number;
    queryString: string;
    resourceData: Array<Omit<UserDocument, "password">>;
    totalDocuments: number;
};

type UsersQueryMessageEvent = MessageEvent<
    SafeBoxResult<
        {
            decodedToken: DecodedToken;
            parsedServerResponse: HttpServerResponse<
                UserDocument
            >;
            metricsView?: Lowercase<DashboardMetricsView>;
        }
    >
>;

export type { UsersQueryMessageEvent, UsersQueryState };
