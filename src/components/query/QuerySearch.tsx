import { Group, Modal, Stack, Text } from "@mantine/core";
import React from "react";

import { useDisclosure } from "@mantine/hooks";
import type { SetPageInErrorPayload, StepperPage } from "../../types";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleSegmentedControl } from "../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import { queryAction } from "./actions";
import { QUERY_SEARCH_CASE_DATA } from "./constants";
import type { QueryDispatch, QueryState } from "./types";
import { SEARCH_CHAIN_HELP_MODAL_CONTENT } from "./utils";

type QuerySearchProps = {
    parentDispatch: React.Dispatch<QueryDispatch>;
    queryState: QueryState;
};

function QuerySearch({
    parentDispatch,
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
        pagesInError: Set<number>;
    };
    const initialQuerySearchState: QuerySearchState = {
        exclusion: generalSearchExclusionValue,
        inclusion: generalSearchInclusionValue,
        pagesInError: new Set(),
    };

    type QuerySearchActions = {
        setExclusion: "setExclusion";
        setInclusion: "setInclusion";
        setPageInError: "setPageInError";
    };
    const querySearchActions: QuerySearchActions = {
        setExclusion: "setExclusion",
        setInclusion: "setInclusion",
        setPageInError: "setPageInError",
    };

    type QuerySearchDispatch =
        | {
            action:
                | QuerySearchActions["setExclusion"]
                | QuerySearchActions["setInclusion"];
            payload: string;
        }
        | {
            action: QuerySearchActions["setPageInError"];
            payload: SetPageInErrorPayload;
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

            case querySearchActions.setPageInError: {
                const { kind, page } = dispatch
                    .payload as SetPageInErrorPayload;
                const pagesInError = new Set(state.pagesInError);
                kind === "add"
                    ? pagesInError.add(page)
                    : pagesInError.delete(page);

                return {
                    ...state,
                    pagesInError,
                };
            }

            default:
                return state;
        }
    }

    const [querySearchState, querySearchDispatch] = React.useReducer(
        querySearchReducer,
        initialQuerySearchState,
    );
    const { exclusion, inclusion, pagesInError } = querySearchState;

    const [
        openedSearchHelpModal,
        { open: openSearchHelpModal, close: closeSearchHelpModal },
    ] = useDisclosure(false);

    const stepperPages: StepperPage[] = [
        {
            children: [
                {
                    inputType: "text",
                    name: "inclusion",
                    validationKey: "inclusion",
                },
                {
                    inputType: "text",
                    name: "exclusion",
                    validationKey: "exclusion",
                },
            ],
            description: "",
        },
    ];

    const generalSearchInclusionTextInput = (
        <AccessibleTextInput
            attributes={{
                invalidValueAction: querySearchActions.setPageInError,
                name: "inclusion",
                parentDispatch: querySearchDispatch,
                stepperPages,
                validValueAction: querySearchActions.setInclusion,
                value: generalSearchInclusionValue,
            }}
        />
    );

    const generalSearchExclusionTextInput = (
        <AccessibleTextInput
            attributes={{
                invalidValueAction: querySearchActions.setPageInError,
                name: "exclusion",
                parentDispatch: querySearchDispatch,
                stepperPages,
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
                parentDispatch,
                validValueAction: queryAction.setGeneralSearchCase,
                value: generalSearchCase,
            }}
        />
    );

    const addSearchLinkButton = (
        <AccessibleButton
            attributes={{
                enabledScreenreaderText: "Add filter link to chain",
                disabledScreenreaderText:
                    "Please fix error(s) before proceeding",
                disabled: pagesInError.size > 0,
                kind: "add",
                onClick: (
                    _event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
                ) => {
                    parentDispatch({
                        action: queryAction.setGeneralSearchExclusionValue,
                        payload: exclusion,
                    });

                    parentDispatch({
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
            title="Search Query guide"
        >
            {SEARCH_CHAIN_HELP_MODAL_CONTENT}
        </Modal>
    );

    const generalSearchSection = (
        <Stack>
            <Text size="md">Search</Text>
            {caseSensitiveSegmentedControl}
            {generalSearchInclusionTextInput}
            {generalSearchExclusionTextInput}
            <Group>
                {searchHelpButton}
                {addSearchLinkButton}
                {searchHelpModal}
            </Group>
        </Stack>
    );

    return generalSearchSection;
}

export { QuerySearch };
