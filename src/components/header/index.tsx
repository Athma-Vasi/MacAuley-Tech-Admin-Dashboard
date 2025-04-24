import { Burger, Flex, Group, Title } from "@mantine/core";
import localforage from "localforage";
import { useEffect, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";
import {
  COLORS_SWATCHES,
  FETCH_REQUEST_TIMEOUT,
  LOGOUT_URL,
  TEXT_SHADOW,
} from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { fetchSafe, returnThemeColors } from "../../utils";
import Settings from "./settings";

type HeaderProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function Header({ opened, setOpened }: HeaderProps) {
  const { authState: { accessToken } } = useAuth();
  const { globalState: { themeObject } } = useGlobalState();
  const { headerBgGradient, grayColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });
  const { showBoundary } = useErrorBoundary();

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchAbortControllerRef?.current?.abort("Request timed out");
    }, FETCH_REQUEST_TIMEOUT);

    return () => {
      clearTimeout(timerId);
      fetchAbortControllerRef?.current?.abort("Component unmounted");
      isComponentMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    async function checkAccessToken() {
      if (!accessToken) {
        const requestInit: RequestInit = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ",
          },
          signal: fetchAbortControllerRef.current?.signal,
        };

        await fetchSafe(LOGOUT_URL, requestInit);
        await localforage.clear();
        showBoundary(new Error("Access token is not available"));
        return;
      }
    }

    checkAccessToken();

    return () => {
      fetchAbortControllerRef.current?.abort("Component unmounted");
      isComponentMountedRef.current = false;
    };
  }, [accessToken]);

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
      className="header"
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
