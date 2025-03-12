import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";
import Dashboard from "./Dashboard";

function DashboardWrapper() {
    return ErrorSuspenseHOC(Dashboard)({});
}

export default DashboardWrapper;
