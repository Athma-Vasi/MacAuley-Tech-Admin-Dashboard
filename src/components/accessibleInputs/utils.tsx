import { Space, Text } from "@mantine/core";
import { TbCheck, TbInfoCircle } from "react-icons/tb";

import { COLORS_SWATCHES } from "../../constants";
import type { ThemeObject } from "../../context/globalProvider/types";
import {
  capitalizeJoinWithAnd,
  formatDate,
  returnThemeColors,
  splitCamelCase,
} from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";
import {
  AccessibleButton,
  AccessibleButtonAttributes,
} from "./AccessibleButton";

type CreateAccessibleCheckboxSelectionsTextElements = {
  checked: boolean;
  deselectedDescription?: string;
  isIcons?: boolean;
  kind: "single" | "group";
  name: string;
  selectedDescription?: string;
  theme?: "muted" | "default";
  themeObject: ThemeObject;
  value: string | string[];
};

function createAccessibleCheckboxSelectionsTextElements({
  checked,
  deselectedDescription,
  isIcons = false,
  kind,
  name,
  selectedDescription,
  theme = "default",
  themeObject,
  value,
}: CreateAccessibleCheckboxSelectionsTextElements): {
  selectedTextElement: React.JSX.Element;
  deselectedTextElement: React.JSX.Element;
} {
  const {
    greenColorShade,
    grayColorShade,
    redColorShade,
    textColor,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const selectedIcon = theme === "default"
    ? <TbCheck color={greenColorShade} />
    : null;

  const stringifiedValue = Array.isArray(value)
    ? capitalizeJoinWithAnd(value)
    : value;

  const selectedText = selectedDescription ??
    (kind === "single"
      ? `${value} selected.`
      : `${stringifiedValue} ${value.length > 1 ? "are" : "is"} selected.`);

  const selectedTextElement = (
    <Text
      aria-live="polite"
      color={textColor}
      data-testid={`${name}-checkbox-selected-text`}
      id={`${name}-selected`}
      style={{ display: checked ? "block" : "none" }}
    >
      {isIcons ? selectedIcon : null} {selectedText}

      <Space h="xs" />
    </Text>
  );

  const deselectedIcon = theme === "default"
    ? <TbInfoCircle color={redColorShade} />
    : null;

  const deselectedText = deselectedDescription ?? "No selection made.";

  const deselectedTextElement = (
    <Text
      aria-live="polite"
      color={theme === "default" ? textColor : grayColorShade}
      data-testid={`${name}-checkbox-deselected-text`}
      id={`${name}-deselected`}
      style={{ display: !checked ? "block" : "none" }}
    >
      {isIcons ? deselectedIcon : null} {deselectedText}
    </Text>
  );

  return { selectedTextElement, deselectedTextElement };
}

type CreateAccessibleButtonScreenreaderTextElements = {
  disabledScreenreaderText?: string;
  enabledScreenreaderText?: string;
  isEnabled: boolean;
  name: string;
  theme?: "muted" | "default";
  themeObject: ThemeObject;
  type?: "submit" | "button" | "reset";
};

function createAccessibleButtonScreenreaderTextElements({
  disabledScreenreaderText,
  enabledScreenreaderText,
  isEnabled,
  name,
  theme = "default",
  themeObject,
  type = "submit",
}: CreateAccessibleButtonScreenreaderTextElements): {
  enabledTextElement: React.JSX.Element;
  disabledTextElement: React.JSX.Element;
} {
  const {
    greenColorShade,
    textColor,
    grayColorShade,
    redColorShade,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const enabledIcon = theme === "default"
    ? <TbCheck color={greenColorShade} />
    : null;

  const defaultEnabledText =
    `All form inputs are valid. ${name} is enabled. You may submit the form.`;

  const enabledTextElement = (
    <Text
      aria-live="polite"
      color={theme === "muted" ? textColor : greenColorShade}
      data-testid={`${name}-button-enabled-screenreader-text`}
      id={`${name}-enabled`}
      style={{ display: isEnabled ? "block" : "none" }}
      w="100%"
    >
      {enabledIcon}
      {enabledScreenreaderText ?? defaultEnabledText}
    </Text>
  );

  const disabledIcon = theme === "default"
    ? <TbInfoCircle color={redColorShade} />
    : null;

  const defaultDisabledText =
    `One or more inputs are in error. ${name} disabled. Please fix errors before submitting form.`;

  const disabledTextElement = (
    <Text
      aria-live="polite"
      color={theme === "default"
        ? (!isEnabled ? redColorShade : textColor)
        : grayColorShade}
      data-testid={`${name}-button-disabled-screenreader-text`}
      id={`${name}-disabled`}
      style={{ display: !isEnabled ? "block" : "none" }}
      w="100%"
    >
      {disabledIcon}
      {disabledScreenreaderText ?? defaultDisabledText}
    </Text>
  );

  return { enabledTextElement, disabledTextElement };
}

function returnValidationTexts(
  { name, value }: {
    name: ValidationKey;
    value: string;
  },
): {
  valueEmptyText: string;
  valueInvalidText: string;
  valueValidText: string;
} {
  const initialValidationTexts = {
    valueEmptyText: "",
    valueInvalidText: "",
    valueValidText: "",
  };
  const regexesArray = VALIDATION_FUNCTIONS_TABLE[name];
  const regexes = regexesArray.map(([regexOrFunc, errorMessage]) => {
    if (typeof regexOrFunc === "function") {
      return regexOrFunc(value) ? "" : errorMessage;
    }
    return regexOrFunc.test(value) ? "" : errorMessage;
  });
  const splitName = splitCamelCase(name);
  const partialInvalidText = regexes.join(" ");
  const valueInvalidText = `${splitName} is invalid. ${partialInvalidText}`;

  return {
    ...initialValidationTexts,
    valueInvalidText,
    valueValidText: `${splitName} is valid.`,
    valueEmptyText: `${splitName} is empty.`,
  };
}

function createAccessibleButtons(
  attributesArray: AccessibleButtonAttributes[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleButton key={index.toString()} attributes={attributes} />
  ));
}

export {
  createAccessibleButtons,
  createAccessibleButtonScreenreaderTextElements,
  createAccessibleCheckboxSelectionsTextElements,
  returnValidationTexts,
};
