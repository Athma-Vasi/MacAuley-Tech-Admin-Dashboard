import { describe, expect, it, vi } from "vitest";
import { SafeBoxResult } from "../../../types";
import { createSafeBoxResult } from "../../../utils";
import { ModifiedFile, OriginalFile } from "../AccessibleFileInput";
import {
  handleImageQualityOrientationSliderChange,
  handleRemoveImageClick,
  handleResetImageClick,
} from "./handlers";
import { AccessibleImageInputDispatch } from "./types";

const READY_RUN_TEST = true;

if (!READY_RUN_TEST) {
  throw new Error("Test is not ready to run");
}

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

// describe("accessibleImageInputReducer", () => {
//   describe("addImageFileBlob", () => {
//     it("should add image file blobs", () => {
//       sampleBlobs.forEach((blob) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.addImageFileBlob,
//           payload: blob,
//         };
//         const state = accessibleImageInputReducer_addImageFileBlob(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.imageFileBlobs).not.toHaveLength(0);
//       });

//       sampleFiles.forEach((file) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.addImageFileBlob,
//           payload: file,
//         };
//         const state = accessibleImageInputReducer_addImageFileBlob(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.imageFileBlobs).not.toHaveLength(0);
//       });
//     });
//   });

//   describe("addFileName", () => {
//     it("should add file names", () => {
//       sampleFiles.forEach((file) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.addFileName,
//           payload: { index: 0, value: file.name },
//         };
//         const state = accessibleImageInputReducer_addFileName(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.fileNames[0]).toBe(file.name);
//       });
//     });

//     it("should not add invalid file names", () => {
//       INVALID_STRINGS.forEach((value) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.addFileName,
//           payload: { index: 0, value: value as any },
//         };
//         const state = accessibleImageInputReducer_addFileName(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.fileNames[0]).toBe(void 0);
//       });
//     });
//   });

//   describe("removeImageFileBlob", () => {
//     it("should remove image file blobs", () => {
//       // Add a blob to the state first
//       const initialState = {
//         ...initialAccessibleImageInputState,
//         imageFileBlobs: [sampleBlobs[0], sampleBlobs[1]],
//       };
//       const dispatch: AccessibleImageInputDispatch = {
//         action: accessibleImageInputAction.removeImageFileBlob,
//         payload: 0,
//       };
//       const state = accessibleImageInputReducer_removeImageFileBlob(
//         initialState,
//         dispatch,
//       );
//       expect(state.imageFileBlobs).toHaveLength(1);
//     });

//     it("should not remove image file blobs with invalid index", () => {
//       // Add a blob to the state first
//       const initialState = {
//         ...initialAccessibleImageInputState,
//         imageFileBlobs: [sampleBlobs[0], sampleBlobs[1]],
//       };
//       const dispatch: AccessibleImageInputDispatch = {
//         action: accessibleImageInputAction.removeImageFileBlob,
//         payload: -1,
//       };
//       const state = accessibleImageInputReducer_removeImageFileBlob(
//         initialState,
//         dispatch,
//       );
//       expect(state.imageFileBlobs).toHaveLength(2);
//     });
//   });

//   describe("resetImageFileBlob", () => {
//     it("should reset image file blobs", () => {
//       // Add a blob to the state first
//       const initialState = {
//         ...initialAccessibleImageInputState,
//         imageFileBlobs: [sampleBlobs[0], sampleBlobs[1]],
//       };
//       const dispatch: AccessibleImageInputDispatch = {
//         action: accessibleImageInputAction.resetImageFileBlob,
//         payload: { index: 0, value: sampleFiles[0] },
//       };
//       const state = accessibleImageInputReducer_resetImageFileBlob(
//         initialState,
//         dispatch,
//       );
//       expect(state.imageFileBlobs[0]).toEqual(sampleFiles[0]);
//     });

//     it("should not reset image file blobs with invalid index", () => {
//       // Add a blob to the state first
//       const initialState = {
//         ...initialAccessibleImageInputState,
//         imageFileBlobs: [sampleBlobs[0], sampleBlobs[1]],
//       };
//       const dispatch: AccessibleImageInputDispatch = {
//         action: accessibleImageInputAction.resetImageFileBlob,
//         payload: { index: -1, value: sampleFiles[0] },
//       };
//       const state = accessibleImageInputReducer_resetImageFileBlob(
//         initialState,
//         dispatch,
//       );
//       expect(state.imageFileBlobs).toHaveLength(2);
//     });
//   });

//   describe("setCurrentImageIndex", () => {
//     it("should set the current image index", () => {
//       const dispatch: AccessibleImageInputDispatch = {
//         action: accessibleImageInputAction.setCurrentImageIndex,
//         payload: 1,
//       };
//       const state = accessibleImageInputReducer_setCurrentImageIndex(
//         initialAccessibleImageInputState,
//         dispatch,
//       );
//       expect(state.currentImageIndex).toBe(1);
//     });

//     it("should not set invalid current image index", () => {
//       const dispatch: AccessibleImageInputDispatch = {
//         action: accessibleImageInputAction.setCurrentImageIndex,
//         payload: -1,
//       };
//       const state = accessibleImageInputReducer_setCurrentImageIndex(
//         initialAccessibleImageInputState,
//         dispatch,
//       );
//       expect(state.currentImageIndex).toBe(0);
//     });
//   });

