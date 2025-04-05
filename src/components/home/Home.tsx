import React from "react";
import { Outlet } from "react-router-dom";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import Header from "../header";
import Sidebar from "../sidebar";

function Home() {
  const { globalState: { themeObject } } = useGlobalState();
  const [opened, setOpened] = React.useState(false);

  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  return (
    <div className={`app-shell ${opened ? "app-shell-sidebar-opened" : ""}`}>
      <div className="header">
        <Header opened={opened} setOpened={setOpened} />
      </div>
      <div
        className={`sidebar ${opened ? "sidebar-opened" : ""}`}
        style={{ background: bgGradient }}
      >
        <Sidebar setOpened={setOpened} />
      </div>
      <div
        className={`main ${opened ? "main-sidebar-opened" : ""}`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
