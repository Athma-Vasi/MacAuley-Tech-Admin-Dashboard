import { lazy } from "react";
import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";

function DashboardWrapper() {
  return ErrorSuspenseHOC(lazy(() => import("./Dashboard")))({});
}

export default DashboardWrapper;
