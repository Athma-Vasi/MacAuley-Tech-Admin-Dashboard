import {
    Card,
    Divider,
    Group,
    Image,
    LoadingOverlay,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { TbCheck, TbExclamationCircle } from "react-icons/tb";
import { COLORS_SWATCHES, INPUT_WIDTH } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { useMountedRef } from "../../../hooks/useMountedRef";
import { returnThemeColors } from "../../../utils";
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
    handleRemoveImageClick,
    handleResetImageClick,
} from "./handlers";
import { accessibleImageInputReducer } from "./reducers";
import { initialAccessibleImageInputState } from "./state";
import type { AccessibleImageInputProps } from "./types";
import {
    checkImageFileBlobs,
    createImageInputForageKeys,
    retrieveStoredImagesValues,
} from "./utils";

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
        isLoading,
        orientations,
        qualities,
    } = accessibleImageInputState;

    const {
        globalState: { themeObject },
    } = useGlobalState();

    const { showBoundary } = useErrorBoundary();

    const {
        redColorShade,
        textColor,
        greenColorShade,
    } = returnThemeColors({ themeObject, colorsSwatches: COLORS_SWATCHES });

    const isComponentMountedRef = useMountedRef();

    const {
        fileNamesForageKey,
        modifiedFilesForageKey,
        orientationsForageKey,
        originalFilesForageKey,
        qualitiesForageKey,
    } = createImageInputForageKeys(
        storageKey,
    );

    useEffect(() => {
        retrieveStoredImagesValues({
            accessibleImageInputDispatch,
            fileNamesForageKey,
            isComponentMountedRef,
            maxImagesAmount,
            modifiedFilesForageKey,
            orientationsForageKey,
            qualitiesForageKey,
            showBoundary,
        });
    }, []);

    // useEffect(() => {
    //     modifyImage({
    //         accessibleImageInputDispatch,
    //         currentImageIndex,
    //         fileNames,
    //         imageFileBlobs,
    //         invalidValueAction,
    //         isComponentMountedRef,
    //         maxImageSize,
    //         maxImagesAmount,
    //         modifiedFilesForageKey,
    //         orientations,
    //         originalFilesForageKey,
    //         parentDispatch,
    //         qualities,
    //         showBoundary,
    //         validValueAction,
    //     });
    // }, [currentImageIndex, qualities, orientations]);

    useEffect(() => {
        checkImageFileBlobs({
            fileNames,
            imageFileBlobs,
            invalidValueAction,
            maxImageSize,
            modifiedFilesForageKey,
            parentDispatch,
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
                name: "images",
                parentDispatch: accessibleImageInputDispatch,
                storageKey,
                validValueAction: accessibleImageInputAction.addImageFileBlob,
            }}
        />
    );

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
                    <Text color={greenColorShade} aria-live="polite">
                        Image is valid
                    </Text>
                </GoldenGrid>
            );

            const isImageSizeInvalidText = isImageSizeInvalid
                ? `Image is too large. Must be less than ${
                    maxImageSize / 1000
                } KB.`
                : "";
            const isImageTypeInvalidText = isImageTypeInvalid
                ? "Image contains disallowed file type. Must only contain .jpg, .jpeg, .png, or .webp file types."
                : "";

            const invalidImageDescription =
                `Image is invalid. ${isImageSizeInvalidText} ${isImageTypeInvalidText}`;

            const invalidScreenreaderTextElement = (
                <GoldenGrid>
                    <Group>
                        <TbExclamationCircle color={redColorShade} size={22} />
                        <Text color={redColorShade} aria-live="polite">
                            Oops!
                        </Text>
                    </Group>
                    <Text color={redColorShade} aria-live="polite">
                        {invalidImageDescription}
                    </Text>
                </GoldenGrid>
            );

            const img = (
                <Image
                    alt={isImageInvalid
                        ? "Invalid image"
                        : fileNames[index] ?? "Image"}
                    key={index.toString()}
                    maw={300}
                    src={URL.createObjectURL(fileBlob ?? new Blob([]))}
                    withPlaceholder
                />
            );

            const imageName = (
                <GoldenGrid>
                    <Text color={textColor}>Name:</Text>
                    <Text color={textColor}>{fileNames[index] ?? "Image"}</Text>
                </GoldenGrid>
            );

            const imageSizeColor = isImageSizeInvalid
                ? redColorShade
                : textColor;
            const imageSize = (
                <GoldenGrid>
                    <Text color={imageSizeColor}>Size:</Text>
                    <Text color={imageSizeColor}>
                        {Math.round(size / 1000)} KB
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
                            isComponentMountedRef,
                            storageKey,
                        });
                    },
                },
                {
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
                        isComponentMountedRef.current = true;
                        await handleResetImageClick({
                            accessibleImageInputDispatch,
                            index,
                            isComponentMountedRef,
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
                            await handleImageQualityOrientationSliderChange({
                                accessibleImageInputDispatch,
                                currentImageIndex: index,
                                fileNames,
                                imageFileBlobs,
                                invalidValueAction,
                                isComponentMountedRef,
                                maxImageSize,
                                maxImagesAmount,
                                orientations,
                                parentDispatch,
                                qualities,
                                qualityValue: value,
                                showBoundary,
                                storageKey,
                                validValueAction,
                            });
                        },
                        // parentDynamicDispatch: accessibleImageInputDispatch,
                        step: 1,
                        validValueAction: accessibleImageInputAction.setQuality,
                        value: qualities[index],
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
                            await handleImageQualityOrientationSliderChange({
                                accessibleImageInputDispatch,
                                currentImageIndex: index,
                                fileNames,
                                imageFileBlobs,
                                invalidValueAction,
                                isComponentMountedRef,
                                maxImageSize,
                                maxImagesAmount,
                                orientations,
                                orientationValue: value,
                                parentDispatch,
                                qualities,
                                showBoundary,
                                storageKey,
                                validValueAction,
                            });
                        },
                        // parentDynamicDispatch: accessibleImageInputDispatch,
                        step: 1,
                        validValueAction:
                            accessibleImageInputAction.setOrientation,
                        value: orientations[index],
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
                    w={325}
                    withBorder
                    radius="md"
                    shadow="sm"
                    key={`${index}-${fileNames[index]}`}
                >
                    <Stack spacing="lg">
                        {img}
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
                        <Group w="100%" position="apart">
                            {removeButtonWithTooltip}
                            {resetButtonWithTooltip}
                        </Group>
                        <Stack spacing="xl">
                            {imageQualityStack}
                            {imageOrientationStack}
                        </Stack>
                    </Stack>
                </Card>
            );
        },
    );

    const loadingOverlay = <LoadingOverlay visible={isLoading} />;

    console.log("AccessibleImageInputState", accessibleImageInputState);

    return (
        <Stack style={{ minWidth: INPUT_WIDTH, maxWidth: "400px" }}>
            {loadingOverlay}
            {fileInput}
            {fileBlobCards}
        </Stack>
    );
}

export { AccessibleImageInput };
