import { Group, Modal, Text } from "@mantine/core";
import React from "react";

import { useDisclosure } from "@mantine/hooks";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleSegmentedControl } from "../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleTextInput } from "../accessibleInputs/AccessibleTextInput";
import { QueryAction, queryAction } from "./actions";
import { QUERY_SEARCH_CASE_DATA } from "./constants";
import { QueryDispatch } from "./schemas";
import type { GeneralSearchCase, QueryState } from "./types";
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

    const [
        openedSearchHelpModal,
        { open: openSearchHelpModal, close: closeSearchHelpModal },
    ] = useDisclosure(false);

    const generalSearchInclusionTextInput = (
        <AccessibleTextInput
            attributes={{
                errorDispatch: queryDispatch,
                invalidValueAction: queryAction.setIsError,
                name: "inclusion",
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setGeneralSearchInclusionValue,
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
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setGeneralSearchExclusionValue,
                value: generalSearchExclusionValue,
            }}
        />
    );

    const caseSensitiveSegmentedControl = (
        <AccessibleSegmentedControl<
            QueryAction["setGeneralSearchCase"],
            GeneralSearchCase
        >
            attributes={{
                data: QUERY_SEARCH_CASE_DATA,
                name: "case",
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setGeneralSearchCase,
                value: generalSearchCase,
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
                {searchHelpModal}
            </Group>
        </div>
    );

    return generalSearchSection;
}

export { QuerySearch };
