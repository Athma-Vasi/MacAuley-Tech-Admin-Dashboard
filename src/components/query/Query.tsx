import { Accordion, Stack } from "@mantine/core";
import React from "react";

import { Chain, type QueryChainDispatch } from "./Chain";
import { QueryProjection } from "./QueryProjection";
import { QuerySearch } from "./QuerySearch";
import { queryReducer } from "./reducers";

import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { queryAction } from "./actions";
import { LIMIT_PER_PAGE_DATA } from "./constants";
import { QueryFilter } from "./QueryFilter";
import { QuerySort } from "./QuerySort";
import { initialQueryState } from "./state";

type QueryProps = {
    collectionName: string;
    hideProjection?: boolean;
    parentDispatch: React.Dispatch<any>;
};

function Query({
    collectionName,
    parentDispatch,
    hideProjection = false,
}: QueryProps) {
    const [queryState, queryDispatch] = React.useReducer(
        queryReducer,
        initialQueryState,
    );

    const {
        filterComparisonOperator,
        filterComparisonOperatorSelectData,
        filterField,
        filterFieldsOperatorsValuesSetsMap,
        filterLogicalOperator,
        filterValue,
        generalSearchCase,
        generalSearchExclusionValue,
        generalSearchInclusionValue,
        isError,
        isSearchDisabled,
        limitPerPage,
        logicalOperatorChainsSetsMap,
        projectionExclusionFields,
        queryChains,
        queryString,
        searchFieldsOperatorsValuesSetMap,
        sortDirection,
        sortField,
        sortFieldsSet,
    } = queryState;

    const queryChain = (
        <Chain
            collectionName={collectionName}
            queryChainDispatch={queryDispatch as QueryChainDispatch}
            queryState={queryState}
        />
    );

    const queryFilter = (
        <QueryFilter
            queryDispatch={queryDispatch}
            queryState={queryState}
        />
    );

    const queryProjection = (
        <QueryProjection
            hideProjection={hideProjection}
            queryDispatch={queryDispatch}
            projectionCheckboxData={[]}
            queryState={queryState}
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
