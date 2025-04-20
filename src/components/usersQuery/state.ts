import { UsersQueryState } from "./types";

const initialUsersQueryState: UsersQueryState = {
    currentPage: 1,
    isError: false,
    isLoading: false,
    newQueryFlag: false,
    pages: 0,
    queryString: "",
    resourceData: [],
    totalDocuments: 0,
};

export { initialUsersQueryState };
