import { Card, Image, ImageProps } from "@mantine/core";
import React, { useState } from "react";
import { TbPhotoOff } from "react-icons/tb";

type AccessibleImageAttributes = ImageProps & {
  dataTestId?: string;
  imageRef?: React.ForwardedRef<HTMLImageElement>;
  isLink?: boolean;
};

type AccessibleImageProps = {
  attributes: AccessibleImageAttributes;
};

function AccessibleImage({ attributes }: AccessibleImageProps) {
  const {
    alt = "Unknown",
    dataTestId,
    fit = "cover",
    imageRef,
    isLink,
    onClick,
    radius,
    src,
    withPlaceholder = true,
    placeholder = withPlaceholder ? <TbPhotoOff /> : null,
    style = {},
    ...imageProps
  } = attributes;

  const [isImageLoadFailed, setIsImageLoadFailed] = useState(false);

  const fallbackAlt = "Image failed to load. Here is a cute picture instead!";
  const fallbackSrc =
    "https://images.pexels.com/photos/27742215/pexels-photo-27742215/free-photo-of-a-small-brown-and-white-guinea-sitting-on-top-of-a-brick.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  const image = (
    <Image
      alt={isImageLoadFailed ? fallbackAlt : alt}
      data-testid={dataTestId}
      fit={fit}
      onClick={onClick}
      onError={() => setIsImageLoadFailed(true)}
      placeholder={placeholder}
      ref={imageRef}
      src={isImageLoadFailed ? fallbackSrc : src}
      {...imageProps}
    />
  );

  const card = (
    <Card
      radius={radius}
      style={{
        ...style,
        cursor: isLink ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <Card.Section style={{ position: "relative" }}>
        {image}
      </Card.Section>
    </Card>
  );

  return card;
}

export default AccessibleImage;
