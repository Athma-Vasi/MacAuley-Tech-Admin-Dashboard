import { parseSafeSync } from "../../utils";
import { DashboardMetricsView } from "../dashboard/types";
import { SidebarAction, sidebarAction } from "./actions";
import {
    setClickedNavlinkSidebarDispatchZod,
    setDirectoryFetchWorkerSidebarDispatchZod,
    setMetricsFetchWorkerSidebarDispatchZod,
    setMetricsViewSidebarDispatchZod,
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
    [sidebarAction.setMetricsFetchWorker, sidebarReducer_setMetricsFetchWorker],
    [sidebarAction.setMetricsView, sidebarReducer_setMetricsView],
]);

function sidebarReducer_setClickedNavlink(
    state: SidebarState,
    dispatch: SidebarDispatch,
) {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setClickedNavlinkSidebarDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        clickedNavlink: parsedResult.safeUnwrap().data
            ?.payload as SidebarNavlinks,
    };
}

function sidebarReducer_setDirectoryFetchWorker(
    state: SidebarState,
    dispatch: SidebarDispatch,
) {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setDirectoryFetchWorkerSidebarDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        directoryFetchWorker: parsedResult.safeUnwrap().data?.payload as Worker,
    };
}

function sidebarReducer_setMetricsFetchWorker(
    state: SidebarState,
    dispatch: SidebarDispatch,
) {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setMetricsFetchWorkerSidebarDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        metricsFetchWorker: parsedResult.safeUnwrap().data?.payload as Worker,
    };
}

function sidebarReducer_setMetricsView(
    state: SidebarState,
    dispatch: SidebarDispatch,
) {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setMetricsViewSidebarDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        metricsView: parsedResult.safeUnwrap().data?.payload as Lowercase<
            DashboardMetricsView
        >,
    };
}

export { sidebarReducer };
