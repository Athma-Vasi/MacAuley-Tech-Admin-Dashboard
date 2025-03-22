import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";
import Home from "./Home";

function HomeWrapper() {
    return ErrorSuspenseHOC(Home)({});
}

export default HomeWrapper;
