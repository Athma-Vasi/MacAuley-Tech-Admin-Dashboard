import { z } from "zod";
import { userDocumentRequiredZod } from "../../components/usersQuery/schemas";
import { authAction } from "./actions";

const setAccessTokenAuthDispatchZod = z.object({
    action: z.literal(authAction.setAccessToken),
    payload: z.string(),
});

const setDecodedTokenAuthDispatchZod = z.object({
    action: z.literal(authAction.setDecodedToken),
    payload: z.object({
        userId: z.string(),
        username: z.string(),
        roles: z.array(z.enum(["Admin", "Manager", "Employee"])),
        sessionId: z.string(),
        iat: z.number(),
        exp: z.number(),
    }),
});

const setIsLoggedInAuthDispatchZod = z.object({
    action: z.literal(authAction.setIsLoggedIn),
    payload: z.boolean(),
});

const setUserDocumentAuthDispatchZod = z.object({
    action: z.literal(authAction.setUserDocument),
    payload: userDocumentRequiredZod,
});

export {
    setAccessTokenAuthDispatchZod,
    setDecodedTokenAuthDispatchZod,
    setIsLoggedInAuthDispatchZod,
    setUserDocumentAuthDispatchZod,
};
