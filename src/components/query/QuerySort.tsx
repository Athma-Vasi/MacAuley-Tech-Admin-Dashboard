import type React from "react";

import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { QueryAction, queryAction } from "./actions";
import { SORT_DIRECTION_DATA } from "./constants";
import { QueryDispatch } from "./schemas";
import { type QueryState, type QueryTemplate, SortDirection } from "./types";
import {
    removeProjectionExclusionFields,
    returnSortableQueryFields,
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
                onChange: (
                    event: React.ChangeEvent<HTMLSelectElement>,
                ) => {
                    queryDispatch({
                        action: queryAction.modifyQueryChains,
                        payload: {
                            index: sortChainLength,
                            logicalOperator: "and",
                            queryChainActions: "insert",
                            queryChainKind: "sort",
                            queryLink: [
                                event.currentTarget.value,
                                "equal to",
                                sortDirection,
                            ],
                        },
                    });
                },
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setSortField,
                value: sortField,
            }}
        />
    );

    const sortDirectionSelectInput = (
        <AccessibleSelectInput<
            QueryAction["setSortDirection"],
            SortDirection
        >
            attributes={{
                data: SORT_DIRECTION_DATA,
                disabled,
                name: "sortDirection",
                onChange: (
                    event: React.ChangeEvent<HTMLSelectElement>,
                ) => {
                    queryDispatch({
                        action: queryAction.modifyQueryChains,
                        payload: {
                            index: sortChainLength,
                            logicalOperator: "and",
                            queryChainActions: "insert",
                            queryChainKind: "sort",
                            queryLink: [
                                sortField,
                                "equal to",
                                event.currentTarget.value as SortDirection,
                            ],
                        },
                    });
                },
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setSortDirection,
                value: sortDirection,
            }}
        />
    );

    return (
        <div className="query-sort">
            {sortFieldSelectInput}
            {sortDirectionSelectInput}
        </div>
    );
}

export { QuerySort };
