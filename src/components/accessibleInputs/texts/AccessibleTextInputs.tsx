// import { Container, Group, Stack } from "@mantine/core";
// import { useReducer, FocusEvent, useEffect } from "react";

// import { TEXT_AREA_INPUT_VALIDATIONS } from "../../../constants/validations";
// import { StepperChild } from "../../../types";
// import { splitCamelCase } from "../../../utils";
// import { AccessibleButton } from "../AccessibleButton";
// import { AccessibleTextAreaInput } from "../AccessibleTextAreaInput";
// import { AccessibleTextInputsAction, accessibleTextInputsAction } from "./actions";
// import { INDEX_ALPHABET_TABLE, MAX_INPUTS_AMOUNT } from "./constants";
// import { accessibleTextInputsReducer } from "./reducers";
// import { initialAccessibleTextInputsState } from "./state";
// import { AccessibleTextInputsProps } from "./types";
// import { AccessibleTextAreaInput } from "../AccessibleTextAreaInput";

// function AccessibleTextInputs<
//   ValidValueAction extends string = string,
//   InvalidValueAction extends string = string,
//   AddStepperChildAction extends string = string
// >({
//   attributes,
// }: AccessibleTextInputsProps<
//   ValidValueAction,
//   InvalidValueAction,
//   AddStepperChildAction
// >) {
//   const {
//     addStepperChildAction,
//     disableds,
//     dynamicIndexes,
//     invalidValueAction,
//     maxInputsAmount = MAX_INPUTS_AMOUNT,
//     stepperPages,
//     validValueAction,
//     values,
//     onBlurs,
//     onClicks,
//     onFocuses,
//     page,
//     parentDispatch,
//     parentIndex,
//     parentDynamicDispatch,
//   } = attributes;

//   const name = splitCamelCase(attributes.name);
//   const labels =
//     attributes.labels ?? values.map((_, idx) => splitCamelCase(name) + ` ${idx + 1}`);

//   const [accessibleTextInputsState, accessibleTextInputsDispatch] = useReducer(
//     accessibleTextInputsReducer,
//     initialAccessibleTextInputsState
//   );

//   const { textValues, pagesInError } = accessibleTextInputsState;

//   const inputs = textValues.map((value, inputIndex) => {
//     const textAreaInput = (
//       <AccessibleTextAreaInput
//         attributes={{
//           dynamicIndexes: [...dynamicIndexes, inputIndex],
//           invalidValueAction: accessibleTextInputsAction.setPageInError,
//           name: `${name} ${INDEX_ALPHABET_TABLE[inputIndex] ?? inputIndex + 1}`,
//           onBlur: (_event: FocusEvent<HTMLTextAreaElement>) => {},
//           onChange: (event) => {},
//           parentDynamicDispatch: accessibleTextInputsDispatch,
//           stepperPages,
//           validValueAction: accessibleTextInputsAction.setInputValue,
//           value,
//         }}
//       />
//     );

//     const deleteInputButton = (
//       <AccessibleButton
//         attributes={{
//           enabledScreenreaderText: `Delete ${name} ${
//             INDEX_ALPHABET_TABLE[inputIndex] ?? inputIndex + 1
//           }`,
//           index: inputIndex,
//           kind: "delete",
//           setIconAsLabel: true,
//           onClick: (
//             _event:
//               | React.MouseEvent<HTMLButtonElement, MouseEvent>
//               | React.PointerEvent<HTMLButtonElement>
//           ) => {
//             accessibleTextInputsDispatch({
//               action: accessibleTextInputsAction.deleteInput,
//               payload: inputIndex,
//             });
//           },
//         }}
//       />
//     );

//     const insertInputButton = (
//       <AccessibleButton
//         attributes={{
//           disabled: inputIndex === maxInputsAmount - 1,
//           disabledScreenreaderText: "Max input amount reached",
//           enabledScreenreaderText: `Insert input before ${name} ${
//             INDEX_ALPHABET_TABLE[inputIndex] ?? inputIndex + 1
//           }`,
//           index: inputIndex,
//           kind: "insert",
//           setIconAsLabel: true,
//           onClick: (
//             _event:
//               | React.MouseEvent<HTMLButtonElement, MouseEvent>
//               | React.PointerEvent<HTMLButtonElement>
//           ) => {
//             accessibleTextInputsDispatch({
//               action: accessibleTextInputsAction.addInput,
//               payload: undefined,
//             });
//           },
//         }}
//       />
//     );

