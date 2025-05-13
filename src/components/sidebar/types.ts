import { DecodedToken, HttpServerResponse, SafeBoxResult } from "../../types";
import { DashboardMetricsView } from "../dashboard/types";
import { SidebarAction } from "./actions";

type SidebarNavlinks =
    | Lowercase<DashboardMetricsView>
    | "directory"
    | "users"
    | "logout";

type SidebarState = {
    clickedNavlink: SidebarNavlinks;
    directoryFetchWorker: Worker | null;
    logoutFetchWorker: Worker | null;
    metricsFetchWorker: Worker | null;
    metricsView: Lowercase<DashboardMetricsView>;
};

type SidebarDispatch =
    | {
        action: SidebarAction["setClickedNavlink"];
        payload: SidebarNavlinks;
    }
    | {
        action: SidebarAction["setDirectoryFetchWorker"];
        payload: Worker;
    }
    | {
        action: SidebarAction["setLogoutFetchWorker"];
        payload: Worker;
    }
    | {
        action: SidebarAction["setMetricsFetchWorker"];
        payload: Worker;
    }
    | {
        action: SidebarAction["setMetricsView"];
        payload: Lowercase<DashboardMetricsView>;
    };

export type { SidebarDispatch, SidebarNavlinks, SidebarState };
