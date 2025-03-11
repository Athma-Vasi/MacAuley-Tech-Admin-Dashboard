import type { TitleOrder } from "@mantine/core";
import type {
    ScreenshotImageType,
    SetPageInErrorPayload,
} from "../../../types";
import type {
    NivoChartTitlePosition,
    NivoColorScheme,
    NivoLegendAnchor,
    NivoLegendDirection,
    NivoLegendItemDirection,
    NivoLegendSymbolShape,
    NivoMotionConfig,
    NivoTransitionMode,
} from "../types";
import {
    type ResponsiveRadialBarChartAction,
    responsiveRadialBarChartAction,
} from "./actions";
import { initialResponsiveRadialBarChartState } from "./state";
import type {
    ResponsiveRadialBarChartDispatch,
    ResponsiveRadialBarChartState,
} from "./types";

function responsiveRadialBarChartReducer(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    const reducer = responsiveRadialBarChartReducersMap.get(dispatch.action);
    return reducer ? reducer(state, dispatch) : state;
}

const responsiveRadialBarChartReducersMap = new Map<
    ResponsiveRadialBarChartAction[keyof ResponsiveRadialBarChartAction],
    (
        state: ResponsiveRadialBarChartState,
        dispatch: ResponsiveRadialBarChartDispatch,
    ) => ResponsiveRadialBarChartState
