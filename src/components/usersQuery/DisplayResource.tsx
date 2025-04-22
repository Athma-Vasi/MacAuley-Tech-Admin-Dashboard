import { Box, Group, Modal, Overlay, Table, Text, Title } from "@mantine/core";
import { useState } from "react";
import {
    COLORS_SWATCHES,
    OVERLAY_BLUR,
    OVERLAY_OPACITY,
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
            transitionProps={{
                transition: "fade",
                duration: 200,
                timingFunction: "ease-in-out",
            }}
            maw={640}
            miw={350}
            title={<Title order={3}>{resourceName}</Title>}
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

    const tableHeaderRow = resourceData.length === 0
        ? null
        : (
            <thead className="table-header">
                <tr>
                    {Object.keys(resourceData[0]).map((key, index) => {
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
        : resourceData.map((resource, resourceIndex) => {
            return (
                <tbody className="table-body" key={`${resourceIndex}`}>
                    <tr>
                        {Object.entries(resource).map(
                            ([key, value], entryIndex) => {
                                const isFieldAnImageUrl =
                                    RESOURCES_IMAGE_URL_FIELDS
                                        .has(key);
                                const isFieldADate = RESOURCES_DATE_FIELDS.has(
                                    key,
                                );

                                const imageDropdown = returnImageDropdown({
                                    alt: "Resource Photo",
                                    fit: "cover",
                                    height: 48,
                                    radius: 9999,
                                    src: value?.toString() ?? "",
                                    width: 48,
                                });

                                const resourceValue = isFieldAnImageUrl
                                    ? imageDropdown
                                    : isFieldADate
                                    ? formatDate({
                                        date: value?.toString() ?? "",
                                    })
                                    : value?.toString() ??
                                        "Unknown";

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
                                                setSelectedDocument(resource);
                                                setKeyToHighlight(key);
                                            }}
                                        >
                                            <Text>{resourceValue}</Text>
                                        </div>
                                    </td>
                                );
                            },
                        )}
                    </tr>
                </tbody>
            );
        });

    const resourcesTable = resourceData.length === 0
        ? []
        : (
            <div className="resource-table-container">
                {resourceModal}
                <Table
                    striped
                    highlightOnHover
                    className="resource-table"
                >
                    {tableHeaderRow}
                    {tableDataRows}
                </Table>
            </div>
        );

    // const tableHeaderRow = resourceData.length === 0
    //     ? null
    //     : (
    //         <div className="table-header">
    //             {Object.keys(resourceData[0]).map((key, index) => (
    //                 <div
    //                     key={`${key}-${index}`}
    //                     className="resource-item"
    //                 >
    //                     {splitCamelCase(key)}
    //                 </div>
    //             ))}
    //         </div>
    //     );

    // const tableDataRows = resourceData.length === 0
    //     ? []
    //     : resourceData.map((resource, resourceIndex) => {
    //         return (
    //             <div
    //                 className="table-body"
    //                 key={`${resourceIndex}`}
    //             >
    //                 {Object.entries(resource).map(
    //                     ([key, value], entryIndex) => {
    //                         const isFieldAnImageUrl = RESOURCES_IMAGE_URL_FIELDS
    //                             .has(key);
    //                         const isFieldADate = RESOURCES_DATE_FIELDS.has(
    //                             key,
    //                         );

    //                         const resourceValue = isFieldAnImageUrl
    //                             ? (
    //                                 <Image
    //                                     alt="Resource Photo"
    //                                     fit="cover"
    //                                     height={96}
    //                                     aria-label="Resource Photo"
    //                                     radius={9999}
    //                                     src={value?.toString() ?? ""}
    //                                     width={96}
    //                                 />
    //                             )
    //                             : isFieldADate
    //                             ? formatDate({
    //                                 date: value?.toString() ?? "",
    //                             })
    //                             : value?.toString() ??
    //                                 "Unknown";

    //                         return (
    //                             <div
    //                                 key={`${resourceIndex}-${entryIndex}-${key}`}
    //                                 className={`resource-item ${
    //                                     entryIndex % 2 === 0 ? "even" : "odd"
    //                                 }`}
    //                             >
    //                                 {resourceValue}
    //                             </div>
    //                         );
    //                     },
    //                 )}
    //             </div>
    //         );
    //     });
    // const resourcesTable = (
    //     <div className="resource-table">
    //         {tableHeaderRow}
    //         {tableDataRows}
    //     </div>
    // );

    const resources = windowWidth < 1300 ? resourcesCards : resourcesTable;

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
