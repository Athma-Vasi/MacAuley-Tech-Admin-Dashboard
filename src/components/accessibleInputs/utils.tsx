import { splitCamelCase } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";
import {
  AccessibleButton,
  AccessibleButtonAttributes,
} from "./AccessibleButton";

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

export { createAccessibleButtons, returnValidationTexts };
