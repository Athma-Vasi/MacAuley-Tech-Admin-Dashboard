import { Group, Modal, Stack } from "@mantine/core";
import type React from "react";

import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import {
    AccessibleSelectInput,
} from "../accessibleInputs/AccessibleSelectInput";
import { queryAction } from "./actions";
import { LOGICAL_OPERATORS_DATA, MAX_LINKS_AMOUNT } from "./constants";
import {
    type QueryChains,
    type QueryDispatch,
    type QueryState,
    type QueryTemplate,
} from "./types";
import {
    createDynamicInput,
    FILTER_HELP_MODAL_CONTENT,
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
    } = queryState;

    const [
        openedFilterHelpModal,
        { open: openFilterHelpModal, close: closeFilterHelpModal },
    ] = useDisclosure(false);

    const chainLength = Object.entries(queryChains.filter).reduce(
        (acc, [_key, value]) => {
            acc += value.length;
            return acc;
        },
        0,
    );

    const logicalOperatorSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: LOGICAL_OPERATORS_DATA,
                label: "Logical Operator",
                name: "filterLogicalOperator",
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setFilterLogicalOperator,
                value: filterLogicalOperator,
            }}
        />
    );

    const { fieldSelectData, filterComparisonOperatorData } =
        returnFilterSelectData(filterField, queryTemplates);

    const fieldSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: fieldSelectData,
                disabled: fieldSelectData.length === 0,
                label: "Field",
                name: "filterField",
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
                parentDispatch: queryDispatch as any,
                validValueAction: queryAction.setFilterComparisonOperator,
                value: filterComparisonOperator,
            }}
        />
    );

    const dynamicInput = createDynamicInput({
        filterValue,
        queryAction,
        queryDispatch,
        filterField,
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

    const addFilterLinkButton = (
        <AccessibleButton
            attributes={{
                enabledScreenreaderText: "Add filter link to chain",
                disabledScreenreaderText: chainLength === MAX_LINKS_AMOUNT
                    ? "Max query links amount reached"
                    : isError
                    ? "Value cannot be invalid"
                    : "Value cannot be empty",
                disabled: isError ||
                    chainLength === MAX_LINKS_AMOUNT,
                kind: "add",
                onClick: (
                    _event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
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
                                filterComparisonOperator,
                                filterValue,
                            ],
                        },
                    });
                },
            }}
        />
    );

    const filterHelpButton = (
        <AccessibleButton
            attributes={{
                enabledScreenreaderText: "Open filter help modal",
                disabledScreenreaderText: "Filter help modal is already open",
                disabled: openedFilterHelpModal,
                kind: "help",
                onClick: (
                    _event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
                ) => {
                    openFilterHelpModal();
                },
            }}
        />
    );

    const filterHelpModal = (
        <Modal
            opened={openedFilterHelpModal}
            onClose={closeFilterHelpModal}
            title="Filter Query guide"
        >
            {FILTER_HELP_MODAL_CONTENT}
        </Modal>
    );

    return (
        <Stack>
            {logicalOperatorSelectInput}
            {fieldSelectInput}
            {filterComparisonOperatorSelectInput}
            {dynamicInput}
            <Group>
                {filterHelpButton}
                {addFilterLinkButton}
                {filterHelpModal}
            </Group>
        </Stack>
    );
}

// function createDynamicValueInput<ValidValueAction extends string = string>({
//     disabled,
//     filterField,
//     filterValue,
//     inputsValidationsMap,
//     queryDispatch,
//     setFilterInputValuesDispatchData,
// }: {
//     disabled: boolean;
//     filterField: string;
//     filterValue: string;
//     inputsValidationsMap: InputsValidationsMap;
//     queryDispatch: React.Dispatch<QueryDispatch>;
//     setFilterInputValuesDispatchData: SetFilterInputValuesDispatchData<
//         ValidValueAction
//     >;
// }) {
//     const { fieldNamesOperatorsTypesMap, selectInputsDataMap } =
//         setFilterInputValuesDispatchData;
//     const operatorTypes = fieldNamesOperatorsTypesMap.get(filterField);

//     if (operatorTypes === undefined) {
//         return null;
//     }

//     const { inputType } = operatorTypes;
//     const name = `${splitCamelCase(filterField)} Value`;

//     if (inputType === "boolean") {
//         return (
//             <AccessibleSelectInput
//                 attributes={{
//                     data: BOOLEAN_VALUES_DATA,
//                     disabled,
//                     name,
//                     queryDispatch,
//                     validValueAction: queryAction.setFilterValue,
//                     value: filterValue,
//                 }}
//             />
//         );
//     }

//     if (inputType === "select") {
//         return (
//             <AccessibleSelectInput
//                 attributes={{
//                     data: selectInputsDataMap.get(filterField) ?? [],
//                     disabled,
//                     name,
//                     queryDispatch,
//                     validValueAction: queryAction.setFilterValue,
//                     value: filterValue,
//                 }}
//             />
//         );
//     }

//     const validationObject = inputsValidationsMap.get(filterField);
//     if (validationObject === undefined) {
//         return null;
//     }

//     const { validation, validationKey } = validationObject;
//     const stepperPages: StepperPage[] = [
//         {
//             children: [
//                 {
//                     inputType,
//                     name,
//                     validationKey,
//                 },
//             ],
//             description: "",
//         },
//     ];

//     const validationFunctionsTable: ValidationFunctionsTable = {
//         ...VALIDATION_FUNCTIONS_TABLE,
//         filterValue: validation,
//     };

//     switch (inputType) {
//         case "date": {
//             return (
//                 <AccessibleDateTimeInput
//                     attributes={{
//                         dateKind: "full date",
//                         disabled,
//                         inputKind: "date",
//                         invalidValueAction: queryAction.setIsError,
//                         name,
//                         queryDispatch,
//                         stepperPages,
//                         validationFunctionsTable,
//                         validValueAction: queryAction.setFilterValue,
//                         value: filterValue,
//                     }}
//                 />
//             );
//         }

//         case "number": {
//             return (
//                 <AccessibleTextInput
//                     attributes={{
//                         disabled,
//                         invalidValueAction: queryAction.setIsError,
//                         name,
//                         queryDispatch,
//                         stepperPages,
//                         validValueAction: queryAction.setFilterValue,
//                         value: filterValue,
//                     }}
//                 />
//             );
//         }

//         case "time": {
//             return (
//                 <AccessibleDateTimeInput
//                     attributes={{
//                         disabled,
//                         inputKind: "time",
//                         invalidValueAction: queryAction.setIsError,
//                         name,
//                         queryDispatch,
//                         stepperPages,
//                         validationFunctionsTable,
//                         validValueAction: queryAction.setFilterValue,
//                         value: filterValue,
//                     }}
//                 />
//             );
//         }

//         case "text": {
//             return (
//                 <AccessibleTextAreaInput
//                     attributes={{
//                         disabled,
//                         invalidValueAction: queryAction.setIsError,
//                         name: `${splitCamelCase(filterField)} Value`,
//                         queryDispatch,
//                         required: false,
//                         stepperPages,
//                         validValueAction: queryAction.setFilterValue,
//                         value: filterValue,
//                     }}
//                 />
//             );
//         }

//         default:
//             return null;
//     }
// }

export { QueryFilter };
