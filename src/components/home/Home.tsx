import { Box } from "@mantine/core";
import React from "react";
import { Outlet } from "react-router-dom";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import Header from "../header";
import Sidebar from "../sidebar";

function Home() {
  const [opened, setOpened] = React.useState(false);
  const { globalState: { themeObject } } = useGlobalState();

  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  return (
    <div className={`app-shell ${opened ? "opened" : ""}`}>
      <Header opened={opened} setOpened={setOpened} />

      <Sidebar opened={opened} setOpened={setOpened} />

      <Box className={`main ${opened ? "sidebar-opened" : ""}`} bg={bgGradient}>
        <Outlet />
      </Box>
    </div>
  );
}

export default Home;
