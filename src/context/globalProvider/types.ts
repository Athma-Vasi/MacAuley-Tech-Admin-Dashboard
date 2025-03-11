import type {
  ContextStylesParams,
  CSSObject,
  MantineColor,
  MantineTheme,
  MantineThemeOverride,
} from "@mantine/core";
import type { ReactNode } from "react";

import type { BarChartData } from "../../components/charts/responsiveBarChart/types";
import type { CalendarChartData } from "../../components/charts/responsiveCalendarChart/types";
import type { LineChartData } from "../../components/charts/responsiveLineChart/types";
import type { PieChartData } from "../../components/charts/responsivePieChart/types";
import type { RadialBarChartData } from "../../components/charts/responsiveRadialBarChart/types";
import type { SunburstChartData } from "../../components/charts/responsiveSunburstChart/types";
import type { NivoChartUnitKind } from "../../components/charts/types";
import type { GlobalAction } from "./actions";
import type { SetPageInErrorPayload } from "../../types";

type ColorScheme = "light" | "dark";
type Shade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface ThemeComponent {
  defaultProps?:
    | Record<string, any>
    | ((theme: MantineTheme) => Record<string, any>);
  classNames?: Record<string, string>;
  styles?:
    | Record<string, CSSObject>
    | ((
      theme: MantineTheme,
      params: any,
      context: ContextStylesParams,
    ) => Record<string, CSSObject>);
  variants?: Record<
    PropertyKey,
    (
      theme: MantineTheme,
      params: any,
      context: ContextStylesParams,
    ) => Record<string, CSSObject>
  >;
  sizes?: Record<
    PropertyKey,
    (
      theme: MantineTheme,
      params: any,
      context: ContextStylesParams,
    ) => Record<string, CSSObject>
  >;
}

interface ThemeObject extends MantineThemeOverride {
  // Defines color scheme for all components, defaults to "light"
  colorScheme: ColorScheme;

  // Determines whether motion based animations should be disabled for
  // users who prefer to reduce motion in their OS settings
  respectReducedMotion: boolean;

  // White and black colors, defaults to '#fff' and '#000'
  white: string;
  black: string;

  // Key of theme.colors
  primaryColor: string;

  // Index of color from theme.colors that is considered primary
  primaryShade: { light: Shade; dark: Shade };

  // Default gradient used in components that support `variant="gradient"` (Button, ThemeIcon, etc.)
  defaultGradient: { deg: number; from: MantineColor; to: MantineColor };

  fontFamily: string;

  components: {
    [x: string]: ThemeComponent;
  };
}

type CustomizeChartsPageData =
  & {
    chartTitle: string;
    selectedYYYYMMDD?: string;
    chartUnitKind: NivoChartUnitKind;
  }
  & (
    | {
      chartKind: "bar";
      chartData: BarChartData[];
    }
    | {
      chartKind: "calendar";
      chartData: CalendarChartData[];
    }
    | {
      chartKind: "line";
      chartData: LineChartData[];
    }
    | {
      chartKind: "pie";
      chartData: PieChartData[];
    }
    | {
      chartKind: "radialBar";
      chartData: RadialBarChartData[];
    }
    | {
      chartKind: "sunburst";
      chartData: SunburstChartData[];
    }
  );

type GlobalState = {
  customizeChartsPageData: CustomizeChartsPageData | null;
  isPrefersReducedMotion: boolean;
  themeObject: ThemeObject;
};

type GlobalDispatch =
  | {
    action: GlobalAction["setPrefersReducedMotion"];
    payload: boolean;
  }
  | {
    action: GlobalAction["setColorScheme"];
    payload: ColorScheme;
  }
  | {
    action: GlobalAction["setPrimaryColor"];
    payload: MantineColor;
  }
  | {
    action: GlobalAction["setPrimaryShadeDark"];
    payload: Shade;
  }
  | {
    action: GlobalAction["setPrimaryShadeLight"];
    payload: Shade;
  }
  | {
    action: GlobalAction["setDefaultGradient"];
    payload: { deg: number; from: MantineColor; to: MantineColor };
  }
  | {
    action: GlobalAction["setFontFamily"];
    payload: string;
  }
  | {
    action: GlobalAction["setCustomizeChartsPageData"];
    payload: CustomizeChartsPageData;
  }
  | {
    action: GlobalAction["setCustomizeChartsPageDataSelectedYYYYMMDD"];
    payload: string;
  }
  | {
    action: GlobalAction["setPageInError"];
    payload: SetPageInErrorPayload;
  };

type GlobalReducer = (
  state: GlobalState,
  action: GlobalDispatch,
) => GlobalState;

type GlobalProviderProps = {
  children?: ReactNode;
};

export type {
  ColorScheme,
  CustomizeChartsPageData,
  GlobalDispatch,
  GlobalProviderProps,
  GlobalReducer,
  GlobalState,
  Shade,
  ThemeObject,
};
