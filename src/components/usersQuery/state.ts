import { UsersQueryState } from "./types";

const initialUsersQueryState: UsersQueryState = {
    arrangeByDirection: "ascending",
    arrangeByField: "username",
    currentPage: 1,
    usersFetchWorker: null,
    isError: false,
    isLoading: false,
    newQueryFlag: false,
    pages: 0,
    prefetchAndCacheWorker: null,
    queryString: "",
    resourceData: [],
    totalDocuments: 0,
};

export { initialUsersQueryState };
