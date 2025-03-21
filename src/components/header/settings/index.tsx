import { lazy } from "react";
import ErrorSuspenseHOC from "../../error/ErrorSuspenseHOC";

function SettingsWrapper() {
  return ErrorSuspenseHOC(lazy(() => import("./Settings")))({});
}

export default SettingsWrapper;
