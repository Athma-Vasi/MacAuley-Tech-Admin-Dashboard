import { UserDocument } from "../../types";
import {
  DepartmentsWithDefaultKey,
  StoreLocationsWithDefaultKey,
} from "./types";

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

function filterEmployees({
  department,
  directory,
  isStoreLocationDisabled,
  storeLocation,
}: {
  department: DepartmentsWithDefaultKey;
  directory: UserDocument[];
  isStoreLocationDisabled: boolean;
  storeLocation: StoreLocationsWithDefaultKey;
}) {
  return department === "All Departments"
    ? directory
    : directory.filter((employee) => {
      return isStoreLocationDisabled
        ? employee.department === department
        : employee.department === department &&
          employee.storeLocation === storeLocation;
    });
}

export { filterEmployees, returnIsStoreLocationDisabled };
