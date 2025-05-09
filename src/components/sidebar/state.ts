import { SidebarState } from "./types";

const initialSidebarState: SidebarState = {
    clickedNavlink: "financials",
    directoryFetchWorker: null,
    logoutFetchWorker: null,
    metricsFetchWorker: null,
    metricsView: "financials",
};

export { initialSidebarState };
