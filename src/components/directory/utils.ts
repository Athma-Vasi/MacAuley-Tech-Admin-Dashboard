import { EmployeeDoc } from "./data";
import {
  DepartmentsWithDefaultKey,
  DirectoryUserDocument,
  StoreLocationsWithDefaultKey,
} from "./types";

function returnSearchInputData(usersDocs: DirectoryUserDocument[]) {
  return Array.from(
    usersDocs.reduce<Set<string>>((acc, user) => {
      const { firstName, middleName, lastName } = user;
      acc.add(firstName);
      acc.add(middleName);
      acc.add(lastName);

      return acc;
    }, new Set<string>()),
  );
}

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
  employees,
  isStoreLocationDisabled,
  storeLocation,
}: {
  department: DepartmentsWithDefaultKey;
  employees: EmployeeDoc[];
  isStoreLocationDisabled: boolean;
  storeLocation: StoreLocationsWithDefaultKey;
}) {
  return department === "All Departments"
    ? employees
    : employees.filter((employee) => {
      return isStoreLocationDisabled
        ? employee.department === department
        : employee.department === department &&
          employee.storeLocation === storeLocation;
    });
}

export {
  filterEmployees,
  returnIsStoreLocationDisabled,
  returnSearchInputData,
};
