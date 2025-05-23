import { Group, Stack, Text, Timeline } from "@mantine/core";
import type React from "react";
import { TbLink, TbLogicNot } from "react-icons/tb";

import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import {
    addCommaSeparator,
    capitalizeJoinWithAnd,
    replaceLastCommaWithAnd,
    returnThemeColors,
    splitCamelCase,
} from "../../utils";
import { queryAction } from "./actions";
import { QueryDispatch } from "./schemas";
import type {
    LogicalOperator,
    QueryChain,
    QueryChainKind,
    QueryState,
} from "./types";
import { returnTimelineBullet } from "./utils";

type QueryChainProps = {
    collectionName: string;
    queryDispatch: React.Dispatch<QueryDispatch>;
    queryState: QueryState;
};

function Chain(
    { collectionName, queryDispatch, queryState }: QueryChainProps,
) {
    const { globalState: { themeObject } } = useGlobalState();
    const {
        generalSearchExclusionValue,
        generalSearchInclusionValue,
        projectionFields,
        queryChains,
    } = queryState;

    const { textColorSliderLabel } = returnThemeColors({
        colorsSwatches: COLORS_SWATCHES,
        themeObject,
    });

    const allChainsLength = Object.values(queryChains).reduce(
        (acc, logicalOperatorChainsMap) => {
            Object.entries(logicalOperatorChainsMap).forEach(
                ([_logicalOperator, queryChain]) => {
                    acc += queryChain.length;
                },
            );

            return acc;
        },
        0,
    );

    const queryChainElements = Object.entries(queryChains).flatMap(
        (tuple, chainsIndex) => {
            const [queryChainKind, logicalOperatorChainsMap] = tuple as [
                QueryChainKind,
                Record<LogicalOperator, QueryChain>,
            ];

            const chainLength = Object.entries(logicalOperatorChainsMap).reduce(
                (acc, [_logicalOperator, queryChain]) => {
                    acc += queryChain.length;
                    return acc;
                },
                0,
            );

            const timeline = Object.entries(logicalOperatorChainsMap).flatMap(
                (tuple, mapIndex) => {
                    const [logicalOperator, queryChain] = tuple as [
                        LogicalOperator,
                        QueryChain,
                    ];
                    return queryChain.length === 0 ? null : (
                        <Timeline
                            active={Number.MAX_SAFE_INTEGER}
                            key={`chain-${chainsIndex}-map-${mapIndex.toString()}`}
                        >
                            {queryChain.map(
                                ([field, operator, value], linkIndex) => {
                                    const queryLinkStatement =
                                        createQueryLinkStatement({
                                            field,
                                            index: linkIndex,
                                            logicalOperator,
                                            operator,
                                            queryChainKind,
                                            value,
                                        });

                                    const timelineBullet = returnTimelineBullet(
                                        {
                                            queryChainKind,
                                            linkIndex,
                                            logicalOperator,
                                            queryAction,
                                            queryDispatch,
                                            queryLinkStatement,
                                            textColorSliderLabel,
                                        },
                                    );

                                    const timelineText = (
                                        <Text data-testid="query-link-text">
                                            {`${queryLinkStatement}${
                                                linkIndex ===
                                                        queryChain.length - 1
                                                    ? "."
                                                    : ` ${logicalOperator}`
                                            }`}
                                        </Text>
                                    );

                                    return (
                                        <Timeline.Item
                                            key={`chain-${chainsIndex}-map-${mapIndex}-link-${linkIndex.toString()}`}
                                            bullet={timelineBullet}
                                            bulletSize={26}
                                        >
                                            {timelineText}
                                            {/* {buttons} */}
                                        </Timeline.Item>
                                    );
                                },
                            )}
                        </Timeline>
                    );
                },
            );

            const queryLinkHeadingElement = chainLength === 0 ? null : (
                <Stack>
                    <Text size="md">
                        {createQueryLinkHeading({
                            collectionName,
                            queryChainKind,
                        })}
                    </Text>
                </Stack>
            );

            return (
                <Stack key={`chain-${chainsIndex.toString()}`}>
                    {queryLinkHeadingElement}
                    <Group
                        w="100%"
                        position="left"
                        align="flex-start"
                        spacing="xl"
                    >
                        {timeline}
                    </Group>
                </Stack>
            );
        },
    );

    const splitAndJoinedGeneralSearchInclusionValue = replaceLastCommaWithAnd(
        addCommaSeparator(
            generalSearchInclusionValue.split(" ").join(", "),
        ),
    );

    const splitAndJoinedGeneralSearchExclusionValue = replaceLastCommaWithAnd(
        addCommaSeparator(
            generalSearchExclusionValue.split(" ").join(", "),
        ),
    );

    const generalSearchExclusionLink = generalSearchExclusionValue.length === 0
        ? null
        : (
            <Timeline.Item
                bullet={
                    <TbLink
                        onClick={() =>
                            queryDispatch({
                                action:
                                    queryAction.setGeneralSearchExclusionValue,
                                payload: "",
                            })}
                        size={18}
                        style={{ cursor: "pointer" }}
                    />
                }
                bulletSize={26}
            >
                <Text>
                    {`${splitAndJoinedGeneralSearchExclusionValue} ${
                        generalSearchExclusionValue.split(" ").length > 1
                            ? "are"
                            : "is"
                    } not present.`}
                </Text>
            </Timeline.Item>
        );

    const generalSearchInclusionLink = generalSearchInclusionValue.length === 0
        ? null
        : (
            <Timeline.Item
                bullet={
                    <TbLink
                        onClick={() =>
                            queryDispatch({
                                action:
                                    queryAction.setGeneralSearchInclusionValue,
                                payload: "",
                            })}
                        size={18}
                        style={{ cursor: "pointer" }}
                    />
                }
                bulletSize={26}
            >
                <Text>
                    {`${splitAndJoinedGeneralSearchInclusionValue} ${
                        generalSearchInclusionValue.split(" ").length > 1
                            ? "are"
                            : "is"
                    } present ${
                        generalSearchExclusionValue.length === 0 ? "" : "and"
                    }`}
                </Text>
            </Timeline.Item>
        );

    const generalSearchChainElement =
        generalSearchExclusionValue.length === 0 &&
            generalSearchInclusionValue.length === 0
            ? null
            : (
                <Stack>
                    <Text size="md" data-testid="general-search-link">
                        {`Search ${
                            splitCamelCase(
                                collectionName,
                            )
                        } by text fields where: `}
                    </Text>
                    <Timeline active={Number.MAX_SAFE_INTEGER}>
                        {generalSearchInclusionLink}
                        {generalSearchExclusionLink}
                    </Timeline>
                </Stack>
            );

    const projectionExclusionLink = (
        <Timeline.Item bullet={<TbLogicNot size={18} />} bulletSize={26}>
            <Text>
                {`${capitalizeJoinWithAnd(projectionFields)} excluded.`}
            </Text>
        </Timeline.Item>
    );

    const projectionChainElement = projectionFields.length === 0
        ? null
        : (
            <Stack>
                <Text size="md" data-testid="projection-link">
                    {`Return selected ${
                        splitCamelCase(collectionName)
                    } with field${projectionFields.length === 1 ? "" : "s"}:`}
                </Text>
                <Timeline active={Number.MAX_SAFE_INTEGER}>
                    {projectionExclusionLink}
                </Timeline>
            </Stack>
        );

    return allChainsLength === 0 &&
            generalSearchExclusionValue.length === 0 &&
            generalSearchInclusionValue.length === 0 &&
            projectionFields.length === 0
        ? (
            <div className="query-chain">
                <Text>No query chain</Text>
            </div>
        )
        : (
            <div className="query-chain">
                {queryChainElements}
                {projectionChainElement}
                {generalSearchChainElement}
            </div>
        );
}

