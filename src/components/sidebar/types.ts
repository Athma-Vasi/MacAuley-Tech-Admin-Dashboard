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
    metricsCacheWorker: Worker | null;
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
        action: SidebarAction["setMetricsCacheWorker"];
        payload: Worker;
    };

export type { SidebarDispatch, SidebarNavlinks, SidebarState };
