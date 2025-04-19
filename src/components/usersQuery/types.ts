import { UserDocument } from "../../types";
import { UsersQueryAction } from "./actions";

type UsersQueryState = {
    currentPage: number;
    isError: boolean;
    isLoading: boolean;
    queryString: string;
    resourceData: Array<UserDocument>;
    totalDocuments: number;
};

type UsersQueryDispatch =
    | { action: UsersQueryAction["setCurrentPage"]; payload: number }
    | { action: UsersQueryAction["setIsError"]; payload: boolean }
    | { action: UsersQueryAction["setIsLoading"]; payload: boolean }
    | { action: UsersQueryAction["setQueryString"]; payload: string }
    | {
        action: UsersQueryAction["setResourceData"];
        payload: Array<UserDocument>;
    }
    | { action: UsersQueryAction["setTotalDocuments"]; payload: number };

export type { UsersQueryDispatch, UsersQueryState };
