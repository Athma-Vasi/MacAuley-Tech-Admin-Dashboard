import { Burger, Flex, Group, Image, Title } from "@mantine/core";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import Settings from "./settings";

type HeaderProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function Header({ opened, setOpened }: HeaderProps) {
  const { globalState: { themeObject } } = useGlobalState();
  const { backgroundColor, grayColorShade } = returnThemeColors({
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

  const logo = (
    <Image
      alt="Macaulay Tech Logo"
      aria-label="Macaulay Tech Logo"
      src="../../../src/assets/macauley-tech-logo.png"
      height={50}
      width={50}
      fit="cover"
    />
  );

  const displayTitle = (
    <Group w="100%" position="apart">
      {logo}
      <Group className="header-title">
        <Title order={1} style={{ letterSpacing: "0.30rem" }}>
          MACAULEY
        </Title>
        <Title pl="md" order={1} style={{ letterSpacing: "0.30rem" }}>
          TECH
        </Title>
      </Group>
    </Group>
  );

  return (
    <Group
      position="apart"
      p="md"
      w="100%"
      bg="white"
      style={{ borderBottom: "1px solid hsl(0, 0%, 80%)" }}
    >
      <Flex align="flex-end" style={{ outline: "1px solid red" }} w="62%">
        {burger}
        {displayTitle}
      </Flex>

      <Settings />
    </Group>
  );
}

export default Header;
