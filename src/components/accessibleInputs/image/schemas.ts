import { z } from "zod";
import { accessibleImageInputAction } from "./actions";

const setIsModalOpenImageDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.setIsModalOpen),
    payload: z.boolean(),
});

const addImageFileBlobDispatchZod = z.object({
    action: z.literal(accessibleImageInputAction.addImageFileBlob),
    payload: z.object({
        name: z.string(),
        size: z.number(),
        type: z.union([z.instanceof(Blob), z.instanceof(File)]),
        lastModified: z.number(),
        lastModifiedDate: z.date(),
    }),
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
    payload: z.number(),
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

export {
    addImageFileBlobDispatchZod,
    addImageFileNameDispatchZod,
    removeImageFileBlobDispatchZod,
    resetImageFileBlobDispatchZod,
    setCurrentImageIndexDispatchZod,
    setImageFileBlobDispatchZod,
    setIsLoadingImageDispatchZod,
    setIsModalOpenImageDispatchZod,
    setOrientationImageDispatchZod,
    setQualityImageDispatchZod,
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
