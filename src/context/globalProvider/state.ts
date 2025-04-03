import type { GlobalState, ThemeObject } from "./types";

const initialThemeObject: ThemeObject = {
  colorScheme: "light",
  respectReducedMotion: true,
  // white: '#f8f9fa', // gray.0
  white: "#f8f9fa",
  // black: '#212529', // gray.9
  // black: "#25262b",
  black: "#121212",
  primaryColor: "violet",
  primaryShade: { light: 5, dark: 7 },
  defaultGradient: { deg: 45, from: "blue", to: "cyan" },
  fontFamily: "sans-serif",
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
  financialMetricsDocument: null,
  productMetricsDocument: null,
  customerMetricsDocument: null,
  repairMetricsDocument: null,
  expandBarChartData: null,
  expandCalendarChartData: null,
  expandLineChartData: null,
  expandPieChartData: null,
  expandRadialBarChartData: null,
  expandSunburstChartData: null,
  isError: false,
  isPrefersReducedMotion: false,
  selectedChartKind: "bar",
  selectedYYYYMMDD: new Date().toISOString().split("T")[0],
  themeObject: initialThemeObject,
};

export { initialGlobalState };
