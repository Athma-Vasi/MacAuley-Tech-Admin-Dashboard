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
        accessibleImageInputAction.setImageFileBlob,
        accessibleImageInputReducer_setImageFileBlob,
    ],
    [
        accessibleImageInputAction.setIsLoading,
        accessibleImageInputReducer_setIsLoading,
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
    const {
        value: fileName,
        index,
    } = dispatch.payload as {
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

    const imageFileBlobs = structuredClone(state.imageFileBlobs).filter(
        (_: ModifiedFile, i: number) => i !== index,
    );

    const fileNames = structuredClone(state.fileNames).filter(
        (_: string, i: number) => i !== index,
    );

    const qualities = structuredClone(state.qualities).filter(
        (_: number, i: number) => i !== index,
    );

    const orientations = structuredClone(state.orientations).filter(
        (_: number, i: number) => i !== index,
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

function accessibleImageInputReducer_setImageFileBlob(
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

function accessibleImageInputReducer_setQuality(
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

function accessibleImageInputReducer_setOrientation(
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
