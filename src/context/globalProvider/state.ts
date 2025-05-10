import type { GlobalState, ThemeObject } from "./types";

const initialThemeObject: ThemeObject = {
  colorScheme: "light",
  respectReducedMotion: true,
  // white: '#f8f9fa', // gray.0
  white: "#f8f9fa",
  // black: '#212529', // gray.9
  // black: "#25262b",
  black: "#121212",
  primaryColor: "dark",
  primaryShade: { light: 7, dark: 7 },
  defaultGradient: { deg: 45, from: "blue", to: "cyan" },
  fontFamily: "Work Sans",
  components: {
    Button: {
      defaultProps: {
        variant: "light",
      },
    },
    Text: {
      defaultProps: {
        color: "gray.8",
        size: "sm",
      },
    },
    Title: {
      defaultProps: {
        color: "dark.4",
      },
    },
  },
};

const initialGlobalState: GlobalState = {
  customerMetricsCategory: "new",
  customerMetricsDocument: null,
  directory: [],
  expandBarChartData: null,
  expandCalendarChartData: null,
  expandLineChartData: null,
  expandPieChartData: null,
  expandRadialBarChartData: null,
  expandSunburstChartData: null,
  financialMetricCategory: "profit",
  financialMetricsDocument: null,
  isError: false,
  isFetching: false,
  isPrefersReducedMotion: false,
  productMetricCategory: "All Products",
  productMetricsDocument: null,
  productSubMetricCategory: "revenue",
  repairMetricCategory: "All Repairs",
  repairMetricsDocument: null,
  selectedChartKind: "bar",
  selectedYYYYMMDD: new Date().toISOString().split("T")[0],
  storeLocation: "All Locations",
  themeObject: initialThemeObject,
};

export { initialGlobalState };
