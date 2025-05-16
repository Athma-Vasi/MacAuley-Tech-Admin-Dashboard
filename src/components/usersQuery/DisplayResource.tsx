import { Box, Group, Modal, Table, Text, Title } from "@mantine/core";
import { useState } from "react";
import {
    COLORS_SWATCHES,
    RESOURCES_DATE_FIELDS,
    RESOURCES_IMAGE_URL_FIELDS,
} from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { useWindowSize } from "../../hooks/useWindowSize";
import { formatDate, returnThemeColors, splitCamelCase } from "../../utils";
import { SortDirection } from "../query/types";
import {
    returnArrangeByIconsElement,
    returnImageDropdown,
    returnResourceCardElement,
} from "./utils";

type DisplayResourceProps = {
    arrangeByDirection: SortDirection;
    arrangeByField: string;
    isLoading: boolean;
    parentAction: Record<string, string>;
    parentDispatch: React.Dispatch<any>;
    resourceData: Array<Record<string, unknown>>;
    resourceName: string;
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
        resourceName,
        totalDocuments,
    }: DisplayResourceProps,
) {
    const { windowWidth } = useWindowSize();
    const { globalState: { themeObject } } = useGlobalState();
    const [modalState, setModalState] = useState(
        false,
    );
    const [selectedDocument, setSelectedDocument] = useState<
        Record<string, unknown>
    >({});
    const [keyToHighlight, setKeyToHighlight] = useState<string>("");

    const { themeColorShade, bgGradient, textColor } = returnThemeColors({
        colorsSwatches: COLORS_SWATCHES,
        themeObject,
    });

    const resourcesCards = (
        <div className="resource-cards-container">
            {resourceData.map((resource, resourceIndex) =>
                returnResourceCardElement({
                    resource,
                    arrangeByDirection,
                    arrangeByField,
                    parentAction,
                    parentDispatch,
                    resourceIndex,
                    textColor,
                    themeColorShade,
                })
            )}
        </div>
    );

    const resourceModal = (
        <Modal
            centered
            closeButtonProps={{ color: themeColorShade }}
            opened={modalState}
            onClose={() => setModalState((prevState) => !prevState)}
            size="lg"
            transitionProps={{
                transition: "fade",
                duration: 200,
                timingFunction: "ease-in-out",
            }}
            title={
                <Text size="lg" weight={600}>
                    {String(selectedDocument?.username ?? resourceName)}
                </Text>
            }
        >
            <div className="resource-cards-container">
                {returnResourceCardElement({
                    resource: selectedDocument,
                    arrangeByDirection,
                    arrangeByField,
                    hideIcons: true,
                    keyToHighlight,
                    parentAction,
                    parentDispatch,
                    resourceIndex: 0,
                    textColor,
                    themeColorShade,
                })}
            </div>
        </Modal>
    );

    const tableHeaderRow = (
        <thead className="table-header">
            <tr>
                {resourceData[0] === undefined
                    ? []
                    : Object.keys(resourceData[0]).map((key, index) => {
                        const arrangeByIconsElement =
                            returnArrangeByIconsElement({
                                arrangeByDirection,
                                arrangeByField,
                                key,
                                parentAction,
                                parentDispatch,
                                textColor,
                                themeColorShade,
                            });

                        return (
                            <th key={`${key}-${index}`}>
                                <div className="header-item">
                                    {arrangeByIconsElement}
                                    <Text
                                        color={key === arrangeByField
                                            ? themeColorShade
                                            : textColor}
                                    >
                                        {splitCamelCase(key)}
                                    </Text>
                                </div>
                            </th>
                        );
                    })}
            </tr>
        </thead>
    );

    const tableDataRows = resourceData.length === 0
        ? []
        : (
            <tbody className="table-body">
                {resourceData.map((resource, resourceIndex) => {
                    return (
                        <tr key={`${resourceIndex}`}>
                            {Object.entries(resource).map(
                                ([key, value], entryIndex) => {
                                    const isFieldAnImageUrl =
                                        RESOURCES_IMAGE_URL_FIELDS
                                            .has(key);
                                    const isFieldADate = RESOURCES_DATE_FIELDS
                                        .has(
                                            key,
                                        );

                                    const imageDropdown = returnImageDropdown({
                                        key: `${resourceIndex}-${entryIndex}-${key}`,
                                        src: value?.toString() ?? "",
                                        truncate: true,
                                    });

                                    const resourceValue = isFieldAnImageUrl
                                        ? imageDropdown
                                        : isFieldADate
                                        ? (
                                            <Text
                                                key={`${resourceIndex}-${entryIndex}-${key}`}
                                            >
                                                {formatDate({
                                                    date: value?.toString() ??
                                                        "",
                                                })}
                                            </Text>
                                        )
                                        : (
                                            <Text
                                                key={`${resourceIndex}-${entryIndex}-${key}`}
                                            >
                                                {value?.toString() ??
                                                    "Unknown"}
                                            </Text>
                                        );

                                    return (
                                        <td
                                            key={`${resourceIndex}-${entryIndex}-${key}`}
                                        >
                                            <div
                                                className="table-value"
                                                onClick={() => {
                                                    setModalState((prevState) =>
                                                        !prevState
                                                    );
                                                    setSelectedDocument(
                                                        resource,
                                                    );
                                                    setKeyToHighlight(key);
                                                }}
                                            >
                                                {resourceValue}
                                            </div>
                                        </td>
                                    );
                                },
                            )}
                        </tr>
                    );
                })}
            </tbody>
        );

    const resourcesTable = (
        <div className="resource-table-container">
            {resourceModal}
            <Table
                highlightOnHover
                className="resource-table"
            >
                {tableHeaderRow}
                {tableDataRows}
            </Table>
        </div>
    );

    const resources = windowWidth < 1361 ? resourcesCards : resourcesTable;

    return (
        <Box
            bg={bgGradient}
            className="display-resource-container"
            pos="relative"
        >
            <Group w="100%" position="apart" p="md">
                <Title order={3} color={textColor} className="resource-title">
                    Resources
                </Title>

                <Text color={textColor} data-testid="usersQuery-totalDocuments">
                    Total Documents: {totalDocuments || 0}
                </Text>
            </Group>

            {resourceData.length === 0
                ? <Text pl="md">No documents found</Text>
                : resources}
        </Box>
    );
}

export default DisplayResource;
