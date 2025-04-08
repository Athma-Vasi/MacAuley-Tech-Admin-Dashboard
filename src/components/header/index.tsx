import { Burger, Flex, Group, Title } from "@mantine/core";
import { COLORS_SWATCHES, TEXT_SHADOW } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import Settings from "./settings";

type HeaderProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function Header({ opened, setOpened }: HeaderProps) {
  const { globalState: { themeObject } } = useGlobalState();
  const { headerBgGradient, grayColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const burger = (
    <Burger
      className="burger"
      opened={opened}
      onClick={() => setOpened((o) => !o)}
      size="sm"
      color={grayColorShade}
      mr="xl"
    />
  );

  const displayTitle = (
    <Group w="100%" position="apart">
      {/* {logo} */}
      <Group className="header-title">
        <Title
          order={1}
          size={40}
          style={{ letterSpacing: "0.19rem", textShadow: TEXT_SHADOW }}
        >
          MACAULEY TECH
        </Title>
      </Group>
    </Group>
  );

  return (
    <Group
      position="apart"
      p="md"
      w="100%"
      bg={headerBgGradient}
      // style={{ borderBottom: "1px solid hsl(0, 0%, 50%)" }}
    >
      <Flex align="flex-end" w="62%">
        {burger}
        {displayTitle}
      </Flex>

      <Settings />
    </Group>
  );
}

export default Header;
