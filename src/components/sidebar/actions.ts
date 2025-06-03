import { Prettify } from "../../types";
import { SidebarState } from "./types";

type SidebarAction = Prettify<
    {
        [K in keyof SidebarState as `set${Capitalize<string & K>}`]:
            `set${Capitalize<string & K>}`;
    }
>;

const sidebarAction: SidebarAction = {
    setClickedNavlink: "setClickedNavlink",
    setDirectoryFetchWorker: "setDirectoryFetchWorker",
    setLogoutFetchWorker: "setLogoutFetchWorker",
    setMetricsCacheWorker: "setMetricsCacheWorker",
    setPrefetchAndCacheWorker: "setPrefetchAndCacheWorker",
};

export { sidebarAction };
export type { SidebarAction };
