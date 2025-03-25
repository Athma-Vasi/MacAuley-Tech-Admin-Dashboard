import type { TitleOrder } from "@mantine/core";
import type { ScreenshotImageType } from "../../../types";
import type {
  NivoAxisLegendPosition,
  NivoBarGroupMode,
  NivoBarLayout,
  NivoBarValueScale,
  NivoChartTitlePosition,
  NivoColorScheme,
  NivoLegendAnchor,
  NivoLegendDirection,
  NivoLegendItemDirection,
  NivoLegendSymbolShape,
  NivoMotionConfig,
} from "../types";
import { responsiveBarChartAction } from "./actions";
import { initialResponsiveBarChartState } from "./state";
import type {
  ResponsiveBarChartAction,
  ResponsiveBarChartDispatch,
  ResponsiveBarChartState,
} from "./types";

function responsiveBarChartReducer(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  const reducer = responsiveBarChartReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const responsiveBarChartReducersMap = new Map<
  ResponsiveBarChartAction[keyof ResponsiveBarChartAction],
  (
    state: ResponsiveBarChartState,
    dispatch: ResponsiveBarChartDispatch,
  ) => ResponsiveBarChartState
>([
  // base
  [
    responsiveBarChartAction.setGroupMode,
    responsiveBarChartReducer_setGroupMode,
  ],
  [
    responsiveBarChartAction.setInnerPaddingBar,
    responsiveBarChartReducer_setInnerPaddingBar,
  ],
  [responsiveBarChartAction.setLayout, responsiveBarChartReducer_setLayout],
  [
    responsiveBarChartAction.setPaddingBar,
    responsiveBarChartReducer_setPaddingBar,
  ],
  [responsiveBarChartAction.setReverse, responsiveBarChartReducer_setReverse],
  [
    responsiveBarChartAction.setValueScale,
    responsiveBarChartReducer_setValueScale,
  ],

  // margin
  [
    responsiveBarChartAction.setMarginTop,
    responsiveBarChartReducer_setMarginTop,
  ],
  [
    responsiveBarChartAction.setMarginRight,
    responsiveBarChartReducer_setMarginRight,
  ],
  [
    responsiveBarChartAction.setMarginBottom,
    responsiveBarChartReducer_setMarginBottom,
  ],
  [
    responsiveBarChartAction.setMarginLeft,
    responsiveBarChartReducer_setMarginLeft,
  ],

  // style
  [
    responsiveBarChartAction.setChartBorderColor,
    responsiveBarChartReducer_setChartBorderColor,
  ],
  [
    responsiveBarChartAction.setChartBorderRadius,
    responsiveBarChartReducer_setChartBorderRadius,
  ],
  [
    responsiveBarChartAction.setChartBorderWidth,
    responsiveBarChartReducer_setChartBorderWidth,
  ],
  [
    responsiveBarChartAction.setChartColors,
    responsiveBarChartReducer_setChartColors,
  ],
  [
    responsiveBarChartAction.setEnableFillPatterns,
    responsiveBarChartReducer_setEnableFillPatterns,
  ],

  // labels
  [
    responsiveBarChartAction.setEnableLabels,
    responsiveBarChartReducer_setEnableLabels,
  ],
  [
    responsiveBarChartAction.setLabelSkipHeight,
    responsiveBarChartReducer_setLabelSkipHeight,
  ],
  [
    responsiveBarChartAction.setLabelSkipWidth,
    responsiveBarChartReducer_setLabelSkipWidth,
  ],
  [
    responsiveBarChartAction.setLabelTextColor,
    responsiveBarChartReducer_setLabelTextColor,
  ],

  // grid and axes
  [
    responsiveBarChartAction.setEnableGridX,
    responsiveBarChartReducer_setEnableGridX,
  ],
  [
    responsiveBarChartAction.setEnableGridY,
    responsiveBarChartReducer_setEnableGridY,
  ],
  // axis -> axisTop
  [
    responsiveBarChartAction.setAxisTopLegend,
    responsiveBarChartReducer_setAxisTopLegend,
  ],
  [
    responsiveBarChartAction.setAxisTopLegendOffset,
    responsiveBarChartReducer_setAxisTopLegendOffset,
  ],
  [
    responsiveBarChartAction.setAxisTopLegendPosition,
    responsiveBarChartReducer_setAxisTopLegendPosition,
  ],
  [
    responsiveBarChartAction.setAxisTopTickPadding,
    responsiveBarChartReducer_setAxisTopTickPadding,
  ],
  [
    responsiveBarChartAction.setAxisTopTickRotation,
    responsiveBarChartReducer_setAxisTopTickRotation,
  ],
  [
    responsiveBarChartAction.setAxisTopTickSize,
    responsiveBarChartReducer_setAxisTopTickSize,
  ],
  [
    responsiveBarChartAction.setEnableAxisTop,
    responsiveBarChartReducer_setEnableAxisTop,
  ],
  // axis -> axisRight
  [
    responsiveBarChartAction.setAxisRightLegend,
    responsiveBarChartReducer_setAxisRightLegend,
  ],
  [
    responsiveBarChartAction.setAxisRightLegendOffset,
    responsiveBarChartReducer_setAxisRightLegendOffset,
  ],
  [
    responsiveBarChartAction.setAxisRightLegendPosition,
    responsiveBarChartReducer_setAxisRightLegendPosition,
  ],
  [
    responsiveBarChartAction.setAxisRightTickPadding,
    responsiveBarChartReducer_setAxisRightTickPadding,
  ],
  [
    responsiveBarChartAction.setAxisRightTickRotation,
    responsiveBarChartReducer_setAxisRightTickRotation,
  ],
  [
    responsiveBarChartAction.setAxisRightTickSize,
    responsiveBarChartReducer_setAxisRightTickSize,
  ],
  [
    responsiveBarChartAction.setEnableAxisRight,
    responsiveBarChartReducer_setEnableAxisRight,
  ],
  // axis -> axisBottom
  [
    responsiveBarChartAction.setAxisBottomLegend,
    responsiveBarChartReducer_setAxisBottomLegend,
  ],
  [
    responsiveBarChartAction.setAxisBottomLegendOffset,
    responsiveBarChartReducer_setAxisBottomLegendOffset,
  ],
  [
    responsiveBarChartAction.setAxisBottomLegendPosition,
    responsiveBarChartReducer_setAxisBottomLegendPosition,
  ],
  [
    responsiveBarChartAction.setAxisBottomTickPadding,
    responsiveBarChartReducer_setAxisBottomTickPadding,
  ],
  [
    responsiveBarChartAction.setAxisBottomTickRotation,
    responsiveBarChartReducer_setAxisBottomTickRotation,
  ],
  [
    responsiveBarChartAction.setAxisBottomTickSize,
    responsiveBarChartReducer_setAxisBottomTickSize,
  ],
  [
    responsiveBarChartAction.setEnableAxisBottom,
    responsiveBarChartReducer_setEnableAxisBottom,
  ],
  // axis -> axisLeft
  [
    responsiveBarChartAction.setAxisLeftLegend,
    responsiveBarChartReducer_setAxisLeftLegend,
  ],
  [
    responsiveBarChartAction.setAxisLeftLegendOffset,
    responsiveBarChartReducer_setAxisLeftLegendOffset,
  ],
  [
    responsiveBarChartAction.setAxisLeftLegendPosition,
    responsiveBarChartReducer_setAxisLeftLegendPosition,
  ],
  [
    responsiveBarChartAction.setAxisLeftTickPadding,
    responsiveBarChartReducer_setAxisLeftTickPadding,
  ],
  [
    responsiveBarChartAction.setAxisLeftTickRotation,
    responsiveBarChartReducer_setAxisLeftTickRotation,
  ],
  [
    responsiveBarChartAction.setAxisLeftTickSize,
    responsiveBarChartReducer_setAxisLeftTickSize,
  ],
  [
    responsiveBarChartAction.setEnableAxisLeft,
    responsiveBarChartReducer_setEnableAxisLeft,
  ],

  // legend
  [
    responsiveBarChartAction.setEnableLegend,
    responsiveBarChartReducer_setEnableLegend,
  ],
  [
    responsiveBarChartAction.setEnableLegendJustify,
    responsiveBarChartReducer_setEnableLegendJustify,
  ],
  [
    responsiveBarChartAction.setLegendAnchor,
    responsiveBarChartReducer_setLegendAnchor,
  ],
  [
    responsiveBarChartAction.setLegendDirection,
    responsiveBarChartReducer_setLegendDirection,
  ],
  [
    responsiveBarChartAction.setLegendItemBackground,
    responsiveBarChartReducer_setLegendItemBackground,
  ],
  [
    responsiveBarChartAction.setLegendItemDirection,
    responsiveBarChartReducer_setLegendItemDirection,
  ],
  [
    responsiveBarChartAction.setLegendItemHeight,
    responsiveBarChartReducer_setLegendItemHeight,
  ],
  [
    responsiveBarChartAction.setLegendItemOpacity,
    responsiveBarChartReducer_setLegendItemOpacity,
  ],
  [
    responsiveBarChartAction.setLegendItemTextColor,
    responsiveBarChartReducer_setLegendItemTextColor,
  ],
  [
    responsiveBarChartAction.setLegendItemWidth,
    responsiveBarChartReducer_setLegendItemWidth,
  ],
  [
    responsiveBarChartAction.setLegendItemsSpacing,
    responsiveBarChartReducer_setLegendItemsSpacing,
  ],
  [
    responsiveBarChartAction.setLegendSymbolBorderColor,
    responsiveBarChartReducer_setLegendSymbolBorderColor,
  ],
  [
    responsiveBarChartAction.setLegendSymbolBorderWidth,
    responsiveBarChartReducer_setLegendSymbolBorderWidth,
  ],
  [
    responsiveBarChartAction.setLegendSymbolShape,
    responsiveBarChartReducer_setLegendSymbolShape,
  ],
  [
    responsiveBarChartAction.setLegendSymbolSize,
    responsiveBarChartReducer_setLegendSymbolSize,
  ],
  [
    responsiveBarChartAction.setLegendSymbolSpacing,
    responsiveBarChartReducer_setLegendSymbolSpacing,
  ],
  [
    responsiveBarChartAction.setLegendTranslateX,
    responsiveBarChartReducer_setLegendTranslateX,
  ],
  [
    responsiveBarChartAction.setLegendTranslateY,
    responsiveBarChartReducer_setLegendTranslateY,
  ],

  // motion
  [
    responsiveBarChartAction.setEnableAnimate,
    responsiveBarChartReducer_setEnableAnimate,
  ],
  [
    responsiveBarChartAction.setMotionConfig,
    responsiveBarChartReducer_setMotionConfig,
  ],

  // options
  [
    responsiveBarChartAction.setChartTitle,
    responsiveBarChartReducer_setChartTitle,
  ],
  [
    responsiveBarChartAction.setChartTitleColor,
    responsiveBarChartReducer_setChartTitleColor,
  ],
  [
    responsiveBarChartAction.setChartTitlePosition,
    responsiveBarChartReducer_setChartTitlePosition,
  ],
  [
    responsiveBarChartAction.setChartTitleSize,
    responsiveBarChartReducer_setChartTitleSize,
  ],

  // screenshot
  [
    responsiveBarChartAction.setScreenshotFilename,
    responsiveBarChartReducer_setScreenshotFilename,
  ],
  [
    responsiveBarChartAction.setScreenshotImageQuality,
    responsiveBarChartReducer_setScreenshotImageQuality,
  ],
  [
    responsiveBarChartAction.setScreenshotImageType,
    responsiveBarChartReducer_setScreenshotImageType,
  ],

  // reset all
  [
    responsiveBarChartAction.resetChartToDefault,
    responsiveBarChartReducer_resetChartToDefault,
  ],

  // error
  [
    responsiveBarChartAction.setIsError,
    responsiveBarChartReducer_setIsError,
  ],
]);

function responsiveBarChartReducer_setGroupMode(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    groupMode: dispatch.payload as NivoBarGroupMode,
  };
}