>([
    // base
    // base -> margin
    [
        responsiveRadialBarChartAction.setMarginTop,
        responsiveRadialBarChartReducer_setMarginTop,
    ],
    [
        responsiveRadialBarChartAction.setMarginRight,
        responsiveRadialBarChartReducer_setMarginRight,
    ],
    [
        responsiveRadialBarChartAction.setMarginBottom,
        responsiveRadialBarChartReducer_setMarginBottom,
    ],
    [
        responsiveRadialBarChartAction.setMarginLeft,
        responsiveRadialBarChartReducer_setMarginLeft,
    ],
    // base -> angles
    [
        responsiveRadialBarChartAction.setStartAngle,
        responsiveRadialBarChartReducer_setStartAngle,
    ],
    [
        responsiveRadialBarChartAction.setEndAngle,
        responsiveRadialBarChartReducer_setEndAngle,
    ],
    [
        responsiveRadialBarChartAction.setInnerRadius,
        responsiveRadialBarChartReducer_setInnerRadius,
    ],
    [
        responsiveRadialBarChartAction.setPaddingRing,
        responsiveRadialBarChartReducer_setPaddingRing,
    ],
    [
        responsiveRadialBarChartAction.setPadAngle,
        responsiveRadialBarChartReducer_setPadAngle,
    ],
    [
        responsiveRadialBarChartAction.setCornerRadius,
        responsiveRadialBarChartReducer_setCornerRadius,
    ],
    // style
    [
        responsiveRadialBarChartAction.setChartColors,
        responsiveRadialBarChartReducer_setChartColors,
    ],
    [
        responsiveRadialBarChartAction.setRingBorderWidth,
        responsiveRadialBarChartReducer_setRingBorderWidth,
    ],

    // tracks
    [
        responsiveRadialBarChartAction.setEnableTracks,
        responsiveRadialBarChartReducer_setEnableTracks,
    ],
    [
        responsiveRadialBarChartAction.setTracksColor,
        responsiveRadialBarChartReducer_setTracksColor,
    ],

    // grids
    [
        responsiveRadialBarChartAction.setEnableRadialGrid,
        responsiveRadialBarChartReducer_setEnableRadialGrid,
    ],
    [
        responsiveRadialBarChartAction.setEnableCircularGrid,
        responsiveRadialBarChartReducer_setEnableCircularGrid,
    ],

    // axes
    // radial axis start
    [
        responsiveRadialBarChartAction.setEnableRadialAxisStart,
        responsiveRadialBarChartReducer_setEnableRadialAxisStart,
    ],
    [
        responsiveRadialBarChartAction.setRadialAxisStartTickSize,
        responsiveRadialBarChartReducer_setRadialAxisStartTickSize,
    ],
    [
        responsiveRadialBarChartAction.setRadialAxisStartTickPadding,
        responsiveRadialBarChartReducer_setRadialAxisStartTickPadding,
    ],
    [
        responsiveRadialBarChartAction.setRadialAxisStartTickRotation,
        responsiveRadialBarChartReducer_setRadialAxisStartTickRotation,
    ],

    // radial axis end
    [
        responsiveRadialBarChartAction.setEnableRadialAxisEnd,
        responsiveRadialBarChartReducer_setEnableRadialAxisEnd,
    ],
    [
        responsiveRadialBarChartAction.setRadialAxisEndTickSize,
        responsiveRadialBarChartReducer_setRadialAxisEndTickSize,
    ],
    [
        responsiveRadialBarChartAction.setRadialAxisEndTickPadding,
        responsiveRadialBarChartReducer_setRadialAxisEndTickPadding,
    ],
    [
        responsiveRadialBarChartAction.setRadialAxisEndTickRotation,
        responsiveRadialBarChartReducer_setRadialAxisEndTickRotation,
    ],

    // circular axis inner
    [
        responsiveRadialBarChartAction.setEnableCircularAxisInner,
        responsiveRadialBarChartReducer_setEnableCircularAxisInner,
    ],
    [
        responsiveRadialBarChartAction.setCircularAxisInnerTickSize,
        responsiveRadialBarChartReducer_setCircularAxisInnerTickSize,
    ],
    [
        responsiveRadialBarChartAction.setCircularAxisInnerTickPadding,
        responsiveRadialBarChartReducer_setCircularAxisInnerTickPadding,
    ],
    [
        responsiveRadialBarChartAction.setCircularAxisInnerTickRotation,
        responsiveRadialBarChartReducer_setCircularAxisInnerTickRotation,
    ],

    // circular axis outer
    [
        responsiveRadialBarChartAction.setEnableCircularAxisOuter,
        responsiveRadialBarChartReducer_setEnableCircularAxisOuter,
    ],
    [
        responsiveRadialBarChartAction.setCircularAxisOuterTickSize,
        responsiveRadialBarChartReducer_setCircularAxisOuterTickSize,
    ],
    [
        responsiveRadialBarChartAction.setCircularAxisOuterTickPadding,
        responsiveRadialBarChartReducer_setCircularAxisOuterTickPadding,
    ],
    [
        responsiveRadialBarChartAction.setCircularAxisOuterTickRotation,
        responsiveRadialBarChartReducer_setCircularAxisOuterTickRotation,
    ],

    // labels
    [
        responsiveRadialBarChartAction.setEnableLabels,
        responsiveRadialBarChartReducer_setEnableLabels,
    ],
    [
        responsiveRadialBarChartAction.setLabelsSkipAngle,
        responsiveRadialBarChartReducer_setLabelsSkipAngle,
    ],
    [
        responsiveRadialBarChartAction.setLabelsRadiusOffset,
        responsiveRadialBarChartReducer_setLabelsRadiusOffset,
    ],
    [
        responsiveRadialBarChartAction.setLabelsTextColor,
        responsiveRadialBarChartReducer_setLabelsTextColor,
    ],

    // legend
    [
        responsiveRadialBarChartAction.setEnableLegend,
        responsiveRadialBarChartReducer_setEnableLegend,
    ],
    [
        responsiveRadialBarChartAction.setEnableLegendJustify,
        responsiveRadialBarChartReducer_setEnableLegendJustify,
    ],
    [
        responsiveRadialBarChartAction.setLegendAnchor,
        responsiveRadialBarChartReducer_setLegendAnchor,
    ],
    [
        responsiveRadialBarChartAction.setLegendDirection,
        responsiveRadialBarChartReducer_setLegendDirection,
    ],
    [
        responsiveRadialBarChartAction.setLegendItemBackground,
        responsiveRadialBarChartReducer_setLegendItemBackground,
    ],
    [
        responsiveRadialBarChartAction.setLegendItemDirection,
        responsiveRadialBarChartReducer_setLegendItemDirection,
    ],
    [
        responsiveRadialBarChartAction.setLegendItemHeight,
        responsiveRadialBarChartReducer_setLegendItemHeight,
    ],
    [
        responsiveRadialBarChartAction.setLegendItemOpacity,
        responsiveRadialBarChartReducer_setLegendItemOpacity,
    ],
    [
        responsiveRadialBarChartAction.setLegendItemTextColor,
        responsiveRadialBarChartReducer_setLegendItemTextColor,
    ],
    [
        responsiveRadialBarChartAction.setLegendItemWidth,
        responsiveRadialBarChartReducer_setLegendItemWidth,
    ],
    [
        responsiveRadialBarChartAction.setLegendItemsSpacing,
        responsiveRadialBarChartReducer_setLegendItemsSpacing,
    ],
    [
        responsiveRadialBarChartAction.setLegendSymbolBorderColor,
        responsiveRadialBarChartReducer_setLegendSymbolBorderColor,
    ],
    [
        responsiveRadialBarChartAction.setLegendSymbolBorderWidth,
        responsiveRadialBarChartReducer_setLegendSymbolBorderWidth,
    ],
    [
        responsiveRadialBarChartAction.setLegendSymbolShape,
        responsiveRadialBarChartReducer_setLegendSymbolShape,
    ],
    [
        responsiveRadialBarChartAction.setLegendSymbolSize,
        responsiveRadialBarChartReducer_setLegendSymbolSize,
    ],
    [
        responsiveRadialBarChartAction.setLegendSymbolSpacing,
        responsiveRadialBarChartReducer_setLegendSymbolSpacing,
    ],
    [
        responsiveRadialBarChartAction.setLegendTranslateX,
        responsiveRadialBarChartReducer_setLegendTranslateX,
    ],
    [
        responsiveRadialBarChartAction.setLegendTranslateY,
        responsiveRadialBarChartReducer_setLegendTranslateY,
    ],

    // motion
    [
        responsiveRadialBarChartAction.setEnableAnimate,
        responsiveRadialBarChartReducer_setEnableAnimate,
    ],
    [
        responsiveRadialBarChartAction.setMotionConfig,
        responsiveRadialBarChartReducer_setMotionConfig,
    ],
    [
        responsiveRadialBarChartAction.setTransitionMode,
        responsiveRadialBarChartReducer_setTransitionMode,
    ],

    // options
    [
        responsiveRadialBarChartAction.setChartTitle,
        responsiveRadialBarChartReducer_setChartTitle,
    ],
    [
        responsiveRadialBarChartAction.setChartTitleColor,
        responsiveRadialBarChartReducer_setChartTitleColor,
    ],
    [
        responsiveRadialBarChartAction.setChartTitlePosition,
        responsiveRadialBarChartReducer_setChartTitlePosition,
    ],
    [
        responsiveRadialBarChartAction.setChartTitleSize,
        responsiveRadialBarChartReducer_setChartTitleSize,
    ],

    // screenshot
    [
        responsiveRadialBarChartAction.setScreenshotFilename,
        responsiveRadialBarChartReducer_setScreenshotFilename,
    ],
    [
        responsiveRadialBarChartAction.setScreenshotImageQuality,
        responsiveRadialBarChartReducer_setScreenshotImageQuality,
    ],
    [
        responsiveRadialBarChartAction.setScreenshotImageType,
        responsiveRadialBarChartReducer_setScreenshotImageType,
    ],

    // reset all
    [
        responsiveRadialBarChartAction.resetChartToDefault,
        responsiveRadialBarChartReducer_resetChartToDefault,
    ],
    [
        responsiveRadialBarChartAction.setPageInError,
        responsiveRadialBarChartReducer_setPageInError,
    ],
]);

