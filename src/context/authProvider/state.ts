import type { AuthState } from "./types";

const initialAuthState: AuthState = {
  accessToken: "",
  decodedToken: null,
  isLoggedIn: false,
  userDocument: null,
};

export { initialAuthState };
