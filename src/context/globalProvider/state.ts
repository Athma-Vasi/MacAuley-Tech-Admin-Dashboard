import type { GlobalState, ThemeObject } from "./types";

const initialThemeObject: ThemeObject = {
  colorScheme: "light",
  respectReducedMotion: true,
  // white: '#f8f9fa', // gray.0
  white: "#f5f5f5",
  // black: '#212529', // gray.9
  black: "#25262b",
  primaryColor: "cyan",
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
  themeObject: initialThemeObject,
  isPrefersReducedMotion: false,
  customizeChartsPageData: {
    chartData: [],
    chartKind: "bar",
    chartTitle: "",
    chartUnitKind: "currency",
    selectedYYYYMMDD: new Date().toISOString().slice(0, 10),
  },
};

export { initialGlobalState };