function createQueryLinkHeading({
    collectionName,
    queryChainKind,
}: {
    collectionName: string;
    queryChainKind: QueryChainKind;
}) {
    let queryLinkHeading = "";

    if (queryChainKind === "filter") {
        queryLinkHeading = `Select ${splitCamelCase(collectionName)} where:`;
    }

    if (queryChainKind === "sort") {
        queryLinkHeading = `Sort selected ${
            splitCamelCase(collectionName)
        } by:`;
    }

    return queryLinkHeading;
}

function createQueryLinkStatement({
    field,
    index,
    logicalOperator,
    operator,
    queryChainKind,
    value,
}: {
    field: string;
    index: number;
    logicalOperator: LogicalOperator;
    operator: string;
    queryChainKind: QueryChainKind;
    value: string;
}) {
    // projection
    let queryLinkStatement = "";

    if (queryChainKind === "filter") {
        queryLinkStatement = `${index === 0 ? logicalOperator + " " : ""}${
            splitCamelCase(field)
        } ${operator === "in" ? "equals" : `is ${operator}`} ${value}`;
    }

    if (queryChainKind === "sort") {
        queryLinkStatement = `${splitCamelCase(field)} in ${value} order`;
    }

    return queryLinkStatement;
}

export { Chain };

// const deleteQueryLinkButton = (
//     <AccessibleButton
//         attributes={{
//             enabledScreenreaderText:
//                 `Delete link ${queryLinkStatement}`,
//             index: linkIndex,
//             kind: "delete",
//             setIconAsLabel: true,
//             onClick: (
//                 _event:
//                     | React.MouseEvent<
//                         HTMLButtonElement,
//                         MouseEvent
//                     >
//                     | React.PointerEvent<
//                         HTMLButtonElement
//                     >,
//             ) => {
//                 queryDispatch({
//                     action: queryAction
//                         .modifyQueryChains,
//                     payload: {
//                         index: linkIndex,
//                         logicalOperator,
//                         queryChainActions:
//                             "delete",
//                         queryChainKind,
//                         queryLink: [
//                             "",
//                             "equal to",
//                             "",
//                         ],
//                     },
//                 });
//             },
//             size: "xs",
//         }}
//     />
// );

