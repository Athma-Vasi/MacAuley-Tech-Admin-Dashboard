import { Prettify } from "../../types";
import { UsersQueryState } from "./types";

type UsersQueryAction = Prettify<
    & {
        [K in keyof UsersQueryState as `set${Capitalize<string & K>}`]:
            `set${Capitalize<string & K>}`;
    }
    & {
        resetToInitial: "resetToInitial";
    }
>;

const usersQueryAction: UsersQueryAction = {
    resetToInitial: "resetToInitial",
    setArrangeByDirection: "setArrangeByDirection",
    setArrangeByField: "setArrangeByField",
    setCurrentPage: "setCurrentPage",
    setUsersFetchWorker: "setUsersFetchWorker",
    setIsError: "setIsError",
    setIsLoading: "setIsLoading",
    setNewQueryFlag: "setNewQueryFlag",
    setPages: "setPages",
    setPrefetchAndCacheWorker: "setPrefetchAndCacheWorker",
    setQueryString: "setQueryString",
    setResourceData: "setResourceData",
    setTotalDocuments: "setTotalDocuments",
};

export { usersQueryAction };
export type { UsersQueryAction };
