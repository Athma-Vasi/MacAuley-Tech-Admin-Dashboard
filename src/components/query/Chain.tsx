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
                                        <Text
                                            aria-live="polite"
                                            id={`${field}-${value}-screenreader-link`}
                                            data-testid="query-link-text"
                                            size="md"
                                        >
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
                    <Text
                        aria-live="assertive"
                        id={`${queryChainKind}-screenreader-link-heading`}
                        data-testid={`query-link-heading-${queryChainKind}`}
                        size="md"
                    >
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
                <Text
                    aria-live="polite"
                    id="general-search-exclusion-screenreader-link"
                    size="md"
                >
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
                <Text
                    aria-live="polite"
                    id="general-search-inclusion-screenreader-link"
                    size="md"
                >
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
                    <Text
                        aria-live="polite"
                        id="general-search-link-heading"
                        size="md"
                        data-testid="general-search-link"
                    >
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
            <Text
                size="md"
                aria-live="polite"
                id="projection-exclusion-screenreader-link"
            >
                {`${capitalizeJoinWithAnd(projectionFields)} excluded.`}
            </Text>
        </Timeline.Item>
    );

    const projectionChainElement = projectionFields.length === 0
        ? null
        : (
            <Stack>
                <Text
                    aria-live="polite"
                    size="md"
                    data-testid="projection-link"
                    id="projection-exclusion-screenreader-heading"
                >
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
                <Text aria-live="polite" aria-atomic="true">
                    No query chain
                </Text>
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
            operator === "in" ? "equals" : `is ${operator}`
        } ${value}`;
    }

    if (queryChainKind === "sort") {
        queryLinkStatement = `${splitCamelCase(field)} in ${value} order`;
    }

    return queryLinkStatement;
}

export { Chain };
