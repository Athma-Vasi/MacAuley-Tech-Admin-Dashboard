import { Box, Group, Text, Title } from "@mantine/core";
import {
    COLORS_SWATCHES,
    RESOURCES_DATE_FIELDS,
    RESOURCES_IMAGE_URL_FIELDS,
} from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { formatDate, returnThemeColors, splitCamelCase } from "../../utils";
import AccessibleImage from "../accessibleInputs/AccessibleImage";

type DisplayResourceProps = {
    resourceData: Array<Record<string, unknown>>;
    totalDocuments: number;
};

function DisplayResource(
    { resourceData, totalDocuments }: DisplayResourceProps,
) {
    const { globalState: { themeObject } } = useGlobalState();

    const { bgGradient } = returnThemeColors({
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
                                const resourceValue =
                                    RESOURCES_IMAGE_URL_FIELDS.has(key)
                                        ? (
                                            <AccessibleImage
                                                attributes={{
                                                    alt: "Resource Photo",
                                                    fit: "cover",
                                                    height: 96,
                                                    name: "Resource Photo",
                                                    radius: 9999,
                                                    src: value
                                                        ?.toString() ??
                                                        "",
                                                    width: 96,
                                                }}
                                            />
                                        )
                                        : RESOURCES_DATE_FIELDS.has(key)
                                        ? formatDate({
                                            date: value?.toString() ?? "",
                                            formatOptions: {
                                                year: "numeric",
                                                month: "long",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            },
                                        })
                                        : value?.toString() ??
                                            "Unknown";

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
        <Box bg={bgGradient} className="display-resource-container">
            <Group w="100%" position="apart">
                <Title order={3} className="resource-title">
                    Resources
                </Title>

                <Text>Total Documents: {totalDocuments}</Text>
            </Group>
            <div className="resources-content">{resources}</div>
        </Box>
    );
}

export default DisplayResource;
