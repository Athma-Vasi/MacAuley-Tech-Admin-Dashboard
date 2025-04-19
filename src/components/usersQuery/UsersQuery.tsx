import { Stack } from "@mantine/core";
import { Query } from "../query/Query";
import { USER_QUERY_TEMPLATES } from "./constants";

type UsersQueryProps = {};

function UsersQuery({}: UsersQueryProps) {
    const queryComponent = (
        <Query
            collectionName="users"
            parentAction="TODO"
            parentDispatch={{} as any}
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
