import { useContext } from "react";

import { AuthContext } from "../context/authProvider";
import type { AuthDispatch, AuthState } from "../context/authProvider/types";

function useAuth(): {
  authState: AuthState;
  authDispatch: React.Dispatch<AuthDispatch>;
} {
  return useContext(AuthContext);
}

export { useAuth };
