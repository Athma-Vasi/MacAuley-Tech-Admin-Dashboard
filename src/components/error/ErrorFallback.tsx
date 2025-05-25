import {
  Accordion,
  Card,
  Center,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";
import { Err } from "ts-results";
import { SafeError } from "../../types";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { GoldenGrid } from "../goldenGrid";
import matrixGif from "./matrix.gif";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Err<SafeError>;
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
    <Tooltip label="Will clear session data and take you to login">
      <Group>
        <AccessibleButton
          attributes={{
            kind: "previous",
            label: "Enter",
            onClick: async () => {
              await localforage.clear();
              navigateFn("/");
            },
          }}
        />
      </Group>
    </Tooltip>
  );

  const image = (
    <Image
      src={matrixGif}
      alt="Glitch in the matrix"
      className="error-image"
      fit="cover"
      radius="md"
    />
  );

  if (!error) {
    return (
      <Center h="100vh">
        <Card shadow="sm" radius="md" withBorder className="error-card">
          {image}

          <Stack w="100%">
            <Text size="xl" weight={500} mt="md" align="center">
              ⚠️ Oops! Something went wrong.
            </Text>

            <Text color="dimmed" align="center">
              😵‍💫 No error information available.
            </Text>

            <Group w="100%" position="apart">
              {goHomeButtonWithTooltip}
              {tryAgainButtonWithTooltip}
            </Group>
          </Stack>
        </Card>
      </Center>
    );
  }

  const nameEntry = (
    <GoldenGrid>
      <Text>Name:</Text>
      <Text data-testid={`error-name-${error.val.name}`}>
        {error.val.name}
      </Text>
    </GoldenGrid>
  );

  const messageEntry = (
    <GoldenGrid>
      <Text>Message:</Text>
      <Text data-testid={`error-message-${error.val.message}`}>
        {error.val.message}
      </Text>
    </GoldenGrid>
  );

  const stackAccordion = (
    <Accordion w="100%">
      <Accordion.Item value="Stack">
        <Accordion.Control px={0}>
          <Text weight={500}>Stack</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Text
            color="dimmed"
            data-testid={`error-stack-${
              error.val.stack.none ? "none" : error.val.stack
            }`}
          >
            {error.stack}
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
  const stackEntry = error.val.stack.none
    ? (
      <GoldenGrid>
        <Text>Stack:</Text>
        <Text
          data-testid={`error-stack-${
            error.val.stack.none ? "none" : error.val.stack
          }`}
        >
          {error.val.stack.none
            ? <Text color="dimmed">No stack available</Text>
            : <Text>{error.stack}</Text>}
        </Text>
      </GoldenGrid>
    )
    : stackAccordion;

  const originalAccordion = (
    <Accordion w="100%">
      <Accordion.Item value="Original">
        <Accordion.Control px={0}>
          <Text weight={500}>Original</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Text
            color="dimmed"
            data-testid={`error-original-${
              error.val.original.none ? "none" : error.val.original
            }`}
          >
            {error.val.original}
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
  const originalEntry = error.val.original.none
    ? (
      <GoldenGrid>
        <Text>Original:</Text>
        <Text
          data-testid={`error-original-${
            error.val.original.none ? "none" : error.val.original
          }`}
        >
          {error.val.original.none
            ? <Text color="dimmed">No original available</Text>
            : <Text>{error.val.original}</Text>}
        </Text>
      </GoldenGrid>
    )
    : originalAccordion;

  const fileNameEntry = (
    <GoldenGrid>
      <Text>File Name:</Text>
      {error.val.fileName.none
        ? (
          <Text color="dimmed" data-testid={`error-fileName-none`}>
            No file name available
          </Text>
        )
        : (
          <Group spacing={0}>
            {error.val.fileName.val.split("").map((char, index) => (
              <Text
                key={index}
                data-testid={`error-fileName-${char}`}
                color={char === "/" ? "dimmed" : "dark"}
              >
                {char}
              </Text>
            ))}
          </Group>
        )}
    </GoldenGrid>
  );
  const lineNumberEntry = (
    <GoldenGrid>
      <Text>Line Number:</Text>
      <Text data-testid={`error-lineNumber-${error.val.lineNumber.none}`}>
        {error.val.lineNumber.none
          ? <Text color="dimmed">No line number available</Text>
          : <Text>{error.val.lineNumber.val}</Text>}
      </Text>
    </GoldenGrid>
  );
  const columnNumberEntry = (
    <GoldenGrid>
      <Text>Column Number:</Text>
      <Text data-testid={`error-columnNumber-${error.val.columnNumber.none}`}>
        {error.val.columnNumber.none
          ? <Text color="dimmed">No column number available</Text>
          : <Text>{error.val.columnNumber.val}</Text>}
      </Text>
    </GoldenGrid>
  );

  const errorCard = (
    <Card shadow="sm" radius="md" withBorder className="error-card">
      {image}

      <Stack w="100%">
        <Text size="xl" weight={500} py="lg" align="center">
          ⚠️ Oops! Something went wrong...
        </Text>

        {nameEntry}
        <Divider w="100%" />
        {messageEntry}
        <Divider w="100%" />
        {fileNameEntry}
        <Divider w="100%" />
        {lineNumberEntry}
        <Divider w="100%" />
        {columnNumberEntry}
        <Divider w="100%" />

        {stackEntry}
        <Divider w="100%" />
        {originalEntry}

        <Group w="100%" position="apart" pt="xl">
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
