import type { TitleOrder } from "@mantine/core";
import type { SetPageInErrorPayload } from "../../../types";
import type {
  NivoArcLabel,
  NivoChartTitlePosition,
  NivoColorScheme,
  NivoFillPatternObject,
  NivoMotionConfig,
  NivoTransitionMode,
} from "../types";
import {
  type ResponsiveSunburstChartAction,
  responsiveSunburstChartAction,
} from "./actions";
import { initialResponsiveSunburstChartState } from "./state";
import type {
  ResponsiveSunburstChartDispatch,
  ResponsiveSunburstChartState,
} from "./types";

function responsiveSunburstChartReducer(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  const reducer = responsiveSunburstChartReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const responsiveSunburstChartReducersMap = new Map<
  ResponsiveSunburstChartAction[keyof ResponsiveSunburstChartAction],
  (
    state: ResponsiveSunburstChartState,
    dispatch: ResponsiveSunburstChartDispatch,
  ) => ResponsiveSunburstChartState
>([
  // base
  [
    responsiveSunburstChartAction.setCornerRadius,
    responsiveSunburstChartReducer_setCornerRadius,
  ],

  // margin
  [
    responsiveSunburstChartAction.setMarginTop,
    responsiveSunburstChartReducer_setMarginTop,
  ],
  [
    responsiveSunburstChartAction.setMarginRight,
    responsiveSunburstChartReducer_setMarginRight,
  ],
  [
    responsiveSunburstChartAction.setMarginBottom,
    responsiveSunburstChartReducer_setMarginBottom,
  ],
  [
    responsiveSunburstChartAction.setMarginLeft,
    responsiveSunburstChartReducer_setMarginLeft,
  ],

  // style
  [
    responsiveSunburstChartAction.setChartBorderColor,
    responsiveSunburstChartReducer_setChartBorderColor,
  ],
  [
    responsiveSunburstChartAction.setChartBorderWidth,
    responsiveSunburstChartReducer_setChartBorderWidth,
  ],
  [
    responsiveSunburstChartAction.setChartColors,
    responsiveSunburstChartReducer_setChartColors,
  ],
  [
    responsiveSunburstChartAction.setEnableFillPatterns,
    responsiveSunburstChartReducer_setEnableFillPatterns,
  ],
  [
    responsiveSunburstChartAction.setFillPatterns,
    responsiveSunburstChartReducer_setFillPatterns,
  ],
  [
    responsiveSunburstChartAction.setInheritColorFromParent,
    responsiveSunburstChartReducer_setInheritColorFromParent,
  ],

  // arc labels
  [
    responsiveSunburstChartAction.setArcLabelsRadiusOffset,
    responsiveSunburstChartReducer_setArcLabelsRadiusOffset,
  ],
  [
    responsiveSunburstChartAction.setArcLabelsSkipAngle,
    responsiveSunburstChartReducer_setArcLabelsSkipAngle,
  ],
  [
    responsiveSunburstChartAction.setArcLabelsTextColor,
    responsiveSunburstChartReducer_setArcLabelsTextColor,
  ],
  [
    responsiveSunburstChartAction.setEnableArcLabels,
    responsiveSunburstChartReducer_setEnableArcLabels,
  ],
  [
    responsiveSunburstChartAction.setArcLabel,
    responsiveSunburstChartReducer_setArcLabel,
  ],

  // motion
  [
    responsiveSunburstChartAction.setEnableAnimate,
    responsiveSunburstChartReducer_setEnableAnimate,
  ],
  [
    responsiveSunburstChartAction.setMotionConfig,
    responsiveSunburstChartReducer_setMotionConfig,
  ],
  [
    responsiveSunburstChartAction.setTransitionMode,
    responsiveSunburstChartReducer_setTransitionMode,
  ],

  // options
  [
    responsiveSunburstChartAction.setChartTitle,
    responsiveSunburstChartReducer_setChartTitle,
  ],
  [
    responsiveSunburstChartAction.setChartTitleColor,
    responsiveSunburstChartReducer_setChartTitleColor,
  ],
  [
    responsiveSunburstChartAction.setChartTitlePosition,
    responsiveSunburstChartReducer_setChartTitlePosition,
  ],
  [
    responsiveSunburstChartAction.setChartTitleSize,
    responsiveSunburstChartReducer_setChartTitleSize,
  ],

  // screenshot
  [
    responsiveSunburstChartAction.setScreenshotFilename,
    responsiveSunburstChartReducer_setScreenshotFilename,
  ],
  [
    responsiveSunburstChartAction.setScreenshotImageQuality,
    responsiveSunburstChartReducer_setScreenshotImageQuality,
  ],

  // reset all
  [
    responsiveSunburstChartAction.resetChartToDefault,
    responsiveSunburstChartReducer_resetChartToDefault,
  ],

  [
    responsiveSunburstChartAction.setPageInError,
    responsiveSunburstChartReducer_setPageInError,
  ],
]);

function responsiveSunburstChartReducer_setCornerRadius(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    cornerRadius: dispatch.payload as number,
  };
}

