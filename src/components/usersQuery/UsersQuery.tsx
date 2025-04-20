import { Stack } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { API_URL, FETCH_REQUEST_TIMEOUT } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { Query } from "../query/Query";
import { usersQueryAction } from "./actions";
import { USER_QUERY_TEMPLATES } from "./constants";
import { handleUsersQuerySubmitGET } from "./handlers";
import { usersQueryReducer } from "./reducers";
import { initialUsersQueryState } from "./state";

type UsersQueryProps = {};

function UsersQuery({}: UsersQueryProps) {
    const { authState: { accessToken }, authDispatch } = useAuth();
    const { showBoundary } = useErrorBoundary();
    const [
        usersQueryState,
        usersQueryDispatch,
    ] = useReducer(usersQueryReducer, initialUsersQueryState);

    const fetchAbortControllerRef = useRef<AbortController | null>(null);
    const isComponentMountedRef = useRef(false);

    useEffect(() => {
        const timerId = setTimeout(() => {
            fetchAbortControllerRef?.current?.abort("Request timed out");
        }, FETCH_REQUEST_TIMEOUT);

        return () => {
            clearTimeout(timerId);
            fetchAbortControllerRef?.current?.abort("Component unmounted");
            isComponentMountedRef.current = false;
        };
    }, []);

    const {
        currentPage,
        isError,
        isLoading,
        queryString,
        resourceData,
        totalDocuments,
    } = usersQueryState;

    console.log("UsersQuery State", usersQueryState);

    const submitButton = (
        <AccessibleButton
            attributes={{
                kind: "submit",
                disabledScreenreaderText: "Please fix errors before submitting",
                disabled: isLoading || isError,
                enabledScreenreaderText: "Submit query",
                onClick: async (event) => {
                    event.preventDefault();

                    await handleUsersQuerySubmitGET({
                        accessToken,
                        authDispatch,
                        dispatch: usersQueryDispatch,
                        fetchAbortControllerRef,
                        isComponentMountedRef,
                        queryString,
                        showBoundary,
                        totalDocuments,
                        url: API_URL,
                    });
                },
            }}
        />
    );

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
            {submitButton}
        </Stack>
    );
}

export default UsersQuery;
