import { Card, Flex, Group, Stack, Text } from "@mantine/core";
import Tree, {
  type CustomNodeElementProps,
  Orientation,
  type Point,
} from "react-d3-tree";

import { useCenteredTree } from "../../../hooks/userCenteredTree";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";

import { useWindowSize } from "../../../hooks";
import AccessibleImage from "../../accessibleInputs/AccessibleImage";
import { GoldenGrid } from "../../goldenGrid";
import type { D3TreeInput } from "./utils";

function renderForeignObjectNode({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
}: {
  nodeDatum: any;
  toggleNode: () => void;
  foreignObjectProps: React.SVGProps<SVGForeignObjectElement>;
}) {
  const button = (
    <AccessibleButton
      attributes={{
        kind: nodeDatum.__rd3t.collapsed ? "expand" : "collapse",
        onClick: toggleNode,
        enabledScreenreaderText: `${
          nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"
        } subordinates`,
        size: "md",
      }}
    />
  );

  const profilePic = (
    <AccessibleImage
      attributes={{
        alt: nodeDatum.name,
        fit: "cover",
        height: 128,
        name: nodeDatum.name,
        radius: 9999,
        src: nodeDatum.attributes.profilePictureUrl ?? "",
        width: 128,
      }}
    />
  );

  const foreignChild = (
    <Flex direction="column" gap="sm" align="center" justify="center">
      <Text
        data-testid={`directory-card-jobPosition-${nodeDatum.attributes.jobPosition}`}
        size={26}
      >
        {nodeDatum.attributes.jobPosition}
      </Text>

      <Text
        data-testid={`directory-card-location-${nodeDatum.attributes.city}-${nodeDatum.attributes.country}`}
        size={20}
      >
        {nodeDatum.attributes.city}, {nodeDatum.attributes.country}
      </Text>
    </Flex>
  );

  const [firstName, lastName] = nodeDatum.name.split(" ");

  const foreignCard = (
    <Card
      className="directory-card"
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
    >
      <Stack w="100%">
        <GoldenGrid style={{ borderBottom: "1px solid hsl(0, 0%, 62%)" }}>
          <Flex
            h="100%"
            direction="column"
            align="flex-end"
            justify="center"
            pr="lg"
          >
            {profilePic}
          </Flex>

          <Stack w="100%" align="flex-start" spacing={0}>
            <Text
              data-testid={`directory-card-firstName-${firstName}`}
              size={28}
              weight={600}
            >
              {firstName}
            </Text>
            <Text
              data-testid={`directory-card-lastName-${lastName}`}
              size={28}
              weight={600}
            >
              {lastName}
            </Text>
            <Text
              data-testid={`directory-card-username-${nodeDatum.attributes.username}`}
              size={22}
              weight={600}
              color="dimmed"
              truncate
              w="100%"
              pt="sm"
            >
              @{nodeDatum.attributes.username}
            </Text>
          </Stack>
        </GoldenGrid>

        {foreignChild}

        <Group position="right">
          {nodeDatum.children.length ? button : null}
        </Group>
      </Stack>
    </Card>
  );

  return (
    <g>
      <circle
        r={20}
        fill={nodeDatum.attributes.nodeColor ?? "gray"}
        opacity={nodeDatum.children.length ? 1 : 0.4}
        stroke="black"
        strokeWidth={2}
      />
      {/* `foreignObject` requires width & height to be explicitly set. */}
      <foreignObject {...foreignObjectProps}>{foreignCard}</foreignObject>
    </g>
  );
}

function D3Tree(
  { data, orientation }: { data: Array<D3TreeInput>; orientation: Orientation },
) {
  const { windowWidth } = useWindowSize();
  const [translate, containerRef] = useCenteredTree();

  const nodeSize = { x: 600, y: 600 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: 15,
    y: 15,
  };
  const containerStyles = {
    width: windowWidth < 1024 ? "100vw" : "calc(100vw - 225px)",
    height: "100vh",
  };

  return (
    <div style={containerStyles} ref={containerRef as any}>
      <Tree
        data={data}
        nodeSize={nodeSize}
        orientation={orientation}
        renderCustomNodeElement={(rd3tProps: CustomNodeElementProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })}
        translate={translate as Point}
      />
    </div>
  );
}

export { D3Tree };