function responsiveSunburstChartReducer_setMarginTop(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    marginTop: dispatch.payload as number,
  };
}

function responsiveSunburstChartReducer_setMarginRight(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    marginRight: dispatch.payload as number,
  };
}

function responsiveSunburstChartReducer_setMarginBottom(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    marginBottom: dispatch.payload as number,
  };
}

function responsiveSunburstChartReducer_setMarginLeft(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    marginLeft: dispatch.payload as number,
  };
}

function responsiveSunburstChartReducer_setChartBorderColor(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    chartBorderColor: dispatch.payload as string,
  };
}

function responsiveSunburstChartReducer_setChartBorderWidth(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    chartBorderWidth: dispatch.payload as number,
  };
}

function responsiveSunburstChartReducer_setChartColors(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    chartColors: dispatch.payload as NivoColorScheme,
  };
}

function responsiveSunburstChartReducer_setEnableFillPatterns(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    enableFillPatterns: dispatch.payload as boolean,
  };
}

function responsiveSunburstChartReducer_setFillPatterns(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    fillPatterns: dispatch.payload as NivoFillPatternObject[],
  };
}

function responsiveSunburstChartReducer_setInheritColorFromParent(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    inheritColorFromParent: dispatch.payload as boolean,
  };
}

function responsiveSunburstChartReducer_setArcLabelsRadiusOffset(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    arcLabelsRadiusOffset: dispatch.payload as number,
  };
}

function responsiveSunburstChartReducer_setArcLabelsSkipAngle(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    arcLabelsSkipAngle: dispatch.payload as number,
  };
}

function responsiveSunburstChartReducer_setArcLabelsTextColor(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    arcLabelsTextColor: dispatch.payload as string,
  };
}

function responsiveSunburstChartReducer_setEnableArcLabels(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    enableArcLabels: dispatch.payload as boolean,
  };
}

function responsiveSunburstChartReducer_setArcLabel(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    arcLabel: dispatch.payload as NivoArcLabel,
  };
}

function responsiveSunburstChartReducer_setEnableAnimate(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    enableAnimate: dispatch.payload as boolean,
  };
}

function responsiveSunburstChartReducer_setMotionConfig(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    motionConfig: dispatch.payload as NivoMotionConfig,
  };
}

function responsiveSunburstChartReducer_setTransitionMode(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    transitionMode: dispatch.payload as NivoTransitionMode,
  };
}

function responsiveSunburstChartReducer_setChartTitle(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    chartTitle: dispatch.payload as string,
  };
}

function responsiveSunburstChartReducer_setChartTitleColor(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    chartTitleColor: dispatch.payload as string,
  };
}

function responsiveSunburstChartReducer_setChartTitlePosition(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    chartTitlePosition: dispatch.payload as NivoChartTitlePosition,
  };
}

function responsiveSunburstChartReducer_setChartTitleSize(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    chartTitleSize: dispatch.payload as TitleOrder,
  };
}

function responsiveSunburstChartReducer_setScreenshotFilename(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    screenshotFilename: dispatch.payload as string,
  };
}

function responsiveSunburstChartReducer_setScreenshotImageQuality(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...state,
    screenshotImageQuality: dispatch.payload as number,
  };
}

function responsiveSunburstChartReducer_resetChartToDefault(
  _state: ResponsiveSunburstChartState,
  _dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
  return {
    ...initialResponsiveSunburstChartState,
  };
}

function responsiveSunburstChartReducer_setPageInError(
  state: ResponsiveSunburstChartState,
  dispatch: ResponsiveSunburstChartDispatch,
): ResponsiveSunburstChartState {
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

export { responsiveSunburstChartReducer };