function responsiveRadialBarChartReducer_setMarginTop(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        marginTop: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setMarginRight(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        marginRight: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setMarginBottom(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        marginBottom: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setMarginLeft(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        marginLeft: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setStartAngle(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        startAngle: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setEndAngle(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        endAngle: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setInnerRadius(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        innerRadius: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setPaddingRing(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        paddingRing: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setPadAngle(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        padAngle: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setCornerRadius(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        cornerRadius: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setChartColors(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        chartColors: dispatch.payload as NivoColorScheme,
    };
}

function responsiveRadialBarChartReducer_setRingBorderWidth(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        ringBorderWidth: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setEnableTracks(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableTracks: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setTracksColor(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        tracksColor: dispatch.payload as string,
    };
}

function responsiveRadialBarChartReducer_setEnableRadialGrid(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableRadialGrid: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setEnableCircularGrid(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableCircularGrid: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setEnableRadialAxisStart(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableRadialAxisStart: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setRadialAxisStartTickSize(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        radialAxisStartTickSize: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setRadialAxisStartTickPadding(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        radialAxisStartTickPadding: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setRadialAxisStartTickRotation(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        radialAxisStartTickRotation: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setEnableRadialAxisEnd(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableRadialAxisEnd: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setRadialAxisEndTickSize(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        radialAxisEndTickSize: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setRadialAxisEndTickPadding(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        radialAxisEndTickPadding: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setRadialAxisEndTickRotation(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        radialAxisEndTickRotation: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setEnableCircularAxisInner(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableCircularAxisInner: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setCircularAxisInnerTickSize(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        circularAxisInnerTickSize: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setCircularAxisInnerTickPadding(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        circularAxisInnerTickPadding: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setCircularAxisInnerTickRotation(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        circularAxisInnerTickRotation: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setEnableCircularAxisOuter(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableCircularAxisOuter: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setCircularAxisOuterTickSize(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        circularAxisOuterTickSize: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setCircularAxisOuterTickPadding(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        circularAxisOuterTickPadding: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setCircularAxisOuterTickRotation(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        circularAxisOuterTickRotation: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setEnableLabels(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableLabels: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setLabelsSkipAngle(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        labelsSkipAngle: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setLabelsRadiusOffset(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        labelsRadiusOffset: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setLabelsTextColor(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        labelsTextColor: dispatch.payload as string,
    };
}

function responsiveRadialBarChartReducer_setEnableLegend(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableLegend: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setEnableLegendJustify(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableLegendJustify: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setLegendAnchor(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendAnchor: dispatch.payload as NivoLegendAnchor,
    };
}

function responsiveRadialBarChartReducer_setLegendDirection(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendDirection: dispatch.payload as NivoLegendDirection,
    };
}

function responsiveRadialBarChartReducer_setLegendItemBackground(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendItemBackground: dispatch.payload as string,
    };
}

function responsiveRadialBarChartReducer_setLegendItemDirection(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendItemDirection: dispatch.payload as NivoLegendItemDirection,
    };
}

function responsiveRadialBarChartReducer_setLegendItemHeight(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendItemHeight: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setLegendItemOpacity(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendItemOpacity: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setLegendItemTextColor(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendItemTextColor: dispatch.payload as string,
    };
}

function responsiveRadialBarChartReducer_setLegendItemWidth(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendItemWidth: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setLegendItemsSpacing(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendItemsSpacing: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setLegendSymbolBorderColor(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendSymbolBorderColor: dispatch.payload as string,
    };
}

function responsiveRadialBarChartReducer_setLegendSymbolBorderWidth(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendSymbolBorderWidth: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setLegendSymbolShape(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendSymbolShape: dispatch.payload as NivoLegendSymbolShape,
    };
}

function responsiveRadialBarChartReducer_setLegendSymbolSize(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendSymbolSize: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setLegendSymbolSpacing(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendSymbolSpacing: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setLegendTranslateX(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendTranslateX: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setLegendTranslateY(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        legendTranslateY: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setEnableAnimate(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        enableAnimate: dispatch.payload as boolean,
    };
}

function responsiveRadialBarChartReducer_setMotionConfig(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        motionConfig: dispatch.payload as NivoMotionConfig,
    };
}

function responsiveRadialBarChartReducer_setTransitionMode(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        transitionMode: dispatch.payload as NivoTransitionMode,
    };
}

function responsiveRadialBarChartReducer_setChartTitle(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        chartTitle: dispatch.payload as string,
    };
}

function responsiveRadialBarChartReducer_setChartTitleColor(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        chartTitleColor: dispatch.payload as string,
    };
}

function responsiveRadialBarChartReducer_setChartTitlePosition(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        chartTitlePosition: dispatch.payload as NivoChartTitlePosition,
    };
}

function responsiveRadialBarChartReducer_setChartTitleSize(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        chartTitleSize: dispatch.payload as TitleOrder,
    };
}

function responsiveRadialBarChartReducer_setScreenshotFilename(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        screenshotFilename: dispatch.payload as string,
    };
}

function responsiveRadialBarChartReducer_setScreenshotImageQuality(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        screenshotImageQuality: dispatch.payload as number,
    };
}

function responsiveRadialBarChartReducer_setScreenshotImageType(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return {
        ...state,
        screenshotImageType: dispatch.payload as ScreenshotImageType,
    };
}

function responsiveRadialBarChartReducer_resetChartToDefault(
    _state: ResponsiveRadialBarChartState,
    _dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    return initialResponsiveRadialBarChartState;
}

function responsiveRadialBarChartReducer_setPageInError(
    state: ResponsiveRadialBarChartState,
    dispatch: ResponsiveRadialBarChartDispatch,
): ResponsiveRadialBarChartState {
    const { kind, page } = dispatch.payload as SetPageInErrorPayload;
    const pagesInError = new Set(state.pagesInError);
    if (kind === "add") {
        pagesInError.add(page);
    } else {
        pagesInError.delete(page);
    }

    return {
        ...state,
        pagesInError,
    };
}

export { responsiveRadialBarChartReducer };
