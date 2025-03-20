import { lazy } from "react";
import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";

function LoginWrapper() {
    return ErrorSuspenseHOC(lazy(() => import("./Login")))({});
}

export default LoginWrapper;
