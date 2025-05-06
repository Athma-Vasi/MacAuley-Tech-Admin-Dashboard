import { Group, Image, ImageProps, Text, Tooltip } from "@mantine/core";
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
        <div className="resource-key-icons" key={key}>
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
        alt = "Resource Photo",
        fit = "cover",
        height = 150,
        key = "",
        radius = 9999,
        src = "",
        truncate = false,
        width = 150,
    }: {
        alt?: string;
        fit?: ImageProps["fit"];
        height?: number;
        key: string;
        radius?: number;
        src: string;
        truncate?: boolean;
        width?: number;
    },
) {
    const dropDownImage = (
        <Image
            alt={alt}
            fit={fit}
            height={height}
            key={key}
            radius={radius}
            src={src
                ? src
                : "https://images.pexels.com/photos/3396661/pexels-photo-3396661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
            width={width}
        />
    );

    const sliced = truncate
        ? src
            ? src.split("").slice(0, 55).concat(" ...")
            : "No URL provided".split(" ")
        : src.split("");

    return (
        <Tooltip
            label={dropDownImage}
            key={key}
            position="right-start"
        >
            <Group w="100%" spacing={0}>
                {sliced.map(
                    (part, index) => {
                        return (
                            <Text key={`${key}-${part}-${index}`}>{part}</Text>
                        );
                    },
                )}
            </Group>
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
                        key: `${resourceIndex}-${entryIndex}-${key}`,
                        radius: 9999,
                        src: value?.toString() ||
                            "https://images.pexels.com/photos/3396661/pexels-photo-3396661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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

                            <Text
                                className="resource-value"
                                color={key === keyToHighlight
                                    ? themeColorShade
                                    : textColor}
                                truncate
                            >
                                {resourceValue}
                            </Text>
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
