import { UsersQueryState } from "./types";

const initialUsersQueryState: UsersQueryState = {
    currentPage: 1,
    isError: false,
    isLoading: false,
    queryString: "",
    resourceData: [],
    totalDocuments: 0,
};

export { initialUsersQueryState };
