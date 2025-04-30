import { Card, Flex, Group, Stack, Text } from "@mantine/core";
import Tree, { type CustomNodeElementProps, type Point } from "react-d3-tree";

import { useCenteredTree } from "../../../hooks/userCenteredTree";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";
// import AccessibleImage from "../../accessibleInputs/";

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
        height: 96,
        name: nodeDatum.name,
        radius: 9999,
        src: nodeDatum.attributes.profilePictureUrl ?? "",
        width: 96,
      }}
    />
  );

  // const foreignChild = (
  //   <Flex direction="column" gap={4}>
  //     {Object.entries(nodeDatum.attributes).map(([key, value], index) => {
  //       const disallowedKeysSet = new Set(["profilePictureUrl", "nodeColor"]);

  //       return disallowedKeysSet.has(key) ? null : (
  //         <Text
  //           key={`${key}-${value}-${index.toString()}`}
  //           size={index === 0 ? 22 : 19}
  //           style={{ textAlign: "center" }}
  //           pb={index === 0 ? "xs" : 0}
  //         >
  //           {value as string}
  //         </Text>
  //       );
  //     })}
  //   </Flex>
  // );

  const foreignChild = (
    <Flex direction="column" rowGap={2} align="center">
      <Text size={22}>
        {nodeDatum.attributes.jobPosition}
      </Text>

      <Text size={18}>
        {nodeDatum.attributes.city}, {nodeDatum.attributes.country}
      </Text>
    </Flex>
  );

  const [firstName, middleName, lastName] = nodeDatum.name.split(" ");

  const foreignCard = (
    <Card
      className="directory-card"
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
    >
      <Stack w="100%">
        <GoldenGrid style={{ borderBottom: "1px solid hsl(0, 0%, 50%)" }}>
          <Flex h="100%" direction="column" align="start" justify="center">
            {profilePic}
          </Flex>
          <Flex direction="column">
            <Text size={24} weight={600}>{firstName}</Text>
            {middleName
              ? <Text size={24} weight={600}>{middleName}</Text>
              : null}
            <Text size={24} weight={600}>{lastName}</Text>
          </Flex>
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
  const containerStyles = {
    width: "calc(100vw - 225px)",
    height: "100vh",
  };

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
