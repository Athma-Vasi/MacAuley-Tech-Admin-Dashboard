import { z } from "zod";
import {
    ADDRESS_LINE_REGEX,
    ALL_STORE_LOCATIONS_REGEX,
    CITY_REGEX,
    COUNTRY_REGEX,
    DEPARTMENT_REGEX,
    FULL_NAME_REGEX,
    JOB_POSITION_REGEX,
    PROVINCE_REGEX,
    STATES_US_REGEX,
    USER_ROLES_REGEX,
    USERNAME_REGEX,
} from "../../regexes";
import { usersQueryAction } from "./actions";

const userDocumentZod = z.object({
    __v: z.number().optional(),
    _id: z.string().optional(),
    addressLine: z.string().regex(ADDRESS_LINE_REGEX).optional(),
    city: z.string().regex(CITY_REGEX).optional(),
    country: z.string().regex(COUNTRY_REGEX).optional(),
    createdAt: z.string().optional(),
    department: z.string().regex(DEPARTMENT_REGEX).optional(),
    email: z.string().email().optional(),
    firstName: z.string().regex(FULL_NAME_REGEX).optional(),
    jobPosition: z.string().regex(JOB_POSITION_REGEX).optional(),
    lastName: z.string().regex(FULL_NAME_REGEX).optional(),
    orgId: z.number().optional(),
    parentOrgId: z.number().optional(),
    postalCodeCanada: z.string().optional(),
    postalCodeUS: z.string().optional(),
    profilePictureUrl: z.string().optional(),
    province: z.string().regex(PROVINCE_REGEX).optional(),
    roles: z.array(z.string().regex(USER_ROLES_REGEX)).optional(),
    state: z.string().regex(STATES_US_REGEX).optional(),
    storeLocation: z.string().regex(ALL_STORE_LOCATIONS_REGEX).optional(),
    updatedAt: z.string().optional(),
    username: z.string().regex(USERNAME_REGEX).optional(),
});

const setArrangeByDirectionDispatchZod = z.object({
    action: z.literal(usersQueryAction.setArrangeByDirection),
    payload: z.enum(["ascending", "descending"]),
});
const setArrangeByFieldDispatchZod = z.object({
    action: z.literal(usersQueryAction.setArrangeByField),
    payload: z.enum([
        "addressLine",
        "city",
        "country",
        "department",
        "email",
        "firstName",
        "jobPosition",
        "lastName",
        "orgId",
        "parentOrgId",
        "password",
        "postalCodeCanada",
        "postalCodeUS",
        "profilePictureUrl",
        "province",
        "roles",
        "state",
        "storeLocation",
        "username",
        "_id",
        "createdAt",
        "updatedAt",
        "__v",
    ]), // keyof UserDocument
});
const setCurrentPageDispatchZod = z.object({
    action: z.literal(usersQueryAction.setCurrentPage),
    payload: z.number().min(0),
});
const setIsErrorDispatchZod = z.object({
    action: z.literal(usersQueryAction.setIsError),
    payload: z.boolean(),
});
const setIsLoadingDispatchZod = z.object({
    action: z.literal(usersQueryAction.setIsLoading),
    payload: z.boolean(),
});
const setNewQueryFlagDispatchZod = z.object({
    action: z.literal(usersQueryAction.setNewQueryFlag),
    payload: z.boolean(),
});
const setPagesDispatchZod = z.object({
    action: z.literal(usersQueryAction.setPages),
    payload: z.number().min(0),
});
const setQueryStringDispatchZod = z.object({
    action: z.literal(usersQueryAction.setQueryString),
    payload: z.string(),
});
const setResourceDataDispatchZod = z.object({
    action: z.literal(usersQueryAction.setResourceData),
    payload: z.array(userDocumentZod),
});
const setTotalDocumentsDispatchZod = z.object({
    action: z.literal(usersQueryAction.setTotalDocuments),
    payload: z.number().min(0),
});
const resetToInitialDispatchZod = z.object({
    action: z.literal(usersQueryAction.resetToInitial),
    payload: z.object({
        arrangeByDirection: z.enum(["ascending", "descending"]),
        arrangeByField: z.enum([
            "addressLine",
            "city",
            "country",
            "department",
            "email",
            "firstName",
            "jobPosition",
            "lastName",
            "orgId",
            "parentOrgId",
            "password",
            "postalCodeCanada",
            "postalCodeUS",
            "profilePictureUrl",
            "province",
            "roles",
            "state",
            "storeLocation",
            "username",
            "_id",
            "createdAt",
            "updatedAt",
            "__v",
        ]),
        currentPage: z.number().min(0),
        isError: z.boolean(),
        isLoading: z.boolean(),
        newQueryFlag: z.boolean(),
        pages: z.number().min(0),
        queryString: z.string(),
        resourceData: z.array(userDocumentZod),
        totalDocuments: z.number().min(0),
    }),
});

type UsersQueryDispatch =
    | z.infer<typeof setArrangeByDirectionDispatchZod>
    | z.infer<typeof setArrangeByFieldDispatchZod>
    | z.infer<typeof setCurrentPageDispatchZod>
    | z.infer<typeof setIsErrorDispatchZod>
    | z.infer<typeof setIsLoadingDispatchZod>
    | z.infer<typeof setNewQueryFlagDispatchZod>
    | z.infer<typeof setPagesDispatchZod>
    | z.infer<typeof setQueryStringDispatchZod>
    | z.infer<typeof setResourceDataDispatchZod>
    | z.infer<typeof setTotalDocumentsDispatchZod>
    | z.infer<typeof resetToInitialDispatchZod>;

export {
    resetToInitialDispatchZod,
    setArrangeByDirectionDispatchZod,
    setArrangeByFieldDispatchZod,
    setCurrentPageDispatchZod,
    setIsErrorDispatchZod,
    setIsLoadingDispatchZod,
    setNewQueryFlagDispatchZod,
    setPagesDispatchZod,
    setQueryStringDispatchZod,
    setResourceDataDispatchZod,
    setTotalDocumentsDispatchZod,
    userDocumentZod,
};
export type { UsersQueryDispatch };

/**
 * type UsersQueryState = {
    arrangeByDirection: SortDirection;
    arrangeByField: keyof UserDocument;
    currentPage: number;
    isError: boolean;
    isLoading: boolean;
    newQueryFlag: boolean;
    pages: number;
    queryString: string;
    resourceData: Array<UserDocument>;
    totalDocuments: number;
};
 */

/**
 * type UserSchema = {
  addressLine: string;
  city: string;
  country: Country;
  department: Department;
  email: string;
  firstName: string;
  jobPosition: JobPosition;
  lastName: string;
  orgId: number;
  parentOrgId: number;
  password: string;
  postalCodeCanada: CanadianPostalCode;
  postalCodeUS: USPostalCode;
  profilePictureUrl: string;
  province: Province;
  roles: UserRoles;
  state: StatesUS;
  storeLocation: AllStoreLocations;
  username: string;
};

type UserDocument = UserSchema & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
 */
