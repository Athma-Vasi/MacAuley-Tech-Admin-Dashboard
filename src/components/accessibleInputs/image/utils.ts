import { ModifiedFile } from "../AccessibleFileInput";

function validateImages({
    allowedFileExtensionsRegex,
    imageFileBlobs,
    maxImageSize,
    maxImagesAmount,
}: {
    allowedFileExtensionsRegex: RegExp;
    imageFileBlobs: Array<ModifiedFile>;
    maxImageSize: number;
    maxImagesAmount: number;
}) {
    const areImagesInvalid = imageFileBlobs.length > maxImagesAmount ||
        imageFileBlobs.reduce((invalidAcc, fileBlob) => {
            if (fileBlob === null) {
                return true;
            }

            const { size, type } = fileBlob;
            if (size > maxImageSize) {
                return true;
            }

            if (!type.length) {
                return true;
            }

            const extension = type.split("/")[1];
            if (!allowedFileExtensionsRegex.test(extension)) {
                return true;
            }

            return invalidAcc;
        }, false);

    return { areImagesInvalid };
}

export { validateImages };
