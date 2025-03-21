import { AccessibleTextInputAction, accessibleTextInputAction } from "./actions";
import { AccessibleTextInputDispatch, AccessibleTextInputState } from "./types";

function accessibleTextInputReducer(
  state: AccessibleTextInputState,
  dispatch: AccessibleTextInputDispatch
): AccessibleTextInputState {
  const reducer = accessibleTextInputReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const accessibleTextInputReducersMap = new Map<
  AccessibleTextInputAction[keyof AccessibleTextInputAction],
  (
    state: AccessibleTextInputState,
    dispatch: AccessibleTextInputDispatch
  ) => AccessibleTextInputState
>([
  [
    accessibleTextInputAction.setTextValueBuffer,
    accessibleTextInputReducer_setValueBuffer,
  ],
]);

function accessibleTextInputReducer_setValueBuffer(
  state: AccessibleTextInputState,
  dispatch: AccessibleTextInputDispatch
): AccessibleTextInputState {
  return {
    ...state,
    textValueBuffer: dispatch.payload as string,
  };
}

export { accessibleTextInputReducer, accessibleTextInputReducersMap };
