import { Card, Flex, Stack, Text } from "@mantine/core";
import Tree, { type CustomNodeElementProps, type Point } from "react-d3-tree";

import { useCenteredTree } from "../../hooks";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import AccessibleImage from "../accessibleInputs/AccessibleImage";
import { GoldenGrid } from "../accessibleInputs/GoldenGrid";
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
  /**
   * <div style={{ border: "1px solid black", backgroundColor: "#dedede" }}>
        <h3 style={{ textAlign: "center" }}>{nodeDatum.name}</h3>
        {nodeDatum.children && (
          <button style={{ width: "100%" }} onClick={toggleNode}>
            {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
          </button>
        )}
      </div>
   */

  const button = (
    <AccessibleButton
      attributes={{
        kind: nodeDatum.__rd3t.collapsed ? "expand" : "collapse",
        onClick: toggleNode,
        enabledScreenreaderText: `${
          nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"
        } subordinates`,
      }}
    />
  );

  const profilePic = (
    <AccessibleImage
      attributes={{
        alt: nodeDatum.name,
        fit: "cover",
        height: 50,
        name: nodeDatum.name,
        radius: 9999,
        src: nodeDatum.attributes.profilePictureUrl ?? "",
        width: 50,
      }}
    />
  );

  const foreignChild = (
    <Flex direction="column" gap={4}>
      {Object.entries(nodeDatum.attributes).map(([key, value], index) => {
        const disallowedKeysSet = new Set(["profilePictureUrl", "nodeColor"]);

        return disallowedKeysSet.has(key)
          ? null
          : (
            <Text key={`${key}-${value}-${index.toString()}`}>
              {value as string}
            </Text>
          );
      })}
    </Flex>
  );

  const [firstName, middleName, lastName] = nodeDatum.name.split(" ");

  const foreignCard = (
    <Card shadow="sm" padding="md" radius="md" withBorder maw={200} mah={250}>
      <Stack w="100%">
        <GoldenGrid>
          <Flex h="100%" direction="column" align="start" justify="center">
            {profilePic}
          </Flex>
          <Flex direction="column">
            <Text>{firstName}</Text>
            <Text>{middleName}</Text>
            <Text>{lastName}</Text>
          </Flex>
        </GoldenGrid>
        {foreignChild}
        {nodeDatum.children.length ? button : null}
      </Stack>
    </Card>
  );

  return (
    <g>
      <circle
        r={15}
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

function D3Tree({ data }: { data: Array<D3TreeInput> }) {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 400, y: 400 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: 15,
    y: 15,
  };
  const containerStyles = { width: "100vw", height: "100vh" };

  return (
    <div style={containerStyles} ref={containerRef as any}>
      <Tree
        data={data}
        nodeSize={nodeSize}
        orientation="vertical"
        renderCustomNodeElement={(rd3tProps: CustomNodeElementProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })}
        translate={translate as Point}
      />
    </div>
  );
}

export { D3Tree };
