import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleCheckboxInputGroup } from "../accessibleInputs/AccessibleCheckboxInput";
import { queryAction } from "./actions";
import { QueryDispatch } from "./schemas";
import type { QueryState, QueryTemplate } from "./types";
import {
    excludeSelectedProjectionFields,
    PROJECTION_HELP_MODAL_CONTENT,
} from "./utils";

type QueryProjectionProps = {
    hideProjection: boolean;
    queryDispatch: React.Dispatch<QueryDispatch>;
    queryState: QueryState;
    queryTemplates: Array<QueryTemplate>;
};

function QueryProjection({
    hideProjection = false,
    queryDispatch,
    queryState,
    queryTemplates,
}: QueryProjectionProps) {
    const [
        openedProjectionHelpModal,
        { open: openProjectionHelpModal, close: closeProjectionHelpModal },
    ] = useDisclosure(false);
    const { projectionFields } = queryState;

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

    const { inputData } = excludeSelectedProjectionFields(
        queryTemplates,
        queryState,
    );

    const projectionCheckboxInput = hideProjection
        ? null
        : (
            <AccessibleCheckboxInputGroup
                attributes={{
                    inputData,
                    name: "exclusionFields",
                    parentDispatch: queryDispatch,
                    validValueAction: queryAction.setProjectionFields,
                    value: projectionFields,
                }}
            />
        );

    return (
        <div className="query-projection">
            {projectionHelpButton}
            {projectionHelpModal}
            {projectionCheckboxInput}
        </div>
    );
}

export { QueryProjection };
