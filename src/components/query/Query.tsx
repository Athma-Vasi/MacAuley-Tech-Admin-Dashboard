import React, { useEffect } from "react";

import { Chain } from "./Chain";
import { QueryProjection } from "./QueryProjection";
import { QuerySearch } from "./QuerySearch";
import { queryReducer } from "./reducers";

import { Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { QueryAction, queryAction } from "./actions";
import { LIMIT_PER_PAGE_DATA, QUERY_KIND_DATA } from "./constants";
import { QueryFilter } from "./QueryFilter";
import { QuerySort } from "./QuerySort";
import { initialQueryState } from "./state";
import { LimitPerPage, QueryKind, QueryTemplate } from "./types";
import {
    createQueryString,
    FILTER_HELP_MODAL_CONTENT,
    PROJECTION_HELP_MODAL_CONTENT,
    SEARCH_CHAIN_HELP_MODAL_CONTENT,
    SORT_HELP_MODAL_CONTENT,
} from "./utils";

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
    const [
        openedFilterHelpModal,
        { open: openFilterHelpModal, close: closeFilterHelpModal },
    ] = useDisclosure(false);
    const [
        openedProjectionHelpModal,
        { open: openProjectionHelpModal, close: closeProjectionHelpModal },
    ] = useDisclosure(false);
    const [
        openedSearchHelpModal,
        { open: openSearchHelpModal, close: closeSearchHelpModal },
    ] = useDisclosure(false);
    const [
        openedSortHelpModal,
        { open: openSortHelpModal, close: closeSortHelpModal },
    ] = useDisclosure(false);

    const {
        generalSearchCase,
        generalSearchExclusionValue,
        generalSearchInclusionValue,
        isError,
        projectionFields,
        queryChains,
        queryKind,
        limitPerPage,
        filterComparisonOperator,
        filterField,
        filterLogicalOperator,
        filterValue,
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
        sortDirection,
        sortField,
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
        <AccessibleSelectInput<
            QueryAction["setQueryKind"],
            QueryKind
        >
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
        <AccessibleSelectInput<
            QueryAction["setLimitPerPage"],
            LimitPerPage
        >
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

    const filterHelpButton = (
        <AccessibleButton
            attributes={{
                dataTestId: "filter-help-modal-button",
                disabledScreenreaderText: "Filter help modal is already open",
                disabled: openedFilterHelpModal,
                enabledScreenreaderText: "Open filter help modal",
                kind: "help",
                onClick: () => {
                    openFilterHelpModal();
                },
            }}
        />
    );
    const filterHelpModal = (
        <Modal
            opened={openedFilterHelpModal}
            onClose={closeFilterHelpModal}
            title={
                <Text data-testid="filter-help-modal-title" size="xl">
                    🛠 How to Use the Filter Builder
                </Text>
            }
        >
            {FILTER_HELP_MODAL_CONTENT}
        </Modal>
    );

    const projectionHelpButton = (
        <AccessibleButton
            attributes={{
                dataTestId: "projection-help-button",
                disabledScreenreaderText:
                    "Projection help modal is already open",
                disabled: openedProjectionHelpModal,
                enabledScreenreaderText: "Open projection help modal",
                kind: "help",
                onClick: (
                    _event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
                ) => {
                    openProjectionHelpModal();
                },
            }}
        />
    );
    const projectionHelpModal = (
        <Modal
            opened={openedProjectionHelpModal}
            onClose={closeProjectionHelpModal}
            title={<Text size="xl">🧰 How it works:</Text>}
        >
            {PROJECTION_HELP_MODAL_CONTENT}
        </Modal>
    );

    const searchHelpButton = (
        <AccessibleButton
            attributes={{
                enabledScreenreaderText: "Open search help modal",
                disabledScreenreaderText: "Search help modal is already open",
                disabled: openedSearchHelpModal,
                kind: "help",
                onClick: (
                    _event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
                ) => {
                    openSearchHelpModal();
                },
            }}
        />
    );
    const searchHelpModal = (
        <Modal
            opened={openedSearchHelpModal}
            onClose={closeSearchHelpModal}
            title={<Text size="xl">🔍 How it works:</Text>}
        >
            {SEARCH_CHAIN_HELP_MODAL_CONTENT}
        </Modal>
    );

    const sortHelpButton = (
        <AccessibleButton
            attributes={{
                enabledScreenreaderText: "Open sort help modal",
                disabledScreenreaderText: "Sort help modal is already open",
                disabled: openedSortHelpModal,
                kind: "help",
                onClick: (
                    _event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
                ) => {
                    openSortHelpModal();
                },
            }}
        />
    );
    const sortHelpModal = (
        <Modal
            opened={openedSortHelpModal}
            onClose={closeSortHelpModal}
            title={<Text size="xl">🔃 How it works:</Text>}
        >
            {SORT_HELP_MODAL_CONTENT}
        </Modal>
    );

    const helpButton = queryKind === "filter"
        ? filterHelpButton
        : queryKind === "projection"
        ? projectionHelpButton
        : queryKind === "search"
        ? searchHelpButton
        : sortHelpButton;

    const query = (
        <div className="query-container">
            <Group w="100%" position="left" p="md" align="flex-end">
                {limitPerPageSelectInput}
                {queryKindSelectInput}
                {refreshButton}
                {helpButton}
                {filterHelpModal}
                {projectionHelpModal}
                {searchHelpModal}
                {sortHelpModal}
            </Group>

            {queryChain}
            {querySection}
        </div>
    );

    return query;
}

export { Query };
