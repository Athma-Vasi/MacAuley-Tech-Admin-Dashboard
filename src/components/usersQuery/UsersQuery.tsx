import { Box, Group, Pagination, Text } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";
import {
    API_URL,
    COLORS_SWATCHES,
    FETCH_REQUEST_TIMEOUT,
} from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { Query } from "../query/Query";
import { usersQueryAction } from "./actions";
import { USER_QUERY_TEMPLATES } from "./constants";
import DisplayResource from "./DisplayResource";
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

    const { globalState: { themeObject } } = useGlobalState();

    const { bgGradient } = returnThemeColors({
        colorsSwatches: COLORS_SWATCHES,
        themeObject,
    });

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
        arrangeByDirection,
        arrangeByField,
        currentPage,
        isError,
        isLoading,
        newQueryFlag,
        pages,
        queryString,
        resourceData,
        totalDocuments,
    } = usersQueryState;

    console.log("UsersQuery State", usersQueryState);

    const refreshButton = (
        <AccessibleButton
            attributes={{
                kind: "refresh",
                enabledScreenreaderText: "Refresh query",
                onClick: async () => {
                    usersQueryDispatch({
                        action: usersQueryAction.resetToInitial,
                        payload: initialUsersQueryState,
                    });
                },
            }}
        />
    );

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
                        currentPage,
                        dispatch: usersQueryDispatch,
                        fetchAbortControllerRef,
                        isComponentMountedRef,
                        newQueryFlag,
                        queryString,
                        showBoundary,
                        totalDocuments,
                        url: API_URL,
                    });
                },
            }}
        />
    );

    const buttons = (
        <Group w="100%" position="apart" px="md">
            {refreshButton}
            {submitButton}
        </Group>
    );

    // const arrangeByDirectionSelectInput = (
    //     <AccessibleSelectInput
    //         attributes={{
    //             data: SORT_DIRECTION_DATA,
    //             disabled: resourceData.length === 0,
    //             name: "arrangeByDirection",
    //             parentDispatch: usersQueryDispatch,
    //             validValueAction: usersQueryAction
    //                 .setArrangeByDirection,
    //             value: arrangeByDirection,
    //         }}
    //     />
    // );

    // const userDocumentFields = USER_QUERY_TEMPLATES.reduce(
    //     (acc, { name }) => {
    //         acc.push(
    //             {
    //                 label: splitCamelCase(name),
    //                 value: name as keyof UserDocument,
    //             },
    //         );
    //         return acc;
    //     },
    //     [
    //         { label: "Created At", value: "createdAt" },
    //         { label: "Updated At", value: "updatedAt" },
    //         { label: "_id", value: "_id" },
    //         { label: "__v", value: "__v" },
    //     ] as CheckboxRadioSelectData<keyof UserDocument>,
    // );

    // const arrangeByFieldSelectInput = (
    //     <AccessibleSelectInput
    //         attributes={{
    //             data: userDocumentFields,
    //             disabled: resourceData.length === 0,
    //             name: "arrangeByField",
    //             parentDispatch: usersQueryDispatch,
    //             validValueAction: usersQueryAction.setArrangeByField,
    //             value: arrangeByField,
    //         }}
    //     />
    // );

    const queryComponent = (
        <Query
            collectionName="users"
            parentAction={usersQueryAction}
            parentDispatch={usersQueryDispatch}
            queryTemplates={USER_QUERY_TEMPLATES}
        />
    );

    const displayResource = (
        <DisplayResource
            arrangeByDirection={arrangeByDirection}
            arrangeByField={arrangeByField}
            isLoading={isLoading}
            parentAction={usersQueryAction}
            parentDispatch={usersQueryDispatch}
            resourceData={resourceData}
            totalDocuments={totalDocuments}
        />
    );

    const pagination = (
        <Group w="100%" position="left" px="md">
            <Pagination
                value={currentPage}
                onChange={async (page) => {
                    await handleUsersQuerySubmitGET({
                        accessToken,
                        authDispatch,
                        currentPage: page,
                        dispatch: usersQueryDispatch,
                        fetchAbortControllerRef,
                        isComponentMountedRef,
                        newQueryFlag: false,
                        queryString,
                        showBoundary,
                        totalDocuments,
                        url: API_URL,
                    });
                }}
                total={pages}
                w="100%"
                // withEdges
                // withControls
            />
        </Group>
    );

    return (
        <Box
            className="users-query-container"
            bg={bgGradient}
        >
            <Text size="lg" weight={500} mb="md">
                Users Query
            </Text>
            {queryComponent}
            {buttons}
            {pagination}
            {displayResource}
            {pagination}
        </Box>
    );
}

export default UsersQuery;
