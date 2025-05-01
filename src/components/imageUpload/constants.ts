const MAX_IMAGE_SIZE = 3_000_000; // 3 MB
const MAX_IMAGES = 5;

const IMG_QUALITY_SLIDER_DATA = [
    { value: 2, label: "20%" },
    { value: 4, label: "40%" },
    { value: 6, label: "60%" },
    { value: 8, label: "80%" },
    { value: 10, label: "100%" },
];

const IMG_ORIENTATION_SLIDER_DATA = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
];

function displayOrientationLabel(value: number): string {
    switch (value) {
        case 1:
            return "0°";
        case 2:
            return "horizontal flip";
        case 3:
            return "180°";
        case 4:
            return "vertical flip";
        case 5:
            return "clockwise 90° + horizontal flip";
        case 6:
            return "clockwise 90°";
        case 7:
            return "clockwise 90° + vertical flip";
        case 8:
            return "counterclockwise 90°";
        default:
            return "0°";
    }
}

/** /(jpg|jpeg|png|webp)$/i */
const ALLOWED_FILE_EXTENSIONS_REGEX = /(jpg|jpeg|png|webp)$/i;

export {
    ALLOWED_FILE_EXTENSIONS_REGEX,
    displayOrientationLabel,
    IMG_ORIENTATION_SLIDER_DATA,
    IMG_QUALITY_SLIDER_DATA,
    MAX_IMAGE_SIZE,
    MAX_IMAGES,
};
