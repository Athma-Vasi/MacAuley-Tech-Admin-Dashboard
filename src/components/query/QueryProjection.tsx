import { AccessibleCheckboxInputGroup } from "../accessibleInputs/AccessibleCheckboxInput";
import { queryAction } from "./actions";
import { QueryDispatch } from "./schemas";
import type { QueryState, QueryTemplate } from "./types";
import { excludeSelectedProjectionFields } from "./utils";

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
    const { projectionFields } = queryState;

    const { inputData } = excludeSelectedProjectionFields(
        queryTemplates,
        queryState,
    );

    const projectionCheckboxInput = hideProjection
        ? null
        : (
            <AccessibleCheckboxInputGroup
                attributes={{
                    // connects query chain links to this input
                    additionalScreenreaderIds: [
                        "projection-exclusion-screenreader-link",
                        "projection-exclusion-screenreader-heading",
                    ],
                    children: <></>,
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
            {projectionCheckboxInput}
        </div>
    );
}

export { QueryProjection };
