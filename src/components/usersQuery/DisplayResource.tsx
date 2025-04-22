import { Box, Group, Image, Overlay, Text, Title } from "@mantine/core";
import {
    TbArrowDown,
    TbArrowUp,
    TbChevronDown,
    TbChevronUp,
} from "react-icons/tb";
import {
    COLORS_SWATCHES,
    OVERLAY_BLUR,
    OVERLAY_OPACITY,
    RESOURCES_DATE_FIELDS,
    RESOURCES_IMAGE_URL_FIELDS,
} from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { formatDate, returnThemeColors, splitCamelCase } from "../../utils";
import { SortDirection } from "../query/types";

type DisplayResourceProps = {
    arrangeByDirection: SortDirection;
    arrangeByField: string;
    isLoading: boolean;
    parentAction: Record<string, string>;
    parentDispatch: React.Dispatch<any>;
    resourceData: Array<Record<string, unknown>>;
    totalDocuments: number;
};

function DisplayResource(
    {
        arrangeByDirection,
        arrangeByField,
        isLoading,
        parentAction,
        parentDispatch,
        resourceData,
        totalDocuments,
    }: DisplayResourceProps,
) {
    const { globalState: { themeObject } } = useGlobalState();

    const { themeColorShade, bgGradient, textColor } = returnThemeColors({
        colorsSwatches: COLORS_SWATCHES,
        themeObject,
    });

    const resourcesCards = (
        <div className="resource-cards-container">
            {resourceData.map((resource, resourceIndex) => {
                return (
                    <div className="resource">
                        {Object.entries(resource).map(
                            ([key, value], entryIndex) => {
                                const isFieldAnUrl = RESOURCES_IMAGE_URL_FIELDS
                                    .has(key);
                                const isFieldADate = RESOURCES_DATE_FIELDS.has(
                                    key,
                                );

                                const resourceValue = isFieldAnUrl
                                    ? (
                                        <Image
                                            alt="Resource Photo"
                                            fit="cover"
                                            height={96}
                                            aria-label="Resource Photo"
                                            radius={9999}
                                            src={value?.toString() ?? ""}
                                            width={96}
                                        />
                                    )
                                    : isFieldADate
                                    ? formatDate({
                                        date: value?.toString() ?? "",
                                    })
                                    : value?.toString() ??
                                        "Unknown";

                                const isAscActive = key === arrangeByField &&
                                    arrangeByDirection ===
                                        "ascending";
                                const isDescActive = key === arrangeByField &&
                                    arrangeByDirection ===
                                        "descending";

                                function handleAscUpIconClick(
                                    _event: React.MouseEvent<
                                        SVGElement,
                                        MouseEvent
                                    >,
                                ) {
                                    parentDispatch({
                                        action: parentAction.setArrangeByField,
                                        payload: key,
                                    });

                                    parentDispatch({
                                        action:
                                            parentAction.setArrangeByDirection,
                                        payload: "ascending",
                                    });
                                }
                                function handleDescDownIconClick(
                                    _event: React.MouseEvent<
                                        SVGElement,
                                        MouseEvent
                                    >,
                                ) {
                                    parentDispatch({
                                        action: parentAction.setArrangeByField,
                                        payload: key,
                                    });

                                    parentDispatch({
                                        action:
                                            parentAction.setArrangeByDirection,
                                        payload: "descending",
                                    });
                                }

                                const arrangeByIcons = (
                                    <div className="resource-key-icons">
                                        {isAscActive
                                            ? (
                                                <TbArrowUp
                                                    color={isAscActive
                                                        ? themeColorShade
                                                        : textColor}
                                                    onClick={handleAscUpIconClick}
                                                    size={20}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            )
                                            : (
                                                <TbChevronUp
                                                    color={textColor}
                                                    onClick={handleAscUpIconClick}
                                                    size={20}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            )}

                                        {isDescActive
                                            ? (
                                                <TbArrowDown
                                                    color={isDescActive
                                                        ? themeColorShade
                                                        : textColor}
                                                    onClick={handleDescDownIconClick}
                                                    size={20}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            )
                                            : (
                                                <TbChevronDown
                                                    color={textColor}
                                                    onClick={handleDescDownIconClick}
                                                    size={20}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            )}
                                    </div>
                                );

                                return (
                                    <div
                                        key={`${resourceIndex}-${entryIndex}-${key}`}
                                        className={`resource-item ${
                                            entryIndex % 2 === 0
                                                ? "even"
                                                : "odd"
                                        }`}
                                    >
                                        <div className="resource-key">
                                            {arrangeByIcons}
                                            {splitCamelCase(key)}
                                        </div>
                                        <div className="resource-value">
                                            {resourceValue}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                );
            })}
        </div>
    );
    const resourcesTable = <></>;

    const resources = resourcesCards;

    return (
        <Box
            bg={bgGradient}
            className="display-resource-container"
            pos="relative"
        >
            <Group w="100%" position="apart" p="md">
                <Title order={3} className="resource-title">
                    Resources
                </Title>

                <Text>Total Documents: {totalDocuments || 0}</Text>
            </Group>
            {isLoading
                ? <Overlay opacity={OVERLAY_OPACITY} blur={OVERLAY_BLUR} />
                : null}
            {resourceData.length === 0
                ? <Text pl="md">No documents found</Text>
                : resources}
        </Box>
    );
}

export default DisplayResource;
