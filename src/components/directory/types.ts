import {
  Country,
  Department,
  JobPosition,
  PhoneNumber,
  PreferredPronouns,
  Province,
  StatesUS,
  StoreLocation,
  UserRole,
} from "../../types";
import { DirectoryAction } from "./actions";

type DirectoryUserDocument = {
  username: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  orgId: number;
  parentOrgId: number;
  preferredName: string;
  preferredPronouns: PreferredPronouns;
  profilePictureUrl: string;
  contactNumber: PhoneNumber;
  city: string;
  province?: Province;
  state?: StatesUS;
  country: Country;
  jobPosition: JobPosition;
  department: Department;
  storeLocation: StoreLocation;
  role: UserRole;
  active: boolean;
};

type DirectoryState = {
  department: DepartmentsWithDefaultKey;
  storeLocation: StoreLocationsWithDefaultKey;
};

// default keys needed for select inputs
type DepartmentsWithDefaultKey = Department | "All Departments";
type StoreLocationsWithDefaultKey = StoreLocation | "All Locations";

type DirectoryDispatch =
  | {
      action: DirectoryAction["setDepartment"];
      payload: DepartmentsWithDefaultKey;
    }
  | {
      action: DirectoryAction["setStoreLocation"];
      payload: StoreLocationsWithDefaultKey;
    };

export type {
  DepartmentsWithDefaultKey,
  DirectoryAction,
  DirectoryDispatch,
  DirectoryState,
  DirectoryUserDocument,
  StoreLocationsWithDefaultKey,
};
