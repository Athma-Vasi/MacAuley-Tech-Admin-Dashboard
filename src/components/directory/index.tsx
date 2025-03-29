import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";
import Directory from "./Directory";

function DirectoryWrapper() {
    return ErrorSuspenseHOC(Directory)({});
}

export default DirectoryWrapper;
