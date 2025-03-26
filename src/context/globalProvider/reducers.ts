import { MantineColor } from "@mantine/core";
import { type GlobalAction, globalAction } from "./actions";
import type {
  ChartKind,
  ColorScheme,
  ExpandBarChartData,
  ExpandCalendarChartData,
  ExpandLineChartData,
  ExpandPieChartData,
  ExpandRadialBarChartData,
  ExpandSunburstChartData,
  GlobalDispatch,
  GlobalState,
  Shade,
} from "./types";

function globalReducer(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  const reducer = globalReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const globalReducersMap = new Map<
  GlobalAction[keyof GlobalAction],
  (state: GlobalState, dispatch: GlobalDispatch) => GlobalState
>([
  [globalAction.setColorScheme, globalReducer_setColorScheme],
  [
    globalAction.setSelectedYYYYMMDD,
    globalReducer_setSelectedYYYYMMDD,
  ],
  [globalAction.setDefaultGradient, globalReducer_setDefaultGradient],
  [globalAction.setFontFamily, globalReducer_setFontFamily],
  [
    globalAction.setPrefersReducedMotion,
    globalReducer_setPrefersReducedMotion,
  ],
  [globalAction.setPrimaryColor, globalReducer_setPrimaryColor],
  [globalAction.setPrimaryShadeDark, globalReducer_setPrimaryShadeDark],
  [globalAction.setPrimaryShadeLight, globalReducer_setPrimaryShadeLight],
  [
    globalAction.setRespectReducedMotion,
    globalReducer_setRespectReducedMotion,
  ],
  [globalAction.setIsError, globalReducer_setIsError],
  [globalAction.setExpandBarChartData, globalReducer_setExpandBarChartData],
  [
    globalAction.setExpandCalendarChartData,
    globalReducer_setExpandCalendarChartData,
  ],
  [globalAction.setExpandLineChartData, globalReducer_setExpandLineChartData],
  [globalAction.setExpandPieChartData, globalReducer_setExpandPieChartData],
  [
    globalAction.setExpandRadialBarChartData,
    globalReducer_setExpandRadialBarChartData,
  ],
  [
    globalAction.setExpandSunburstChartData,
    globalReducer_setExpandSunburstChartData,
  ],
  [globalAction.setSelectedChartKind, globalReducer_setSelectedChartKind],
]);

function globalReducer_setColorScheme(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  const colorScheme = dispatch.payload as ColorScheme;
  const { components } = state.themeObject;
  const { Button, Text, Title } = components;

  // set button variant
  const { defaultProps } = Button;
  const newButtonDefaultProps = {
    ...defaultProps,
    variant: colorScheme === "dark" ? "outline" : "light",
  };

  // set text color
  const { defaultProps: textDefaultProps } = Text;
  const newTextDefaultProps = {
    ...textDefaultProps,
    color: colorScheme === "dark" ? "gray.5" : "gray.8",
  };

  // set title color
  const { defaultProps: titleDefaultProps } = Title;
  const newTitleDefaultProps = {
    ...titleDefaultProps,
    color: colorScheme === "dark" ? "dark.1" : "dark.4",
  };

  return {
    ...state,
    themeObject: {
      ...state.themeObject,
      colorScheme,
      components: {
        ...components,
        Button: {
          ...Button,
          defaultProps: newButtonDefaultProps,
        },
        Text: {
          ...Text,
          defaultProps: newTextDefaultProps,
        },
        Title: {
          ...Title,
          defaultProps: newTitleDefaultProps,
        },
      },
    },
  };
}

function globalReducer_setSelectedYYYYMMDD(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    selectedYYYYMMDD: dispatch.payload as string,
  };
}

function globalReducer_setDefaultGradient(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    themeObject: {
      ...state.themeObject,
      defaultGradient: dispatch.payload as {
        deg: number;
        from: MantineColor;
        to: MantineColor;
      },
    },
  };
}

function globalReducer_setFontFamily(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    themeObject: {
      ...state.themeObject,
      fontFamily: dispatch.payload as string,
    },
  };
}

function globalReducer_setPrefersReducedMotion(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    isPrefersReducedMotion: dispatch.payload as boolean,
  };
}

function globalReducer_setPrimaryColor(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    themeObject: {
      ...state.themeObject,
      primaryColor: dispatch.payload as MantineColor,
    },
  };
}

function globalReducer_setPrimaryShadeDark(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    themeObject: {
      ...state.themeObject,
      primaryShade: {
        ...state.themeObject.primaryShade,
        dark: dispatch.payload as Shade,
      },
    },
  };
}

function globalReducer_setPrimaryShadeLight(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    themeObject: {
      ...state.themeObject,
      primaryShade: {
        ...state.themeObject.primaryShade,
        light: dispatch.payload as Shade,
      },
    },
  };
}

function globalReducer_setRespectReducedMotion(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    themeObject: {
      ...state.themeObject,
      respectReducedMotion: dispatch.payload as boolean,
    },
  };
}

function globalReducer_setIsError(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    isError: dispatch.payload as boolean,
  };
}

function globalReducer_setExpandBarChartData(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    expandBarChartData: dispatch.payload as ExpandBarChartData,
  };
}

function globalReducer_setExpandCalendarChartData(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    expandCalendarChartData: dispatch.payload as ExpandCalendarChartData,
  };
}

function globalReducer_setExpandLineChartData(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    expandLineChartData: dispatch.payload as ExpandLineChartData,
  };
}

function globalReducer_setExpandPieChartData(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    expandPieChartData: dispatch.payload as ExpandPieChartData,
  };
}

function globalReducer_setExpandRadialBarChartData(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    expandRadialBarChartData: dispatch.payload as ExpandRadialBarChartData,
  };
}

function globalReducer_setExpandSunburstChartData(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    expandSunburstChartData: dispatch.payload as ExpandSunburstChartData,
  };
}

function globalReducer_setSelectedChartKind(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    selectedChartKind: dispatch.payload as ChartKind,
  };
}

export { globalReducer };
