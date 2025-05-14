import { parseSafeSync } from "../../../utils";
import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import { DynamicSliderInputPayload } from "../AccessibleSliderInput";
import {
    AccessibleImageInputAction,
    accessibleImageInputAction,
} from "./actions";
import {
    addImageFileBlobDispatchZod,
    addImageFileNameDispatchZod,
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
} from "./schemas";
import {
    AccessibleImageInputDispatch,
    AccessibleImageInputState,
} from "./types";

function accessibleImageInputReducer(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const reducer = accessibleImageInputReducersMap.get(dispatch.action);
    return reducer ? reducer(state, dispatch) : state;
}

const accessibleImageInputReducersMap = new Map<
    AccessibleImageInputAction[keyof AccessibleImageInputAction],
    (
        state: AccessibleImageInputState,
        dispatch: AccessibleImageInputDispatch,
    ) => AccessibleImageInputState
>([
    [
        accessibleImageInputAction.addImageFileBlob,
        accessibleImageInputReducer_addImageFileBlob,
    ],
    [
        accessibleImageInputAction.addFileName,
        accessibleImageInputReducer_addFileName,
    ],
    [
        accessibleImageInputAction.setCurrentImageIndex,
        accessibleImageInputReducer_setCurrentImageIndex,
    ],
    [
        accessibleImageInputAction.resetImageFileBlob,
        accessibleImageInputReducer_resetImageFileBlob,
    ],
    [
        accessibleImageInputAction.removeImageFileBlob,
        accessibleImageInputReducer_removeImageFileBlob,
    ],
    [
        accessibleImageInputAction.setImageFileBlob,
        accessibleImageInputReducer_setImageFileBlob,
    ],
    [
        accessibleImageInputAction.setModifyImagesWorker,
        accessibleImageInputReducer_setModifyImagesWorker,
    ],
    [
        accessibleImageInputAction.setRetrieveImagesWorker,
        accessibleImageInputReducer_setRetrieveImagesWorker,
    ],
    [
        accessibleImageInputAction.setIsErrors,
        accessibleImageInputReducer_setIsErrors,
    ],
    [
        accessibleImageInputAction.setIsLoading,
        accessibleImageInputReducer_setIsLoading,
    ],
    [
        accessibleImageInputAction.setIsModalOpen,
        accessibleImageInputReducer_setIsModalOpen,
    ],
    [
        accessibleImageInputAction.setQuality,
        accessibleImageInputReducer_setQuality,
    ],
    [
        accessibleImageInputAction.setOrientation,
        accessibleImageInputReducer_setOrientation,
    ],
]);

function accessibleImageInputReducer_addImageFileBlob(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: addImageFileBlobDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const fileBlob = parsedResult.safeUnwrap().data?.payload as ModifiedFile;
    const imageFileBlobs = structuredClone(state.imageFileBlobs);
    imageFileBlobs.push(fileBlob);

    return {
        ...state,
        imageFileBlobs,
    };
}

function accessibleImageInputReducer_addFileName(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: addImageFileNameDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const {
        value: fileName,
        index,
    } = parsedResult.safeUnwrap().data?.payload as {
        value: string;
        index: number;
    };

    const fileNames = structuredClone(state.fileNames);
    if (index < 0) {
        fileNames.push(fileName);
    } else {
        fileNames[index] = fileName;
    }

    return {
        ...state,
        fileNames: [...state.fileNames, fileName],
    };
}

function accessibleImageInputReducer_setCurrentImageIndex(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setCurrentImageIndexDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        currentImageIndex: parsedResult.safeUnwrap().data?.payload as number,
    };
}

function accessibleImageInputReducer_removeImageFileBlob(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: removeImageFileBlobDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const index = parsedResult.safeUnwrap().data?.payload as number;

    const imageFileBlobs = structuredClone(state.imageFileBlobs).filter(
        (_: ModifiedFile, i: number) => i !== index,
    );
    const fileNames = structuredClone(state.fileNames).filter(
        (_: string, i: number) => i !== index,
    );
    const qualities = structuredClone(state.qualities).map(
        (quality: number, i: number) => i === index ? 10 : quality,
    );
    const orientations = structuredClone(state.orientations).map(
        (orientation: number, i: number) => i === index ? 1 : orientation,
    );

    return {
        ...state,
        fileNames,
        imageFileBlobs,
        qualities,
        orientations,
    };
}

