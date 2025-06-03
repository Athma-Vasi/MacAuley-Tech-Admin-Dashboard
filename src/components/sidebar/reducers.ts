import { parseSyncSafe } from "../../utils";
import { SidebarAction, sidebarAction } from "./actions";
import {
    setClickedNavlinkSidebarDispatchZod,
    setDirectoryFetchWorkerSidebarDispatchZod,
    setLogoutFetchWorkerSidebarDispatchZod,
    setMetricsCacheWorkerSidebarDispatchZod,
    setPrefetchAndCacheWorkerSidebarDispatchZod,
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
    [sidebarAction.setMetricsCacheWorker, sidebarReducer_setMetricsCacheWorker],
    [
        sidebarAction.setPrefetchAndCacheWorker,
        sidebarReducer_setPrefetchAndCacheWorker,
    ],
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

function sidebarReducer_setMetricsCacheWorker(
    state: SidebarState,
    dispatch: SidebarDispatch,
) {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setMetricsCacheWorkerSidebarDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        metricsCacheWorker: parsedResult.val.val.payload as Worker,
    };
}

function sidebarReducer_setPrefetchAndCacheWorker(
    state: SidebarState,
    dispatch: SidebarDispatch,
) {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setPrefetchAndCacheWorkerSidebarDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        prefetchAndCacheWorker: parsedResult.val.val.payload as Worker,
    };
}

export {
    sidebarReducer,
    sidebarReducer_setClickedNavlink,
    sidebarReducer_setDirectoryFetchWorker,
    sidebarReducer_setLogoutFetchWorker,
    sidebarReducer_setMetricsCacheWorker,
    sidebarReducer_setPrefetchAndCacheWorker,
};
