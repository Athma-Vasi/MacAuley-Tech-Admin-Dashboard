import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import { DynamicSliderInputPayload } from "../AccessibleSliderInput";
import {
    AccessibleImageInputAction,
    accessibleImageInputAction,
} from "./actions";
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
        accessibleImageInputAction.setImageFileBlobs,
        accessibleImageInputReducer_setImageFileBlobs,
    ],
    [
        accessibleImageInputAction.setIsLoading,
        accessibleImageInputReducer_setIsLoading,
    ],
    [
        accessibleImageInputAction.setQualities,
        accessibleImageInputReducer_setQualities,
    ],
    [
        accessibleImageInputAction.setOrientations,
        accessibleImageInputReducer_setOrientations,
    ],
]);

function accessibleImageInputReducer_addImageFileBlob(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const fileBlob = dispatch.payload as ModifiedFile;
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
    const fileName = dispatch.payload as string;

    return {
        ...state,
        fileNames: [...state.fileNames, fileName],
    };
}

function accessibleImageInputReducer_setCurrentImageIndex(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    return {
        ...state,
        currentImageIndex: dispatch.payload as number,
    };
}

function accessibleImageInputReducer_removeImageFileBlob(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const index = dispatch.payload as number;
    const imageFileBlobs = structuredClone(state.imageFileBlobs);
    imageFileBlobs.splice(index, 1);

    const fileNames = state.fileNames.slice();
    fileNames.splice(index, 1);

    const qualities = state.qualities.slice();
    qualities.splice(index, 1);

    const orientations = state.orientations.slice();
    orientations.splice(index, 1);

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
    const { index, value } = dispatch.payload as {
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

function accessibleImageInputReducer_setImageFileBlobs(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const { fileBlob, index } = dispatch.payload as {
        index: number;
        fileBlob: ModifiedFile;
    };

    const imageFileBlobs = structuredClone(state.imageFileBlobs);
    imageFileBlobs[index] = fileBlob;

    return {
        ...state,
        imageFileBlobs,
    };
}

function accessibleImageInputReducer_setIsLoading(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    return {
        ...state,
        isLoading: dispatch.payload as boolean,
    };
}

function accessibleImageInputReducer_setQualities(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const { index, value } = dispatch.payload as DynamicSliderInputPayload;
    const qualities = structuredClone(state.qualities);
    qualities[index] = value;

    return {
        ...state,
        qualities,
        currentImageIndex: index,
    };
}

function accessibleImageInputReducer_setOrientations(
    state: AccessibleImageInputState,
    dispatch: AccessibleImageInputDispatch,
): AccessibleImageInputState {
    const { index, value } = dispatch.payload as DynamicSliderInputPayload;
    const orientations = state.orientations.slice();
    orientations[index] = value;

    return {
        ...state,
        orientations,
        currentImageIndex: index,
    };
}

export { accessibleImageInputReducer };
