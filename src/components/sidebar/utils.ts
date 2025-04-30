import { AllStoreLocations } from "../dashboard/types";
import { DepartmentsWithDefaultKey } from "../directory/types";

function createDirectoryForageKey(
    department: DepartmentsWithDefaultKey = "Executive Management",
    storeLocation: AllStoreLocations = "All Locations",
) {
    return `directory/${storeLocation}/${department}`;
}

export { createDirectoryForageKey };