function responsiveBarChartReducer_setInnerPaddingBar(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    innerPaddingBar: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLayout(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    layout: dispatch.payload as NivoBarLayout,
  };
}

function responsiveBarChartReducer_setPaddingBar(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    paddingBar: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setReverse(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    reverse: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setValueScale(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    valueScale: dispatch.payload as NivoBarValueScale,
  };
}

function responsiveBarChartReducer_setMarginTop(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    marginTop: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setMarginRight(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    marginRight: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setMarginBottom(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    marginBottom: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setMarginLeft(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    marginLeft: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setChartBorderColor(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    chartBorderColor: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setChartBorderRadius(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    chartBorderRadius: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setChartBorderWidth(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    chartBorderWidth: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setChartColors(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    chartColors: dispatch.payload as NivoColorScheme,
  };
}

function responsiveBarChartReducer_setEnableFillPatterns(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableFillPatterns: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setEnableLabels(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableLabels: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setLabelSkipHeight(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    labelSkipHeight: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLabelSkipWidth(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    labelSkipWidth: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLabelTextColor(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    labelTextColor: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setEnableGridX(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableGridX: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setEnableGridY(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableGridY: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setAxisTopLegend(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisTopLegend: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setAxisTopLegendOffset(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisTopLegendOffset: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisTopLegendPosition(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisTopLegendPosition: dispatch.payload as NivoAxisLegendPosition,
  };
}

function responsiveBarChartReducer_setAxisTopTickPadding(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisTopTickPadding: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisTopTickRotation(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisTopTickRotation: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisTopTickSize(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisTopTickSize: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setEnableAxisTop(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableAxisTop: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setAxisRightLegend(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisRightLegend: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setAxisRightLegendOffset(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisRightLegendOffset: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisRightLegendPosition(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisRightLegendPosition: dispatch.payload as NivoAxisLegendPosition,
  };
}

function responsiveBarChartReducer_setAxisRightTickPadding(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisRightTickPadding: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisRightTickRotation(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisRightTickRotation: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisRightTickSize(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisRightTickSize: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setEnableAxisRight(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableAxisRight: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setAxisBottomLegend(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisBottomLegend: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setAxisBottomLegendOffset(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisBottomLegendOffset: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisBottomLegendPosition(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisBottomLegendPosition: dispatch.payload as NivoAxisLegendPosition,
  };
}

function responsiveBarChartReducer_setAxisBottomTickPadding(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisBottomTickPadding: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisBottomTickRotation(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisBottomTickRotation: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisBottomTickSize(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisBottomTickSize: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setEnableAxisBottom(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableAxisBottom: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setAxisLeftLegend(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisLeftLegend: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setAxisLeftLegendOffset(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisLeftLegendOffset: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisLeftLegendPosition(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisLeftLegendPosition: dispatch.payload as NivoAxisLegendPosition,
  };
}

function responsiveBarChartReducer_setAxisLeftTickPadding(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisLeftTickPadding: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisLeftTickRotation(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisLeftTickRotation: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setAxisLeftTickSize(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    axisLeftTickSize: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setEnableAxisLeft(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableAxisLeft: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setEnableLegend(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableLegend: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setEnableLegendJustify(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableLegendJustify: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setLegendAnchor(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendAnchor: dispatch.payload as NivoLegendAnchor,
  };
}

function responsiveBarChartReducer_setLegendDirection(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendDirection: dispatch.payload as NivoLegendDirection,
  };
}

function responsiveBarChartReducer_setLegendItemBackground(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendItemBackground: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setLegendItemDirection(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendItemDirection: dispatch.payload as NivoLegendItemDirection,
  };
}

function responsiveBarChartReducer_setLegendItemHeight(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendItemHeight: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLegendItemOpacity(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendItemOpacity: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLegendItemTextColor(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendItemTextColor: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setLegendItemWidth(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendItemWidth: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLegendItemsSpacing(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendItemsSpacing: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLegendSymbolBorderColor(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendSymbolBorderColor: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setLegendSymbolBorderWidth(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendSymbolBorderWidth: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLegendSymbolShape(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendSymbolShape: dispatch.payload as NivoLegendSymbolShape,
  };
}

function responsiveBarChartReducer_setLegendSymbolSize(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendSymbolSize: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLegendSymbolSpacing(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendSymbolSpacing: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLegendTranslateX(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendTranslateX: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setLegendTranslateY(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    legendTranslateY: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setEnableAnimate(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    enableAnimate: dispatch.payload as boolean,
  };
}

function responsiveBarChartReducer_setMotionConfig(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    motionConfig: dispatch.payload as NivoMotionConfig,
  };
}

function responsiveBarChartReducer_setChartTitle(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    chartTitle: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setChartTitleColor(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    chartTitleColor: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setChartTitlePosition(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    chartTitlePosition: dispatch.payload as NivoChartTitlePosition,
  };
}

function responsiveBarChartReducer_setChartTitleSize(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    chartTitleSize: dispatch.payload as TitleOrder,
  };
}

function responsiveBarChartReducer_setScreenshotFilename(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    screenshotFilename: dispatch.payload as string,
  };
}

function responsiveBarChartReducer_setScreenshotImageQuality(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    screenshotImageQuality: dispatch.payload as number,
  };
}

function responsiveBarChartReducer_setScreenshotImageType(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    screenshotImageType: dispatch.payload as ScreenshotImageType,
  };
}

function responsiveBarChartReducer_resetChartToDefault(
  _state: ResponsiveBarChartState,
  _dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return initialResponsiveBarChartState;
}

function responsiveBarChartReducer_setIsError(
  state: ResponsiveBarChartState,
  dispatch: ResponsiveBarChartDispatch,
): ResponsiveBarChartState {
  return {
    ...state,
    isError: dispatch.payload as boolean,
  };
}

export { responsiveBarChartReducer };
