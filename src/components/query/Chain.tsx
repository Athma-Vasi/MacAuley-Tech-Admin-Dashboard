import { Group, Stack, Text, Timeline } from "@mantine/core";
import type React from "react";
import {
    TbLink,
    TbLogicAnd,
    TbLogicNor,
    TbLogicNot,
    TbLogicOr,
} from "react-icons/tb";

import {
    addCommaSeparator,
    capitalizeJoinWithAnd,
    replaceLastCommaWithAnd,
    splitCamelCase,
} from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { queryAction } from "./actions";
import type {
    LogicalOperator,
    QueryChain,
    QueryChainKind,
    QueryDispatch,
    QueryState,
} from "./types";

type QueryChainProps = {
    collectionName: string;
    queryDispatch: React.Dispatch<QueryDispatch>;
    queryState: QueryState;
};

function Chain(
    { collectionName, queryDispatch, queryState }: QueryChainProps,
) {
    const {
        generalSearchCase,
        generalSearchExclusionValue,
        generalSearchInclusionValue,
        projectionFields,
        queryChains,
    } = queryState;

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
                                            operator,
                                            queryChainKind,
                                            value,
                                        });

                                    const deleteQueryLinkButton = (
                                        <AccessibleButton
                                            attributes={{
                                                enabledScreenreaderText:
                                                    `Delete link ${queryLinkStatement}`,
                                                index: linkIndex,
                                                kind: "delete",
                                                setIconAsLabel: true,
                                                onClick: (
                                                    _event:
                                                        | React.MouseEvent<
                                                            HTMLButtonElement,
                                                            MouseEvent
                                                        >
                                                        | React.PointerEvent<
                                                            HTMLButtonElement
                                                        >,
                                                ) => {
                                                    queryDispatch({
                                                        action: queryAction
                                                            .modifyQueryChains,
                                                        payload: {
                                                            index: linkIndex,
                                                            logicalOperator,
                                                            queryChainActions:
                                                                "delete",
                                                            queryChainKind,
                                                            queryLink: [
                                                                "",
                                                                "equal to",
                                                                "",
                                                            ],
                                                        },
                                                    });
                                                },
                                            }}
                                        />
                                    );

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

                                    const slideQueryChainUpButton = (
                                        <AccessibleButton
                                            attributes={{
                                                disabled: linkIndex === 0,
                                                disabledScreenreaderText:
                                                    "Cannot move up. Already at the top",
                                                enabledScreenreaderText:
                                                    `Move link ${queryLinkStatement} up`,
                                                index: linkIndex,
                                                kind: "up",
                                                setIconAsLabel: true,
                                                onClick: (
                                                    _event:
                                                        | React.MouseEvent<
                                                            HTMLButtonElement,
                                                            MouseEvent
                                                        >
                                                        | React.PointerEvent<
                                                            HTMLButtonElement
                                                        >,
                                                ) => {
                                                    queryDispatch({
                                                        action: queryAction
                                                            .modifyQueryChains,
                                                        payload: {
                                                            index: linkIndex,
                                                            logicalOperator,
                                                            queryChainActions:
                                                                "slideUp",
                                                            queryChainKind,
                                                            queryLink: [
                                                                "",
                                                                "equal to",
                                                                "",
                                                            ],
                                                        },
                                                    });
                                                },
                                            }}
                                        />
                                    );

                                    const slideQueryChainDownButton = (
                                        <AccessibleButton
                                            attributes={{
                                                disabled: linkIndex ===
                                                    queryChain.length - 1,
                                                disabledScreenreaderText:
                                                    "Cannot move link down. Already at the bottom",
                                                enabledScreenreaderText:
                                                    `Move link ${queryLinkStatement} down`,
                                                index: linkIndex,
                                                kind: "down",
                                                setIconAsLabel: true,
                                                onClick: (
                                                    _event:
                                                        | React.MouseEvent<
                                                            HTMLButtonElement,
                                                            MouseEvent
                                                        >
                                                        | React.PointerEvent<
                                                            HTMLButtonElement
                                                        >,
                                                ) => {
                                                    queryDispatch({
                                                        action: queryAction
                                                            .modifyQueryChains,
                                                        payload: {
                                                            index: linkIndex,
                                                            logicalOperator,
                                                            queryChainActions:
                                                                "slideDown",
                                                            queryChainKind,
                                                            queryLink: [
                                                                "",
                                                                "equal to",
                                                                "",
                                                            ],
                                                        },
                                                    });
                                                },
                                            }}
                                        />
                                    );

                                    const buttons = (
                                        <Group>
                                            {deleteQueryLinkButton}
                                            {/* {insertQueryLinkButton} */}
                                            {slideQueryChainUpButton}
                                            {slideQueryChainDownButton}
                                        </Group>
                                    );

                                    const timelineBullet =
                                        logicalOperator === "and"
                                            ? <TbLogicAnd />
                                            : logicalOperator === "nor"
                                            ? <TbLogicNor />
                                            : <TbLogicOr />;

                                    const timelineText = (
                                        <Text>
                                            {`${queryLinkStatement} ${
                                                linkIndex ===
                                                        queryChain.length - 1
                                                    ? "."
                                                    : logicalOperator
                                            }`}
                                        </Text>
                                    );

                                    return (
                                        <Timeline.Item
                                            key={`chain-${chainsIndex}-map-${mapIndex}-link-${linkIndex.toString()}`}
                                            bullet={timelineBullet}
                                        >
                                            {timelineText}
                                            {buttons}
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
            <Timeline.Item bullet={<TbLink />}>
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
            <Timeline.Item bullet={<TbLink />}>
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
                    <Text size="md">
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
        <Timeline.Item bullet={<TbLogicNot />}>
            <Text>
                {`${capitalizeJoinWithAnd(projectionFields)} excluded.`}
            </Text>
        </Timeline.Item>
    );

    const projectionChainElement = projectionFields.length === 0
        ? null
        : (
            <Stack>
                <Text size="md">
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
            <Group px="md" w="100%">
                <Text>No query chain</Text>
            </Group>
        )
        : (
            <Stack px="md" w="100%">
                {queryChainElements}
                {projectionChainElement}
                {generalSearchChainElement}
            </Stack>
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
    operator,
    queryChainKind,
    value,
}: {
    field: string;
    operator: string;
    queryChainKind: QueryChainKind;
    value: string;
}) {
    // projection
    let queryLinkStatement = "";

    if (queryChainKind === "filter") {
        queryLinkStatement = `${splitCamelCase(field)} ${
            operator === "in" ? "contains" : `is ${operator}`
        } ${value}`;
    }

    if (queryChainKind === "sort") {
        queryLinkStatement = `${splitCamelCase(field)} in ${value} order`;
    }

    return queryLinkStatement;
}

export { Chain };
