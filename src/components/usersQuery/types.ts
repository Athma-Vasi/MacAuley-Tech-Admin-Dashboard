import { UserDocument } from "../../types";
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
    prefetchAndCacheWorker: Worker | null;
    queryString: string;
    resourceData: Array<Omit<UserDocument, "password">>;
    totalDocuments: number;
};

export type { UsersQueryState };
