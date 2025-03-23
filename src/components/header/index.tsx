import { Group } from "@mantine/core";
import Settings from "./settings";

function Header() {
  return (
    <Group position="apart" p="md" w="100%">
      <h1>MacAuley Tech</h1>

      <Settings />
    </Group>
  );
}

export default Header;
