import { Dispatch } from "react";
import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import { AccessibleImageInputAction } from "./actions";

type AccessibleImageInputAttributes<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
> = {
    disabled?: boolean;
    disabledScreenreaderText?: string;
    invalidValueAction: InvalidValueAction;
    maxImageSize?: number;
    maxImagesAmount?: number;
    parentDispatch?: Dispatch<
        | {
            action: ValidValueAction;
            payload: FormData;
        }
        | {
            action: InvalidValueAction;
            payload: SetFilesInErrorPayload;
        }
    >;
    /** unique id for local forage */
    storageKey: string;
    validValueAction: ValidValueAction;
};

type AccessibleImageInputProps<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
> = {
    attributes: AccessibleImageInputAttributes<
        ValidValueAction,
        InvalidValueAction
    >;
};

type AccessibleImageInputState = {
    currentImageIndex: number;
    /** because blobs do not have name property */
    fileNames: string[];
    imageFileBlobs: Array<ModifiedFile>;
    imageWorker: Worker | null;
    isErrors: boolean[];
    isLoading: boolean;
    isModalOpen: boolean;
    qualities: number[];
    orientations: number[];
};

type SetFilesInErrorPayload = {
    kind: "isError" | "notError" | "remove";
    name: string;
};

type AccessibleImageInputDispatch =
    | {
        action: AccessibleImageInputAction["setIsErrors"];
        payload: {
            index: number;
            value: boolean;
        };
    }
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
    }
    | {
        action: AccessibleImageInputAction["setImageWorker"];
        payload: Worker;
    };

export type {
    AccessibleImageInputAttributes,
    AccessibleImageInputDispatch,
    AccessibleImageInputProps,
    AccessibleImageInputState,
    SetFilesInErrorPayload,
};
