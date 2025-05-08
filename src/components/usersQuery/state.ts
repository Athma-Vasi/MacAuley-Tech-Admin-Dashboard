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
    queryString: "",
    resourceData: [],
    totalDocuments: 0,
};

export { initialUsersQueryState };
