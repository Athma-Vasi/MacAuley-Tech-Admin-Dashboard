import { Group, Text } from "@mantine/core";
import React from "react";

import { AccessibleSegmentedControl } from "../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleTextInput } from "../accessibleInputs/AccessibleTextInput";
import { QueryAction, queryAction } from "./actions";
import { QUERY_SEARCH_CASE_DATA } from "./constants";
import { QueryDispatch } from "./schemas";
import type { GeneralSearchCase, QueryState } from "./types";

type QuerySearchProps = {
    queryDispatch: React.Dispatch<QueryDispatch>;
    queryState: QueryState;
};

function QuerySearch({
    queryDispatch,
    queryState,
}: QuerySearchProps) {
    const {
        generalSearchCase,
        generalSearchExclusionValue,
        generalSearchInclusionValue,
    } = queryState;

    const generalSearchInclusionTextInput = (
        <AccessibleTextInput
            attributes={{
                additionalScreenreaderIds: [
                    "general-search-link-heading",
                    "general-search-inclusion-screenreader-link",
                    "general-search-exclusion-screenreader-link",
                ],
                errorDispatch: queryDispatch,
                invalidValueAction: queryAction.setIsError,
                name: "inclusion",
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setGeneralSearchInclusionValue,
                value: generalSearchInclusionValue,
            }}
        />
    );

    const generalSearchExclusionTextInput = (
        <AccessibleTextInput
            attributes={{
                additionalScreenreaderIds: [
                    "general-search-link-heading",
                    "general-search-inclusion-screenreader-link",
                    "general-search-exclusion-screenreader-link",
                ],
                errorDispatch: queryDispatch,
                invalidValueAction: queryAction.setIsError,
                name: "exclusion",
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setGeneralSearchExclusionValue,
                value: generalSearchExclusionValue,
            }}
        />
    );

    const caseSensitiveSegmentedControl = (
        <AccessibleSegmentedControl<
            QueryAction["setGeneralSearchCase"],
            GeneralSearchCase
        >
            attributes={{
                data: QUERY_SEARCH_CASE_DATA,
                name: "case",
                parentDispatch: queryDispatch,
                validValueAction: queryAction.setGeneralSearchCase,
                value: generalSearchCase,
            }}
        />
    );

    const generalSearchSection = (
        <div className="query-search">
            <Text size="md">Search</Text>
            {caseSensitiveSegmentedControl}
            <Group w="100%" position="left" align="flex-start">
                {generalSearchInclusionTextInput}
                {generalSearchExclusionTextInput}
            </Group>
        </div>
    );

    return generalSearchSection;
}

export { QuerySearch };
