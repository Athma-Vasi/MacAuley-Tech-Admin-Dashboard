import { Switch } from "@mantine/core";
import { TbMoon, TbSun } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../constants";
import { globalAction } from "../../context/globalProvider/actions";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import Settings from "./settings";

function Header() {
    return (
        <div className="header">
            <h2>MacAuley Tech</h2>

            <Settings />
        </div>
    );
}

export default Header;
