import { Image, ImageProps, Tooltip } from "@mantine/core";
import {
    TbArrowDown,
    TbArrowUp,
    TbChevronDown,
    TbChevronUp,
} from "react-icons/tb";
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

export { returnArrangeByIconsElement, returnImageDropdown };
