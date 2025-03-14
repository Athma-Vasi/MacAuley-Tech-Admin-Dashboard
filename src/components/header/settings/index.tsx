import {
    ColorSwatch,
    Group,
    HoverCard,
    Text,
    UnstyledButton,
} from "@mantine/core";
import { TbCheck, TbSettings } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../../constants";
import { globalAction } from "../../../context/globalProvider/actions";
import { useGlobalState } from "../../../hooks/useGlobalState";

function Settings() {
    const { globalState: { themeObject }, globalDispatch } = useGlobalState();
    const { colorScheme, primaryColor, primaryShade } = themeObject;

    const colorSwatches = Object.entries(COLORS_SWATCHES)
        .filter(([colorName, colorShades]) => colorName !== "dark")
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
                        console.log({ colorName });
                        console.log({ colorValue });
                        console.log({ primaryColor });
                        console.log({ primaryShade });
                        console.log({ colorScheme });

                        globalDispatch({
                            action: globalAction.setPrimaryColor,
                            payload: colorName,
                        });
                    }}
                    key={`colorName-${idx.toString()}`}
                >
                    <Group>
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

    const settingsHoverCard = (
        <Group position="center">
            <HoverCard width={300} shadow="md">
                <HoverCard.Target>
                    <div className="settings">
                        <TbSettings size={22} />
                    </div>
                </HoverCard.Target>

                <HoverCard.Dropdown>
                    {colorSwatches}
                </HoverCard.Dropdown>
            </HoverCard>
        </Group>
    );
    return settingsHoverCard;
}

export default Settings;
