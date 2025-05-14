import { describe, expect, it, vi } from "vitest";
import { SafeBoxResult } from "../../../types";
import { createSafeBoxResult } from "../../../utils";
import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import {
    handleImageQualityOrientationSliderChange,
    handleRemoveImageClick,
    handleResetImageClick,
} from "./handlers";
import { AccessibleImageInputDispatch, SetFilesInErrorPayload } from "./types";

const sampleBlobs = [
    new Blob(["sample"], { type: "image/png" }),
    new Blob(["sample"], { type: "image/jpeg" }),
    new Blob(["sample"], { type: "image/webp" }),
];

const sampleFiles = [
    new File([sampleBlobs[0]], "sample.png", {
        type: "image/png",
        lastModified: Date.now(),
    }),
    new File([sampleBlobs[1]], "sample.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
    }),
    new File([sampleBlobs[2]], "sample.webp", {
        type: "image/webp",
        lastModified: Date.now(),
    }),
];

async function handleResetImageClickTestMock(): Promise<SafeBoxResult> {
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const accessibleImageInputDispatch = vi.fn() as React.Dispatch<
        AccessibleImageInputDispatch
    >;
    const index = 0;
    const getForageItemSafe = vi.fn(async () => {
        return createSafeBoxResult<Array<OriginalFile>>({
            kind: "success",
            data: [
                new File([sampleBlobs[0]], "sample.png", {
                    type: "image/png",
                    lastModified: Date.now(),
                }),
            ],
            message: "png",
        });
    }) as any;

    try {
        const handleClickResult = await handleResetImageClick({
            accessibleImageInputDispatch,
            getForageItemSafe,
            index,
            isComponentMountedRef,
            storageKey: "",
        });
        if (handleClickResult.err) {
            return createSafeBoxResult({
                message: handleClickResult.val.message ??
                    "Unable to reset image",
            });
        }
        const safebox = handleClickResult.safeUnwrap();

        describe("handleResetImageClick", () => {
            it("should return a success result", () => {
                expect(safebox.kind).toBe("success");
                expect(safebox.data).toBe(true);
            });
        });

        return createSafeBoxResult({
            kind: "success",
            data: true,
        });
    } catch (error) {
        return createSafeBoxResult({
            message: "Error: Component is not mounted",
        });
    }
}

async function handleRemoveImageClickTestMock(): Promise<SafeBoxResult> {
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const accessibleImageInputDispatch = vi.fn() as React.Dispatch<
        AccessibleImageInputDispatch
    >;
    const index = 0;
    const getForageItemSafe = vi.fn(async () => {
        return createSafeBoxResult<Array<ModifiedFile>>({
            kind: "success",
            data: [
                new Blob(["sample"], { type: "image/png" }),
            ],
            message: "png",
        });
    }) as any;
    const setForageItemSafe = vi.fn(async () => {
        return createSafeBoxResult({
            kind: "success",
            data: true,
            message: "png",
        });
    }) as any;
    const parentDispatch = vi.fn() as React.Dispatch<
        {
            action: string;
            payload: FormData;
        } | { action: string; payload: SetFilesInErrorPayload }
    >;

    const storageKey = "testStorageKey";
    const validValueAction = "testValidValueAction";
    const invalidValueAction = "testInvalidValueAction";

    try {
        const handleClickResult = await handleRemoveImageClick({
            accessibleImageInputDispatch,
            getForageItemSafe,
            index,
            invalidValueAction,
            isComponentMountedRef,
            parentDispatch,
            setForageItemSafe,
            storageKey,
            validValueAction,
        });
        if (handleClickResult.err) {
            return createSafeBoxResult({
                message: handleClickResult.val.message ??
                    "Unable to remove image",
            });
        }
        const safebox = handleClickResult.safeUnwrap();

        describe("handleRemoveImageClick", () => {
            it("should return a success result", () => {
                expect(safebox.kind).toBe("success");
                expect(safebox.data).toBe(true);
            });
        });

        return createSafeBoxResult({
            kind: "success",
            data: true,
        });
    } catch (error) {
        return createSafeBoxResult({
            message: "Error: Component is not mounted",
        });
    }
}

async function handleImageQualityOrientationSliderChangeTestMock(): Promise<
    SafeBoxResult
> {
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const accessibleImageInputDispatch = vi.fn() as React.Dispatch<
        AccessibleImageInputDispatch
    >;
    const currentImageIndex = 0;
    const fileNames = ["sample.png"];
    const imageFileBlobs = [
        new Blob(["sample"], { type: "image/png" }),
        new Blob(["sample"], { type: "image/jpeg" }),
        new Blob(["sample"], { type: "image/webp" }),
    ];
    const maxImagesAmount = 3;
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    const orientations = [0, 1, 2];
    const orientationValue = 1;
    const parentDispatch = vi.fn() as React.Dispatch<
        | {
            action: string;
            payload: FormData;
        }
        | {
            action: string;
            payload: SetFilesInErrorPayload;
        }
    >;
    const qualities = [0, 1, 2];
    const qualityValue = 1;
    const showBoundary = vi.fn() as (error: Error) => void;
    const storageKey = "testStorageKey";
    const validValueAction = "testValidValueAction";
    const invalidValueAction = "testInvalidValueAction";
    const getForageItemSafe = vi.fn(async () => {
        return createSafeBoxResult<Array<OriginalFile>>({
            kind: "success",
            data: [sampleFiles[0]],
            message: "png",
        });
    }) as any;
    const setForageItemSafe = vi.fn(async () => {
        return createSafeBoxResult({
            kind: "success",
            data: true,
            message: "png",
        });
    }) as any;
    const modifyImageSafe = vi.fn(async () => {
        return createSafeBoxResult({
            kind: "success",
            data: new Blob(["sample"], { type: "image/png" }),
            message: "png",
        });
    }) as any;

    try {
        const handleClickResult =
            await handleImageQualityOrientationSliderChange({
                accessibleImageInputDispatch,
                currentImageIndex,
                fileNames,
                getForageItemSafe,
                isComponentMountedRef,
                maxImageSize,
                modifyImageSafe,
                orientations,
                orientationValue,
                parentDispatch,
                qualities,
                qualityValue,
                setForageItemSafe,
                showBoundary,
                storageKey,
                validValueAction,
                invalidValueAction,
            });

        if (handleClickResult.err) {
            return createSafeBoxResult({
                message: handleClickResult.val.message ??
                    "Unable to modify image",
            });
        }
        const safebox = handleClickResult.safeUnwrap();

        describe("handleImageQualityOrientationSliderChange", () => {
            it("should return a success result", () => {
                expect(safebox.kind).toBe("success");
                expect(safebox.data).toBe(true);
            });
        });

        return createSafeBoxResult({
            kind: "success",
            data: true,
        });
    } catch (error) {
        return createSafeBoxResult({
            message: "Error: Component is not mounted",
        });
    }
}
