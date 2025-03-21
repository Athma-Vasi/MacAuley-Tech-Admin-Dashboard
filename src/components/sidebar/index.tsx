import { lazy } from "react";
import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";

function SidebarWrapper() {
  return ErrorSuspenseHOC(lazy(() => import("./Sidebar")))({});
}

export default SidebarWrapper;
