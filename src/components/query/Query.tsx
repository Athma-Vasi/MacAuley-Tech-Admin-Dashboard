import React, { useEffect } from "react";

import { Chain } from "./Chain";
import { QueryProjection } from "./QueryProjection";
import { QuerySearch } from "./QuerySearch";
import { queryReducer } from "./reducers";

import { Group } from "@mantine/core";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { queryAction } from "./actions";
import { LIMIT_PER_PAGE_DATA, QUERY_KIND_DATA } from "./constants";
import { QueryFilter } from "./QueryFilter";
import { QuerySort } from "./QuerySort";
import { initialQueryState } from "./state";
import { QueryTemplate } from "./types";
import { createQueryString } from "./utils";

type QueryProps = {
    collectionName: string;
    hideProjection?: boolean;
    /** parentAction must have keys: setCurrentPage, setQueryString and setNewQueryFlag */
    parentAction: Record<string, string>;
    parentDispatch: React.Dispatch<any>;
    queryTemplates: Array<QueryTemplate>;
};

function Query({
    collectionName,
    parentDispatch,
    hideProjection = false,
    parentAction,
    queryTemplates,
}: QueryProps) {
    const [queryState, queryDispatch] = React.useReducer(
        queryReducer,
        initialQueryState,
    );

    const {
        filterComparisonOperator,
        filterField,
        filterLogicalOperator,
        filterValue,
        generalSearchCase,
        generalSearchExclusionValue,
        generalSearchInclusionValue,
        isError,
        isSearchDisabled,
        projectionFields,
        queryChains,
        queryKind,
        limitPerPage,
        sortDirection,
        sortField,
    } = queryState;

    // this components output is the query string used to fetch data
    // and the newQueryFlag is set to true whenever the query string changes
    useEffect(() => {
        const queryString = createQueryString(queryState);

        parentDispatch({
            action: parentAction.setQueryString,
            payload: queryString,
        });

        parentDispatch({
            action: parentAction.setCurrentPage,
            payload: 1,
        });

        parentDispatch({
            action: parentAction.setNewQueryFlag,
            payload: true,
        });
    }, [
        generalSearchCase,
        generalSearchExclusionValue,
        generalSearchInclusionValue,
        limitPerPage,
        projectionFields,
        queryChains,
    ]);

    const queryChain = (
        <Chain
            collectionName={collectionName}
            queryDispatch={queryDispatch}
            queryState={queryState}
        />
    );

    const queryFilter = (
        <QueryFilter
            queryChains={queryChains}
            queryDispatch={queryDispatch}
            queryState={queryState}
            queryTemplates={queryTemplates}
        />
    );

    const queryProjection = (
        <QueryProjection
            hideProjection={hideProjection}
            queryDispatch={queryDispatch}
            queryState={queryState}
            queryTemplates={queryTemplates}
        />
    );

    const querySearch = (
        <QuerySearch
            queryDispatch={queryDispatch}
            queryState={queryState}
        />
    );

    const querySort = (
        <QuerySort
            queryDispatch={queryDispatch}
            queryState={queryState}
            queryTemplates={queryTemplates}
        />
    );

    const queryKindSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: QUERY_KIND_DATA,
                name: "queryKind",
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setQueryKind,
                value: queryKind,
            }}
        />
    );

    const querySection = queryKind === "filter"
        ? queryFilter
        : queryKind === "search"
        ? querySearch
        : queryKind === "projection"
        ? queryProjection
        : querySort;

    const limitPerPageSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: LIMIT_PER_PAGE_DATA,
                name: "limitPerPage",
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setLimitPerPage,
                value: limitPerPage,
            }}
        />
    );

    const refreshButton = (
        <AccessibleButton
            attributes={{
                dataTestId: "query-refresh-button",
                enabledScreenreaderText: "Reset query to initial",
                kind: "refresh",
                onClick: async () => {
                    queryDispatch({
                        action: queryAction.resetToInitial,
                        payload: initialQueryState,
                    });
                },
            }}
        />
    );

    const query = (
        <div className="query-container">
            <Group w="100%" position="left" p="md" align="flex-end">
                {limitPerPageSelectInput}
                {queryKindSelectInput}
                {refreshButton}
            </Group>

            {queryChain}

            {querySection}
        </div>
    );

    return query;
}

export { Query };
