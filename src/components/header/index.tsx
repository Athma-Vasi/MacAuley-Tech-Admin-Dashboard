import { Group } from "@mantine/core";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import Settings from "./settings";

function Header() {
  const { globalState: { themeObject } } = useGlobalState();
  const { backgroundColor } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  return (
    <Group
      position="apart"
      p="md"
      w="100%"
      bg={backgroundColor}
      style={{ borderBottom: "1px solid hsl(0, 0%, 80%)" }}
    >
      <h1>MacAuley Tech</h1>

      <Settings />
    </Group>
  );
}

export default Header;
