import { Space, Text } from "@mantine/core";
import { TbCheck, TbInfoCircle } from "react-icons/tb";

import { COLORS_SWATCHES } from "../../constants";
import type { ThemeObject } from "../../context/globalProvider/types";
import { ValidationFunctionsTable } from "../../types";
import {
  capitalizeJoinWithAnd,
  returnThemeColors,
  splitCamelCase,
} from "../../utils";
import { ValidationKey } from "../../validations";
import {
  AccessibleButton,
  type AccessibleButtonAttributes,
} from "./AccessibleButton";
import {
  AccessibleSelectInput,
  type AccessibleSelectInputAttributes,
} from "./AccessibleSelectInput";
import {
  AccessibleSwitchInput,
  AccessibleSwitchInputAttributes,
} from "./AccessibleSwitchInput";

type CreateAccessibleValueValidationTextElements = {
  isPopoverOpened: boolean;
  isValueBufferValid: boolean;
  arePasswordsDifferent?: boolean;
  name: string;
  themeObject: ThemeObject;
  valueBuffer: string;
  validationTexts: {
    valueInvalidText: string;
    valueValidText: string;
  };
};

function createAccessibleValueValidationTextElements({
  isPopoverOpened,
  isValueBufferValid,
  arePasswordsDifferent,
  name,
  themeObject,
  valueBuffer,
  validationTexts: { valueInvalidText, valueValidText },
}: CreateAccessibleValueValidationTextElements): {
  validValueTextElement: React.JSX.Element;
  invalidValueTextElement: React.JSX.Element;
} {
  const {
    redColorShade,
  } = returnThemeColors({ themeObject, colorsSwatches: COLORS_SWATCHES });

  const invalidValueTextElement = (
    <Text
      color={redColorShade}
      id={`${name}-invalid-text`}
      style={{
        display: isPopoverOpened && valueBuffer && !isValueBufferValid
          ? "inline-block"
          : "none",
      }}
      w="100%"
    >
      {valueInvalidText}
      {arePasswordsDifferent ? "Passwords do not match." : ""}
    </Text>
  );

  const validValueTextElement = (
    <Text
      color={redColorShade}
      id={`${name}-valid-text`}
      style={{
        display: isPopoverOpened && valueBuffer && isValueBufferValid
          ? "block"
          : "none",
      }}
      w="100%"
    >
      {valueValidText}
    </Text>
  );

  return { invalidValueTextElement, validValueTextElement };
}

type CreateAccessibleNavLinkTextElements = {
  active: boolean;
  description: string;
  name: string;
  themeObject: ThemeObject;
};

