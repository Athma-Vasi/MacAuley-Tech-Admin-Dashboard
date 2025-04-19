import { Accordion, Stack } from "@mantine/core";
import React from "react";

import { Chain } from "./Chain";
import { QueryProjection } from "./QueryProjection";
import { QuerySearch } from "./QuerySearch";
import { queryReducer } from "./reducers";

import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { queryAction } from "./actions";
import { LIMIT_PER_PAGE_DATA } from "./constants";
import { QueryFilter } from "./QueryFilter";
import { QuerySort } from "./QuerySort";
import { initialQueryState } from "./state";
import { QueryTemplate } from "./types";

type QueryProps<ValidValueAction extends string = string> = {
    collectionName: string;
    hideProjection?: boolean;
    // this components output is the query string used to fetch data
    parentAction: ValidValueAction;
    parentDispatch: React.ActionDispatch<
        [dispatch: { action: ValidValueAction; payload: string }]
    >;
    queryTemplates: Array<QueryTemplate>;
};

function Query<ValidValueAction extends string = string>({
    collectionName,
    parentDispatch,
    hideProjection = false,
    parentAction,
    queryTemplates,
}: QueryProps<ValidValueAction>) {
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
        queryChains,
        limitPerPage,
        sortDirection,
        sortField,
    } = queryState;

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

    const queryAccordion = (
        <Accordion>
            <Accordion.Item value="Filter">
                <Accordion.Control>Filter</Accordion.Control>
                <Accordion.Panel>{queryFilter}</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Search">
                <Accordion.Control>Search</Accordion.Control>
                <Accordion.Panel>{querySearch}</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Projection">
                <Accordion.Control>Projection</Accordion.Control>
                <Accordion.Panel>{queryProjection}</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Sort">
                <Accordion.Control>Sort</Accordion.Control>
                <Accordion.Panel>{querySort}</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );

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

    return (
        <Stack>
            {queryChain}
            {limitPerPageSelectInput}
            {queryAccordion}
        </Stack>
    );
}

export { Query };
