import { Switch } from "@mantine/core";
import { TbMoon, TbSun } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../constants";
import { globalAction } from "../../context/globalProvider/actions";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";

function Header() {
    const { globalState: { themeObject }, globalDispatch } = useGlobalState();
    const { colorScheme, primaryColor } = themeObject;

    const { themeColorShade } = returnThemeColors({
        colorsSwatches: COLORS_SWATCHES,
        themeObject,
    });

    console.log({ themeColorShade });

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

    return (
        <div className="header">
            <h2>MacAuley Tech</h2>
            {themeSwitch}
        </div>
    );
}

export default Header;
