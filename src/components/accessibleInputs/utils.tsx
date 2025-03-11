import { Flex, Highlight, Space, Text } from "@mantine/core";
import { TbCheck, TbInfoCircle } from "react-icons/tb";

import { COLORS_SWATCHES } from "../../constants/data";
import type { ThemeObject } from "../../context/globalProvider/types";
import type {
  StepperPage,
  Validation,
  ValidationFunctionsTable,
} from "../../types";
import {
  capitalizeJoinWithAnd,
  returnThemeColors,
  splitCamelCase,
} from "../../utils";
import {
  AccessibleButton,
  type AccessibleButtonAttributes,
} from "./AccessibleButton";
import {
  AccessibleCheckboxInputGroup,
  type AccessibleCheckboxInputGroupAttributes,
  AccessibleCheckboxInputSingle,
  type AccessibleCheckboxInputSingleAttributes,
} from "./AccessibleCheckboxInput";
import {
  AccessibleDateTimeInput,
  type AccessibleDateTimeInputAttributes,
} from "./AccessibleDateTimeInput";
import {
  AccessibleRadioInputGroup,
  type AccessibleRadioInputGroupAttributes,
  AccessibleRadioInputSingle,
  type AccessibleRadioInputSingleAttributes,
} from "./AccessibleRadioInput";
import {
  AccessibleSelectInput,
  type AccessibleSelectInputAttributes,
} from "./AccessibleSelectInput";
import {
  AccessibleSwitchInput,
  type AccessibleSwitchInputAttributes,
} from "./AccessibleSwitchInput";
import {
  AccessibleTextAreaInput,
  type AccessibleTextAreaInputAttributes,
} from "./AccessibleTextAreaInput";
import {
  AccessibleTextInputPhone,
  type AccessibleTextInputPhoneAttributes,
} from "./AccessibleTextInputPhone";
import {
  AccessibleTextInputPostal,
  type AccessibleTextInputPostalAttributes,
} from "./AccessibleTextInputPostal";
import {
  AccessibleTextInput,
  type AccessibleTextInputAttributes,
} from "./text/AccessibleTextInput";

type CreateAccessibleValueValidationTextElements = {
  isPopoverOpened: boolean;
  isValueBufferValid: boolean;
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
  name,
  themeObject,
  valueBuffer,
  validationTexts: { valueInvalidText, valueValidText },
}: CreateAccessibleValueValidationTextElements): {
  invalidValueTextElement: React.JSX.Element;
} {
  const {
    generalColors: { redColorShade },
  } = returnThemeColors({ themeObject, colorsSwatches: COLORS_SWATCHES });

  const invalidValueTextElement = (
    <Text
      id={`${name}-invalid`}
      style={{
        display: isPopoverOpened && valueBuffer && !isValueBufferValid
          ? "inline-block"
          : "none",
      }}
      w="100%"
      aria-live="polite"
    >
      {
        /* <Grid columns={14}>
        <Grid.Col span={2}>
          <Group position="center">
            <TbExclamationCircle color={redColorShade} size={22} />
          </Group>
        </Grid.Col>
        <Grid.Col span={12}>
          <Group position="right">
            <Text >{valueInvalidText}</Text>
          </Group>
        </Grid.Col>
      </Grid> */
      }
      <Text color={redColorShade}>{valueInvalidText}</Text>
    </Text>
  );

  // const validValueTextElement = (
  //   <Text
  //     id={`${name}-valid`}
  //     style={{
  //       display: isPopoverOpened && valueBuffer && isValueBufferValid
  //         ? "block"
  //         : "none",
  //     }}
  //     color={greenColorShade}
  //     w="100%"
  //     aria-live="polite"
  //   >
  //     <Grid columns={14}>
  //       <Grid.Col span={2}>
  //         <Group position="center">
  //           <TbCheck color={greenColorShade} size={22} />
  //         </Group>
  //       </Grid.Col>
  //       <Grid.Col span={12}>
  //         <Group position="left">
  //           <Text size="sm">{valueValidText}</Text>
  //         </Group>
  //       </Grid.Col>
  //     </Grid>
  //   </Text>
  // );

  return { invalidValueTextElement };
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
    generalColors: {
      greenColorShade,
      grayColorShade,
      redColorShade,
      darkSchemeGray,
    },
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
      color={darkSchemeGray}
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
      color={theme === "default" ? darkSchemeGray : grayColorShade}
      id={`${name}-deselected`}
      style={{ display: !checked ? "block" : "none" }}
    >
      {isIcons ? deselectedIcon : null} {deselectedText}
    </Text>
  );

  return { selectedTextElement, deselectedTextElement };
}

