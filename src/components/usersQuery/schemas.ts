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

const userDocumentOptionalsZod = z.object({
    __v: z.number().optional(),
    _id: z.string().optional(),
    addressLine: z.string().regex(ADDRESS_LINE_REGEX).optional(),
    city: z.string().regex(CITY_REGEX).optional(),
    country: z.string().regex(COUNTRY_REGEX).optional(),
    createdAt: z.string().optional(),
    department: z.string().regex(DEPARTMENT_REGEX).optional(),
    email: z.string().email().optional(),
    fileUploadId: z.string().optional(),
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

const userDocumentRequiredZod = z.object({
    __v: z.number(),
    _id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    addressLine: z.string().regex(ADDRESS_LINE_REGEX),
    city: z.string().regex(CITY_REGEX),
    country: z.string().regex(COUNTRY_REGEX),
    department: z.string().regex(DEPARTMENT_REGEX),
    email: z.string().email(),
    fileUploadId: z.string().optional(),
    firstName: z.string().regex(FULL_NAME_REGEX),
    jobPosition: z.string().regex(JOB_POSITION_REGEX),
    lastName: z.string().regex(FULL_NAME_REGEX),
    orgId: z.number(),
    parentOrgId: z.number(),
    postalCodeCanada: z.string(),
    postalCodeUS: z.string(),
    profilePictureUrl: z.string(),
    province: z.string().regex(PROVINCE_REGEX),
    roles: z.array(z.string().regex(USER_ROLES_REGEX)),
    state: z.string().regex(STATES_US_REGEX),
    storeLocation: z.string().regex(ALL_STORE_LOCATIONS_REGEX),
    username: z.string().regex(USERNAME_REGEX),
});

const setArrangeByDirectionUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.setArrangeByDirection),
    payload: z.enum(["ascending", "descending"]),
});
const setArrangeByFieldUsersQueryDispatchZod = z.object({
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
const setCurrentPageUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.setCurrentPage),
    payload: z.number().min(0),
});
const setIsErrorUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.setIsError),
    payload: z.boolean(),
});
const setIsLoadingUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.setIsLoading),
    payload: z.boolean(),
});
const setNewQueryFlagUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.setNewQueryFlag),
    payload: z.boolean(),
});
const setPagesUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.setPages),
    payload: z.number().min(0),
});
const setQueryStringUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.setQueryString),
    payload: z.string(),
});
const setResourceDataUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.setResourceData),
    payload: z.array(userDocumentOptionalsZod),
});
const setTotalDocumentsUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.setTotalDocuments),
    payload: z.number().min(0),
});
const resetToInitialUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.resetToInitial),
    payload: z.object({
        arrangeByDirection: z.enum(["ascending", "descending"]),
        arrangeByField: z.enum([
            "addressLine",
            "city",
            "country",
            "department",
            "email",
            "fileUploadId",
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
        resourceData: z.array(userDocumentOptionalsZod),
        totalDocuments: z.number().min(0),
    }),
});

const setUsersFetchWorkerUsersQueryDispatchZod = z.object({
    action: z.literal(usersQueryAction.setUsersFetchWorker),
    payload: z.instanceof(Worker),
});

const arrangeByFieldZod = z.enum([
    "addressLine",
    "city",
    "country",
    "department",
    "email",
    "fileUploadId",
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
]);
const arrangeByDirectionZod = z.enum(["ascending", "descending"]);
const userRolesZod = z.array(z.string().regex(USER_ROLES_REGEX));

const decodedTokenZod = z.object({
    userId: z.string(),
    username: z.string(),
    roles: userRolesZod,
    sessionId: z.string(),
    iat: z.number(),
    exp: z.number(),
});

const handleUsersQuerySubmitGETClickInputZod = z.object({
    accessToken: z.string(),
    arrangeByDirection: arrangeByDirectionZod,
    arrangeByField: arrangeByFieldZod,
    currentPage: z.number().min(0),
    decodedToken: decodedTokenZod,
    isComponentMountedRef: z.object({ current: z.boolean() }),
    newQueryFlag: z.boolean(),
    queryString: z.string(),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    totalDocuments: z.number().min(0),
    url: z.string().url(),
    usersFetchWorker: z.instanceof(Worker),
    usersQueryDispatch: z.function().args(z.any()).returns(z.void()),
});

const handleMessageEventUsersFetchWorkerToMainInputZod = z.object({
    authDispatch: z.function().args(z.any()).returns(z.void()),
    event: z.instanceof(MessageEvent),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    navigate: z.function().args(z.any()).returns(z.void()),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    usersQueryDispatch: z.function().args(z.any()).returns(z.void()),
});

type UsersQueryDispatch =
    | z.infer<typeof setArrangeByDirectionUsersQueryDispatchZod>
    | z.infer<typeof setArrangeByFieldUsersQueryDispatchZod>
    | z.infer<typeof setCurrentPageUsersQueryDispatchZod>
    | z.infer<typeof setIsErrorUsersQueryDispatchZod>
    | z.infer<typeof setIsLoadingUsersQueryDispatchZod>
    | z.infer<typeof setNewQueryFlagUsersQueryDispatchZod>
    | z.infer<typeof setPagesUsersQueryDispatchZod>
    | z.infer<typeof setQueryStringUsersQueryDispatchZod>
    | z.infer<typeof setResourceDataUsersQueryDispatchZod>
    | z.infer<typeof setTotalDocumentsUsersQueryDispatchZod>
    | z.infer<typeof resetToInitialUsersQueryDispatchZod>
    | z.infer<typeof setUsersFetchWorkerUsersQueryDispatchZod>;

const messageEventUsersFetchMainToWorkerZod = z.object({
    accessToken: z.string(),
    arrangeByDirection: arrangeByDirectionZod,
    arrangeByField: arrangeByFieldZod,
    currentPage: z.number().min(0),
    newQueryFlag: z.boolean(),
    queryString: z.string(),
    requestInit: z.any(),
    routesZodSchemaMapKey: z.string(),
    totalDocuments: z.number().min(0),
    url: z.string().url(),
});

export {
    decodedTokenZod,
    handleMessageEventUsersFetchWorkerToMainInputZod,
    handleUsersQuerySubmitGETClickInputZod,
    messageEventUsersFetchMainToWorkerZod,
    resetToInitialUsersQueryDispatchZod,
    setArrangeByDirectionUsersQueryDispatchZod,
    setArrangeByFieldUsersQueryDispatchZod,
    setCurrentPageUsersQueryDispatchZod,
    setIsErrorUsersQueryDispatchZod,
    setIsLoadingUsersQueryDispatchZod,
    setNewQueryFlagUsersQueryDispatchZod,
    setPagesUsersQueryDispatchZod,
    setQueryStringUsersQueryDispatchZod,
    setResourceDataUsersQueryDispatchZod,
    setTotalDocumentsUsersQueryDispatchZod,
    setUsersFetchWorkerUsersQueryDispatchZod,
    userDocumentOptionalsZod,
    userDocumentRequiredZod,
    userRolesZod,
};
export type { UsersQueryDispatch };
