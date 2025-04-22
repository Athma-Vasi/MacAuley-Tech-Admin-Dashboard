import { UserDocument } from "../../types";
import { SortDirection } from "../query/types";
import { UsersQueryAction } from "./actions";

type UsersQueryState = {
    arrangeByDirection: SortDirection;
    arrangeByField: keyof UserDocument;
    currentPage: number;
    isError: boolean;
    isLoading: boolean;
    newQueryFlag: boolean;
    pages: number;
    queryString: string;
    resourceData: Array<UserDocument>;
    totalDocuments: number;
};

type UsersQueryDispatch =
    | {
        action: UsersQueryAction["resetToInitial"];
        payload: UsersQueryState;
    }
    | {
        action: UsersQueryAction["setArrangeByDirection"];
        payload: SortDirection;
    }
    | {
        action: UsersQueryAction["setArrangeByField"];
        payload: keyof UserDocument;
    }
    | { action: UsersQueryAction["setCurrentPage"]; payload: number }
    | { action: UsersQueryAction["setIsError"]; payload: boolean }
    | { action: UsersQueryAction["setIsLoading"]; payload: boolean }
    | { action: UsersQueryAction["setNewQueryFlag"]; payload: boolean }
    | { action: UsersQueryAction["setPages"]; payload: number }
    | { action: UsersQueryAction["setQueryString"]; payload: string }
    | {
        action: UsersQueryAction["setResourceData"];
        payload: Array<UserDocument>;
    }
    | { action: UsersQueryAction["setTotalDocuments"]; payload: number };

export type { UsersQueryDispatch, UsersQueryState };
