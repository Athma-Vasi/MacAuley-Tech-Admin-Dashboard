import { Group, Modal, Text } from "@mantine/core";
import React from "react";

import { useDisclosure } from "@mantine/hooks";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleSegmentedControl } from "../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleTextInput } from "../accessibleInputs/AccessibleTextInput";
import { QueryAction, queryAction } from "./actions";
import { QUERY_SEARCH_CASE_DATA } from "./constants";
import { QueryDispatch } from "./schemas";
import type { QueryState } from "./types";
import { SEARCH_CHAIN_HELP_MODAL_CONTENT } from "./utils";

type QuerySearchProps = {
    queryDispatch: React.Dispatch<QueryDispatch>;
    queryState: QueryState;
};

function QuerySearch({
    queryDispatch,
    queryState,
}: QuerySearchProps) {
    const {
        generalSearchCase,
        generalSearchExclusionValue,
        generalSearchInclusionValue,
    } = queryState;

    type QuerySearchState = {
        exclusion: string;
        inclusion: string;
    };
    const initialQuerySearchState: QuerySearchState = {
        exclusion: generalSearchExclusionValue,
        inclusion: generalSearchInclusionValue,
    };

    type QuerySearchActions = {
        setExclusion: "setExclusion";
        setInclusion: "setInclusion";
    };
    const querySearchActions: QuerySearchActions = {
        setExclusion: "setExclusion",
        setInclusion: "setInclusion",
    };

    type QuerySearchDispatch = {
        action:
            | QuerySearchActions["setExclusion"]
            | QuerySearchActions["setInclusion"];
        payload: string;
    };

    function querySearchReducer(
        state: QuerySearchState,
        dispatch: QuerySearchDispatch,
    ) {
        switch (dispatch.action) {
            case querySearchActions.setExclusion:
                return { ...state, exclusion: dispatch.payload };

            case querySearchActions.setInclusion:
                return { ...state, inclusion: dispatch.payload };

            default:
                return state;
        }
    }

    const [querySearchState, querySearchDispatch] = React.useReducer(
        querySearchReducer,
        initialQuerySearchState,
    );
    const { exclusion, inclusion } = querySearchState;

    const [
        openedSearchHelpModal,
        { open: openSearchHelpModal, close: closeSearchHelpModal },
    ] = useDisclosure(false);

    const generalSearchInclusionTextInput = (
        <AccessibleTextInput<
            QuerySearchActions["setInclusion"],
            QueryAction["setIsError"]
        >
            attributes={{
                errorDispatch: queryDispatch,
                invalidValueAction: queryAction.setIsError,
                name: "inclusion",
                parentDispatch: querySearchDispatch as any,
                validValueAction: querySearchActions.setInclusion,
                value: generalSearchInclusionValue,
            }}
        />
    );

    const generalSearchExclusionTextInput = (
        <AccessibleTextInput
            attributes={{
                errorDispatch: queryDispatch,
                invalidValueAction: queryAction.setIsError,
                name: "exclusion",
                parentDispatch: querySearchDispatch as any,
                validValueAction: querySearchActions.setExclusion,
                value: generalSearchExclusionValue,
            }}
        />
    );

    const caseSensitiveSegmentedControl = (
        <AccessibleSegmentedControl
            attributes={{
                data: QUERY_SEARCH_CASE_DATA,
                name: "case",
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setGeneralSearchCase,
                value: generalSearchCase,
            }}
        />
    );

    const addSearchLinkButton = (
        <AccessibleButton
            attributes={{
                dataTestId: "add-search-link-button",
                disabledScreenreaderText:
                    "Please fix error(s) before proceeding",
                disabled: queryState.isError,
                enabledScreenreaderText: "Add filter link to chain",
                kind: "add",
                onClick: (
                    _event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
                ) => {
                    queryDispatch({
                        action: queryAction.setGeneralSearchExclusionValue,
                        payload: exclusion,
                    });

                    queryDispatch({
                        action: queryAction.setGeneralSearchInclusionValue,
                        payload: inclusion,
                    });
                },
            }}
        />
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

    const generalSearchSection = (
        <div className="query-search">
            <Text size="md">Search</Text>
            {caseSensitiveSegmentedControl}
            <Group w="100%" position="left">
                {generalSearchInclusionTextInput}
                {generalSearchExclusionTextInput}
            </Group>
            <Group w="100%" position="center">
                {searchHelpButton}
                {addSearchLinkButton}
                {searchHelpModal}
            </Group>
        </div>
    );

    return generalSearchSection;
}

export { QuerySearch };
