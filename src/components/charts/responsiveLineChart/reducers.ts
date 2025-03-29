import type { TitleOrder } from "@mantine/core";
import type { ScreenshotImageType } from "../../../types";
import type {
  NivoAxisLegendPosition,
  NivoChartTitlePosition,
  NivoColorScheme,
  NivoLegendAnchor,
  NivoLegendDirection,
  NivoLegendItemDirection,
  NivoLegendSymbolShape,
  NivoLineAreaBlendMode,
  NivoLineAxesScale,
  NivoLineCrosshairType,
  NivoLineCurve,
  NivoLinePointLabel,
  NivoMotionConfig,
} from "../types";
import { responsiveLineChartAction } from "./actions";
import { initialResponsiveLineChartState } from "./state";
import type {
  ResponsiveLineChartAction,
  ResponsiveLineChartDispatch,
  ResponsiveLineChartState,
} from "./types";

function responsiveLineChartReducer(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  const reducer = responsiveLineChartReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const responsiveLineChartReducersMap = new Map<
  ResponsiveLineChartAction[keyof ResponsiveLineChartAction],
  (
    state: ResponsiveLineChartState,
    dispatch: ResponsiveLineChartDispatch,
  ) => ResponsiveLineChartState
>([
  // base
  [
    responsiveLineChartAction.setEnableYScaleStacked,
    responsiveLineChartReducer_setEnableYScaleStacked,
  ],
  [
    responsiveLineChartAction.setReverseScale,
    responsiveLineChartReducer_setReverseScale,
  ],
  [responsiveLineChartAction.setXScale, responsiveLineChartReducer_setXScale],
  [responsiveLineChartAction.setYScale, responsiveLineChartReducer_setYScale],

  // margin
  [
    responsiveLineChartAction.setMarginTop,
    responsiveLineChartReducer_setMarginTop,
  ],
  [
    responsiveLineChartAction.setMarginRight,
    responsiveLineChartReducer_setMarginRight,
  ],
  [
    responsiveLineChartAction.setMarginBottom,
    responsiveLineChartReducer_setMarginBottom,
  ],
  [
    responsiveLineChartAction.setMarginLeft,
    responsiveLineChartReducer_setMarginLeft,
  ],

  // style
  [
    responsiveLineChartAction.setAreaBlendMode,
    responsiveLineChartReducer_setAreaBlendMode,
  ],
  [
    responsiveLineChartAction.setAreaOpacity,
    responsiveLineChartReducer_setAreaOpacity,
  ],
  [
    responsiveLineChartAction.setChartColors,
    responsiveLineChartReducer_setChartColors,
  ],
  [
    responsiveLineChartAction.setEnableArea,
    responsiveLineChartReducer_setEnableArea,
  ],
  [
    responsiveLineChartAction.setLineCurve,
    responsiveLineChartReducer_setLineCurve,
  ],
  [
    responsiveLineChartAction.setLineWidth,
    responsiveLineChartReducer_setLineWidth,
  ],

  // points
  [
    responsiveLineChartAction.setEnablePointLabel,
    responsiveLineChartReducer_setEnablePointLabel,
  ],
  [
    responsiveLineChartAction.setEnablePoints,
    responsiveLineChartReducer_setEnablePoints,
  ],
  [
    responsiveLineChartAction.setPointBorderWidth,
    responsiveLineChartReducer_setPointBorderWidth,
  ],
  [
    responsiveLineChartAction.setPointColor,
    responsiveLineChartReducer_setPointColor,
  ],
  [
    responsiveLineChartAction.setPointLabel,
    responsiveLineChartReducer_setPointLabel,
  ],
  [
    responsiveLineChartAction.setPointLabelYOffset,
    responsiveLineChartReducer_setPointLabelYOffset,
  ],
  [
    responsiveLineChartAction.setPointSize,
    responsiveLineChartReducer_setPointSize,
  ],

  // grids
  [
    responsiveLineChartAction.setEnableGridX,
    responsiveLineChartReducer_setEnableGridX,
  ],
  [
    responsiveLineChartAction.setEnableGridY,
    responsiveLineChartReducer_setEnableGridY,
  ],

  // axes
  // axisTop
  [
    responsiveLineChartAction.setAxisTopLegend,
    responsiveLineChartReducer_setAxisTopLegend,
  ],
  [
    responsiveLineChartAction.setAxisTopLegendOffset,
    responsiveLineChartReducer_setAxisTopLegendOffset,
  ],
  [
    responsiveLineChartAction.setAxisTopLegendPosition,
    responsiveLineChartReducer_setAxisTopLegendPosition,
  ],
  [
    responsiveLineChartAction.setAxisTopTickPadding,
    responsiveLineChartReducer_setAxisTopTickPadding,
  ],
  [
    responsiveLineChartAction.setAxisTopTickRotation,
    responsiveLineChartReducer_setAxisTopTickRotation,
  ],
  [
    responsiveLineChartAction.setAxisTopTickSize,
    responsiveLineChartReducer_setAxisTopTickSize,
  ],
  [
    responsiveLineChartAction.setEnableAxisTop,
    responsiveLineChartReducer_setEnableAxisTop,
  ],
  // axisRight
  [
    responsiveLineChartAction.setAxisRightLegend,
    responsiveLineChartReducer_setAxisRightLegend,
  ],
  [
    responsiveLineChartAction.setAxisRightLegendOffset,
    responsiveLineChartReducer_setAxisRightLegendOffset,
  ],
  [
    responsiveLineChartAction.setAxisRightLegendPosition,
    responsiveLineChartReducer_setAxisRightLegendPosition,
  ],
  [
    responsiveLineChartAction.setAxisRightTickPadding,
    responsiveLineChartReducer_setAxisRightTickPadding,
  ],
  [
    responsiveLineChartAction.setAxisRightTickRotation,
    responsiveLineChartReducer_setAxisRightTickRotation,
  ],
  [
    responsiveLineChartAction.setAxisRightTickSize,
    responsiveLineChartReducer_setAxisRightTickSize,
  ],
  [
    responsiveLineChartAction.setEnableAxisRight,
    responsiveLineChartReducer_setEnableAxisRight,
  ],
  // axisBottom
  [
    responsiveLineChartAction.setAxisBottomLegend,
    responsiveLineChartReducer_setAxisBottomLegend,
  ],
  [
    responsiveLineChartAction.setAxisBottomLegendOffset,
    responsiveLineChartReducer_setAxisBottomLegendOffset,
  ],
  [
    responsiveLineChartAction.setAxisBottomLegendPosition,
    responsiveLineChartReducer_setAxisBottomLegendPosition,
  ],
  [
    responsiveLineChartAction.setAxisBottomTickPadding,
    responsiveLineChartReducer_setAxisBottomTickPadding,
  ],
  [
    responsiveLineChartAction.setAxisBottomTickRotation,
    responsiveLineChartReducer_setAxisBottomTickRotation,
  ],
  [
    responsiveLineChartAction.setAxisBottomTickSize,
    responsiveLineChartReducer_setAxisBottomTickSize,
  ],
  [
    responsiveLineChartAction.setEnableAxisBottom,
    responsiveLineChartReducer_setEnableAxisBottom,
  ],
  // axisLeft
  [
    responsiveLineChartAction.setAxisLeftLegend,
    responsiveLineChartReducer_setAxisLeftLegend,
  ],
  [
    responsiveLineChartAction.setAxisLeftLegendOffset,
    responsiveLineChartReducer_setAxisLeftLegendOffset,
  ],
  [
    responsiveLineChartAction.setAxisLeftLegendPosition,
    responsiveLineChartReducer_setAxisLeftLegendPosition,
  ],
  [
    responsiveLineChartAction.setAxisLeftTickPadding,
    responsiveLineChartReducer_setAxisLeftTickPadding,
  ],
  [
    responsiveLineChartAction.setAxisLeftTickRotation,
    responsiveLineChartReducer_setAxisLeftTickRotation,
  ],
  [
    responsiveLineChartAction.setAxisLeftTickSize,
    responsiveLineChartReducer_setAxisLeftTickSize,
  ],
  [
    responsiveLineChartAction.setEnableAxisLeft,
    responsiveLineChartReducer_setEnableAxisLeft,
  ],

  // interactivity
  [
    responsiveLineChartAction.setEnableCrosshair,
    responsiveLineChartReducer_setEnableCrosshair,
  ],
  [
    responsiveLineChartAction.setCrosshairType,
    responsiveLineChartReducer_setCrosshairType,
  ],

  // legends
  [
    responsiveLineChartAction.setEnableLegend,
    responsiveLineChartReducer_setEnableLegend,
  ],
  [
    responsiveLineChartAction.setEnableLegendJustify,
    responsiveLineChartReducer_setEnableLegendJustify,
  ],
  [
    responsiveLineChartAction.setLegendAnchor,
    responsiveLineChartReducer_setLegendAnchor,
  ],
  [
    responsiveLineChartAction.setLegendDirection,
    responsiveLineChartReducer_setLegendDirection,
  ],
  [
    responsiveLineChartAction.setLegendItemBackground,
    responsiveLineChartReducer_setLegendItemBackground,
  ],
  [
    responsiveLineChartAction.setLegendItemDirection,
    responsiveLineChartReducer_setLegendItemDirection,
  ],
  [
    responsiveLineChartAction.setLegendItemHeight,
    responsiveLineChartReducer_setLegendItemHeight,
  ],
  [
    responsiveLineChartAction.setLegendItemOpacity,
    responsiveLineChartReducer_setLegendItemOpacity,
  ],
  [
    responsiveLineChartAction.setLegendItemTextColor,
    responsiveLineChartReducer_setLegendItemTextColor,
  ],
  [
    responsiveLineChartAction.setLegendItemWidth,
    responsiveLineChartReducer_setLegendItemWidth,
  ],
  [
    responsiveLineChartAction.setLegendItemsSpacing,
    responsiveLineChartReducer_setLegendItemsSpacing,
  ],
  [
    responsiveLineChartAction.setLegendSymbolBorderColor,
    responsiveLineChartReducer_setLegendSymbolBorderColor,
  ],
  [
    responsiveLineChartAction.setLegendSymbolBorderWidth,
    responsiveLineChartReducer_setLegendSymbolBorderWidth,
  ],
  [
    responsiveLineChartAction.setLegendSymbolShape,
    responsiveLineChartReducer_setLegendSymbolShape,
  ],
  [
    responsiveLineChartAction.setLegendSymbolSize,
    responsiveLineChartReducer_setLegendSymbolSize,
  ],
  [
    responsiveLineChartAction.setLegendSymbolSpacing,
    responsiveLineChartReducer_setLegendSymbolSpacing,
  ],
  [
    responsiveLineChartAction.setLegendTranslateX,
    responsiveLineChartReducer_setLegendTranslateX,
  ],
  [
    responsiveLineChartAction.setLegendTranslateY,
    responsiveLineChartReducer_setLegendTranslateY,
  ],

  // motion
  [
    responsiveLineChartAction.setEnableAnimate,
    responsiveLineChartReducer_setEnableAnimate,
  ],
  [
    responsiveLineChartAction.setMotionConfig,
    responsiveLineChartReducer_setMotionConfig,
  ],

  // options
  [
    responsiveLineChartAction.setChartTitle,
    responsiveLineChartReducer_setChartTitle,
  ],
  [
    responsiveLineChartAction.setChartTitleColor,
    responsiveLineChartReducer_setChartTitleColor,
  ],
  [
    responsiveLineChartAction.setChartTitlePosition,
    responsiveLineChartReducer_setChartTitlePosition,
  ],
  [
    responsiveLineChartAction.setChartTitleSize,
    responsiveLineChartReducer_setChartTitleSize,
  ],

  // screenshot
  [
    responsiveLineChartAction.setScreenshotFilename,
    responsiveLineChartReducer_setScreenshotFilename,
  ],
  [
    responsiveLineChartAction.setScreenshotImageQuality,
    responsiveLineChartReducer_setScreenshotImageQuality,
  ],
  [
    responsiveLineChartAction.setScreenshotImageType,
    responsiveLineChartReducer_setScreenshotImageType,
  ],

  // reset all
  [
    responsiveLineChartAction.resetChartToDefault,
    responsiveLineChartReducer_resetChartToDefault,
  ],

  // error
  [
    responsiveLineChartAction.setIsError,
    responsiveLineChartReducer_setIsError,
  ],
]);

function responsiveLineChartReducer_setEnableYScaleStacked(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableYScaleStacked: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setReverseScale(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    reverseScale: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setXScale(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    xScale: dispatch.payload as NivoLineAxesScale,
  };
}

function responsiveLineChartReducer_setYScale(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    yScale: dispatch.payload as NivoLineAxesScale,
  };
}

function responsiveLineChartReducer_setMarginTop(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    marginTop: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setMarginRight(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    marginRight: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setMarginBottom(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    marginBottom: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setMarginLeft(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    marginLeft: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAreaBlendMode(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    areaBlendMode: dispatch.payload as NivoLineAreaBlendMode,
  };
}

function responsiveLineChartReducer_setAreaOpacity(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    areaOpacity: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setChartColors(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    chartColors: dispatch.payload as NivoColorScheme,
  };
}

function responsiveLineChartReducer_setEnableArea(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableArea: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setLineCurve(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    lineCurve: dispatch.payload as NivoLineCurve,
  };
}

function responsiveLineChartReducer_setLineWidth(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    lineWidth: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setEnablePointLabel(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enablePointLabel: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setEnablePoints(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enablePoints: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setPointBorderWidth(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    pointBorderWidth: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setPointColor(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    pointColor: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setPointLabel(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    pointLabel: dispatch.payload as NivoLinePointLabel,
  };
}

function responsiveLineChartReducer_setPointLabelYOffset(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    pointLabelYOffset: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setPointSize(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    pointSize: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setEnableGridX(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableGridX: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setEnableGridY(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableGridY: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setAxisTopLegend(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisTopLegend: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setAxisTopLegendOffset(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisTopLegendOffset: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisTopLegendPosition(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisTopLegendPosition: dispatch.payload as NivoAxisLegendPosition,
  };
}

function responsiveLineChartReducer_setAxisTopTickPadding(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisTopTickPadding: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisTopTickRotation(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisTopTickRotation: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisTopTickSize(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisTopTickSize: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setEnableAxisTop(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableAxisTop: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setAxisRightLegend(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisRightLegend: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setAxisRightLegendOffset(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisRightLegendOffset: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisRightLegendPosition(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisRightLegendPosition: dispatch.payload as NivoAxisLegendPosition,
  };
}

function responsiveLineChartReducer_setAxisRightTickPadding(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisRightTickPadding: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisRightTickRotation(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisRightTickRotation: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisRightTickSize(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisRightTickSize: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setEnableAxisRight(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableAxisRight: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setAxisBottomLegend(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisBottomLegend: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setAxisBottomLegendOffset(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisBottomLegendOffset: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisBottomLegendPosition(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisBottomLegendPosition: dispatch.payload as NivoAxisLegendPosition,
  };
}

function responsiveLineChartReducer_setAxisBottomTickPadding(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisBottomTickPadding: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisBottomTickRotation(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisBottomTickRotation: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisBottomTickSize(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisBottomTickSize: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setEnableAxisBottom(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableAxisBottom: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setAxisLeftLegend(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisLeftLegend: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setAxisLeftLegendOffset(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisLeftLegendOffset: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisLeftLegendPosition(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisLeftLegendPosition: dispatch.payload as NivoAxisLegendPosition,
  };
}

function responsiveLineChartReducer_setAxisLeftTickPadding(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisLeftTickPadding: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisLeftTickRotation(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisLeftTickRotation: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setAxisLeftTickSize(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    axisLeftTickSize: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setEnableAxisLeft(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableAxisLeft: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setEnableCrosshair(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableCrosshair: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setCrosshairType(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    crosshairType: dispatch.payload as NivoLineCrosshairType,
  };
}

function responsiveLineChartReducer_setEnableLegend(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableLegend: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setEnableLegendJustify(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableLegendJustify: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setLegendAnchor(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendAnchor: dispatch.payload as NivoLegendAnchor,
  };
}

function responsiveLineChartReducer_setLegendDirection(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendDirection: dispatch.payload as NivoLegendDirection,
  };
}

function responsiveLineChartReducer_setLegendItemBackground(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendItemBackground: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setLegendItemDirection(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendItemDirection: dispatch.payload as NivoLegendItemDirection,
  };
}

function responsiveLineChartReducer_setLegendItemHeight(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendItemHeight: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setLegendItemOpacity(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendItemOpacity: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setLegendItemTextColor(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendItemTextColor: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setLegendItemWidth(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendItemWidth: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setLegendItemsSpacing(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendItemsSpacing: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setLegendSymbolBorderColor(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendSymbolBorderColor: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setLegendSymbolBorderWidth(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendSymbolBorderWidth: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setLegendSymbolShape(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendSymbolShape: dispatch.payload as NivoLegendSymbolShape,
  };
}

function responsiveLineChartReducer_setLegendSymbolSize(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendSymbolSize: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setLegendSymbolSpacing(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendSymbolSpacing: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setLegendTranslateX(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendTranslateX: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setLegendTranslateY(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    legendTranslateY: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setEnableAnimate(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    enableAnimate: dispatch.payload as boolean,
  };
}

function responsiveLineChartReducer_setMotionConfig(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    motionConfig: dispatch.payload as NivoMotionConfig,
  };
}

function responsiveLineChartReducer_setChartTitle(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    chartTitle: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setChartTitleColor(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    chartTitleColor: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setChartTitlePosition(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    chartTitlePosition: dispatch.payload as NivoChartTitlePosition,
  };
}

function responsiveLineChartReducer_setChartTitleSize(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    chartTitleSize: dispatch.payload as TitleOrder,
  };
}

function responsiveLineChartReducer_setScreenshotFilename(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    screenshotFilename: dispatch.payload as string,
  };
}

function responsiveLineChartReducer_setScreenshotImageQuality(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    screenshotImageQuality: dispatch.payload as number,
  };
}

function responsiveLineChartReducer_setScreenshotImageType(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    screenshotImageType: dispatch.payload as ScreenshotImageType,
  };
}

function responsiveLineChartReducer_resetChartToDefault(
  _state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return dispatch.payload as ResponsiveLineChartState;
}

function responsiveLineChartReducer_setIsError(
  state: ResponsiveLineChartState,
  dispatch: ResponsiveLineChartDispatch,
): ResponsiveLineChartState {
  return {
    ...state,
    isError: dispatch.payload as boolean,
  };
}

export { responsiveLineChartReducer };
