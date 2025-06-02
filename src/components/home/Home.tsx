import { Box, Loader } from "@mantine/core";
import React, { Suspense } from "react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import { COLORS_SWATCHES } from "../../constants";
import { useWindowErrorHandler } from "../../hooks";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import ErrorFallback from "../error/ErrorFallback";
import Header from "../header";
import Sidebar from "../sidebar";

function Home() {
  const [opened, setOpened] = React.useState(false);
  const { globalState: { themeObject } } = useGlobalState();
  const { showBoundary } = useErrorBoundary();
  useWindowErrorHandler(showBoundary);

  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const home = (
    <div
      className={`app-shell ${opened ? "opened" : ""}`}
    >
      <Header opened={opened} setOpened={setOpened} />

      <Sidebar opened={opened} setOpened={setOpened} />

      <Box className={`main ${opened ? "sidebar-opened" : ""}`} bg={bgGradient}>
        <Outlet />
      </Box>
    </div>
  );

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={(details) => {
        console.group("onReset triggered");
        console.log("details", details);
        console.groupEnd();
      }}
      onError={(error, info) => {
        console.group("onError triggered");
        console.log("error", error);
        console.log("info", info);
        console.groupEnd();
      }}
    >
      <Suspense fallback={<Loader />}>
        {home}
      </Suspense>
    </ErrorBoundary>
  );
}

export default Home;
