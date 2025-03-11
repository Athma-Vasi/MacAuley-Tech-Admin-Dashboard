import { SetPageInErrorPayload } from "../../../types";
import { AccessibleTextInputsAction, accessibleTextInputsAction } from "./actions";
import { AccessibleTextInputsDispatch, AccessibleTextInputsState } from "./types";

function accessibleTextInputsReducer(
  state: AccessibleTextInputsState,
  dispatch: AccessibleTextInputsDispatch
): AccessibleTextInputsState {
  const reducer = accessibleTextInputsReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const accessibleTextInputsReducers = new Map<
  AccessibleTextInputsAction[keyof AccessibleTextInputsAction],
  (
    state: AccessibleTextInputsState,
    dispatch: AccessibleTextInputsDispatch
  ) => AccessibleTextInputsState
>([
  [accessibleTextInputsAction.addInput, accessibleTextInputsReducer_addInput],
  [accessibleTextInputsAction.deleteInput, accessibleTextInputsReducer_deleteInput],
  [accessibleTextInputsAction.insertInput, accessibleTextInputsReducer_insertInput],
  [accessibleTextInputsAction.setInputValue, accessibleTextInputsReducer_setInputValue],
  [accessibleTextInputsAction.setPageInError, accessibleTextInputsReducer_setPageInError],
  [accessibleTextInputsAction.slideInputUp, accessibleTextInputsReducer_slideInputUp],
  [accessibleTextInputsAction.slideInputDown, accessibleTextInputsReducer_slideInputDown],
]);

function accessibleTextInputsReducer_addInput(
  state: AccessibleTextInputsState,
  _dispatch: AccessibleTextInputsDispatch
): AccessibleTextInputsState {
  return {
    ...state,
    textValues: [...state.textValues, ""],
  };
}

function accessibleTextInputsReducer_deleteInput(
  state: AccessibleTextInputsState,
  dispatch: AccessibleTextInputsDispatch
): AccessibleTextInputsState {
  const index = dispatch.payload as number;
  const clonedState = structuredClone(state);
  clonedState.textValues.splice(index, 1);

  return clonedState;
}

function accessibleTextInputsReducer_insertInput(
  state: AccessibleTextInputsState,
  dispatch: AccessibleTextInputsDispatch
): AccessibleTextInputsState {
  const index = dispatch.payload as number;
  const clonedState = structuredClone(state);
  const left = clonedState.textValues.slice(0, index);
  const right = clonedState.textValues.slice(index);
  clonedState.textValues = [...left, "", ...right];

  return clonedState;
}

function accessibleTextInputsReducer_setInputValue(
  state: AccessibleTextInputsState,
  dispatch: AccessibleTextInputsDispatch
): AccessibleTextInputsState {
  // const { index, value } = dispatch.payload as { dynamicIndexes: number[]; value: string };
  // const clonedState = structuredClone(state);
  // clonedState.textValues[index] = value;

  // return clonedState;
  return state;
}

function accessibleTextInputsReducer_setPageInError(
  state: AccessibleTextInputsState,
  dispatch: AccessibleTextInputsDispatch
): AccessibleTextInputsState {
  const { kind, page } = dispatch.payload as SetPageInErrorPayload;
  const pagesInError = new Set(state.pagesInError);
  kind === "add" ? pagesInError.add(page) : pagesInError.delete(page);

  return {
    ...state,
    pagesInError,
  };
}

function accessibleTextInputsReducer_slideInputUp(
  state: AccessibleTextInputsState,
  dispatch: AccessibleTextInputsDispatch
): AccessibleTextInputsState {
  const index = dispatch.payload as number;
  const clonedState = structuredClone(state);
  const [removed] = clonedState.textValues.splice(index, 1);
  clonedState.textValues.splice(index - 1, 0, removed);

  return clonedState;
}

function accessibleTextInputsReducer_slideInputDown(
  state: AccessibleTextInputsState,
  dispatch: AccessibleTextInputsDispatch
): AccessibleTextInputsState {
  const index = dispatch.payload as number;
  const clonedState = structuredClone(state);
  const [removed] = clonedState.textValues.splice(index, 1);
  clonedState.textValues.splice(index + 1, 0, removed);

  return clonedState;
}

export { accessibleTextInputsReducer };
