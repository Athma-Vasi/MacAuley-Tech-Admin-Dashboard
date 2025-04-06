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
import type { ChartUnitKind } from "../../components/charts/types";
import { CustomerMetricsCategory } from "../../components/dashboard/customer/types";
import { FinancialMetricCategory } from "../../components/dashboard/financial/types";
import { ProductSubMetric } from "../../components/dashboard/product/types";
import { RepairMetricCategory } from "../../components/dashboard/repair/types";
import {
  DashboardCalendarView,
  ProductCategory,
} from "../../components/dashboard/types";
import {
  CustomerMetricsDocument,
  FinancialMetricsDocument,
  FontFamily,
  ProductMetricsDocument,
  RepairMetricsDocument,
} from "../../types";
import type { GlobalAction } from "./actions";

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

  fontFamily: FontFamily;

  components: {
    [x: string]: ThemeComponent;
  };
}

type CustomizeChartsData = {
  calendarView: DashboardCalendarView;
  chartTitle: string;
  chartUnitKind: ChartUnitKind;
  day: string;
  month: string;
  year: string;
};

type ExpandBarChartData = CustomizeChartsData & {
  chartKind: "bar";
  chartData: BarChartData[];
  indexBy: string;
  keys: string[];
};

type ExpandCalendarChartData = CustomizeChartsData & {
  calendarChartYAxis: string;
  chartKind: "calendar";
  chartData: CalendarChartData[];
};

type ExpandLineChartData = CustomizeChartsData & {
  chartKind: "line";
  chartData: LineChartData[];
};

type ExpandPieChartData = CustomizeChartsData & {
  chartKind: "pie";
  chartData: PieChartData[];
};

type ExpandRadialBarChartData = CustomizeChartsData & {
  chartKind: "radial";
  chartData: RadialBarChartData[];
};

type ExpandSunburstChartData = CustomizeChartsData & {
  chartKind: "sunburst";
  chartData: SunburstChartData[];
};

type ChartKind = "bar" | "calendar" | "line" | "pie" | "radial" | "sunburst";

type GlobalState = {
  customerMetricsCategory: CustomerMetricsCategory;
  customerMetricsDocument: CustomerMetricsDocument | null;
  expandBarChartData: ExpandBarChartData | null;
  expandCalendarChartData: ExpandCalendarChartData | null;
  expandLineChartData: ExpandLineChartData | null;
  expandPieChartData: ExpandPieChartData | null;
  expandRadialBarChartData: ExpandRadialBarChartData | null;
  expandSunburstChartData: ExpandSunburstChartData | null;
  financialMetricCategory: FinancialMetricCategory;
  financialMetricsDocument: FinancialMetricsDocument | null;
  isError: boolean;
  isFetching: boolean;
  isPrefersReducedMotion: boolean;
  productMetricCategory: ProductCategory | "All Products";
  productMetricsDocument: ProductMetricsDocument | null;
  productSubMetricCategory: ProductSubMetric;
  repairMetricCategory: RepairMetricCategory;
  repairMetricsDocument: RepairMetricsDocument | null;
  selectedChartKind: ChartKind;
  selectedYYYYMMDD: string;
  themeObject: ThemeObject;
};

type GlobalDispatch =
  | {
    action: GlobalAction["setIsFetching"];
    payload: CustomerMetricsCategory;
  }
  | {
    action: GlobalAction["setProductMetricCategory"];
    payload: ProductCategory | "All Products";
  }
  | {
    action: GlobalAction["setProductSubMetricCategory"];
    payload: ProductSubMetric;
  }
  | {
    action: GlobalAction["setRepairMetricCategory"];
    payload: RepairMetricCategory;
  }
  | {
    action: GlobalAction["setFinancialMetricCategory"];
    payload: FinancialMetricCategory;
  }
  | {
    action: GlobalAction["setCustomerMetricsCategory"];
    payload: CustomerMetricsCategory;
  }
  | {
    action: GlobalAction["setFinancialMetricsDocument"];
    payload: FinancialMetricsDocument;
  }
  | {
    action: GlobalAction["setProductMetricsDocument"];
    payload: ProductMetricsDocument;
  }
  | {
    action: GlobalAction["setCustomerMetricsDocument"];
    payload: CustomerMetricsDocument;
  }
  | {
    action: GlobalAction["setRepairMetricsDocument"];
    payload: RepairMetricsDocument;
  }
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
    payload: FontFamily;
  }
  | {
    action: GlobalAction["setSelectedChartKind"];
    payload: ChartKind;
  }
  | {
    action: GlobalAction["setSelectedYYYYMMDD"];
    payload: string;
  }
  | {
    action: GlobalAction["setIsError"];
    payload: boolean;
  }
  | {
    action: GlobalAction["setExpandBarChartData"];
    payload: ExpandBarChartData;
  }
  | {
    action: GlobalAction["setExpandCalendarChartData"];
    payload: ExpandCalendarChartData;
  }
  | {
    action: GlobalAction["setExpandLineChartData"];
    payload: ExpandLineChartData;
  }
  | {
    action: GlobalAction["setExpandPieChartData"];
    payload: ExpandPieChartData;
  }
  | {
    action: GlobalAction["setExpandRadialBarChartData"];
    payload: ExpandRadialBarChartData;
  }
  | {
    action: GlobalAction["setExpandSunburstChartData"];
    payload: ExpandSunburstChartData;
  };

type GlobalReducer = (
  state: GlobalState,
  action: GlobalDispatch,
) => GlobalState;

type GlobalProviderProps = {
  children?: ReactNode;
};

export type {
  ChartKind,
  ColorScheme,
  CustomizeChartsData,
  ExpandBarChartData,
  ExpandCalendarChartData,
  ExpandLineChartData,
  ExpandPieChartData,
  ExpandRadialBarChartData,
  ExpandSunburstChartData,
  GlobalDispatch,
  GlobalProviderProps,
  GlobalReducer,
  GlobalState,
  Shade,
  ThemeObject,
};
