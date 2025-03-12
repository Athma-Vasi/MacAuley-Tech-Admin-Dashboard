import ErrorSuspenseHOC from "../../error/ErrorSuspenseHOC";
import DisplayResponsiveChart from "./DisplayResponsiveChart";

function DisplayResponsiveChartWrapper() {
    return ErrorSuspenseHOC(DisplayResponsiveChart)({});
}

export default DisplayResponsiveChartWrapper;
