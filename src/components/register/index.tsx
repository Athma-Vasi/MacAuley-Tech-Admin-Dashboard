import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";
import Register from "./Register";

function RegisterWrapper() {
    return ErrorSuspenseHOC(Register)({});
}

export default RegisterWrapper;
