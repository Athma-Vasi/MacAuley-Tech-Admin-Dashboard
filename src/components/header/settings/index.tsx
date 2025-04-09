import {
  Box,
  ColorSwatch,
  Group,
  Popover,
  Space,
  Stack,
  Switch,
  Text,
  UnstyledButton,
} from "@mantine/core";
import React from "react";
import { TbCheck, TbMoon, TbSettings, TbSun } from "react-icons/tb";
import { COLORS_SWATCHES, FONT_FAMILY_DATA } from "../../../constants";
import {
  GlobalAction,
  globalAction,
} from "../../../context/globalProvider/actions";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { Shade } from "../../../types";
import { returnThemeColors } from "../../../utils";
import { AccessibleSegmentedControl } from "../../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";

function Settings() {
  const { globalState: { themeObject }, globalDispatch } = useGlobalState();
  const { colorScheme, primaryColor, primaryShade, fontFamily } = themeObject;
  const [popoverOpened, setPopoverOpened] = React.useState(false);

  const { themeColorShade, textColorSliderLabel } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const colorSwatches = Object.entries(COLORS_SWATCHES)
    .map(([colorName, colorShades], idx) => {
      const shade = colorScheme === "light"
        ? primaryShade.light
        : primaryShade.dark;
      const colorValue = colorShades[shade];

      const colorSwatch = (
        <ColorSwatch
          color={colorValue}
          key={`colorName-${idx.toString()}`}
        >
          {colorName === primaryColor
            ? <TbCheck size={20} color="white" />
            : null}
        </ColorSwatch>
      );

      const colorSwatchButton = (
        <UnstyledButton
          variant="outline"
          style={{
            color: colorValue,
            borderRadius: 4,
            border: `1px solid ${colorValue}`,
          }}
          color={colorValue}
          p="xs"
          aria-label={`Select ${colorName} color. ${
            colorName === primaryColor
              ? `${colorName} is currently selected`
              : `${colorName} is not currently selected`
          }`}
          onClick={() => {
            globalDispatch({
              action: globalAction.setPrimaryColor,
              payload: colorName,
            });
          }}
          key={`colorName-${idx.toString()}`}
        >
          <Group position="apart" w={90}>
            {colorSwatch}

            <Text color={colorValue}>
              {`${
                colorName
                  .charAt(0)
                  .toUpperCase()
              }${colorName.slice(1)}`}
            </Text>
          </Group>
        </UnstyledButton>
      );

      const displayColorSwatch = (
        <Group key={`colorName-${idx.toString()}`}>
          {colorSwatchButton}
        </Group>
      );

      return displayColorSwatch;
    });

  const themeSwitch = (
    <Switch
      color={primaryColor}
      checked={colorScheme === "light"}
      onLabel={<TbSun size={18} />}
      offLabel={<TbMoon size={18} />}
      onChange={() => {
        globalDispatch({
          action: globalAction.setColorScheme,
          payload: colorScheme === "dark" ? "light" : "dark",
        });
      }}
      size="md"
      value={colorScheme}
    />
  );

  const lightSchemeShadeSliderInput = (
    <AccessibleSliderInput<
      GlobalAction["setPrimaryShadeLight"],
      Shade
    >
      attributes={{
        color: primaryColor,
        disabled: colorScheme === "dark",
        label: (value) => (
          <Text style={{ color: textColorSliderLabel }}>{value}</Text>
        ),
        max: 9,
        min: 0,
        name: "lightSchemeShadeSlider",
        parentDispatch: globalDispatch,
        step: 1,
        validValueAction: globalAction.setPrimaryShadeLight,
        value: primaryShade.light,
      }}
    />
  );

  const darkSchemeShadeSliderInput = (
    <AccessibleSliderInput<
      GlobalAction["setPrimaryShadeDark"],
      Shade
    >
      attributes={{
        color: primaryColor,
        disabled: colorScheme === "light",
        label: (value) => (
          <Text style={{ color: textColorSliderLabel }}>{value}</Text>
        ),
        max: 9,
        min: 0,
        name: "darkSchemeShadeSlider",
        parentDispatch: globalDispatch,
        step: 1,
        validValueAction: globalAction.setPrimaryShadeDark,
        value: primaryShade.dark,
      }}
    />
  );

  const fontFamilySegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: FONT_FAMILY_DATA,
        name: "fontFamily",
        parentDispatch: globalDispatch as any,
        validValueAction: globalAction.setFontFamily,
        value: fontFamily,
        defaultValue: "Work Sans",
      }}
    />
  );

  const settingsPopover = (
    <Group position="center" pr="xl">
      <Popover
        opened={popoverOpened}
        onChange={setPopoverOpened}
        width={300}
        position="bottom-end"
      >
        <Popover.Target>
          <Box>
            <TbSettings
              color={Object.entries(COLORS_SWATCHES).find(
                ([colorName]) => colorName === primaryColor,
              )?.[1][
                colorScheme === "light" ? primaryShade.light : primaryShade.dark
              ] ?? "violet"}
              onClick={() => setPopoverOpened((o) => !o)}
              style={{ cursor: "pointer" }}
              size={30}
            />
          </Box>
          {
            /* <ColorSwatch
            color={Object.entries(COLORS_SWATCHES).find(
              ([colorName]) => colorName === primaryColor,
            )?.[1][primaryShade.dark] ?? "violet"}
            onClick={() => setPopoverOpened((o) => !o)}
            style={{ cursor: "pointer" }}
          /> */
          }
        </Popover.Target>

        <Popover.Dropdown h="auto">
          <Stack spacing="md" align="flex-start">
            {/* <Title order={4}>Colors</Title> */}
            {themeSwitch}
            <Group spacing="1em">{colorSwatches}</Group>
            <Text size="sm" weight={500}>
              Light Shade
            </Text>
            {lightSchemeShadeSliderInput}

            <Space h="xs" />

            <Text size="sm" weight={500}>
              Dark Shade
            </Text>
            {darkSchemeShadeSliderInput}
            <Space h="xs" />

            {fontFamilySegmentedControl}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );

  return settingsPopover;
}

export default Settings;
