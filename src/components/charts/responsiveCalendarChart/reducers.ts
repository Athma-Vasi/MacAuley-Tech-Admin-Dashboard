import type { TitleOrder } from "@mantine/core";
import type { ScreenshotImageType } from "../../../types";
import type {
  NivoCalendarAlign,
  NivoCalendarDirection,
  NivoCalendarLegendPosition,
  NivoChartTitlePosition,
} from "../types";
import { responsiveCalendarChartAction } from "./actions";
import type {
  ResponsiveCalendarChartAction,
  ResponsiveCalendarChartDispatch,
  ResponsiveCalendarChartState,
} from "./types";

function responsiveCalendarChartReducer(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  const reducer = responsiveCalendarChartReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const responsiveCalendarChartReducersMap = new Map<
  ResponsiveCalendarChartAction[keyof ResponsiveCalendarChartAction],
  (
    state: ResponsiveCalendarChartState,
    dispatch: ResponsiveCalendarChartDispatch,
  ) => ResponsiveCalendarChartState
>([
  // base
  [
    responsiveCalendarChartAction.setCalendarAlign,
    responsiveCalendarChartReducer_setCalendarAlign,
  ],
  [
    responsiveCalendarChartAction.setCalendarDirection,
    responsiveCalendarChartReducer_setCalendarDirection,
  ],

  // margin
  [
    responsiveCalendarChartAction.setMarginTop,
    responsiveCalendarChartReducer_setMarginTop,
  ],
  [
    responsiveCalendarChartAction.setMarginRight,
    responsiveCalendarChartReducer_setMarginRight,
  ],
  [
    responsiveCalendarChartAction.setMarginBottom,
    responsiveCalendarChartReducer_setMarginBottom,
  ],
  [
    responsiveCalendarChartAction.setMarginLeft,
    responsiveCalendarChartReducer_setMarginLeft,
  ],

  // style
  [
    responsiveCalendarChartAction.setEmptyColor,
    responsiveCalendarChartReducer_setEmptyColor,
  ],
  [
    responsiveCalendarChartAction.setEnableDefaultColors,
    responsiveCalendarChartReducer_setEnableDefaultColors,
  ],

  // years
  [
    responsiveCalendarChartAction.setYearLegendOffset,
    responsiveCalendarChartReducer_setYearLegendOffset,
  ],
  [
    responsiveCalendarChartAction.setYearLegendPosition,
    responsiveCalendarChartReducer_setYearLegendPosition,
  ],
  [
    responsiveCalendarChartAction.setYearSpacing,
    responsiveCalendarChartReducer_setYearSpacing,
  ],

  // months
  [
    responsiveCalendarChartAction.setMonthBorderColor,
    responsiveCalendarChartReducer_setMonthBorderColor,
  ],
  [
    responsiveCalendarChartAction.setMonthBorderWidth,
    responsiveCalendarChartReducer_setMonthBorderWidth,
  ],
  [
    responsiveCalendarChartAction.setMonthLegendOffset,
    responsiveCalendarChartReducer_setMonthLegendOffset,
  ],
  [
    responsiveCalendarChartAction.setMonthLegendPosition,
    responsiveCalendarChartReducer_setMonthLegendPosition,
  ],
  [
    responsiveCalendarChartAction.setMonthSpacing,
    responsiveCalendarChartReducer_setMonthSpacing,
  ],

  // days
  [
    responsiveCalendarChartAction.setDayBorderColor,
    responsiveCalendarChartReducer_setDayBorderColor,
  ],
  [
    responsiveCalendarChartAction.setDayBorderWidth,
    responsiveCalendarChartReducer_setDayBorderWidth,
  ],
  [
    responsiveCalendarChartAction.setDaySpacing,
    responsiveCalendarChartReducer_setDaySpacing,
  ],

  // options
  [
    responsiveCalendarChartAction.setChartTitle,
    responsiveCalendarChartReducer_setChartTitle,
  ],
  [
    responsiveCalendarChartAction.setChartTitleColor,
    responsiveCalendarChartReducer_setChartTitleColor,
  ],
  [
    responsiveCalendarChartAction.setChartTitlePosition,
    responsiveCalendarChartReducer_setChartTitlePosition,
  ],
  [
    responsiveCalendarChartAction.setChartTitleSize,
    responsiveCalendarChartReducer_setChartTitleSize,
  ],

  // screenshot
  [
    responsiveCalendarChartAction.setScreenshotFilename,
    responsiveCalendarChartReducer_setScreenshotFilename,
  ],
  [
    responsiveCalendarChartAction.setScreenshotImageQuality,
    responsiveCalendarChartReducer_setScreenshotImageQuality,
  ],
  [
    responsiveCalendarChartAction.setScreenshotImageType,
    responsiveCalendarChartReducer_setScreenshotImageType,
  ],

  // reset all
  [
    responsiveCalendarChartAction.resetChartToDefault,
    responsiveCalendarChartReducer_resetChartToDefault,
  ],

  // error
  [
    responsiveCalendarChartAction.setIsError,
    responsiveCalendarChartReducer_setIsError,
  ],
]);

function responsiveCalendarChartReducer_setCalendarAlign(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    calendarAlign: dispatch.payload as NivoCalendarAlign,
  };
}

