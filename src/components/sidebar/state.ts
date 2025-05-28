import { SidebarState } from "./types";

const initialSidebarState: SidebarState = {
    clickedNavlink: "financials",
    directoryFetchWorker: null,
    logoutFetchWorker: null,
    metricsCacheWorker: null,
};

export { initialSidebarState };