type CreateAccessibleRadioSelectionTextElements = {
  name: string;
  theme?: "muted" | "default";
  themeObject: ThemeObject;
  value: string;
};

function createAccessibleRadioScreenreaderTextElements({
  name,
  themeObject,
  value,
  theme = "default",
}: CreateAccessibleRadioSelectionTextElements): {
  screenreaderTextElement: React.JSX.Element;
} {
  const {
    generalColors: { greenColorShade, textColor },
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const icon = theme === "default" ? <TbCheck color={greenColorShade} /> : null;

  const screenreaderTextElement = (
    <Text
      id={`${name}-selected`}
      color={theme === "muted" ? textColor : greenColorShade}
      w="100%"
      aria-live="polite"
    >
      {icon}
      {`For ${name}, ${value} selected.`}
    </Text>
  );

  return { screenreaderTextElement };
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
    generalColors: {
      greenColorShade,
      textColor,
      grayColorShade,
      redColorShade,
    },
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
      id={`${name}-enabled`}
      style={{ display: isEnabled ? "block" : "none" }}
      color={theme === "muted" ? textColor : greenColorShade}
      w="100%"
      aria-live="polite"
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
      id={`${name}-disabled`}
      style={{ display: !isEnabled ? "block" : "none" }}
      color={theme === "default"
        ? (!isEnabled ? redColorShade : textColor)
        : grayColorShade}
      w="100%"
      aria-live="polite"
    >
      {disabledIcon}
      {disabledScreenreaderText ?? defaultDisabledText}
    </Text>
  );

  return { enabledTextElement, disabledTextElement };
}

type AccessiblePaginationTextElements = {
  currentPage: number;
  name: string;
  themeObject: ThemeObject;
  totalPages: number;
};

