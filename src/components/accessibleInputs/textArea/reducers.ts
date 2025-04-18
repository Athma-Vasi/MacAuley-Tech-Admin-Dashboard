import {
  AccessibleTextAreaInputAction,
  accessibleTextAreaInputAction,
} from "./actions";
import {
  AccessibleTextAreaInputDispatch,
  AccessibleTextAreaInputState,
} from "./types";

function accessibleTextAreaInputReducer(
  state: AccessibleTextAreaInputState,
  dispatch: AccessibleTextAreaInputDispatch,
): AccessibleTextAreaInputState {
  const reducer = accessibleTextAreaInputReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const accessibleTextAreaInputReducersMap = new Map<
  AccessibleTextAreaInputAction[keyof AccessibleTextAreaInputAction],
  (
    state: AccessibleTextAreaInputState,
    dispatch: AccessibleTextAreaInputDispatch,
  ) => AccessibleTextAreaInputState
>([
  [
    accessibleTextAreaInputAction.setTextValueBuffer,
    accessibleTextAreaInputReducer_setValueBuffer,
  ],
]);

function accessibleTextAreaInputReducer_setValueBuffer(
  state: AccessibleTextAreaInputState,
  dispatch: AccessibleTextAreaInputDispatch,
): AccessibleTextAreaInputState {
  return {
    ...state,
    textValueBuffer: dispatch.payload as string,
  };
}

export { accessibleTextAreaInputReducer, accessibleTextAreaInputReducersMap };
