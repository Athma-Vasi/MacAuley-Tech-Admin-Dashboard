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

const userDocumentZ = z.object({
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

export { userDocumentZ };
