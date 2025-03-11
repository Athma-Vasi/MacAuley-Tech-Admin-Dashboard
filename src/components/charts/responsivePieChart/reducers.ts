import type { TitleOrder } from "@mantine/core";
import type {
    ScreenshotImageType,
    SetPageInErrorPayload,
} from "../../../types";
import type {
    NivoArcLabel,
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
    type ResponsivePieChartAction,
    responsivePieChartAction,
} from "./actions";
import { initialResponsivePieChartState } from "./state";
import type {
    ResponsivePieChartDispatch,
    ResponsivePieChartState,
} from "./types";

function responsivePieChartReducer(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    const reducer = responsivePieChartReducersMap.get(dispatch.action);
    return reducer ? reducer(state, dispatch) : state;
}

const responsivePieChartReducersMap = new Map<
    ResponsivePieChartAction[keyof ResponsivePieChartAction],
    (
        state: ResponsivePieChartState,
        dispatch: ResponsivePieChartDispatch,
    ) => ResponsivePieChartState
>([
    // base
    [
        responsivePieChartAction.setCornerRadius,
        responsivePieChartReducer_setCornerRadius,
    ],
    [
        responsivePieChartAction.setEndAngle,
        responsivePieChartReducer_setEndAngle,
    ],
    [
        responsivePieChartAction.setInnerRadius,
        responsivePieChartReducer_setInnerRadius,
    ],
    [
        responsivePieChartAction.setPadAngle,
        responsivePieChartReducer_setPadAngle,
    ],
    [
        responsivePieChartAction.setSortByValue,
        responsivePieChartReducer_setSortByValue,
    ],
    [
        responsivePieChartAction.setStartAngle,
        responsivePieChartReducer_setStartAngle,
    ],

    // style
    [
        responsivePieChartAction.setArcBorderColor,
        responsivePieChartReducer_setArcBorderColor,
    ],
    [
        responsivePieChartAction.setArcBorderWidth,
        responsivePieChartReducer_setArcBorderWidth,
    ],
    [
        responsivePieChartAction.setColorScheme,
        responsivePieChartReducer_setColorScheme,
    ],
    [
        responsivePieChartAction.setEnableFillPatterns,
        responsivePieChartReducer_setEnableFillPatterns,
    ],

    // arc labels
    [
        responsivePieChartAction.setArcLabel,
        responsivePieChartReducer_setArcLabel,
    ],
    [
        responsivePieChartAction.setArcLabelsRadiusOffset,
        responsivePieChartReducer_setArcLabelsRadiusOffset,
    ],
    [
        responsivePieChartAction.setArcLabelsSkipAngle,
        responsivePieChartReducer_setArcLabelsSkipAngle,
    ],
    [
        responsivePieChartAction.setArcLabelsTextColor,
        responsivePieChartReducer_setArcLabelsTextColor,
    ],
    [
        responsivePieChartAction.setEnableArcLabels,
        responsivePieChartReducer_setEnableArcLabels,
    ],

    // arc link labels
    [
        responsivePieChartAction.setArcLinkLabelsDiagonalLength,
        responsivePieChartReducer_setArcLinkLabelsDiagonalLength,
    ],
    [
        responsivePieChartAction.setArcLinkLabelsOffset,
        responsivePieChartReducer_setArcLinkLabelsOffset,
    ],
    [
        responsivePieChartAction.setArcLinkLabelsSkipAngle,
        responsivePieChartReducer_setArcLinkLabelsSkipAngle,
    ],
    [
        responsivePieChartAction.setArcLinkLabelsStraightLength,
        responsivePieChartReducer_setArcLinkLabelsStraightLength,
    ],
    [
        responsivePieChartAction.setArcLinkLabelsTextColor,
        responsivePieChartReducer_setArcLinkLabelsTextColor,
    ],
    [
        responsivePieChartAction.setArcLinkLabelsTextOffset,
        responsivePieChartReducer_setArcLinkLabelsTextOffset,
    ],
    [
        responsivePieChartAction.setArcLinkLabelsThickness,
        responsivePieChartReducer_setArcLinkLabelsThickness,
    ],
    [
        responsivePieChartAction.setEnableArcLinkLabels,
        responsivePieChartReducer_setEnableArcLinkLabels,
    ],

    // interactivity
    [
        responsivePieChartAction.setActiveInnerRadiusOffset,
        responsivePieChartReducer_setActiveInnerRadiusOffset,
    ],
    [
        responsivePieChartAction.setActiveOuterRadiusOffset,
        responsivePieChartReducer_setActiveOuterRadiusOffset,
    ],

    // motion
    [
        responsivePieChartAction.setEnableAnimate,
        responsivePieChartReducer_setEnableAnimate,
    ],
    [
        responsivePieChartAction.setMotionConfig,
        responsivePieChartReducer_setMotionConfig,
    ],
    [
        responsivePieChartAction.setTransitionMode,
        responsivePieChartReducer_setTransitionMode,
    ],

    // margin
    [
        responsivePieChartAction.setMarginTop,
        responsivePieChartReducer_setMarginTop,
    ],
    [
        responsivePieChartAction.setMarginRight,
        responsivePieChartReducer_setMarginRight,
    ],
    [
        responsivePieChartAction.setMarginBottom,
        responsivePieChartReducer_setMarginBottom,
    ],
    [
        responsivePieChartAction.setMarginLeft,
        responsivePieChartReducer_setMarginLeft,
    ],

    // legend
    [
        responsivePieChartAction.setEnableLegend,
        responsivePieChartReducer_setEnableLegend,
    ],
    [
        responsivePieChartAction.setEnableLegendJustify,
        responsivePieChartReducer_setEnableLegendJustify,
    ],
    [
        responsivePieChartAction.setLegendAnchor,
        responsivePieChartReducer_setLegendAnchor,
    ],
    [
        responsivePieChartAction.setLegendDirection,
        responsivePieChartReducer_setLegendDirection,
    ],
    [
        responsivePieChartAction.setLegendItemBackground,
        responsivePieChartReducer_setLegendItemBackground,
    ],
    [
        responsivePieChartAction.setLegendItemDirection,
        responsivePieChartReducer_setLegendItemDirection,
    ],
    [
        responsivePieChartAction.setLegendItemHeight,
        responsivePieChartReducer_setLegendItemHeight,
    ],
    [
        responsivePieChartAction.setLegendItemOpacity,
        responsivePieChartReducer_setLegendItemOpacity,
    ],
    [
        responsivePieChartAction.setLegendItemTextColor,
        responsivePieChartReducer_setLegendItemTextColor,
    ],
    [
        responsivePieChartAction.setLegendItemWidth,
        responsivePieChartReducer_setLegendItemWidth,
    ],
    [
        responsivePieChartAction.setLegendItemsSpacing,
        responsivePieChartReducer_setLegendItemsSpacing,
    ],
    [
        responsivePieChartAction.setLegendSymbolBorderColor,
        responsivePieChartReducer_setLegendSymbolBorderColor,
    ],
    [
        responsivePieChartAction.setLegendSymbolBorderWidth,
        responsivePieChartReducer_setLegendSymbolBorderWidth,
    ],
    [
        responsivePieChartAction.setLegendSymbolShape,
        responsivePieChartReducer_setLegendSymbolShape,
    ],
    [
        responsivePieChartAction.setLegendSymbolSize,
        responsivePieChartReducer_setLegendSymbolSize,
    ],
    [
        responsivePieChartAction.setLegendSymbolSpacing,
        responsivePieChartReducer_setLegendSymbolSpacing,
    ],
    [
        responsivePieChartAction.setLegendTranslateX,
        responsivePieChartReducer_setLegendTranslateX,
    ],
    [
        responsivePieChartAction.setLegendTranslateY,
        responsivePieChartReducer_setLegendTranslateY,
    ],

    // options
    [
        responsivePieChartAction.setChartTitle,
        responsivePieChartReducer_setChartTitle,
    ],
    [
        responsivePieChartAction.setChartTitleColor,
        responsivePieChartReducer_setChartTitleColor,
    ],
    [
        responsivePieChartAction.setChartTitlePosition,
        responsivePieChartReducer_setChartTitlePosition,
    ],
    [
        responsivePieChartAction.setChartTitleSize,
        responsivePieChartReducer_setChartTitleSize,
    ],

    // screenshot
    [
        responsivePieChartAction.setScreenshotFilename,
        responsivePieChartReducer_setScreenshotFilename,
    ],
    [
        responsivePieChartAction.setScreenshotImageQuality,
        responsivePieChartReducer_setScreenshotImageQuality,
    ],
    [
        responsivePieChartAction.setScreenshotImageType,
        responsivePieChartReducer_setScreenshotImageType,
    ],

    // reset all
    [
        responsivePieChartAction.resetChartToDefault,
        responsivePieChartReducer_resetChartToDefault,
    ],

    // error
    [
        responsivePieChartAction.setPageInError,
        responsivePieChartReducer_setPageInError,
    ],
]);

