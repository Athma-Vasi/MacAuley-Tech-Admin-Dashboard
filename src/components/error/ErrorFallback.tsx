import {
  Button,
  Group,
  Notification,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { InvalidTokenError } from "jwt-decode";
import { TbExclamationMark } from "react-icons/tb";
import { useGlobalState } from "../../hooks/useGlobalState";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: any;
  resetErrorBoundary: () => void;
}) {
  const {
    globalState: { themeObject },
  } = useGlobalState();

  // const {
  //   generalColors: { redColorShade, themeColorShade },
  // } = returnThemeColors({ themeObject, colorsSwatches: COLORS_SWATCHES });

  const tryAgainButtonWithTooltip = (
    <Tooltip label="Will try the action again">
      <Group>
        <Button
          onClick={() => resetErrorBoundary()}
          aria-label="Will try the action again"
        >
          Try again
        </Button>
      </Group>
    </Tooltip>
  );

  const { colorScheme, primaryShade } = themeObject;
  const errorColor = colorScheme === "light"
    ? `red.${primaryShade.light}`
    : `red.${primaryShade.dark}`;

  const errorMessage = error instanceof InvalidTokenError
    ? "Invalid token. Please login again!"
    : !error.response
    ? "Network error. Please try again!"
    : error?.message ?? "Unknown error occurred. Please try again!";

  return (
    <Stack w={350}>
      <Notification
        color={errorColor}
        icon={<TbExclamationMark size={22} />}
        style={{ boxShadow: "0 0 0 0", backgroundColor: "transparent" }}
        withCloseButton={false}
      >
        <Stack w="100%">
          <Text>{errorMessage}</Text>
          <Group w="100%" position="right">
            {tryAgainButtonWithTooltip}
          </Group>
        </Stack>
      </Notification>
    </Stack>
  );
}

export default ErrorFallback;
