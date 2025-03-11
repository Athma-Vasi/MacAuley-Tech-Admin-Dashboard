import { createContext, useMemo, useReducer } from "react";

import { globalReducer } from "./reducers";
import { initialGlobalState } from "./state";
import type { GlobalDispatch, GlobalProviderProps, GlobalState } from "./types";

const GlobalContext = createContext<{
  globalState: GlobalState;
  globalDispatch: React.Dispatch<GlobalDispatch>;
}>({
  globalState: initialGlobalState,
  globalDispatch: () => null,
});

function GlobalProvider({ children }: GlobalProviderProps) {
  const [globalState, globalDispatch] = useReducer(
    globalReducer,
    initialGlobalState,
  );

  const globalContextValue = useMemo(
    () => ({
      globalState,
      globalDispatch,
    }),
    [globalState, globalDispatch],
  );

  return (
    <GlobalContext.Provider value={globalContextValue}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
