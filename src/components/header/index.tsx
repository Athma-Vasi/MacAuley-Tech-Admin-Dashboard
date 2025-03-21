import { lazy } from "react";
import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";

function HeaderWrapper() {
  return ErrorSuspenseHOC(lazy(() => import("./Header")))({});
}

export default HeaderWrapper;