function accessibleImageInputReducer_resetImageFileBlob(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: resetImageFileBlobDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const { index, value } = parsedResult.safeUnwrap().data?.payload as {
        index: number;
        value: OriginalFile;
    };
    const imageFileBlobs = structuredClone(state.imageFileBlobs);
    imageFileBlobs[index] = value;

    const qualities = state.qualities.slice();
    qualities[index] = 10;
    const orientations = state.orientations.slice();
    orientations[index] = 1;

    return {
        ...state,
        imageFileBlobs,
        qualities,
        orientations,
    };
}

function accessibleImageInputReducer_setImageFileBlob(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    // const { fileBlob, index } = dispatch.payload as {
    //     index: number;
    //     fileBlob: ModifiedFile;
    // };

    // const imageFileBlobs = structuredClone(state.imageFileBlobs);
    // imageFileBlobs[index] = fileBlob;

    // return {
    //     ...state,
    //     imageFileBlobs,
    // };
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setImageFileBlobDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const { index, fileBlob } = parsedResult.safeUnwrap().data
        ?.payload as {
            index: number;
            fileBlob: ModifiedFile;
        };
    const imageFileBlobs = structuredClone(state.imageFileBlobs);
    imageFileBlobs[index] = fileBlob;

    return {
        ...state,
        imageFileBlobs,
        currentImageIndex: index,
    };
}

function accessibleImageInputReducer_setModifyImagesWorker(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setModifyImagesWorkerDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        modifyImagesWorker: parsedResult.safeUnwrap().data?.payload as Worker,
    };
}

function accessibleImageInputReducer_setRetrieveImagesWorker(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setRetrieveImagesWorkerDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        retrieveImagesWorker: parsedResult.safeUnwrap().data?.payload as Worker,
    };
}

function accessibleImageInputReducer_setIsErrors(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setIsErrorsImageDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const { index, value } = parsedResult.safeUnwrap().data?.payload as {
        index: number;
        value: boolean;
    };
    const isErrors = structuredClone(state.isErrors);
    isErrors[index] = value;

    return {
        ...state,
        isErrors,
    };
}

function accessibleImageInputReducer_setIsLoading(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setIsLoadingImageDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        isLoading: parsedResult.safeUnwrap().data?.payload as boolean,
    };
}

function accessibleImageInputReducer_setIsModalOpen(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setIsModalOpenImageDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        isModalOpen: parsedResult.safeUnwrap().data?.payload as boolean,
    };
}

function accessibleImageInputReducer_setQuality(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setQualityImageDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const { index, value } = parsedResult.safeUnwrap().data
        ?.payload as DynamicSliderInputPayload;
    const qualities = structuredClone(state.qualities);
    qualities[index] = value;

    return {
        ...state,
        qualities,
        currentImageIndex: index,
    };
}

function accessibleImageInputReducer_setOrientation(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setOrientationImageDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const { index, value } = parsedResult.safeUnwrap().data
        ?.payload as DynamicSliderInputPayload;
    const orientations = state.orientations.slice();
    orientations[index] = value;

    return {
        ...state,
        orientations,
        currentImageIndex: index,
    };
}

export {
    accessibleImageInputReducer,
    accessibleImageInputReducer_addFileName,
    accessibleImageInputReducer_addImageFileBlob,
    accessibleImageInputReducer_removeImageFileBlob,
    accessibleImageInputReducer_resetImageFileBlob,
    accessibleImageInputReducer_setCurrentImageIndex,
    accessibleImageInputReducer_setImageFileBlob,
    accessibleImageInputReducer_setIsErrors,
    accessibleImageInputReducer_setIsLoading,
    accessibleImageInputReducer_setIsModalOpen,
    accessibleImageInputReducer_setModifyImagesWorker,
    accessibleImageInputReducer_setOrientation,
    accessibleImageInputReducer_setQuality,
    accessibleImageInputReducer_setRetrieveImagesWorker,
};
