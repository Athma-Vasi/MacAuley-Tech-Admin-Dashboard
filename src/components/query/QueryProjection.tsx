import { Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { CheckboxRadioSelectData } from "../../types";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleCheckboxInputGroup } from "../accessibleInputs/AccessibleCheckboxInput";
import { queryAction } from "./actions";
import type { QueryDispatch, QueryState } from "./types";
import { PROJECTION_HELP_MODAL_CONTENT } from "./utils";

type QueryProjectionProps = {
    hideProjection: boolean;
    parentDispatch: React.Dispatch<QueryDispatch>;
    projectionCheckboxData: CheckboxRadioSelectData;
    queryState: QueryState;
};

function QueryProjection({
    hideProjection = false,
    parentDispatch,
    projectionCheckboxData,
    queryState,
}: QueryProjectionProps) {
    const [
        openedProjectionHelpModal,
        { open: openProjectionHelpModal, close: closeProjectionHelpModal },
    ] = useDisclosure(false);

    const { projectionExclusionFields } = queryState;

    const projectionHelpButton = (
        <AccessibleButton
            attributes={{
                enabledScreenreaderText: "Open projection help modal",
                disabledScreenreaderText:
                    "Projection help modal is already open",
                disabled: openedProjectionHelpModal,
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
            title="Projection Query guide"
        >
            {PROJECTION_HELP_MODAL_CONTENT}
        </Modal>
    );

    const projectionCheckboxInput = hideProjection
        ? null
        : (
            <AccessibleCheckboxInputGroup
                attributes={{
                    inputData: projectionCheckboxData,
                    name: "exclusionFields",
                    parentDispatch,
                    validValueAction: queryAction.setProjectionExclusionFields,
                    value: projectionExclusionFields,
                }}
            />
        );

    return (
        <Stack>
            {projectionHelpButton}
            {projectionHelpModal}
            {projectionCheckboxInput}
        </Stack>
    );
}

export { QueryProjection };
