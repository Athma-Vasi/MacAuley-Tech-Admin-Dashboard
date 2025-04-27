import { UserDocument } from "../../types";
import { SortDirection } from "../query/types";

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

export type { UsersQueryState };