function createAccessibleNavLinkTextElement({
  active,
  description,
  name,
  themeObject,
}: CreateAccessibleNavLinkTextElements): {
  screenreaderTextElement: React.JSX.Element;
} {
  const {
    greenColorShade,
    textColor,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const screenreaderTextElement = (
    <Text
      aria-live="polite"
      color={active ? textColor : greenColorShade}
      data-testid={`${name}-navlink-selected-screenreader-text`}
      id={`${name}-selected`}
      w="100%"
    >
      {description}
    </Text>
  );

  return { screenreaderTextElement };
}

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

type AccessibleImageTextElements = {
  description: string;
  name: string;
  themeObject: ThemeObject;
};

function createAccessibleImageTextElement(
  { description, name, themeObject }: AccessibleImageTextElements,
): {
  screenreaderTextElement: React.JSX.Element;
} {
  const screenreaderTextElement = (
    <Text
      aria-live="polite"
      data-testid={`${name}-image-screenreader-text`}
      id={`${name}-selected`}
      w="100%"
    >
      {description}
    </Text>
  );

  return { screenreaderTextElement };
}

type CreateAccessibleSliderSelectionTextElements = {
  name: string;
  theme?: "muted" | "default";
  themeObject: ThemeObject;
  value: number;
};

function createAccessibleSliderScreenreaderTextElements({
  name,
  theme = "default",
  themeObject,
  value,
}: CreateAccessibleSliderSelectionTextElements): {
  screenreaderTextElement: React.JSX.Element;
} {
  const {
    greenColorShade,
    textColor,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const icon = theme === "default" ? <TbCheck color={greenColorShade} /> : null;

  const screenreaderTextElement = (
    <Text
      aria-live="polite"
      color={theme === "muted" ? textColor : greenColorShade}
      data-testid={`${name}-slider-screenreader-text`}
      id={`${name}-selected`}
      w="100%"
    >
      {icon}
      {`For ${name}, ${value} selected.`}
    </Text>
  );

  return { screenreaderTextElement };
}

type CreateAccessibleSwitchSelectionTextElements = {
  checked: boolean;
  name: string;
  switchOffDescription?: string;
  switchOnDescription?: string;
  theme?: "muted" | "default";
  themeObject: ThemeObject;
};

function createAccessibleSwitchOnOffTextElements({
  checked,
  name,
  switchOffDescription,
  switchOnDescription,
  themeObject,
  theme = "default",
}: CreateAccessibleSwitchSelectionTextElements): {
  switchOnTextElement: React.JSX.Element;
  switchOffTextElement: React.JSX.Element;
} {
  const {
    grayColorShade,
    redColorShade,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const switchOnText = switchOnDescription ?? `${name} is on.`;

  const switchOnTextElement = (
    <Text
      aria-live="polite"
      color={grayColorShade}
      data-testid={`${name}-switch-on-screenreader-text`}
      id={`${name}-on`}
      w="100%"
    >
      {switchOnText}
    </Text>
  );

  const switchOffText = switchOffDescription ?? `${name} is off.`;

  const switchOffTextElement = (
    <Text
      aria-live="polite"
      color={theme === "default" ? redColorShade : grayColorShade}
      data-testid={`${name}-switch-off-screenreader-text`}
      id={`${name}-off`}
      w="100%"
    >
      {switchOffText}
    </Text>
  );

  return { switchOnTextElement, switchOffTextElement };
}

function createAccessibleSelectInputs<
  ValidValueAction extends string = string,
  Payload extends string = string,
>(
  attributesArray: AccessibleSelectInputAttributes<
    ValidValueAction,
    Payload
  >[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleSelectInput
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

function createAccessibleButtons(
  attributesArray: AccessibleButtonAttributes[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleButton key={index.toString()} attributes={attributes} />
  ));
}

function createAccessibleSwitchInputs<
  ValidValueAction extends string = string,
>(
  attributesArray: AccessibleSwitchInputAttributes<
    ValidValueAction
  >[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleSwitchInput
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

type ValidationTexts = {
  valueValidText: string;
  valueInvalidText: string;
};

function returnValidationTexts(
  { name, validationFunctionsTable, valueBuffer }: {
    name: ValidationKey;
    validationFunctionsTable: ValidationFunctionsTable;
    valueBuffer: string;
  },
): ValidationTexts {
  const initialValidationTexts = {
    valueInvalidText: "",
    valueValidText: "",
  };
  const regexesArray = validationFunctionsTable[name];
  const regexes = regexesArray.map(([regexOrFunc, errorMessage]) => {
    if (typeof regexOrFunc === "function") {
      return regexOrFunc(valueBuffer) ? "" : errorMessage;
    }
    return regexOrFunc.test(valueBuffer) ? "" : errorMessage;
  });
  const partialInvalidText = regexes.join(" ");
  const valueInvalidText = `${
    splitCamelCase(name)
  } is invalid. ${partialInvalidText}`;
  const valueValidText = `${splitCamelCase(name)} is valid.`;

  return {
    ...initialValidationTexts,
    valueInvalidText,
    valueValidText,
  };
}

export {
  createAccessibleButtons,
  createAccessibleButtonScreenreaderTextElements,
  createAccessibleCheckboxSelectionsTextElements,
  createAccessibleImageTextElement,
  createAccessibleNavLinkTextElement,
  createAccessibleSelectInputs,
  createAccessibleSliderScreenreaderTextElements,
  createAccessibleSwitchInputs,
  createAccessibleSwitchOnOffTextElements,
  createAccessibleValueValidationTextElements,
  returnValidationTexts,
};
