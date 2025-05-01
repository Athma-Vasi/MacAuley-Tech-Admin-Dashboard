import {
    Card,
    Group,
    Image,
    LoadingOverlay,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { compress, EImageType } from "image-conversion";
import localforage from "localforage";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { TbCheck, TbExclamationCircle } from "react-icons/tb";
import { COLORS_SWATCHES, INPUT_WIDTH } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../utils";
import { GoldenGrid } from "../../goldenGrid";
import {
    AccessibleFileInput,
    ModifiedFile,
    OriginalFile,
} from "../AccessibleFileInput";
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
import { accessibleImageInputReducer } from "./reducers";
import { initialAccessibleImageInputState } from "./state";
import type { AccessibleImageInputProps } from "./types";
import { retrieveStoredValues, validateImages } from "./utils";

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

    const isComponentMountedRef = useRef(false);

    const isMountedRetrieveStoredValuesRef = useRef(false);
    useEffect(() => {
        isMountedRetrieveStoredValuesRef.current = true;
        const isMounted = isMountedRetrieveStoredValuesRef.current;

        retrieveStoredValues();

        return () => {
            isMountedRetrieveStoredValuesRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isMountedModifyImagesRef = useRef(false);
    useEffect(() => {
        isMountedModifyImagesRef.current = true;
        const isMounted = isMountedModifyImagesRef.current;

        async function modifyImage(): Promise<void> {
            try {
                const originalFiles = await localforage.getItem<
                    Array<OriginalFile>
                >(
                    `${storageKey}-originalFiles`,
                );

                if (!originalFiles) {
                    return;
                }

                const imageToModify = structuredClone(
                    originalFiles[currentImageIndex],
                );

                if (!imageToModify) {
                    return;
                }

                const quality = qualities[currentImageIndex] / 10;
                const orientation = orientations[currentImageIndex];
                const type = imageToModify?.type as EImageType;

                const fileBlob: Blob = await compress(imageToModify, {
                    quality,
                    orientation,
                    type,
                });

                if (!isMounted) {
                    return;
                }

                accessibleImageInputDispatch({
                    action: accessibleImageInputAction.setImageFileBlobs,
                    payload: {
                        fileBlob,
                        index: currentImageIndex,
                    },
                });

                const updatedModifiedFiles = originalFiles.map(
                    (originalFile, index) => {
                        if (index === currentImageIndex) {
                            return fileBlob;
                        }
                        return originalFile;
                    },
                );

                await localforage.setItem<Array<ModifiedFile>>(
                    `${storageKey}-modifiedFiles`,
                    updatedModifiedFiles,
                );

                const { areImagesInvalid } = validateImages({
                    allowedFileExtensionsRegex: ALLOWED_FILE_EXTENSIONS_REGEX,
                    imageFileBlobs,
                    maxImagesAmount,
                    maxImageSize,
                });

                parentDispatch?.({
                    action: invalidValueAction,
                    payload: areImagesInvalid,
                });

                const formData = imageFileBlobs.reduce<FormData>(
                    (formDataAcc, imageFileBlob, index) => {
                        if (imageFileBlob) {
                            formDataAcc.append(
                                `${storageKey}-modifiedFiles`,
                                imageFileBlob,
                                fileNames[index],
                            );
                        }

                        return formDataAcc;
                    },
                    new FormData(),
                );

                parentDispatch?.({
                    action: validValueAction,
                    payload: formData,
                });
            } catch (error: any) {
                if (!isMounted) {
                    return;
                }

                showBoundary(error);
            }
        }

        modifyImage();

        return () => {
            isMountedModifyImagesRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentImageIndex, qualities, orientations]);

    useEffect(() => {
        if (imageFileBlobs.length === 0) {
            return;
        }

        imageFileBlobs.forEach((imageFileBlob) => {
            if (imageFileBlob !== null) {
                const { size, type } = imageFileBlob;

                const isImageSizeInvalid = size > maxImageSize;
                const isImageTypeInvalid = !ALLOWED_FILE_EXTENSIONS_REGEX.test(
                    type.split("/")[1],
                );
                const isImageInvalid = isImageSizeInvalid || isImageTypeInvalid;

                parentDispatch?.({
                    action: invalidValueAction,
                    payload: isImageInvalid,
                });
            }
        });

        const value = imageFileBlobs.reduce<FormData>(
            (formDataAcc, imageFileBlob, index) => {
                if (imageFileBlob) {
                    formDataAcc.append(
                        `${storageKey}-modifiedFiles`,
                        imageFileBlob,
                        fileNames[index],
                    );
                }

                return formDataAcc;
            },
            new FormData(),
        );

        parentDispatch?.({
            action: validValueAction,
            payload: value,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        const modifiedFiles = await localforage.getItem<
                            Array<ModifiedFile>
                        >(
                            storageKey,
                        );
                        modifiedFiles?.splice(index, 1);
                        await localforage.setItem(
                            `${storageKey}-modifiedFiles`,
                            modifiedFiles,
                        );

                        const originalFiles = await localforage.getItem<
                            Array<OriginalFile>
                        >(
                            `${storageKey}-originalFiles`,
                        );
                        originalFiles?.splice(index, 1);
                        await localforage.setItem(
                            `${storageKey}-originalFiles`,
                            originalFiles,
                        );

                        accessibleImageInputDispatch({
                            action:
                                accessibleImageInputAction.removeImageFileBlob,
                            payload: index,
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
                        const originalFiles = await localforage.getItem<
                            Array<OriginalFile>
                        >(
                            `${storageKey}-originalFiles`,
                        );

                        if (!originalFiles) {
                            return;
                        }

                        const originalFile = originalFiles[index];
                        accessibleImageInputDispatch({
                            action:
                                accessibleImageInputAction.resetImageFileBlob,
                            payload: {
                                index,
                                value: originalFile,
                            },
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
                        index,
                        marks: IMG_QUALITY_SLIDER_DATA,
                        max: 10,
                        min: 1,
                        name: "quality",
                        onChange: async (value: number) => {
                            const storedQualities =
                                (await localforage.getItem<Array<number>>(
                                    `${storageKey}-qualities`,
                                )) ??
                                    Array.from(
                                        { length: maxImagesAmount },
                                        () => 10,
                                    );
                            storedQualities[index] = value;
                            await localforage.setItem(
                                `${storageKey}-qualities`,
                                storedQualities,
                            );
                        },
                        parentDynamicDispatch: accessibleImageInputDispatch,
                        step: 1,
                        validValueAction:
                            accessibleImageInputAction.setQualities,
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
                            const storedOrientations =
                                (await localforage.getItem<Array<number>>(
                                    `${storageKey}-orientations`,
                                )) ??
                                    Array.from(
                                        { length: maxImagesAmount },
                                        () => 1,
                                    );
                            storedOrientations[index] = value;
                            await localforage.setItem(
                                `${storageKey}-orientations`,
                                storedOrientations,
                            );
                        },
                        parentDynamicDispatch: accessibleImageInputDispatch,
                        step: 1,
                        validValueAction:
                            accessibleImageInputAction.setOrientations,
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
                    <Stack spacing="xl">
                        {img}
                        {isImageInvalid
                            ? invalidScreenreaderTextElement
                            : validScreenreaderTextElement}
                        <Stack>
                            {imageName}
                            {imageSize}
                            {imageType}
                        </Stack>
                        <GoldenGrid>
                            {removeButtonWithTooltip}
                            {resetButtonWithTooltip}
                        </GoldenGrid>
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
