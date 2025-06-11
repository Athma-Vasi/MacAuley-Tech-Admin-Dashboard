import type React from "react";

import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import {
    AccessibleSelectInput,
} from "../accessibleInputs/AccessibleSelectInput";
import { QueryAction, queryAction } from "./actions";
import { LOGICAL_OPERATORS_DATA } from "./constants";
import { QueryDispatch } from "./schemas";
import {
    LogicalOperator,
    type QueryChains,
    type QueryState,
    type QueryTemplate,
} from "./types";
import {
    createDynamicInput,
    returnDefaultFilterValue,
    returnFilterSelectData,
} from "./utils";

type QueryFilterProps = {
    queryChains: QueryChains;
    queryDispatch: React.Dispatch<QueryDispatch>;
    queryState: QueryState;
    queryTemplates: Array<QueryTemplate>;
};

function QueryFilter(
    { queryChains, queryDispatch, queryState, queryTemplates }:
        QueryFilterProps,
) {
    const {
        filterField,
        filterComparisonOperator,
        filterLogicalOperator,
        filterValue,
        isError,
        projectionFields,
    } = queryState;

    const chainLength = Object.entries(queryChains.filter).reduce(
        (acc, [_key, value]) => {
            acc += value.length;
            return acc;
        },
        0,
    );

    const logicalOperatorSelectInput = (
        <AccessibleSelectInput<
            QueryAction["setFilterLogicalOperator"],
            LogicalOperator
        >
            attributes={{
                data: LOGICAL_OPERATORS_DATA,
                label: "Logical Operator",
                name: "filterLogicalOperator",
                onChange: (
                    event: React.ChangeEvent<HTMLSelectElement>,
                ) => {
                    queryDispatch({
                        action: queryAction.modifyQueryChains,
                        payload: {
                            index: chainLength,
                            logicalOperator: event.currentTarget
                                .value as LogicalOperator,
                            queryChainActions: "insert",
                            queryChainKind: "filter",
                            queryLink: [
                                filterField,
                                filterComparisonOperator,
                                filterValue,
                            ],
                        },
                    });
                },
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setFilterLogicalOperator,
                value: filterLogicalOperator,
            }}
        />
    );

    const { fieldSelectData, filterComparisonOperatorData } =
        returnFilterSelectData(filterField, queryTemplates, projectionFields);

    const fieldSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: fieldSelectData,
                disabled: fieldSelectData.length === 0,
                label: "Field",
                name: "filterField",
                onChange: (
                    event: React.ChangeEvent<HTMLSelectElement>,
                ) => {
                    queryDispatch({
                        action: queryAction.modifyQueryChains,
                        payload: {
                            index: chainLength,
                            logicalOperator: filterLogicalOperator,
                            queryChainActions: "insert",
                            queryChainKind: "filter",
                            queryLink: [
                                event.currentTarget.value,
                                filterComparisonOperator,
                                filterValue,
                            ],
                        },
                    });
                },
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setFilterField,
                value: filterField,
            }}
        />
    );

    const filterComparisonOperatorSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: filterComparisonOperatorData,
                disabled: filterComparisonOperatorData.length === 0,
                label: "Comparison Operator",
                name: "filterComparisonOperator",
                onChange: (
                    event: React.ChangeEvent<HTMLSelectElement>,
                ) => {
                    queryDispatch({
                        action: queryAction.modifyQueryChains,
                        payload: {
                            index: chainLength,
                            logicalOperator: filterLogicalOperator,
                            queryChainActions: "insert",
                            queryChainKind: "filter",
                            queryLink: [
                                filterField,
                                event.currentTarget.value,
                                filterValue,
                            ],
                        },
                    });
                },
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setFilterComparisonOperator,
                value: filterComparisonOperator,
            }}
        />
    );

    const dynamicInput = createDynamicInput({
        chainLength,
        filterComparisonOperator,
        filterField,
        filterLogicalOperator,
        filterValue,
        queryAction,
        queryDispatch,
        queryTemplates,
    });

    // to prevent stale closure
    useEffect(() => {
        queryDispatch({
            action: queryAction.setFilterComparisonOperator,
            payload: filterComparisonOperatorData[0]
                .value as typeof filterComparisonOperator,
        });

        queryDispatch({
            action: queryAction.setFilterValue,
            payload: returnDefaultFilterValue(filterField, queryTemplates),
        });
    }, [filterField]);

    // const addFilterLinkButton = (
    //     <AccessibleButton
    //         attributes={{
    //             dataTestId: "add-filter-link-button",
    //             disabledScreenreaderText: chainLength === MAX_LINKS_AMOUNT
    //                 ? "Max query links amount reached"
    //                 : isError
    //                 ? "Value cannot be invalid"
    //                 : "Value cannot be empty",
    //             disabled: isError ||
    //                 chainLength === MAX_LINKS_AMOUNT,
    //             enabledScreenreaderText: "Add filter link to chain",
    //             kind: "add",
    //             onClick: (
    //                 _event:
    //                     | React.MouseEvent<HTMLButtonElement, MouseEvent>
    //                     | React.PointerEvent<HTMLButtonElement>,
    //             ) => {
    //                 queryDispatch({
    //                     action: queryAction.modifyQueryChains,
    //                     payload: {
    //                         index: chainLength,
    //                         logicalOperator: filterLogicalOperator,
    //                         queryChainActions: "insert",
    //                         queryChainKind: "filter",
    //                         queryLink: [
    //                             filterField,
    //                             filterComparisonOperator,
    //                             filterValue,
    //                         ],
    //                     },
    //                 });
    //             },
    //         }}
    //     />
    // );

    return (
        <div className="query-filter">
            {logicalOperatorSelectInput}
            {fieldSelectInput}
            {filterComparisonOperatorSelectInput}
            {dynamicInput}
        </div>
    );
}

export { QueryFilter };
