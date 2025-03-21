import {
    ColorSwatch,
    Flex,
    Group,
    Popover,
    Space,
    Stack,
    Switch,
    Text,
    UnstyledButton,
} from "@mantine/core";
import React from "react";
import { TbCheck, TbMoon, TbSun } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../../constants";
import {
    GlobalAction,
    globalAction,
} from "../../../context/globalProvider/actions";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { Shade } from "../../../types";
import { returnThemeColors } from "../../../utils";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";

function Settings() {
    const { globalState: { themeObject }, globalDispatch } = useGlobalState();
    const { colorScheme, primaryColor, primaryShade } = themeObject;
    const [popoverOpened, setPopoverOpened] = React.useState(false);

    const { themeColorShade, backgroundColor, textColorSliderLabel } =
        returnThemeColors({
            colorsSwatches: COLORS_SWATCHES,
            themeObject,
        });

    const colorSwatches = Object.entries(COLORS_SWATCHES)
        .filter(([colorName, _colorShades]) => colorName !== "dark")
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
                    <Group>
                        {colorSwatch}
                        {
                            /* <Text color={colorValue}>
                            {`${
                                colorName
                                    .charAt(0)
                                    .toUpperCase()
                            }${colorName.slice(1)}`}
                        </Text> */
                        }
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

    const settingsPopover = (
        <Group position="center">
            <Popover
                opened={popoverOpened}
                onChange={setPopoverOpened}
                width={300}
            >
                <Popover.Target>
                    <ColorSwatch
                        color={Object.entries(COLORS_SWATCHES).find(
                            ([colorName]) => colorName === primaryColor,
                        )?.[1][primaryShade.dark] ?? "violet"}
                        onClick={() => setPopoverOpened((o) => !o)}
                        style={{ cursor: "pointer" }}
                    />
                </Popover.Target>

                <Popover.Dropdown h="auto" bg={backgroundColor}>
                    <Stack spacing="md" align="flex-start">
                        {/* <Title order={4}>Colors</Title> */}
                        {themeSwitch}
                        <Flex wrap="wrap" gap="1em">{colorSwatches}</Flex>
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
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        </Group>
    );

    return settingsPopover;
}

export default Settings;
