import { MantineColor } from "@mantine/core";
import { type GlobalAction, globalAction } from "./actions";
import type {
  ColorScheme,
  CustomizeChartsPageData,
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
    globalAction.setCustomizeChartsPageData,
    globalReducer_setCustomizeChartsPageData,
  ],
  [
    globalAction.setCustomizeChartsPageDataSelectedYYYYMMDD,
    globalReducer_setCustomizeChartsPageDataSelectedYYYYMMDD,
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

function globalReducer_setCustomizeChartsPageData(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  const customizeChartsPageData = dispatch.payload as CustomizeChartsPageData;
  const existingYYYYMMDD = state.customizeChartsPageData?.selectedYYYYMMDD ??
    new Date().toISOString().slice(0, 10);

  let [existingYYYY, existingMM, existingDD] = existingYYYYMMDD.split("-");
  existingMM = existingMM.padStart(2, "0");
  existingDD = existingDD.padStart(2, "0");

  return {
    ...state,
    customizeChartsPageData: {
      ...customizeChartsPageData,
      selectedYYYYMMDD: `${existingYYYY}-${existingMM}-${existingDD}`,
    },
  };
}

function globalReducer_setCustomizeChartsPageDataSelectedYYYYMMDD(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  const { customizeChartsPageData } = state;
  if (!customizeChartsPageData) return state;

  const clonedCustomizeChartsPageData = structuredClone(
    customizeChartsPageData,
  );
  clonedCustomizeChartsPageData.selectedYYYYMMDD = dispatch.payload as string;

  return {
    ...state,
    customizeChartsPageData: clonedCustomizeChartsPageData,
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

export { globalReducer };
