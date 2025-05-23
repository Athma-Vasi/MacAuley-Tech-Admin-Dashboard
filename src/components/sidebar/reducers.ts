import { parseSyncSafe } from "../../utils";
import { SidebarAction, sidebarAction } from "./actions";
import {
    setClickedNavlinkSidebarDispatchZod,
    setDirectoryFetchWorkerSidebarDispatchZod,
    setLogoutFetchWorkerSidebarDispatchZod,
    setMetricsFetchWorkerSidebarDispatchZod,
} from "./schemas";
import { SidebarDispatch, SidebarNavlinks, SidebarState } from "./types";

function sidebarReducer(state: SidebarState, dispatch: SidebarDispatch) {
    const reducer = reducersMap.get(dispatch.action);
    return reducer ? reducer(state, dispatch) : state;
}

const reducersMap = new Map<
    SidebarAction[keyof SidebarAction],
    (state: SidebarState, dispatch: SidebarDispatch) => SidebarState
>([
    [sidebarAction.setClickedNavlink, sidebarReducer_setClickedNavlink],
    [
        sidebarAction.setDirectoryFetchWorker,
        sidebarReducer_setDirectoryFetchWorker,
    ],
    [sidebarAction.setLogoutFetchWorker, sidebarReducer_setLogoutFetchWorker],
    [sidebarAction.setMetricsFetchWorker, sidebarReducer_setMetricsFetchWorker],
]);

function sidebarReducer_setClickedNavlink(
    state: SidebarState,
    dispatch: SidebarDispatch,
) {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setClickedNavlinkSidebarDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        clickedNavlink: parsedResult.val.val
            .payload as SidebarNavlinks,
    };
}

function sidebarReducer_setDirectoryFetchWorker(
    state: SidebarState,
    dispatch: SidebarDispatch,
) {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setDirectoryFetchWorkerSidebarDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        directoryFetchWorker: parsedResult.val.val.payload as Worker,
    };
}

function sidebarReducer_setLogoutFetchWorker(
    state: SidebarState,
    dispatch: SidebarDispatch,
) {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setLogoutFetchWorkerSidebarDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        logoutFetchWorker: parsedResult.val.val.payload as Worker,
    };
}

function sidebarReducer_setMetricsFetchWorker(
    state: SidebarState,
    dispatch: SidebarDispatch,
) {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setMetricsFetchWorkerSidebarDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        metricsFetchWorker: parsedResult.val.val.payload as Worker,
    };
}

export {
    sidebarReducer,
    sidebarReducer_setClickedNavlink,
    sidebarReducer_setDirectoryFetchWorker,
    sidebarReducer_setLogoutFetchWorker,
    sidebarReducer_setMetricsFetchWorker,
};
