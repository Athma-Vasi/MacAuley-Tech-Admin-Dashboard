import { Image, ImageProps, Text, Tooltip } from "@mantine/core";
import {
    TbArrowDown,
    TbArrowUp,
    TbChevronDown,
    TbChevronUp,
} from "react-icons/tb";
import {
    RESOURCES_DATE_FIELDS,
    RESOURCES_IMAGE_URL_FIELDS,
} from "../../constants";
import { formatDate, splitCamelCase } from "../../utils";
import { SortDirection } from "../query/types";

function returnArrangeByIconsElement(
    {
        arrangeByDirection,
        arrangeByField,
        key,
        parentAction,
        parentDispatch,
        textColor,
        themeColorShade,
    }: {
        arrangeByDirection: SortDirection;
        arrangeByField: string;
        key: string;
        parentDispatch: React.Dispatch<any>;
        parentAction: Record<string, string>;
        themeColorShade: string;
        textColor: string;
    },
) {
    const isAscActive = key === arrangeByField &&
        arrangeByDirection ===
            "ascending";
    const isDescActive = key === arrangeByField &&
        arrangeByDirection ===
            "descending";

    function handleIconClick(
        arrangeByDirection: SortDirection,
    ) {
        parentDispatch({
            action: parentAction.setArrangeByField,
            payload: key,
        });

        parentDispatch({
            action: parentAction
                .setArrangeByDirection,
            payload: arrangeByDirection,
        });
    }

    return (
        <div className="resource-key-icons">
            {isAscActive
                ? (
                    <TbArrowUp
                        color={isAscActive ? themeColorShade : textColor}
                        onClick={(_event) =>
                            handleIconClick(
                                "ascending",
                            )}
                        size={20}
                        style={{
                            cursor: "pointer",
                        }}
                    />
                )
                : (
                    <TbChevronUp
                        color={textColor}
                        onClick={(_event) =>
                            handleIconClick(
                                "ascending",
                            )}
                        size={20}
                        style={{
                            cursor: "pointer",
                        }}
                    />
                )}

            {isDescActive
                ? (
                    <TbArrowDown
                        color={isDescActive ? themeColorShade : textColor}
                        onClick={(_event) =>
                            handleIconClick(
                                "descending",
                            )}
                        size={20}
                        style={{
                            cursor: "pointer",
                        }}
                    />
                )
                : (
                    <TbChevronDown
                        color={textColor}
                        onClick={(_event) =>
                            handleIconClick(
                                "descending",
                            )}
                        size={20}
                        style={{
                            cursor: "pointer",
                        }}
                    />
                )}
        </div>
    );
}

function returnImageDropdown(
    {
        alt,
        fit,
        height,
        radius,
        src,
        width,
    }: {
        src: string;
        alt: string;
        height: number;
        width: number;
        radius: number;
        fit: ImageProps["fit"];
    },
) {
    const dropDownImage = (
        <Image
            alt={alt}
            fit={fit}
            height={256}
            aria-label="Resource Photo"
            radius={radius}
            src={src}
            width={256}
        />
    );

    return (
        <Tooltip
            label={dropDownImage}
            position="right-start"
        >
            <Image
                alt={alt}
                fit={fit}
                height={height}
                radius={radius}
                src={src}
                width={width}
            />
        </Tooltip>
    );
}

function returnResourceCardElement(
    {
        arrangeByDirection,
        arrangeByField,
        hideIcons = false,
        keyToHighlight,
        parentAction,
        parentDispatch,
        resource,
        resourceIndex,
        textColor,
        themeColorShade,
    }: {
        arrangeByDirection: SortDirection;
        arrangeByField: string;
        hideIcons?: boolean;
        keyToHighlight?: string;
        parentAction: Record<string, string>;
        parentDispatch: React.Dispatch<any>;
        resource: Record<string, unknown>;
        resourceIndex: number;
        textColor: string;
        themeColorShade: string;
    },
) {
    return (
        <div className="resource">
            {Object.entries(resource).map(
                ([key, value], entryIndex) => {
                    const isFieldAnImageUrl = RESOURCES_IMAGE_URL_FIELDS
                        .has(key);
                    const isFieldADate = RESOURCES_DATE_FIELDS.has(
                        key,
                    );

                    const imageDropdown = returnImageDropdown({
                        alt: "Resource Photo",
                        fit: "cover",
                        height: 96,
                        radius: 9999,
                        src: value?.toString() ?? "",
                        width: 96,
                    });

                    const resourceValue = isFieldAnImageUrl
                        ? imageDropdown
                        : isFieldADate
                        ? formatDate({
                            date: value?.toString() ?? "",
                        })
                        : value?.toString() ??
                            "Unknown";

                    const arrangeByIconsElement = hideIcons
                        ? null
                        : returnArrangeByIconsElement({
                            arrangeByDirection,
                            arrangeByField,
                            key,
                            parentAction,
                            parentDispatch,
                            textColor,
                            themeColorShade,
                        });

                    return (
                        <div
                            key={`${resourceIndex}-${entryIndex}-${key}`}
                            className={`resource-item ${
                                entryIndex % 2 === 0 ? "even" : "odd"
                            }`}
                        >
                            <div className="resource-key">
                                {arrangeByIconsElement}
                                <Text
                                    color={key === arrangeByField
                                        ? themeColorShade
                                        : textColor}
                                >
                                    {splitCamelCase(key)}
                                </Text>
                            </div>
                            <div className="resource-value">
                                <Text
                                    color={key === keyToHighlight
                                        ? themeColorShade
                                        : textColor}
                                >
                                    {resourceValue}
                                </Text>
                            </div>
                        </div>
                    );
                },
            )}
        </div>
    );
}

export {
    returnArrangeByIconsElement,
    returnImageDropdown,
    returnResourceCardElement,
};
