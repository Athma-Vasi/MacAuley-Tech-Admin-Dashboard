import { Dispatch } from "react";
import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import { AccessibleImageInputAction } from "./actions";

type AccessibleImageInputAttributes<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
> = {
    disabled?: boolean;
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
            payload: boolean;
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
    /** blobs do not have name property */
    fileNames: string[];
    imageFileBlobs: Array<ModifiedFile>;
    isLoading: boolean;
    qualities: number[];
    orientations: number[];
};

type AccessibleImageInputDispatch =
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

export type {
    AccessibleImageInputAttributes,
    AccessibleImageInputDispatch,
    AccessibleImageInputProps,
    AccessibleImageInputState,
};
