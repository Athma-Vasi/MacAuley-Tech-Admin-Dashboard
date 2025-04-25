import { Card, Group, Space, Text } from "@mantine/core";
import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import {
  returnThemeColors,
  splitCamelCase,
  splitWordIntoUpperCasedSentence,
} from "../../../utils";
import { GoldenGrid } from "../../goldenGrid";

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
  const { globalState: { themeObject } } = useGlobalState();
  const { colorScheme } = themeObject;
  const {
    grayColorShade,
    darkColorShade,
    cardBgGradient,
    textColor,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const defaultValue = Object.entries(initialChartState).find(
    ([key]) =>
      splitCamelCase(key).toLowerCase() ===
        splitCamelCase(label).toLowerCase(),
  )?.[1] ?? "";

  const sectionTextColor = isInputDisabled
    ? colorScheme === "dark" ? grayColorShade : "grey"
    : defaultValue === value
    ? colorScheme === "dark" ? textColor : "grey"
    : textColor;

  const displayDefaultValue = defaultValue === "" ? null : (
    <Group
      spacing="xs"
      align="center"
    >
      <Text
        weight={300}
        color={sectionTextColor}
      >
        Default:
      </Text>
      <Text
        weight={300}
        color={sectionTextColor}
      >
        {splitWordIntoUpperCasedSentence(
          splitCamelCase(defaultValue.toString()),
        )} {symbol}
      </Text>
    </Group>
  );

  const displayTopSection = (
    <GoldenGrid w="100%">
      <Group position="left" spacing={4}>
        {splitWordIntoUpperCasedSentence(label).split(" ").map((
          word,
          idx,
        ) => (
          <Text
            size={16}
            color={isInputDisabled
              ? colorScheme === "dark" ? grayColorShade : "grey"
              : ""}
            key={idx}
            span
          >
            {word}
          </Text>
        ))}
      </Group>

      <Group position="right">
        {displayDefaultValue}
      </Group>
    </GoldenGrid>
  );

  const displayBottomSection = (
    <Group
      w="100%"
      align="center"
      position="apart"
    >
      <Text
        aria-live="polite"
        // size="md"
        color={isInputDisabled
          ? colorScheme === "dark" ? grayColorShade : "grey"
          : ""}
      >
        {splitWordIntoUpperCasedSentence(
          splitCamelCase(value.toString()),
        )} {symbol}
      </Text>
      <Group pb="xs">{input}</Group>
    </Group>
  );

  return (
    <Card
      className="controls-card"
      radius="md"
      bg={cardBgGradient}
    >
      {displayTopSection}
      <Space h="sm" />
      {displayBottomSection}
    </Card>
  );
}
export default ChartsAndGraphsControlsStacker;
