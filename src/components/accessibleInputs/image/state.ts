import { MAX_IMAGES } from "./constants";
import { AccessibleImageInputState } from "./types";

const initialAccessibleImageInputState: AccessibleImageInputState = {
    currentImageIndex: 0,
    fileNames: [],
    imageFileBlobs: [],
    isLoading: false,
    isModalOpen: false,
    orientations: Array.from({ length: MAX_IMAGES }, () => 1),
    qualities: Array.from({ length: MAX_IMAGES }, () => 10),
};

export { initialAccessibleImageInputState };