//   describe("setImageFileBlob", () => {
//     it("should set image file blobs", () => {
//       const dispatch: AccessibleImageInputDispatch = {
//         action: accessibleImageInputAction.setImageFileBlob,
//         payload: { index: 0, fileBlob: sampleBlobs[0] },
//       };
//       const state = accessibleImageInputReducer_setImageFileBlob(
//         initialAccessibleImageInputState,
//         dispatch,
//       );
//       expect(state.imageFileBlobs[0]).toEqual(sampleBlobs[0]);
//     });

//     it("should not set image file blobs with invalid index", () => {
//       const dispatch: AccessibleImageInputDispatch = {
//         action: accessibleImageInputAction.setImageFileBlob,
//         payload: { index: -1, fileBlob: sampleBlobs[0] },
//       };
//       const state = accessibleImageInputReducer_setImageFileBlob(
//         initialAccessibleImageInputState,
//         dispatch,
//       );
//       expect(state.imageFileBlobs).toHaveLength(0);
//     });
//   });

//   describe("setIsLoading", () => {
//     it("should set loading state", () => {
//       VALID_BOOLEANS.forEach((value) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.setIsLoading,
//           payload: value,
//         };
//         const state = accessibleImageInputReducer_setIsLoading(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.isLoading).toBe(value);
//       });
//     });

//     it("should not set invalid loading state", () => {
//       INVALID_BOOLEANS.forEach((value) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.setIsLoading,
//           payload: value as any,
//         };
//         const state = accessibleImageInputReducer_setIsLoading(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.isLoading).toBe(false);
//       });
//     });
//   });

//   describe("setIsModalOpen", () => {
//     it("should set modal open state", () => {
//       VALID_BOOLEANS.forEach((value) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.setIsModalOpen,
//           payload: value,
//         };
//         const state = accessibleImageInputReducer_setIsModalOpen(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.isModalOpen).toBe(value);
//       });
//     });

//     it("should not set invalid modal open state", () => {
//       INVALID_BOOLEANS.forEach((value) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.setIsModalOpen,
//           payload: value as any,
//         };
//         const state = accessibleImageInputReducer_setIsModalOpen(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.isModalOpen).toBe(false);
//       });
//     });
//   });

//   describe("setQuality", () => {
//     it("should set quality values", () => {
//       const validIndexes = [0, 1, 2];
//       validIndexes.forEach((value) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.setQuality,
//           payload: { index: 0, value },
//         };
//         const state = accessibleImageInputReducer_setQuality(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.qualities[0]).toBe(value);
//       });
//     });

//     it("should not set invalid quality values", () => {
//       const initialQuality = initialAccessibleImageInputState.qualities[0];
//       INVALID_NUMBERS.forEach((value) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.setQuality,
//           payload: { index: 0, value: value as any },
//         };
//         const state = accessibleImageInputReducer_setQuality(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.qualities[0]).toBe(initialQuality);
//       });
//     });
//   });

//   describe("setOrientation", () => {
//     it("should set orientation values", () => {
//       const validOrientations = [0, 1, 2];
//       validOrientations.forEach((value) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.setOrientation,
//           payload: { index: 0, value },
//         };
//         const state = accessibleImageInputReducer_setOrientation(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.orientations[0]).toBe(value);
//       });
//     });

//     it("should not set invalid orientation values", () => {
//       const initialOrientation =
//         initialAccessibleImageInputState.orientations[0];
//       INVALID_NUMBERS.forEach((value) => {
//         const dispatch: AccessibleImageInputDispatch = {
//           action: accessibleImageInputAction.setOrientation,
//           payload: { index: 0, value: value as any },
//         };
//         const state = accessibleImageInputReducer_setOrientation(
//           initialAccessibleImageInputState,
//           dispatch,
//         );
//         expect(state.orientations[0]).toBe(initialOrientation);
//       });
//     });
//   });
// });

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
        message: handleClickResult.val.message ?? "Unable to reset image",
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

await handleResetImageClickTestMock();

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
  const parentDispatch = vi.fn() as React.Dispatch<{
    action: string;
    payload: FormData;
  }>;

  const storageKey = "testStorageKey";
  const validValueAction = "testValidValueAction";

  try {
    const handleClickResult = await handleRemoveImageClick({
      accessibleImageInputDispatch,
      getForageItemSafe,
      index,
      isComponentMountedRef,
      parentDispatch,
      setForageItemSafe,
      storageKey,
      validValueAction,
    });
    if (handleClickResult.err) {
      return createSafeBoxResult({
        message: handleClickResult.val.message ?? "Unable to remove image",
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

await handleRemoveImageClickTestMock();

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
      payload: boolean;
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
      data: [
        new File([sampleBlobs[0]], "sample.png", {
          type: "image/png",
          lastModified: Date.now(),
        }),
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
  const modifyImageSafe = vi.fn(async () => {
    return createSafeBoxResult({
      kind: "success",
      data: new Blob(["sample"], { type: "image/png" }),
      message: "png",
    });
  }) as any;

  try {
    const handleClickResult = await handleImageQualityOrientationSliderChange({
      accessibleImageInputDispatch,
      currentImageIndex,
      fileNames,
      getForageItemSafe,
      imageFileBlobs,
      isComponentMountedRef,
      maxImagesAmount,
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
        message: handleClickResult.val.message ?? "Unable to modify image",
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

await handleImageQualityOrientationSliderChangeTestMock();
