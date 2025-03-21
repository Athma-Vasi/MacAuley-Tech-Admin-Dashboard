import { lazy } from "react";
import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";

function HomeWrapper() {
    return ErrorSuspenseHOC(lazy(() => import("./Home")))({});
}

export default HomeWrapper;
