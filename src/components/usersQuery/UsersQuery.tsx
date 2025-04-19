import { Stack } from "@mantine/core";
import { useReducer } from "react";
import { Query } from "../query/Query";
import { usersQueryAction } from "./actions";
import { USER_QUERY_TEMPLATES } from "./constants";
import { usersQueryReducer } from "./reducers";
import { initialUsersQueryState } from "./state";

type UsersQueryProps = {};

function UsersQuery({}: UsersQueryProps) {
    const [
        usersQueryState,
        usersQueryDispatch,
    ] = useReducer(usersQueryReducer, initialUsersQueryState);

    const {
        currentPage,
        isError,
        isLoading,
        queryString,
        resourceData,
        totalDocuments,
    } = usersQueryState;

    console.log("UsersQuery State", usersQueryState);

    const queryComponent = (
        <Query
            collectionName="users"
            parentAction={usersQueryAction.setQueryString}
            parentDispatch={usersQueryDispatch}
            queryTemplates={USER_QUERY_TEMPLATES}
        />
    );

    return (
        <Stack>
            {queryComponent}
        </Stack>
    );
}

export default UsersQuery;
