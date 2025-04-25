import { z } from "zod";
import {
    ADDRESS_LINE_REGEX,
    ALL_STORE_LOCATIONS_REGEX,
    CITY_REGEX,
    COUNTRY_REGEX,
    DEPARTMENT_REGEX,
    FULL_NAME_REGEX,
    JOB_POSITION_REGEX,
    PASSWORD_REGEX,
    PROVINCE_REGEX,
    STATES_US_REGEX,
    USER_ROLES_REGEX,
    USERNAME_REGEX,
} from "./regexes";

const userDocumentZ = z.object({
    __v: z.number(),
    _id: z.string(),
    addressLine: z.string().regex(ADDRESS_LINE_REGEX),
    city: z.string().regex(CITY_REGEX),
    country: z.string().regex(COUNTRY_REGEX),
    createdAt: z.string(),
    department: z.string().regex(DEPARTMENT_REGEX),
    email: z.string().email(),
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
    updatedAt: z.string(),
    username: z.string().regex(USERNAME_REGEX),
});

export { userDocumentZ };