function createAccessiblePaginationTextElement({
  currentPage,
  name,
  themeObject,
  totalPages,
}: AccessiblePaginationTextElements): {
  screenreaderTextElement: React.JSX.Element;
} {
  const {
    generalColors: { greenColorShade, textColor },
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const screenreaderTextElement = (
    <Text
      id={`${name}-selected`}
      w="100%"
      aria-live="polite"
    >
      {`Page ${currentPage} of ${totalPages} selected.`}
    </Text>
  );

  return { screenreaderTextElement };
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
  const {
    generalColors: { greenColorShade, textColor },
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const screenreaderTextElement = (
    <Text
      id={`${name}-selected`}
      w="100%"
      aria-live="polite"
    >
      {description}
    </Text>
  );

  return { screenreaderTextElement };
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
    generalColors: { greenColorShade, textColor },
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const screenreaderTextElement = (
    <Text
      id={`${name}-selected`}
      color={active ? textColor : greenColorShade}
      w="100%"
      aria-live="polite"
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
    generalColors: { greenColorShade, textColor },
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const icon = theme === "default" ? <TbCheck color={greenColorShade} /> : null;

  const screenreaderTextElement = (
    <Text
      id={`${name}-selected`}
      color={theme === "muted" ? textColor : greenColorShade}
      w="100%"
      aria-live="polite"
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
    generalColors: { grayColorShade, redColorShade, greenColorShade },
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const switchOnText = switchOnDescription ?? `${name} is on.`;

  const switchOnTextElement = (
    <Text
      id={`${name}-on`}
      color={grayColorShade}
      w="100%"
      aria-live="polite"
    >
      {switchOnText}
    </Text>
  );

  const switchOffText = switchOffDescription ?? `${name} is off.`;

  const switchOffTextElement = (
    <Text
      id={`${name}-off`}
      color={theme === "default" ? redColorShade : grayColorShade}
      w="100%"
      aria-live="polite"
    >
      {switchOffText}
    </Text>
  );

  return { switchOnTextElement, switchOffTextElement };
}

function createAccessibleTextInputs<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  attributesArray: AccessibleTextInputAttributes<
    ValidValueAction,
    InvalidValueAction
  >[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleTextInput
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

function createAccessibleTextAreaInputs<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  attributesArray: AccessibleTextAreaInputAttributes<
    ValidValueAction,
    InvalidValueAction
  >[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleTextAreaInput
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

function createAccessibleCheckboxSingleInputs<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  attributesArray: AccessibleCheckboxInputSingleAttributes<
    ValidValueAction,
    InvalidValueAction
  >[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleCheckboxInputSingle
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

function createAccessibleCheckboxGroupInputs<
  ValidValueAction extends string = string,
  Payload extends string = string,
>(
  attributesArray: AccessibleCheckboxInputGroupAttributes<
    ValidValueAction,
    Payload
  >[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleCheckboxInputGroup
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

function createAccessibleRadioSingleInputs<
  ValidValueAction extends string = string,
>(
  attributesArray: AccessibleRadioInputSingleAttributes<ValidValueAction>[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleRadioInputSingle
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

function createAccessibleRadioGroupInputs<
  ValidValueAction extends string = string,
>(
  attributesArray: AccessibleRadioInputGroupAttributes<ValidValueAction>[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleRadioInputGroup
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

function createAccessibleSelectInputs<
  ValidValueAction extends string = string,
  Payload extends string = string,
>(
  attributesArray: AccessibleSelectInputAttributes<ValidValueAction, Payload>[],
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

function createAccessibleTextInputsPostal<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  attributesArray: AccessibleTextInputPostalAttributes<
    ValidValueAction,
    InvalidValueAction
  >[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleTextInputPostal
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

function createAccessibleTextInputsPhone<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  attributesArray: AccessibleTextInputPhoneAttributes<
    ValidValueAction,
    InvalidValueAction
  >[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleTextInputPhone
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

function createAccessibleSwitchInputs<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  attributesArray: AccessibleSwitchInputAttributes<
    ValidValueAction,
    InvalidValueAction
  >[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleSwitchInput
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

function createAccessibleDateTimeInputs<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  attributesArray: AccessibleDateTimeInputAttributes<
    ValidValueAction,
    InvalidValueAction
  >[],
): React.JSX.Element[] {
  return attributesArray.map((attributes, index) => (
    <AccessibleDateTimeInput
      key={`${index}-${attributes.name}`}
      attributes={attributes}
    />
  ));
}

type ValidationTexts = {
  valueValidText: string;
  valueInvalidText: string;
};

function returnValidationTexts({
  name,
  stepperPages,
  validationFunctionsTable,
  valueBuffer,
}: {
  name: string;
  stepperPages: StepperPage[];
  validationFunctionsTable: ValidationFunctionsTable;
  valueBuffer: string;
}): ValidationTexts {
  const initialValidationTexts = {
    valueInvalidText: "",
    valueValidText: "",
  };

  return stepperPages.reduce<ValidationTexts>((validationTextsAcc, page) => {
    const { kind, children } = page;

    if (kind && kind === "review") {
      return validationTextsAcc;
    }

    children.forEach((child) => {
      const { name: inputName, validationKey } = child;
      if (inputName !== name) {
        return;
      }

      const partials = validationFunctionsTable[validationKey ?? "allowAll"];

      const partialInvalidText = partials.length
        ? partials
          .map(([regexOrFunc, errorMessage]) => {
            if (typeof regexOrFunc === "function") {
              return regexOrFunc(valueBuffer) ? "" : errorMessage;
            }

            return regexOrFunc.test(valueBuffer) ? "" : errorMessage;
          })
          .join(" ")
        : "";

      validationTextsAcc.valueInvalidText = `${
        splitCamelCase(
          name,
        )
      } is invalid. ${partialInvalidText}`;
      validationTextsAcc.valueValidText = `${splitCamelCase(name)} is valid.`;
    });

    return validationTextsAcc;
  }, initialValidationTexts);
}

function returnPartialValidations({
  name,
  stepperPages,
  validationFunctionsTable,
}: {
  name: string;
  stepperPages: StepperPage[];
  validationFunctionsTable: ValidationFunctionsTable;
}): { partials: Validation } {
  const initial = { partials: [] };

  return stepperPages.reduce<{ partials: Validation }>(
    (regexAcc, page) => {
      const { children, kind } = page;

      if (kind && kind === "review") {
        return regexAcc;
      }

      children.forEach((child) => {
        const { name: inputName, validationKey } = child;

        if (inputName !== name) {
          return;
        }

        const partials = validationFunctionsTable[validationKey ?? "allowAll"];

        regexAcc.partials = partials;
      });

      return regexAcc;
    },
    initial,
  );
}

function returnHighlightedText({
  fieldValue,
  queryValuesArray,
  textHighlightColor,
}: {
  fieldValue: string | boolean | number | string[] | boolean[] | number[];
  queryValuesArray: string[];
  textHighlightColor: string;
}) {
  // regex to determine if formattedValue has any terms in queryValuesArray
  const regex = queryValuesArray.length
    ? new RegExp(
      queryValuesArray
        .filter((value) => value !== "")
        .flatMap((value) => value.split(" "))
        .join("|"),
      "gi",
    )
    : null;

  let returnedText: React.JSX.Element | React.JSX.Element[] | null = null;
  if (regex?.test(fieldValue?.toString() ?? "")) {
    returnedText = fieldValue
      .toString()
      .split(" ")
      .map((text, index) => {
        // word that has below symbol is also highlighted
        const wordWithoutPunctuation = text
          .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
          .toLowerCase()
          .split(" ");

        const flattenedQueryValuesArray = queryValuesArray
          .filter((value) => value !== "")
          .flatMap((value) => value.toLowerCase().split(" "));

        const isQueryArrayIncludesWord = flattenedQueryValuesArray.some(
          (queryValue) => {
            const regex = new RegExp(queryValue, "gi");
            return regex.test(wordWithoutPunctuation.join(" "));
          },
        );

        if (isQueryArrayIncludesWord) {
          return (
            <Flex>
              <Highlight
                key={`${text}-${index.toString()}`}
                highlightStyles={{ backgroundColor: textHighlightColor }}
                highlight={text}
              >
                {text}
              </Highlight>
            </Flex>
          );
        }

        return <Text key={`${text}-${index.toString()}`}>{text}</Text>;
      });
  } else {
    returnedText = <Text>{fieldValue?.toString() ?? ""}</Text>;
  }

  return returnedText;
}

export {
  createAccessibleButtons,
  createAccessibleButtonScreenreaderTextElements,
  createAccessibleCheckboxGroupInputs,
  createAccessibleCheckboxSelectionsTextElements,
  createAccessibleCheckboxSingleInputs,
  createAccessibleDateTimeInputs,
  createAccessibleImageTextElement,
  createAccessibleNavLinkTextElement,
  createAccessiblePaginationTextElement,
  createAccessibleRadioGroupInputs,
  createAccessibleRadioScreenreaderTextElements,
  createAccessibleRadioSingleInputs,
  createAccessibleSelectInputs,
  createAccessibleSliderScreenreaderTextElements,
  createAccessibleSwitchInputs,
  createAccessibleSwitchOnOffTextElements,
  createAccessibleTextAreaInputs,
  createAccessibleTextInputs,
  createAccessibleTextInputsPhone,
  createAccessibleTextInputsPostal,
  createAccessibleValueValidationTextElements,
  returnHighlightedText,
  returnPartialValidations,
  returnValidationTexts,
};
