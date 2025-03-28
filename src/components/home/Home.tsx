import {
  AppShell,
  Burger,
  Group,
  Header as MantineHeader,
  MediaQuery,
  Navbar,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { Outlet } from "react-router-dom";
import { APP_HEADER_HEIGHT } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import Header from "../header";
import Sidebar from "../sidebar";

function Home() {
  const theme = useMantineTheme();
  const {
    globalState: { themeObject },
  } = useGlobalState();

  const [opened, setOpened] = React.useState(false);

  // const { backgroundColor, textColor } = returnThemeColors({
  //     colorsSwatches: COLORS_SWATCHES,
  //     themeObject,
  // });

  return (
    <AppShell
      className="app-shell"
      header={
        <MantineHeader
          height={{ base: APP_HEADER_HEIGHT }}
          p="md"
          className="mantine-header"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <MediaQuery
              largerThan="sm"
              styles={{ display: "none" }}
            >
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Header />
          </div>
        </MantineHeader>
      }
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200 }}
        >
          <Sidebar />
        </Navbar>
      }
    >
      <Group
        className="main-outlet"
        w="100%"
        style={{ outline: "1px solid red" }}
      >
        <Outlet />
      </Group>
    </AppShell>
  );

  // return (
  //     <div className="app" style={{ backgroundColor, color: textColor }}>
  //         <Header />
  //         <div className="sidebar">
  //             <Sidebar />
  //         </div>
  //         <div className="main">
  //             <Outlet />
  //         </div>
  //     </div>
  // );
}

export default Home;
