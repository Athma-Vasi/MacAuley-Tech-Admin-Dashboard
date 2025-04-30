import { Group, Modal, Text } from "@mantine/core";
import type React from "react";

import { useDisclosure } from "@mantine/hooks";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { queryAction } from "./actions";
import { SORT_DIRECTION_DATA } from "./constants";
import { QueryDispatch } from "./schemas";
import { type QueryState, type QueryTemplate } from "./types";
import {
    removeProjectionExclusionFields,
    returnSortableQueryFields,
    SORT_HELP_MODAL_CONTENT,
} from "./utils";

type QuerySortProps = {
    queryDispatch: React.Dispatch<QueryDispatch>;
    queryState: QueryState;
    queryTemplates: Array<QueryTemplate>;
};

function QuerySort({
    queryDispatch,
    queryState,
    queryTemplates,
}: QuerySortProps) {
    const [
        openedSortHelpModal,
        { open: openSortHelpModal, close: closeSortHelpModal },
    ] = useDisclosure(false);

    const { projectionFields, queryChains, sortDirection, sortField } =
        queryState;
    const logicalOperatorChainsMap = queryChains.sort;
    const sortChainLength = Object.entries(logicalOperatorChainsMap).reduce(
        (acc, [_key, value]) => {
            acc += value.length;
            return acc;
        },
        0,
    );

    const sortableQueryFields = returnSortableQueryFields(queryTemplates);

    const data = removeProjectionExclusionFields(
        projectionFields,
        sortableQueryFields,
    );
    const disabled = data.length === 0;

    const sortFieldSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data,
                disabled,
                name: "sortField",
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setSortField,
                value: sortField,
            }}
        />
    );

    const sortDirectionSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: SORT_DIRECTION_DATA,
                disabled,
                name: "sortDirection",
                parentDispatch: queryDispatch,
                validValueAction: queryAction
                    .setSortDirection,
                value: sortDirection,
            }}
        />
    );

    const addSortLinkButton = (
        <AccessibleButton
            attributes={{
                enabledScreenreaderText: "Add sort link to chain",
                disabledScreenreaderText: "Max query links amount reached",
                // disabled: disabled || sortChainLength === MAX_LINKS_AMOUNT,
                kind: "add",
                onClick: (
                    _event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
                ) => {
                    queryDispatch({
                        action: queryAction.modifyQueryChains,
                        payload: {
                            index: sortChainLength,
                            logicalOperator: "and",
                            queryChainActions: "insert",
                            queryChainKind: "sort",
                            queryLink: [sortField, "equal to", sortDirection],
                        },
                    });
                },
            }}
        />
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

    return (
        <div className="query-sort">
            {sortFieldSelectInput}
            {sortDirectionSelectInput}

            <Group w="100%" position="center">
                {sortHelpButton}
                {addSortLinkButton}
                {sortHelpModal}
            </Group>
        </div>
    );
}

export { QuerySort };