// const insertQueryLinkButton = (
//   <AccessibleButton
//     attributes={{
//       disabled: linkIndex === MAX_LINKS_AMOUNT - 1,
//       disabledScreenreaderText: "Max query links amount reached",
//       enabledScreenreaderText: `Insert link before ${queryLinkStatement}`,
//       index: linkIndex,
//       kind: "insert",
//       setIconAsLabel: true,
//       onClick: (
//         _event:
//           | React.MouseEvent<HTMLButtonElement, MouseEvent>
//           | React.PointerEvent<HTMLButtonElement>
//       ) => {
//         queryDispatch({
//           action: queryAction.modifyQueryChains,
//           payload: {
//             index: linkIndex,
//             queryChainActions: "insert",
//             queryChainKind,
//             value: ["", "", ""],
//           },
//         });
//       },
//     }}
//   />
// );

// const slideQueryChainUpButton = (
//     <AccessibleButton
//         attributes={{
//             disabled: linkIndex === 0,
//             disabledScreenreaderText:
//                 "Cannot move up. Already at the top",
//             enabledScreenreaderText:
//                 `Move link ${queryLinkStatement} up`,
//             index: linkIndex,
//             kind: "up",
//             setIconAsLabel: true,
//             onClick: (
//                 _event:
//                     | React.MouseEvent<
//                         HTMLButtonElement,
//                         MouseEvent
//                     >
//                     | React.PointerEvent<
//                         HTMLButtonElement
//                     >,
//             ) => {
//                 queryDispatch({
//                     action: queryAction
//                         .modifyQueryChains,
//                     payload: {
//                         index: linkIndex,
//                         logicalOperator,
//                         queryChainActions:
//                             "slideUp",
//                         queryChainKind,
//                         queryLink: [
//                             "",
//                             "equal to",
//                             "",
//                         ],
//                     },
//                 });
//             },
//             size: "xs",
//         }}
//     />
// );

// const slideQueryChainDownButton = (
//     <AccessibleButton
//         attributes={{
//             disabled: linkIndex ===
//                 queryChain.length - 1,
//             disabledScreenreaderText:
//                 "Cannot move link down. Already at the bottom",
//             enabledScreenreaderText:
//                 `Move link ${queryLinkStatement} down`,
//             index: linkIndex,
//             kind: "down",
//             setIconAsLabel: true,
//             onClick: (
//                 _event:
//                     | React.MouseEvent<
//                         HTMLButtonElement,
//                         MouseEvent
//                     >
//                     | React.PointerEvent<
//                         HTMLButtonElement
//                     >,
//             ) => {
//                 queryDispatch({
//                     action: queryAction
//                         .modifyQueryChains,
//                     payload: {
//                         index: linkIndex,
//                         logicalOperator,
//                         queryChainActions:
//                             "slideDown",
//                         queryChainKind,
//                         queryLink: [
//                             "",
//                             "equal to",
//                             "",
//                         ],
//                     },
//                 });
//             },
//             size: "xs",
//         }}
//     />
// );

// const buttons = (
//     <Group>
//         {deleteQueryLinkButton}
//         {/* {insertQueryLinkButton} */}
//         {slideQueryChainUpButton}
//         {slideQueryChainDownButton}
//     </Group>
// );
