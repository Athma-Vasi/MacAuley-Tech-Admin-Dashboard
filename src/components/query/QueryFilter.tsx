import { Group, Modal, Stack } from "@mantine/core";
import type React from "react";

import { useDisclosure } from "@mantine/hooks";
import {
    CheckboxRadioSelectData,
    SetStepInErrorPayload,
    ValidationFunctionsTable,
} from "../../types";
import { splitCamelCase } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE } from "../../validations";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleDateTimeInput } from "../accessibleInputs/AccessibleDateTimeInput";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import { AccessibleTextAreaInput } from "../accessibleInputs/textArea/AccessibleTextAreaInput";
import { queryAction } from "./actions";
import {
    BOOLEAN_VALUES_DATA,
    LOGICAL_OPERATORS_DATA,
    MAX_LINKS_AMOUNT,
} from "./constants";
import type {
    ModifyQueryChainsDispatch,
    QueryDispatch,
    QueryState,
} from "./types";
import {
    FILTER_HELP_MODAL_CONTENT,
    type InputsValidationsMap,
    type OperatorsInputType,
    removeProjectionExclusionFields,
} from "./utils";

type QueryFilterProps = {
    queryDispatch: React.Dispatch<QueryDispatch>;
    queryState: QueryState;
};

function QueryFilter({
    queryDispatch,
    queryState,
}: QueryFilterProps) {
    const {
        filterField,
        filterComparisonOperator,
        filterLogicalOperator,
        filterValue,
        isError,
        projectionExclusionFields,
        queryChains,
    } = queryState;

    const [
        openedFilterHelpModal,
        { open: openFilterHelpModal, close: closeFilterHelpModal },
    ] = useDisclosure(false);

    const chainLength = Array.from(queryChains.filter).reduce(
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

    // const data = removeProjectionExclusionFields(projectionExclusionFields, [
    //     ...filterFieldSelectInputData,
    //     ...searchFieldSelectInputData,
    // ]);
    // const disabled = data.length === 0;
    // const setFilterInputValuesDispatchData: SetFilterInputValuesDispatchData<
    //     ValidValueAction
    // > = {
    //     fieldNamesOperatorsTypesMap,
    //     searchFieldSelectInputData,
    //     setFilterInputValuesDispatch,
    //     selectInputsDataMap,
    // };

    // const fieldSelectInput = (
    //     <AccessibleSelectInput
    //         attributes={{
    //             data,
    //             disabled,
    //             label: "Field",
    //             name: "filterField",
    //             validValueAction: queryAction
    //                 .setFilterField ,
    //             value: filterField,
    //         }}
    //     />
    // );

    // const filterComparisonOperatorSelectInput = (
    //     <AccessibleSelectInput
    //         attributes={{
    //             data: fieldNamesOperatorsTypesMap.get(filterField)?.operators ??
    //                 [],
    //             disabled: disabled,
    //             label: "Comparison Operator",
    //             name: "filterComparisonOperator",
    //             queryDispatch,
    //             validValueAction: queryAction.setFilterComparisonOperator,
    //             value: filterComparisonOperator,
    //         }}
    //     />
    // );

    // const dynamicValueInput = createDynamicValueInput({
    //     disabled,
    //     filterField,
    //     filterValue,
    //     inputsValidationsMap,
    //     queryDispatch,
    //     setFilterInputValuesDispatchData,
    // });

    const addFilterLinkButton = (
        <AccessibleButton
            attributes={{
                enabledScreenreaderText: "Add filter link to chain",
                disabledScreenreaderText: chainLength === MAX_LINKS_AMOUNT
                    ? "Max query links amount reached"
                    : isError
                    ? "Value cannot be invalid"
                    : "Value cannot be empty",
                // disabled: disabled || isError ||
                //     chainLength === MAX_LINKS_AMOUNT,
                kind: "add",
                onClick: (
                    _event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
                ) => {
                    // modifyQueryChainsDispatch({
                    //     action: queryAction.modifyQueryChains,
                    //     payload: {
                    //         index: chainLength,
                    //         logicalOperator: filterLogicalOperator,
                    //         queryChainActions: "insert",
                    //         queryChainKind: "filter",
                    //         queryLink: [
                    //             filterField,
                    //             filterComparisonOperator,
                    //             filterValue,
                    //         ],
                    //     },
                    // });
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
            {/* {fieldSelectInput} */}
            {
                /* {searchFieldSelectInputData.map(({ value }) => value).includes(
                    filterField,
                )
                ? null
                : filterComparisonOperatorSelectInput} */
            }
            {/* {dynamicValueInput} */}
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