function responsivePieChartReducer_setCornerRadius(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        cornerRadius: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setEndAngle(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        endAngle: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setInnerRadius(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        innerRadius: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setPadAngle(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        padAngle: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setSortByValue(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        sortByValue: dispatch.payload as boolean,
    };
}

function responsivePieChartReducer_setStartAngle(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        startAngle: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setArcBorderColor(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcBorderColor: dispatch.payload as string,
    };
}

function responsivePieChartReducer_setArcBorderWidth(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcBorderWidth: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setColorScheme(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        colorScheme: dispatch.payload as NivoColorScheme,
    };
}

function responsivePieChartReducer_setEnableFillPatterns(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        enableFillPatterns: dispatch.payload as boolean,
    };
}

function responsivePieChartReducer_setArcLabel(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLabel: dispatch.payload as NivoArcLabel,
    };
}

function responsivePieChartReducer_setArcLabelsRadiusOffset(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLabelsRadiusOffset: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setArcLabelsSkipAngle(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLabelsSkipAngle: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setArcLabelsTextColor(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLabelsTextColor: dispatch.payload as string,
    };
}

function responsivePieChartReducer_setEnableArcLabels(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        enableArcLinkLabels: dispatch.payload as boolean,
    };
}

function responsivePieChartReducer_setArcLinkLabelsDiagonalLength(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLinkLabelsDiagonalLength: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setArcLinkLabelsOffset(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLinkLabelsOffset: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setArcLinkLabelsSkipAngle(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLinkLabelsSkipAngle: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setArcLinkLabelsStraightLength(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLinkLabelsStraightLength: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setArcLinkLabelsTextColor(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLinkLabelsTextColor: dispatch.payload as string,
    };
}

function responsivePieChartReducer_setArcLinkLabelsTextOffset(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLinkLabelsTextOffset: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setArcLinkLabelsThickness(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        arcLinkLabelsThickness: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setEnableArcLinkLabels(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        enableArcLinkLabels: dispatch.payload as boolean,
    };
}

function responsivePieChartReducer_setActiveInnerRadiusOffset(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        activeInnerRadiusOffset: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setActiveOuterRadiusOffset(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        activeOuterRadiusOffset: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setEnableAnimate(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        enableAnimate: dispatch.payload as boolean,
    };
}

function responsivePieChartReducer_setMotionConfig(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        motionConfig: dispatch.payload as NivoMotionConfig,
    };
}

function responsivePieChartReducer_setTransitionMode(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        transitionMode: dispatch.payload as NivoTransitionMode,
    };
}

function responsivePieChartReducer_setMarginTop(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        marginTop: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setMarginRight(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        marginRight: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setMarginBottom(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        marginBottom: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setMarginLeft(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        marginLeft: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setEnableLegend(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        enableLegend: dispatch.payload as boolean,
    };
}

function responsivePieChartReducer_setEnableLegendJustify(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        enableLegendJustify: dispatch.payload as boolean,
    };
}

function responsivePieChartReducer_setLegendAnchor(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendAnchor: dispatch.payload as NivoLegendAnchor,
    };
}

function responsivePieChartReducer_setLegendDirection(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendDirection: dispatch.payload as NivoLegendDirection,
    };
}

function responsivePieChartReducer_setLegendItemBackground(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendItemBackground: dispatch.payload as string,
    };
}

function responsivePieChartReducer_setLegendItemDirection(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendItemDirection: dispatch.payload as NivoLegendItemDirection,
    };
}

function responsivePieChartReducer_setLegendItemHeight(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendItemHeight: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setLegendItemOpacity(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendItemOpacity: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setLegendItemTextColor(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendItemTextColor: dispatch.payload as string,
    };
}

function responsivePieChartReducer_setLegendItemWidth(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendItemWidth: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setLegendItemsSpacing(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendItemsSpacing: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setLegendSymbolBorderColor(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendSymbolBorderColor: dispatch.payload as string,
    };
}

function responsivePieChartReducer_setLegendSymbolBorderWidth(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendSymbolBorderWidth: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setLegendSymbolShape(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendSymbolShape: dispatch.payload as NivoLegendSymbolShape,
    };
}

function responsivePieChartReducer_setLegendSymbolSize(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendSymbolSize: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setLegendSymbolSpacing(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendSymbolSpacing: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setLegendTranslateX(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendTranslateX: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setLegendTranslateY(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        legendTranslateY: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setChartTitle(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        chartTitle: dispatch.payload as string,
    };
}

function responsivePieChartReducer_setChartTitleColor(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        chartTitleColor: dispatch.payload as string,
    };
}

function responsivePieChartReducer_setChartTitlePosition(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        chartTitlePosition: dispatch.payload as NivoChartTitlePosition,
    };
}

function responsivePieChartReducer_setChartTitleSize(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        chartTitleSize: dispatch.payload as TitleOrder,
    };
}

function responsivePieChartReducer_setScreenshotFilename(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        screenshotFilename: dispatch.payload as string,
    };
}

function responsivePieChartReducer_setScreenshotImageQuality(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        screenshotImageQuality: dispatch.payload as number,
    };
}

function responsivePieChartReducer_setScreenshotImageType(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return {
        ...state,
        screenshotImageType: dispatch.payload as ScreenshotImageType,
    };
}

function responsivePieChartReducer_resetChartToDefault(
    _state: ResponsivePieChartState,
    _dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
    return initialResponsivePieChartState;
}

function responsivePieChartReducer_setPageInError(
    state: ResponsivePieChartState,
    dispatch: ResponsivePieChartDispatch,
): ResponsivePieChartState {
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

export { responsivePieChartReducer };
