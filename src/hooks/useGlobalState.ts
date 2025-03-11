import { useContext } from "react";

import { GlobalContext } from "../context/globalProvider/GlobalProvider";
import type {
  GlobalDispatch,
  GlobalState,
} from "../context/globalProvider/types";

function useGlobalState(): {
  globalState: GlobalState;
  globalDispatch: React.Dispatch<GlobalDispatch>;
} {
  return useContext(GlobalContext);
}

export { useGlobalState };
