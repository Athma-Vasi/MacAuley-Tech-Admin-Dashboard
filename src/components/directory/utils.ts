import { UserDocument } from "../../types";
import { createSafeBoxResult, getForageItemSafe } from "../../utils";
import { createDirectoryForageKey } from "../sidebar/utils";
import { directoryAction } from "./actions";
import { DepartmentsWithDefaultKey, DirectoryDispatch } from "./types";

function returnIsStoreLocationDisabled(department: DepartmentsWithDefaultKey) {
  const disabledSet = new Set<DepartmentsWithDefaultKey>([
    "All Departments",
    "Executive Management",
    "Accounting",
    "Human Resources",
    "Marketing",
    "Sales",
    "Information Technology",
  ]);

  return disabledSet.has(department);
}

async function forageDirectory(
  {
    fetchAbortControllerRef,
    isComponentMountedRef,
    directoryDispatch,
    showBoundary,
  }: {
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    isComponentMountedRef: React.RefObject<boolean>;
    directoryDispatch: React.Dispatch<DirectoryDispatch>;
    showBoundary: (error: any) => void;
  },
) {
  fetchAbortControllerRef.current?.abort("Previous request cancelled");
  fetchAbortControllerRef.current = new AbortController();
  const fetchAbortController = fetchAbortControllerRef.current;

  isComponentMountedRef.current = true;
  const isComponentMounted = isComponentMountedRef.current;

  const directoryKey = createDirectoryForageKey();

  try {
    const forageResult = await getForageItemSafe<UserDocument[]>(
      directoryKey,
    );

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    if (forageResult.err) {
      return createSafeBoxResult({
        message: forageResult.val.message ?? "Error getting directory",
      });
    }

    const { message, data } = forageResult.safeUnwrap();

    if (data === undefined) {
      return createSafeBoxResult({
        message: message ?? "Data is undefined",
      });
    }

    directoryDispatch({
      action: directoryAction.setDirectory,
      payload: data,
    });
    return createSafeBoxResult({
      data,
      kind: "success",
    });
  } catch (error) {
    if (
      !isComponentMounted || fetchAbortController?.signal.aborted
    ) {
      return createSafeBoxResult({
        message: "Component unmounted or request aborted",
      });
    }

    showBoundary(error);
    return createSafeBoxResult({
      message: "Unknown error",
    });
  }
}

export { forageDirectory, returnIsStoreLocationDisabled };