function responsiveCalendarChartReducer_setCalendarDirection(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    calendarDirection: dispatch.payload as NivoCalendarDirection,
  };
}

function responsiveCalendarChartReducer_setMarginTop(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    marginTop: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setMarginRight(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    marginRight: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setMarginBottom(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    marginBottom: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setMarginLeft(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    marginLeft: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setEmptyColor(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    emptyColor: dispatch.payload as string,
  };
}

function responsiveCalendarChartReducer_setEnableDefaultColors(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    enableDefaultColors: dispatch.payload as boolean,
  };
}

function responsiveCalendarChartReducer_setYearLegendOffset(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    yearLegendOffset: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setYearLegendPosition(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    yearLegendPosition: dispatch.payload as NivoCalendarLegendPosition,
  };
}

function responsiveCalendarChartReducer_setYearSpacing(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    yearSpacing: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setMonthBorderColor(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    monthBorderColor: dispatch.payload as string,
  };
}

function responsiveCalendarChartReducer_setMonthBorderWidth(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    monthBorderWidth: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setMonthLegendOffset(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    monthLegendOffset: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setMonthLegendPosition(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    monthLegendPosition: dispatch.payload as NivoCalendarLegendPosition,
  };
}

function responsiveCalendarChartReducer_setMonthSpacing(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    monthSpacing: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setDayBorderColor(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    dayBorderColor: dispatch.payload as string,
  };
}

function responsiveCalendarChartReducer_setDayBorderWidth(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    dayBorderWidth: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setDaySpacing(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    daySpacing: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setChartTitle(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    chartTitle: dispatch.payload as string,
  };
}

function responsiveCalendarChartReducer_setChartTitleColor(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    chartTitleColor: dispatch.payload as string,
  };
}

function responsiveCalendarChartReducer_setChartTitlePosition(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    chartTitlePosition: dispatch.payload as NivoChartTitlePosition,
  };
}

function responsiveCalendarChartReducer_setChartTitleSize(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    chartTitleSize: dispatch.payload as TitleOrder,
  };
}

function responsiveCalendarChartReducer_setScreenshotFilename(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    screenshotFilename: dispatch.payload as string,
  };
}

function responsiveCalendarChartReducer_setScreenshotImageQuality(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    screenshotImageQuality: dispatch.payload as number,
  };
}

function responsiveCalendarChartReducer_setScreenshotImageType(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    screenshotImageType: dispatch.payload as ScreenshotImageType,
  };
}

function responsiveCalendarChartReducer_resetChartToDefault(
  _state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return dispatch.payload as ResponsiveCalendarChartState;
}

function responsiveCalendarChartReducer_setIsError(
  state: ResponsiveCalendarChartState,
  dispatch: ResponsiveCalendarChartDispatch,
): ResponsiveCalendarChartState {
  return {
    ...state,
    isError: dispatch.payload as boolean,
  };
}

export { responsiveCalendarChartReducer };
