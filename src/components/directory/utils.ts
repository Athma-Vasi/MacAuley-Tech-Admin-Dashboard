import { AllStoreLocations } from "../dashboard/types";
import { DepartmentsWithDefaultKey } from "./types";

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

function createDirectoryURLCacheKey(
  { department, directoryUrl, storeLocation }: {
    department: DepartmentsWithDefaultKey;
    directoryUrl: string;
    storeLocation: AllStoreLocations;
  },
) {
  const urlWithQuery = department === "All Departments"
    ? new URL(
      `${directoryUrl}/user/?&limit=200&newQueryFlag=true&totalDocuments=0`,
    )
    : new URL(
      `${directoryUrl}/user/?&$and[storeLocation][$eq]=${storeLocation}&$and[department][$eq]=${department}&limit=200&newQueryFlag=true&totalDocuments=0`,
    );

  return urlWithQuery.toString();
}

export { createDirectoryURLCacheKey, returnIsStoreLocationDisabled };
