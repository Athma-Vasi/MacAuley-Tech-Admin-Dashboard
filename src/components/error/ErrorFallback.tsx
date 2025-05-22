import {
  Card,
  Center,
  Group,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { InvalidTokenError } from "jwt-decode";
import { LuRabbit } from "react-icons/lu";
import { TbPillFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Option } from "ts-results";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import matrixGif from "./matrix.gif";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Option<unknown>;
  resetErrorBoundary: () => void;
}) {
  const navigateFn = useNavigate();
  const { globalState: { themeObject } } = useGlobalState();
  const { redColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const tryAgainButtonWithTooltip = (
    <Tooltip label="Will try the action again">
      <Group>
        <AccessibleButton
          attributes={{
            kind: "reset",
            label: "Reload",
            leftIcon: <LuRabbit />,
            onClick: () => resetErrorBoundary(),
          }}
        />
      </Group>
    </Tooltip>
  );

  const goHomeButtonWithTooltip = (
    <Tooltip label="Will take you to login">
      <Group>
        <AccessibleButton
          attributes={{
            kind: "previous",
            label: <Text color={redColorShade}>Enter</Text>,
            leftIcon: <TbPillFilled color={redColorShade} />,
            onClick: () => navigateFn("/"),
          }}
        />
      </Group>
    </Tooltip>
  );

  const errorUnwrapped = error.none ? "Follow the white rabbit." : error.val;
  const errorMessage = typeof errorUnwrapped === "string"
    ? errorUnwrapped
    : errorUnwrapped instanceof InvalidTokenError
    ? "Invalid token. Please login again!"
    : errorUnwrapped instanceof Error
    ? errorUnwrapped.message
    : "You've seen it before. Déjà vu. Something's off.";

  const errorCard = (
    <Card shadow="sm" radius="md" withBorder className="error-card">
      <Image
        src={matrixGif}
        alt="Glitch in the matrix"
        className="error-image"
        fit="cover"
        radius="md"
      />

      <Stack w="100%">
        <Text size="xl" weight={500} mt="md" align="center">
          Simulation desynchronized
        </Text>

        <Text size="sm" color="dimmed">
          {errorMessage}
        </Text>

        <Group w="100%" position="apart">
          {goHomeButtonWithTooltip}
          {tryAgainButtonWithTooltip}
        </Group>
      </Stack>
    </Card>
  );

  return (
    <Center h="100vh">
      {errorCard}
    </Center>
  );
}

export default ErrorFallback;
