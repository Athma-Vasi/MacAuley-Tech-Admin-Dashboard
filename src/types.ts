import {
    ContextStylesParams,
    CSSObject,
    MantineColor,
    MantineTheme,
    MantineThemeOverride,
} from "@mantine/core";
import { ValidationKey } from "./validations";

type CheckboxRadioSelectData<Payload extends string = string> = Array<{
    label: string;
    value: Payload;
}>;

type SliderMarksData = Array<{
    label: string;
    value: number;
}>;

type ScreenshotImageType = "image/png" | "image/jpeg" | "image/webp";

type SetPageInErrorPayload = {
    kind: "add" | "delete";
    page: number;
};

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

type ValidationFunctionsTable = Record<ValidationKey, Validation>;

/** input popover error messages are determined by partials tests */
type Validation = [RegExp | ((value: string) => boolean), string][];

type StoreLocation = "Calgary" | "Edmonton" | "Vancouver";

export type {
    CheckboxRadioSelectData,
    ColorScheme,
    ScreenshotImageType,
    SetPageInErrorPayload,
    Shade,
    SliderMarksData,
    StoreLocation,
    ThemeComponent,
    ThemeObject,
    Validation,
    ValidationFunctionsTable,
};
