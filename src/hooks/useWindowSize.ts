import { useCallback, useEffect, useState } from "react";

type WindowSize = {
  windowWidth: number;
  windowHeight: number;
};

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  });

  const setSize = useCallback(() => {
    setWindowSize({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [setSize]);

  return {
    windowWidth: windowSize.windowWidth,
    windowHeight: windowSize.windowHeight,
  };
}

export { useWindowSize };
export type { WindowSize };
