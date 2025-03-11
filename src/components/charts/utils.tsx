import { Group, Stack, Text } from "@mantine/core";

import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import {
  returnThemeColors,
  splitCamelCase,
  splitWordIntoUpperCasedSentence,
} from "../../utils";

type ChartsAndGraphsControlsStackerProps = {
  initialChartState?: Record<string, any>;
  input: React.JSX.Element;
  isInputDisabled?: boolean;
  label: string;
  symbol?: string;
  value: string | number | boolean;
};

function ChartsAndGraphsControlsStacker({
  initialChartState = {},
  input,
  isInputDisabled = false,
  label,
  symbol = "",
  value,
}: ChartsAndGraphsControlsStackerProps): React.JSX.Element {
  const {
    globalState: { themeObject },
  } = useGlobalState();

  const {
    appThemeColors: { borderColor },
    generalColors: { grayColorShade },
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const defaultValue = Object.entries(initialChartState).find(
    ([key]) =>
      splitCamelCase(key).toLowerCase() ===
        splitCamelCase(label).toLowerCase(),
  )?.[1] ?? "";

  const displayDefaultValue = defaultValue === "" ? null : (
    <Text
      weight={300}
      color={isInputDisabled
        ? grayColorShade
        : defaultValue === value
        ? grayColorShade
        : ""}
    >
      Default: {splitWordIntoUpperCasedSentence(
        splitCamelCase(defaultValue.toString()),
      )} {symbol}
    </Text>
  );

  const displayTopSection = (
    <Group w="100%" position="apart">
      <Text weight={500} color={isInputDisabled ? grayColorShade : ""}>
        {splitWordIntoUpperCasedSentence(label)}
      </Text>

      {displayDefaultValue}
    </Group>
  );

  const displayBottomSection = (
    <Stack>
      <Group position="apart">
        <Text
          aria-live="polite"
          color={isInputDisabled ? grayColorShade : ""}
          style={value === "" ? {} : {
            border: borderColor,
            borderRadius: 4,
            padding: "0.5rem 0.75rem",
            width: "fit-content",
          }}
        >
          {splitWordIntoUpperCasedSentence(splitCamelCase(value.toString()))}
          {" "}
          {symbol}
        </Text>
        <Group pb="xs">{input}</Group>
      </Group>
    </Stack>
  );

  return (
    <Stack style={{ borderBottom: borderColor }} py="md">
      {displayTopSection}
      {displayBottomSection}
    </Stack>
  );
}

export { ChartsAndGraphsControlsStacker };