//     const slideInputUpButton = (
//       <AccessibleButton
//         attributes={{
//           disabled: inputIndex === 0,
//           disabledScreenreaderText: "Cannot move up. Already at the top",
//           enabledScreenreaderText: `Move ${name} ${
//             INDEX_ALPHABET_TABLE[inputIndex] ?? inputIndex + 1
//           } up`,
//           index: inputIndex,
//           kind: "up",
//           setIconAsLabel: true,
//           onClick: (
//             _event:
//               | React.MouseEvent<HTMLButtonElement, MouseEvent>
//               | React.PointerEvent<HTMLButtonElement>
//           ) => {
//             accessibleTextInputsDispatch({
//               action: accessibleTextInputsAction.slideInputUp,
//               payload: inputIndex,
//             });
//           },
//         }}
//       />
//     );

//     const slideInputDownButton = (
//       <AccessibleButton
//         attributes={{
//           disabled: inputIndex === textValues.length - 1,
//           disabledScreenreaderText: "Cannot move down. Already at the bottom",
//           enabledScreenreaderText: `Move ${name} ${
//             INDEX_ALPHABET_TABLE[inputIndex] ?? inputIndex + 1
//           } down`,
//           index: inputIndex,
//           kind: "down",
//           setIconAsLabel: true,
//           onClick: (
//             _event:
//               | React.MouseEvent<HTMLButtonElement, MouseEvent>
//               | React.PointerEvent<HTMLButtonElement>
//           ) => {
//             accessibleTextInputsDispatch({
//               action: accessibleTextInputsAction.slideInputDown,
//               payload: inputIndex,
//             });
//           },
//         }}
//       />
//     );

//     const buttons = (
//       <Group>
//         {deleteInputButton}
//         {insertInputButton}
//         {slideInputUpButton}
//         {slideInputDownButton}
//       </Group>
//     );

//     return (
//       <Stack key={`${labels}-${inputIndex}`}>
//         {textAreaInput}
//         {buttons}
//       </Stack>
//     );
//   });

//   console.group("AccessibleTextInputs");
//   console.log("values", values);
//   console.log("textValues", textValues);
//   console.log("stepperPages", stepperPages);
//   console.groupEnd();

//   const addInputButton = (
//     <AccessibleButton
//       attributes={{
//         disabled: textValues.length === maxInputsAmount,
//         disabledScreenreaderText: "Max inputs amount reached",
//         enabledScreenreaderText: `Add new ${name}: ${values.length + 1}`,
//         kind: "add",
//         onClick: (
//           _event:
//             | React.MouseEvent<HTMLButtonElement, MouseEvent>
//             | React.PointerEvent<HTMLButtonElement>
//         ) => {
//           accessibleTextInputsDispatch({
//             action: accessibleTextInputsAction.addInput,
//             payload: void 0,
//           });

//           // required for popover validation linking to stepper component
//           const stepperChilds = textValues.map((_, inputIndex) => {
//             return {
//               inputType: "text",
//               name: `${name} ${INDEX_ALPHABET_TABLE[inputIndex] ?? inputIndex + 1}`,
//               validations: TEXT_AREA_INPUT_VALIDATIONS,
//             } as StepperChild;
//           });

//           console.group("AccessibleTextInputs addInputButton onClick");
//           console.log("stepperChilds", stepperChilds);
//           console.groupEnd();

//           parentIndex === undefined
//             ? parentDispatch?.({
//                 action: addStepperChildAction,
//                 payload: stepperChilds,
//               })
//             : parentDynamicDispatch?.({
//                 action: addStepperChildAction,
//                 payload: {
//                   parentIndex: parentIndex,
//                   value: stepperChilds,
//                 },
//               });
//         },
//       }}
//     />
//   );

//   return (
//     <Container w={700}>
//       {addInputButton} {inputs}
//     </Container>
//   );
// }

// export { AccessibleTextInputs };
export {};
