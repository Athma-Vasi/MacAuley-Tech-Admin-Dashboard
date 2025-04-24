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
import { useNavigate } from "react-router-dom";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: any;
  resetErrorBoundary: () => void;
}) {
  const navigateFn = useNavigate();

  const tryAgainButtonWithTooltip = (
    <Tooltip label="Will try the action again">
      <Group>
        <AccessibleButton
          attributes={{
            kind: "reset",
            label: "Try again",
            onClick: () => resetErrorBoundary(),
          }}
        />
      </Group>
    </Tooltip>
  );

  const goHomeButtonWithTooltip = (
    <Tooltip label="Will take you to the home page">
      <Group>
        <AccessibleButton
          attributes={{
            kind: "previous",
            label: "Login",
            onClick: () => {
              navigateFn("/");
            },
          }}
        />
      </Group>
    </Tooltip>
  );

  const errorMessage = error instanceof InvalidTokenError
    ? "Invalid token. Please login again!"
    : !error.response
    ? "Network error. Please try again!"
    : error?.message ?? "Unknown error occurred. Please try again!";

  const errorCard = (
    <Card shadow="sm" radius="md" withBorder>
      <Image
        src="https://images.pexels.com/photos/2882552/pexels-photo-2882552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Picture of a guinea pig with a thought"
        height={320}
        width={320}
        fit="cover"
        radius="md"
      />

      <Stack>
        <Text size="lg" weight={500} mt="md">
          Oops! Something went wrong.
        </Text>
        <Text size="sm" color="dimmed">
          If the problem persists, contact support.
        </Text>
        <Text size="sm" color="dimmed">
          Error details: {errorMessage}
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
