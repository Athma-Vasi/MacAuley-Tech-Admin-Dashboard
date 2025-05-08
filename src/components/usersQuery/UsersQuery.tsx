import { Accordion, Box, Group, Pagination, Space } from "@mantine/core";
import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { API_URL, COLORS_SWATCHES } from "../../constants";
import { useMountedRef } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { useWindowSize } from "../../hooks/useWindowSize";
import { returnThemeColors } from "../../utils";
import FetchParseWorker from "../../workers/fetchParseWorker?worker";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { Query } from "../query/Query";
import { usersQueryAction } from "./actions";
import { USER_QUERY_TEMPLATES } from "./constants";
import DisplayResource from "./DisplayResource";
import {
    handleUsersQueryOnmessageCallback,
    handleUsersQuerySubmitGETClick,
} from "./handlers";
import { usersQueryReducer } from "./reducers";
import { initialUsersQueryState } from "./state";
import { UsersQueryMessageEvent } from "./types";

type UsersQueryProps = {};

function UsersQuery({}: UsersQueryProps) {
    const { windowWidth } = useWindowSize();
    const { authState: { accessToken }, authDispatch } = useAuth();
    const { showBoundary } = useErrorBoundary();
    const [
        usersQueryState,
        usersQueryDispatch,
    ] = useReducer(usersQueryReducer, initialUsersQueryState);

    const navigate = useNavigate();

    const { globalState: { themeObject } } = useGlobalState();

    const { bgGradient } = returnThemeColors({
        colorsSwatches: COLORS_SWATCHES,
        themeObject,
    });

    const isComponentMountedRef = useMountedRef();

    useEffect(() => {
        const newUsersFetchWorker = new FetchParseWorker();
        usersQueryDispatch({
            action: usersQueryAction.setUsersFetchWorker,
            payload: newUsersFetchWorker,
        });

        newUsersFetchWorker.onmessage = async (
            event: UsersQueryMessageEvent,
        ) => {
            await handleUsersQueryOnmessageCallback({
                authDispatch,
                event,
                isComponentMountedRef,
                navigate,
                showBoundary,
                usersQueryDispatch,
                usersQueryState,
            });
        };

        return () => {
            isComponentMountedRef.current = false;
            newUsersFetchWorker.terminate();
        };
    }, []);

    const {
        arrangeByDirection,
        arrangeByField,
        currentPage,
        usersFetchWorker,
        isError,
        isLoading,
        pages,
        resourceData,
        totalDocuments,
    } = usersQueryState;

    const submitButton = (
        <AccessibleButton
            attributes={{
                kind: "submit",
                disabledScreenreaderText: "Please fix errors before submitting",
                disabled: isLoading || isError,
                enabledScreenreaderText: "Submit query",
                onClick: async (event) => {
                    event.preventDefault();

                    await handleUsersQuerySubmitGETClick({
                        accessToken,
                        url: API_URL,
                        usersFetchWorker,
                        usersQueryDispatch,
                        usersQueryState,
                    });
                },
            }}
        />
    );

    const buttons = (
        <Group w="100%" position="center" px="md">
            {submitButton}
        </Group>
    );

    const queryComponent = (
        <Query
            collectionName="users"
            parentAction={usersQueryAction}
            parentDispatch={usersQueryDispatch}
            queryTemplates={USER_QUERY_TEMPLATES}
        />
    );

    const queryAccordion = (
        <Accordion w="100%" defaultValue={"Users Query"}>
            <Accordion.Item value="Users Query">
                <Accordion.Control>Users Query</Accordion.Control>
                <Accordion.Panel>
                    {queryComponent}
                    {buttons}
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );

    const displayResource = (
        <DisplayResource
            arrangeByDirection={arrangeByDirection}
            arrangeByField={arrangeByField}
            isLoading={isLoading}
            parentAction={usersQueryAction}
            parentDispatch={usersQueryDispatch}
            resourceData={resourceData}
            resourceName="User"
            totalDocuments={totalDocuments}
        />
    );

    const pagination = (
        <Group w="100%" position="left" px="md">
            <Pagination
                value={currentPage}
                onChange={async (page) => {
                    await handleUsersQuerySubmitGETClick({
                        accessToken,
                        url: API_URL,
                        usersFetchWorker,
                        usersQueryDispatch,
                        usersQueryState: {
                            ...usersQueryState,
                            currentPage: page,
                            newQueryFlag: false,
                        },
                    });
                }}
                total={pages}
                w="100%"
            />
        </Group>
    );

    return (
        <Box
            className="users-query-container"
            bg={bgGradient}
        >
            {windowWidth < 1024 ? queryAccordion : (
                <>
                    {queryComponent}
                    {buttons}
                </>
            )}
            <Space h="md" />
            {pagination}
            <Space h="md" />
            {displayResource}
            <Space h="md" />
            {pagination}
        </Box>
    );
}

export default UsersQuery;
