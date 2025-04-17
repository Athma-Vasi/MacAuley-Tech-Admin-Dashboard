import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";
import Testing from "./Testing";

function TestingWrapper() {
    return ErrorSuspenseHOC(Testing)({});
}

export default TestingWrapper;
