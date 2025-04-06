import { MantineColor } from "@mantine/core";
import { CustomerMetricsCategory } from "../../components/dashboard/customer/types";
import { FinancialMetricCategory } from "../../components/dashboard/financial/types";
import {
  ProductMetricCategory,
  ProductSubMetric,
} from "../../components/dashboard/product/types";
import { RepairMetricCategory } from "../../components/dashboard/repair/types";
import {
  CustomerMetricsDocument,
  FinancialMetricsDocument,
  FontFamily,
  ProductMetricsDocument,
  RepairMetricsDocument,
} from "../../types";
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
  [
    globalAction.setProductMetricCategory,
    globalReducer_setProductMetricCategory,
  ],
  [
    globalAction.setProductSubMetricCategory,
    globalReducer_setProductSubMetricCategory,
  ],
  [
    globalAction.setRepairMetricCategory,
    globalReducer_setRepairMetricCategory,
  ],
  [
    globalAction.setFinancialMetricCategory,
    globalReducer_setFinancialMetricCategory,
  ],
  [
    globalAction.setCustomerMetricsCategory,
    globalReducer_setCustomerMetricsCategory,
  ],
  [
    globalAction.setFinancialMetricsDocument,
    globalReducer_setFinancialMetricsDocument,
  ],
  [
    globalAction.setProductMetricsDocument,
    globalReducer_setProductMetricsDocument,
  ],
  [
    globalAction.setCustomerMetricsDocument,
    globalReducer_setCustomerMetricsDocument,
  ],
  [
    globalAction.setRepairMetricsDocument,
    globalReducer_setRepairMetricsDocument,
  ],
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
  [globalAction.setIsFetching, globalReducer_setIsFetching],
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

function globalReducer_setProductMetricCategory(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    productMetricCategory: dispatch.payload as ProductMetricCategory,
  };
}

function globalReducer_setProductSubMetricCategory(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    productSubMetricCategory: dispatch.payload as ProductSubMetric,
  };
}

function globalReducer_setRepairMetricCategory(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    repairMetricCategory: dispatch.payload as RepairMetricCategory,
  };
}

function globalReducer_setFinancialMetricCategory(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    financialMetricCategory: dispatch.payload as FinancialMetricCategory,
  };
}

function globalReducer_setCustomerMetricsCategory(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    customerMetricsCategory: dispatch.payload as CustomerMetricsCategory,
  };
}

function globalReducer_setFinancialMetricsDocument(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    financialMetricsDocument: dispatch.payload as FinancialMetricsDocument,
  };
}

function globalReducer_setProductMetricsDocument(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    productMetricsDocument: dispatch.payload as ProductMetricsDocument,
  };
}

function globalReducer_setCustomerMetricsDocument(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    customerMetricsDocument: dispatch.payload as CustomerMetricsDocument,
  };
}

function globalReducer_setRepairMetricsDocument(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    repairMetricsDocument: dispatch.payload as RepairMetricsDocument,
  };
}

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
      fontFamily: dispatch.payload as FontFamily,
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

function globalReducer_setIsFetching(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    isFetching: dispatch.payload as boolean,
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
