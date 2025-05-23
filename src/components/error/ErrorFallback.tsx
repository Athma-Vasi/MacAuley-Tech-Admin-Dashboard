import {
  Card,
  Center,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Err } from "ts-results";
import { SafeError } from "../../types";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { GoldenGrid } from "../goldenGrid";
import matrixGif from "./matrix.gif";

function ErrorFallback({
  safeError,
  resetErrorBoundary,
}: {
  safeError: Err<SafeError>;
  resetErrorBoundary: () => void;
}) {
  const navigateFn = useNavigate();

  const tryAgainButtonWithTooltip = (
    <Tooltip label="Will try the action again">
      <Group>
        <AccessibleButton
          attributes={{
            kind: "reset",
            label: "Reload",
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
            label: "Enter",
            onClick: () => navigateFn("/"),
          }}
        />
      </Group>
    </Tooltip>
  );

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
          Oops! Something went wrong.
        </Text>

        <GoldenGrid>
          <Text>Name:</Text>
          <Text data-testid={`error-name-${safeError.val.name}`}>
            {safeError.val.name}
          </Text>
        </GoldenGrid>
        <Divider w="100%" />
        <GoldenGrid>
          <Text>Message:</Text>
          <Text data-testid={`error-message-${safeError.val.message}`}>
            {safeError.val.message}
          </Text>
        </GoldenGrid>
        <Divider w="100%" />
        <GoldenGrid>
          <Text>Stack:</Text>
          <Text data-testid={`error-stack-${safeError.val.stack}`}>
            {safeError.val.stack.none
              ? <Text color="dimmed">No stack available</Text>
              : <Text>{safeError.stack}</Text>}
          </Text>
        </GoldenGrid>
        <Divider w="100%" />
        <GoldenGrid>
          <Text>Original:</Text>
          <Text data-testid={`error-original-${safeError.val.original}`}>
            {safeError.val.original.none
              ? <Text color="dimmed">No original available</Text>
              : <Text>{safeError.val.original}</Text>}
          </Text>
        </GoldenGrid>

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
