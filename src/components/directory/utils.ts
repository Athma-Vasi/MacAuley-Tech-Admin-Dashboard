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

export { returnIsStoreLocationDisabled };
