import { Group, Modal, Stack } from "@mantine/core";
import type React from "react";

import { useDisclosure } from "@mantine/hooks";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import type { QueryDispatch, QueryState } from "./types";
import { SORT_HELP_MODAL_CONTENT } from "./utils";

type QuerySortProps = {
    queryDispatch: React.Dispatch<QueryDispatch>;
    queryState: QueryState;
};

function QuerySort({
    queryDispatch,
    queryState,
}: QuerySortProps) {
    const [
        openedSortHelpModal,
        { open: openSortHelpModal, close: closeSortHelpModal },
    ] = useDisclosure(false);

    const { sortDirection, sortField } = queryState;
    // const logicalOperatorChainsMap = queryChains.sort;
    // const sortChainLength = Array.from(logicalOperatorChainsMap).reduce(
    //     (acc, [_key, value]) => {
    //         acc += value.length;
    //         return acc;
    //     },
    //     0,
    // );

    // const data = removeProjectionExclusionFields(
    //     projectionExclusionFields,
    //     sortFieldSelectData,
    // );
    // const disabled = data.length === 0;

    // const sortFieldSelectInput = (
    //     <AccessibleSelectInput
    //         attributes={{
    //             data,
    //             disabled,
    //             name: "sortField",
    //             parentDispatch: queryDispatch,
    //             validValueAction: queryAction.setSortField,
    //             value: sortField,
    //         }}
    //     />
    // );

    // const sortDirectionSelectInput = (
    //     <AccessibleSelectInput
    //         attributes={{
    //             data: SORT_DIRECTION_DATA,
    //             disabled,
    //             name: "sortDirection",
    //             parentDispatch: queryDispatch,
    //             validValueAction: queryAction
    //                 .setSortDirection,
    //             value: sortDirection,
    //         }}
    //     />
    // );

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
                    // sortChainDispatch({
                    //     action: queryAction.modifyQueryChains,
                    //     payload: {
                    //         index: sortChainLength,
                    //         logicalOperator: "and",
                    //         queryChainActions: "insert",
                    //         queryChainKind: "sort",
                    //         queryLink: [sortField, "equal to", sortDirection],
                    //     },
                    // });
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
            title="Sort Query guide"
        >
            {SORT_HELP_MODAL_CONTENT}
        </Modal>
    );

    return (
        <Stack>
            {
                /* {sortFieldSelectInput}
            {sortDirectionSelectInput} */
            }
            <Group>
                {sortHelpButton}
                {addSortLinkButton}
                {sortHelpModal}
            </Group>
        </Stack>
    );
}

export { QuerySort };
