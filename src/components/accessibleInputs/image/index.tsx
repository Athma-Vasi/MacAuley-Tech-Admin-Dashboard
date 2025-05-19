import {
    Card,
    Divider,
    Group,
    Image,
    LoadingOverlay,
    Modal,
    Space,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { TbCheck, TbExclamationCircle } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { useMountedRef } from "../../../hooks/useMountedRef";
import { addCommaSeparator, returnThemeColors } from "../../../utils";
import { MessageEventRetrieveImagesWorkerToMain } from "../../../workers/retrieveImagesWorker";
import RetrieveImagesWorker from "../../../workers/retrieveImagesWorker?worker";
import { GoldenGrid } from "../../goldenGrid";
import { AccessibleFileInput, ModifiedFile } from "../AccessibleFileInput";
import { AccessibleSliderInput } from "../AccessibleSliderInput";
import { createAccessibleButtons } from "../utils";
import {
    AccessibleImageInputAction,
    accessibleImageInputAction,
} from "./actions";
import {
    ALLOWED_FILE_EXTENSIONS_REGEX,
    displayOrientationLabel,
    IMG_ORIENTATION_SLIDER_DATA,
    IMG_QUALITY_SLIDER_DATA,
    MAX_IMAGE_SIZE,
    MAX_IMAGES,
} from "./constants";
import {
    handleImageQualityOrientationSliderChange,
    handleMessageEventRetrieveImagesWorkerToMain,
    handleRemoveImageClick,
    handleResetImageClick,
} from "./handlers";
import { accessibleImageInputReducer } from "./reducers";
import { initialAccessibleImageInputState } from "./state";
import type { AccessibleImageInputProps } from "./types";
import { checkImageFileBlobs } from "./utils";

function AccessibleImageInput<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>(
    { attributes }: AccessibleImageInputProps<
        ValidValueAction,
        InvalidValueAction
    >,
) {
    const {
        disabled,
        disabledScreenreaderText,
        invalidValueAction,
        maxImageSize = MAX_IMAGE_SIZE,
        maxImagesAmount = MAX_IMAGES,
        parentDispatch,
        storageKey,
        validValueAction,
    } = attributes;

    const [accessibleImageInputState, accessibleImageInputDispatch] =
        useReducer(
            accessibleImageInputReducer,
            initialAccessibleImageInputState,
        );

    const {
        currentImageIndex,
        fileNames,
        imageFileBlobs,
        retrieveImagesWorker,
        isErrors,
        isLoading,
        isModalOpen,
        orientations,
        qualities,
    } = accessibleImageInputState;

    const {
        globalState: { themeObject },
    } = useGlobalState();

    const { showBoundary } = useErrorBoundary();

    const isComponentMountedRef = useMountedRef();

    useEffect(() => {
        const newRetrieveImagesWorker = new RetrieveImagesWorker();

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setRetrieveImagesWorker,
            payload: newRetrieveImagesWorker,
        });

        newRetrieveImagesWorker.onmessage = async (
            event: MessageEventRetrieveImagesWorkerToMain,
        ) => {
            await handleMessageEventRetrieveImagesWorkerToMain({
                event,
                accessibleImageInputDispatch,
                isComponentMountedRef,
                showBoundary,
            });
        };

        return () => {
            newRetrieveImagesWorker.terminate();
            isComponentMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!retrieveImagesWorker) {
            return;
        }

        accessibleImageInputDispatch({
            action: accessibleImageInputAction.setIsLoading,
            payload: true,
        });

        retrieveImagesWorker.postMessage({
            storageKey,
        });
    }, [retrieveImagesWorker]);

    useEffect(() => {
        checkImageFileBlobs({
            fileNames,
            imageFileBlobs,
            invalidValueAction,
            maxImageSize,
            parentDispatch,
            storageKey,
            validValueAction,
        });
    }, [imageFileBlobs.length]);

    const fileInput = (
        <AccessibleFileInput<
            AccessibleImageInputAction["addImageFileBlob"],
            AccessibleImageInputAction["addFileName"]
        >
            attributes={{
                addFileNameAction: accessibleImageInputAction.addFileName,
                disabled,
                label: disabled ? disabledScreenreaderText : void 0,
                name: "image",
                parentDispatch: accessibleImageInputDispatch,
                storageKey,
                validValueAction: accessibleImageInputAction.addImageFileBlob,
            }}
        />
    );

    const {
        redColorShade,
        textColor,
        greenColorShade,
        themeColorShade,
    } = returnThemeColors({ themeObject, colorsSwatches: COLORS_SWATCHES });

    const fileBlobCards = imageFileBlobs.map(
        (fileBlob: ModifiedFile, index) => {
            const { size, type } = fileBlob ?? new Blob([]);

            const isImageSizeInvalid = size > maxImageSize;
            const isImageTypeInvalid = !ALLOWED_FILE_EXTENSIONS_REGEX.test(
                type.split("/")[1],
            );
            const isImageInvalid = isImageSizeInvalid || isImageTypeInvalid;

            const validScreenreaderTextElement = (
                <GoldenGrid>
                    <Group position="right">
                        <TbCheck color={greenColorShade} size={22} />
                    </Group>
                    <Text
                        color={greenColorShade}
                        data-testid="image-valid-text"
                        aria-live="polite"
                    >
                        Image is valid
                    </Text>
                </GoldenGrid>
            );

            const isImageSizeInvalidText = isImageSizeInvalid
                ? `Image is too large. Must be less than ${
                    addCommaSeparator(maxImageSize / 1000)
                } KB.`
                : "";
            const isImageTypeInvalidText = isImageTypeInvalid
                ? "Image contains disallowed file type. Must only contain jpg, jpeg, png, or webp file types."
                : "";

            const invalidImageDescription =
                `Image is invalid. ${isImageSizeInvalidText} ${isImageTypeInvalidText}`;

            const invalidScreenreaderTextElement = (
                <GoldenGrid>
                    <Group w="100%" position="right">
                        <TbExclamationCircle color={redColorShade} size={22} />
                    </Group>

                    <Text
                        color={redColorShade}
                        aria-live="polite"
                        data-testid="image-invalid-text"
                    >
                        {invalidImageDescription}
                    </Text>
                </GoldenGrid>
            );

            const img = (
                <Image
                    alt={isImageInvalid
                        ? "Invalid image"
                        : fileNames[index] ?? "Image"}
                    data-testid="image-preview"
                    key={index.toString()}
                    // maw={300}
                    src={URL.createObjectURL(fileBlob ?? new Blob([]))}
                    style={{ cursor: "pointer" }}
                    onClick={(
                        _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                    ) => {
                        accessibleImageInputDispatch({
                            action: accessibleImageInputAction.setIsModalOpen,
                            payload: true,
                        });
                        accessibleImageInputDispatch({
                            action:
                                accessibleImageInputAction.setCurrentImageIndex,
                            payload: index,
                        });
                    }}
                    withPlaceholder
                />
            );

            const imageName = (
                <GoldenGrid>
                    <Text color={textColor}>Name:</Text>

                    <Group spacing={4}>
                        {fileNames[index]?.split(" ").map((char, charIndex) => {
                            return (
                                <Text
                                    data-testid="image-name"
                                    key={`${index}-${charIndex}`}
                                    color={textColor}
                                >
                                    {char}
                                </Text>
                            );
                        })}
                    </Group>
                </GoldenGrid>
            );

            const imageSizeColor = isImageSizeInvalid
                ? redColorShade
                : textColor;
            const imageSize = (
                <GoldenGrid>
                    <Text color={imageSizeColor}>Size:</Text>
                    <Text color={imageSizeColor}>
                        {addCommaSeparator(Math.round(size / 1000))} KB
                    </Text>
                </GoldenGrid>
            );

            const imageTypeColor = isImageTypeInvalid
                ? redColorShade
                : textColor;
            const imageType = (
                <GoldenGrid>
                    <Text color={imageTypeColor}>Type:</Text>
                    <Text color={imageTypeColor}>
                        {type.length
                            ? type.split("/")[1]
                            : fileNames[index].split(".")[1] ?? "Unknown"}
                    </Text>
                </GoldenGrid>
            );

            const fileName = fileNames[index].slice(0, 17);
            const ellipsis = fileNames[index].length > 17 ? "..." : "";

            const [removeButton, resetButton] = createAccessibleButtons([
                {
                    dataTestId: "remove-image-button",
                    disabledScreenreaderText:
                        `Image ${fileName} ${ellipsis} is invalid`,
                    enabledScreenreaderText: `Remove ${fileName} ${ellipsis}`,
                    kind: "delete",
                    name: "remove",
                    onClick: async (
                        _event:
                            | React.MouseEvent<HTMLButtonElement, MouseEvent>
                            | React.PointerEvent<HTMLButtonElement>,
                    ) => {
                        await handleRemoveImageClick({
                            accessibleImageInputDispatch,
                            index,
                            invalidValueAction,
                            isComponentMountedRef,
                            parentDispatch,
                            showBoundary,
                            storageKey,
                            validValueAction,
                        });
                    },
                },
                {
                    dataTestId: "reset-image-button",
                    disabled: isImageTypeInvalid,
                    disabledScreenreaderText:
                        `Image ${fileName} ${ellipsis} is invalid`,
                    enabledScreenreaderText: `Reset ${fileName} ${ellipsis}`,
                    kind: "refresh",
                    name: "reset",
                    onClick: async (
                        _event:
                            | React.MouseEvent<HTMLButtonElement, MouseEvent>
                            | React.PointerEvent<HTMLButtonElement>,
                    ) => {
                        await handleResetImageClick({
                            accessibleImageInputDispatch,
                            index,
                            isComponentMountedRef,
                            showBoundary,
                            storageKey,
                        });
                    },
                },
            ]);

            const removeButtonWithTooltip = isImageInvalid
                ? (
                    <Tooltip label={`${imageName} is invalid`}>
                        {removeButton}
                    </Tooltip>
                )
                : removeButton;

            const resetButtonWithTooltip = isImageInvalid
                ? (
                    <Tooltip label={invalidImageDescription}>
                        {resetButton}
                    </Tooltip>
                )
                : resetButton;

            const imageQualitySlider = (
                <AccessibleSliderInput
                    attributes={{
                        disabled: isImageTypeInvalid,
                        marks: IMG_QUALITY_SLIDER_DATA,
                        max: 10,
                        min: 1,
                        name: "quality",
                        onChange: async (value: number) => {
                            // if (!modifyImagesWorker) {
                            //     return;
                            // }

                            // accessibleImageInputDispatch({
                            //     action: accessibleImageInputAction.setIsLoading,
                            //     payload: true,
                            // });

                            // modifyImagesWorker.postMessage(
                            //     {
                            //         currentImageIndex: index,
                            //         maxImagesAmount,
                            //         maxImageSize,
                            //         orientations,
                            //         orientation: orientations[index],
                            //         qualities,
                            //         quality: value,
                            //         storageKey,
                            //     },
                            // );

                            console.log(
                                "handleImageQualityOrientationSliderChange onChange",
                            );

                            await handleImageQualityOrientationSliderChange({
                                accessibleImageInputDispatch,
                                currentImageIndex: index,
                                fileNames,
                                invalidValueAction,
                                isComponentMountedRef,
                                maxImageSize,
                                orientations,
                                parentDispatch,
                                qualities,
                                qualityValue: value,
                                showBoundary,
                                storageKey,
                                validValueAction,
                            }).then((result) => {
                                console.log(
                                    "handleImageQualityOrientationSliderChange result",
                                    result,
                                );
                            });
                        },
                        sliderDefaultValue: 1,
                        step: 1,
                        validValueAction: accessibleImageInputAction.setQuality,
                        value: qualities[index],
                        width: "100%",
                    }}
                />
            );

            const imageQualityStack = (
                <Stack spacing="xl">
                    {imageQualitySlider}
                    <Group position="center">
                        <Text>Quality</Text>
                    </Group>
                </Stack>
            );

            const imageOrientationSlider = (
                <AccessibleSliderInput
                    attributes={{
                        disabled: isImageTypeInvalid || qualities[index] > 8,
                        index,
                        label: (value) => displayOrientationLabel(value),
                        marks: IMG_ORIENTATION_SLIDER_DATA,
                        max: 8,
                        min: 1,
                        name: "orientation",
                        onChange: async (value: number) => {
                            // if (!modifyImagesWorker) {
                            //     return;
                            // }

                            // accessibleImageInputDispatch({
                            //     action: accessibleImageInputAction.setIsLoading,
                            //     payload: true,
                            // });

                            // modifyImagesWorker.postMessage(
                            //     {
                            //         currentImageIndex: index,
                            //         maxImagesAmount,
                            //         maxImageSize,
                            //         orientation: value,
                            //         orientations,
                            //         qualities,
                            //         quality: qualities[index],
                            //         storageKey,
                            //     },
                            // );

                            await handleImageQualityOrientationSliderChange({
                                accessibleImageInputDispatch,
                                currentImageIndex: index,
                                fileNames,
                                invalidValueAction,
                                isComponentMountedRef,
                                maxImageSize,
                                orientations,
                                orientationValue: value,
                                parentDispatch,
                                qualities,
                                showBoundary,
                                storageKey,
                                validValueAction,
                            });
                        },
                        sliderDefaultValue: 1,
                        step: 1,
                        validValueAction:
                            accessibleImageInputAction.setOrientation,
                        value: orientations[index],
                        width: "100%",
                    }}
                />
            );

            const imageOrientationStack = (
                <Stack spacing="xl">
                    {imageOrientationSlider}
                    <Group position="center">
                        <Text>
                            {qualities[index] > 8
                                ? "Quality must be less than 90%"
                                : "Orientation"}
                        </Text>
                    </Group>
                </Stack>
            );

            return (
                <Card
                    withBorder
                    radius="md"
                    shadow="sm"
                    key={`${index}-${fileNames[index]}`}
                >
                    <Card.Section>
                        {img}
                    </Card.Section>
                    <Space h="xs" />
                    <Stack spacing="lg">
                        {isImageInvalid
                            ? invalidScreenreaderTextElement
                            : validScreenreaderTextElement}

                        <Stack spacing="xs">
                            {imageName}
                            <Divider />
                            {imageSize}
                            <Divider />
                            {imageType}
                            <Divider />
                        </Stack>

                        <Stack spacing="xl">
                            {imageQualityStack}
                            {imageOrientationStack}
                        </Stack>

                        <Group w="100%" position="apart">
                            {removeButtonWithTooltip}
                            {resetButtonWithTooltip}
                        </Group>
                    </Stack>
                </Card>
            );
        },
    );

    const loadingOverlay = <LoadingOverlay visible={isLoading} />;

    const modifiedImagePreviewModal = (
        <Modal
            centered
            closeButtonProps={{ color: themeColorShade }}
            opened={isModalOpen}
            onClose={() =>
                accessibleImageInputDispatch({
                    action: accessibleImageInputAction.setIsModalOpen,
                    payload: false,
                })}
            transitionProps={{
                transition: "fade",
                duration: 200,
                timingFunction: "ease-in-out",
            }}
            maw={1024}
            miw={350}
            title={
                <Text size="lg" weight={600}>
                    {fileNames[currentImageIndex] ?? "Image"}
                </Text>
            }
            size={"xl"}
        >
            <Stack spacing="lg" align="center">
                <Image
                    alt={fileNames[currentImageIndex] ?? "Image"}
                    maw={640}
                    src={URL.createObjectURL(
                        imageFileBlobs[currentImageIndex] ?? new Blob([]),
                    )}
                    placeholder="Image loading..."
                    withPlaceholder
                />
                <Stack w="100%" pl="xl">
                    <Text color={textColor} size="md">
                        {`Quality: ${qualities[currentImageIndex]} = ${
                            qualities[currentImageIndex] * 10
                        }%`}
                    </Text>

                    <Text color={textColor} size="md">
                        {`Orientation: ${orientations[currentImageIndex]} = ${
                            displayOrientationLabel(
                                orientations[currentImageIndex],
                            )
                        }`}
                    </Text>

                    <Text color={textColor} size="md">
                        {imageFileBlobs[currentImageIndex]
                            ? `Size: ${
                                addCommaSeparator(
                                    Math.round(
                                        imageFileBlobs[currentImageIndex].size /
                                            1000,
                                    ),
                                )
                            } KB`
                            : null}
                    </Text>
                </Stack>
            </Stack>
        </Modal>
    );

    return (
        <Stack
            className="accessible-input"
            // style={{ minWidth: INPUT_WIDTH, maxWidth: "400px" }}
            pos="relative"
        >
            {modifiedImagePreviewModal}
            {loadingOverlay}
            {fileInput}
            {fileBlobCards}
        </Stack>
    );
}

export { AccessibleImageInput };
