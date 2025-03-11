import { Box, Card, Image, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type CSSProperties, type ReactNode, useState } from "react";
import { TbPhotoOff } from "react-icons/tb";
import { useGlobalState } from "../../hooks";
import { createAccessibleImageTextElement } from "./utils";

type AccessibleImageAttributes = {
    alt: string;
    caption?: ReactNode;
    fit?: React.CSSProperties["objectFit"];
    height?: number | string;
    imageRef?: React.ForwardedRef<HTMLImageElement>;
    isLink?: boolean;
    name: string;
    onClick?: () => void;
    placeholder?: ReactNode;
    radius?: number | "xs" | "sm" | "md" | "lg" | "xl";
    src: string;
    style?: CSSProperties;
    width?: number | string;
    withPlaceholder?: boolean;
};

type AccessibleImageProps = {
    attributes: AccessibleImageAttributes;
    uniqueId?: string;
};

function AccessibleImage({ attributes, uniqueId }: AccessibleImageProps) {
    const {
        alt,
        caption,
        fit,
        height,
        imageRef,
        isLink,
        name,
        onClick,
        radius = 0,
        src,
        style,
        width = "100%",
        withPlaceholder = true,
        placeholder = withPlaceholder ? <TbPhotoOff /> : null,
    } = attributes;

    const {
        globalState: { themeObject },
    } = useGlobalState();

    const [loadingOverlayVisible, { toggle: toggleLoadingOverlay }] =
        useDisclosure(true);
    const [_isImageLoading, setIsImageLoading] = useState(true);
    const [isImageLoadFailed, setIsImageLoadFailed] = useState(false);

    const { screenreaderTextElement } = createAccessibleImageTextElement({
        description: alt,
        name,
        themeObject,
    });

    const loadingOverlay = (
        <LoadingOverlay
            visible={loadingOverlayVisible}
            overlayBlur={4}
            overlayOpacity={0.9}
            radius="md"
        />
    );

    const fallbackAlt = "Image failed to load. Here is a cute picture instead!";
    const fallbackSrc =
        "https://images.pexels.com/photos/27742215/pexels-photo-27742215/free-photo-of-a-small-brown-and-white-guinea-sitting-on-top-of-a-brick.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

    const styles: CSSProperties = { ...style, position: "relative" };

    const image = (
        <Image
            alt={isImageLoadFailed ? fallbackAlt : alt}
            caption={caption}
            fit={fit}
            height={height}
            onError={() => setIsImageLoadFailed(true)}
            onLoad={() => {
                setIsImageLoading(false);
                toggleLoadingOverlay();
            }}
            placeholder={placeholder}
            radius={radius}
            ref={imageRef}
            src={isImageLoadFailed ? fallbackSrc : src}
            style={styles}
            width={width}
        />
    );

    const card = (
        <Card
            radius={radius}
            key={uniqueId ?? `${name}-${alt}-${src}`}
            style={{
                ...styles,
                cursor: isLink ? "pointer" : "default",
            }}
            onClick={onClick}
        >
            <Card.Section style={{ position: "relative" }}>
                {image}
                {loadingOverlay}
            </Card.Section>

            <Box
                style={
                    // This is an invisible element that is used to provide screen reader users with additional information
                    // @see https://webaim.org/techniques/css/invisiblecontent/
                    {
                        height: "1px",
                        left: "-9999px",
                        position: "absolute",
                        top: "auto",
                        width: "1px",
                    }
                }
            >
                {screenreaderTextElement}
            </Box>
        </Card>
    );

    return card;
}

export default AccessibleImage;
