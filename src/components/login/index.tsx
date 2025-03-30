import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";
import Login from "./Login";

function LoginWrapper() {
    return ErrorSuspenseHOC(Login)({});
}

export default LoginWrapper;
