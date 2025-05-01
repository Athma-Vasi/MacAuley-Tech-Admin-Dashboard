import type { Dispatch } from "react";

import type { SetPageInErrorPayload } from "../../../types";
import type { ProductCategory } from "../../dashboard/types";
import type { AdditionalFieldsFormDataPayload } from "../../product/dispatch";
import type { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import type { AccessibleImageInputAction } from "./actions";

type AccessibleImageInputAttributes<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
> = {
    disabled?: boolean;
    invalidValueAction: InvalidValueAction;
    maxImageSize?: number;
    maxImagesAmount?: number;
    page: number;
    parentDispatch?: Dispatch<
        | {
            action: ValidValueAction;
            payload: FormData;
        }
        | {
            action: InvalidValueAction;
            payload: SetPageInErrorPayload;
        }
    >;
    productCategory?: ProductCategory;
    productCategoryDispatch?: Dispatch<
        | {
            action: ValidValueAction;
            payload: AdditionalFieldsFormDataPayload;
        }
        | {
            action: InvalidValueAction;
            payload: SetPageInErrorPayload;
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
        payload: string;
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
        action: AccessibleImageInputAction["setImageFileBlobs"];
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
        action: AccessibleImageInputAction["setQualities"];
        payload: {
            index: number;
            value: number;
        };
    }
    | {
        action: AccessibleImageInputAction["setOrientations"];
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
