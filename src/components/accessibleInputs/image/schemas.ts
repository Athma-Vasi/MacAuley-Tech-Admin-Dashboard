import { z } from "zod";
import { accessibleImageInputAction } from "./actions";

const setIsModalOpenImageDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.setIsModalOpen),
    payload: z.boolean(),
});

const addImageFileBlobDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.addImageFileBlob),
    payload: z.union([z.instanceof(Blob), z.instanceof(File)]).optional(),
});

const removeImageFileBlobDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.removeImageFileBlob),
    payload: z.number(),
});

const addImageFileNameDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.addFileName),
    payload: z.object({
        index: z.number(),
        value: z.string(),
    }),
});

const setCurrentImageIndexDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.setCurrentImageIndex),
    payload: z.number().min(0),
});

const resetImageFileBlobDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.resetImageFileBlob),
    payload: z.object({
        index: z.number(),
        value: z.union([z.instanceof(Blob), z.instanceof(File)]),
    }),
});

const setImageFileBlobDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.setImageFileBlob),
    payload: z.object({
        index: z.number(),
        fileBlob: z.union([z.instanceof(Blob), z.instanceof(File)]),
    }),
});

const setIsLoadingImageDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.setIsLoading),
    payload: z.boolean(),
});

const setQualityImageDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.setQuality),
    payload: z.object({
        index: z.number(),
        value: z.number(),
    }),
});

const setOrientationImageDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.setOrientation),
    payload: z.object({
        index: z.number(),
        value: z.number(),
    }),
});

const setIsErrorsImageDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.setIsErrors),
    payload: z.object({
        index: z.number(),
        value: z.boolean(),
    }),
});

const setRetrieveImagesWorkerDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.setRetrieveImagesWorker),
    payload: z.instanceof(Worker),
});

const setModifyImagesWorkerDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.setModifyImagesWorker),
    payload: z.instanceof(Worker),
});

const handleResetImageClickInputZod = z.object({
    accessibleImageInputDispatch: z.function().args(z.any()).returns(z.void()),
    index: z.number().min(0),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storageKey: z.string(),
});

const handleRemoveImageClickInputZod = z.object({
    accessibleImageInputDispatch: z.function().args(z.any()).returns(z.void()),
    index: z.number().min(0),
    invalidValueAction: z.literal("setFilesInError"),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    parentDispatch: z.function().args(z.any()).returns(z.void()),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storageKey: z.string(),
    validValueAction: z.literal("setFormData"),
});

const handleMessageEventModifyImagesWorkerToMainInputZod = z.object({
    accessibleImageInputDispatch: z.function().args(z.any()).returns(z.void()),
    event: z.instanceof(MessageEvent),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    invalidValueAction: z.literal("setFilesInError"),
    parentDispatch: z.function().args(z.any()).returns(z.void()).optional(),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storageKey: z.string(),
    validValueAction: z.literal("setFormData"),
});

const handleImageQualityOrientationSliderChangeInputZod = z.object({
    accessibleImageInputDispatch: z.function().args(z.any()).returns(z.void()),
    currentImageIndex: z.number(),
    fileNames: z.array(z.string()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    invalidValueAction: z.literal("setFilesInError"),
    maxImageSize: z.number(),
    orientations: z.array(z.number()),
    orientationValue: z.number().optional(),
    parentDispatch: z.function().args(z.any()).returns(z.void()).optional(),
    qualities: z.array(z.number()),
    qualityValue: z.number().optional(),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storageKey: z.string(),
    validValueAction: z.literal("setFormData"),
});

const handleMessageEventRetrieveImagesWorkerToMainInputZod = z.object({
    event: z.instanceof(MessageEvent),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    accessibleImageInputDispatch: z.function().args(z.any()).returns(z.void()),
});

const messageEventRetrieveImagesMainToWorkerInputZod = z.object({
    storageKey: z.string(),
});

const messageEventModifyImagesMainToWorkerInputZod = z.object({
    currentImageIndex: z.number(),
    maxImagesAmount: z.number(),
    maxImageSize: z.number(),
    orientation: z.number(),
    orientations: z.array(z.number()),
    qualities: z.array(z.number()),
    quality: z.number(),
    storageKey: z.string(),
});

export {
    addImageFileBlobDispatchZod,
    addImageFileNameDispatchZod,
    handleImageQualityOrientationSliderChangeInputZod,
    handleMessageEventModifyImagesWorkerToMainInputZod,
    handleMessageEventRetrieveImagesWorkerToMainInputZod,
    handleRemoveImageClickInputZod,
    handleResetImageClickInputZod,
    messageEventModifyImagesMainToWorkerInputZod,
    messageEventRetrieveImagesMainToWorkerInputZod,
    removeImageFileBlobDispatchZod,
    resetImageFileBlobDispatchZod,
    setCurrentImageIndexDispatchZod,
    setImageFileBlobDispatchZod,
    setIsErrorsImageDispatchZod,
    setIsLoadingImageDispatchZod,
    setIsModalOpenImageDispatchZod,
    setModifyImagesWorkerDispatchZod,
    setOrientationImageDispatchZod,
    setQualityImageDispatchZod,
    setRetrieveImagesWorkerDispatchZod,
};

/**
 * type AccessibleImageInputState = {
    currentImageIndex: number;

    fileNames: string[];
    imageFileBlobs: Array<ModifiedFile>;
    isLoading: boolean;
    isModalOpen: boolean;
    qualities: number[];
    orientations: number[];
};

type AccessibleImageInputDispatch =
    | {
        action: AccessibleImageInputAction["setIsModalOpen"];
        payload: boolean;
    }
    | {
        action: AccessibleImageInputAction["addImageFileBlob"];
        payload: ModifiedFile;
    }
    | {
        action: AccessibleImageInputAction["removeImageFileBlob"];
        payload: number;
    }
    | {
        action: AccessibleImageInputAction["addFileName"];
        payload: {
            index: number;
            value: string;
        };
    }
    | {
        action: AccessibleImageInputAction["setCurrentImageIndex"];
        payload: number;
    }
    | {
        action: AccessibleImageInputAction["resetImageFileBlob"];
        payload: {
            index: number;
            value: OriginalFile;
        };
    }
    | {
        action: AccessibleImageInputAction["setImageFileBlob"];
        payload: {
            index: number;
            fileBlob: ModifiedFile;
        };
    }
    | {
        action: AccessibleImageInputAction["setIsLoading"];
        payload: boolean;
    }
    | {
        action: AccessibleImageInputAction["setQuality"];
        payload: {
            index: number;
            value: number;
        };
    }
    | {
        action: AccessibleImageInputAction["setOrientation"];
        payload: {
            index: number;
            value: number;
        };
    };
 */
