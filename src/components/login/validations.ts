import { z } from "zod";
import {
    CountryZodEnum,
    DepartmentZodEnum,
    HttpResponseKindZodEnum,
    JobPositionZodEnum,
    PreferredPronounsZodEnum,
    ProvinceZodEnum,
    StatesUSZodEnum,
    StorelocationZodEnum,
    UserRolesZodEnum,
} from "../../parse";

const loginResponseSchema = z.object({
    accessToken: z.string(),
    data: z.array(
        z.object({
            _id: z.string(),
            username: z.string(),
            email: z.string(),
            firstName: z.string(),
            middleName: z.string(),
            lastName: z.string(),
            preferredName: z.string(),
            preferredPronouns: z.enum(PreferredPronounsZodEnum),
            profilePictureUrl: z.string(),
            dateOfBirth: z.string(),
            contactNumber: z.string(),
            address: z.object({
                addressLine: z.string(),
                city: z.string(),
                province: z.enum(ProvinceZodEnum).optional(),
                postalCode: z.string(),
                state: z.enum(StatesUSZodEnum).optional(),
                country: z.enum(CountryZodEnum),
            }),
            jobPosition: z.enum(JobPositionZodEnum),
            department: z.enum(DepartmentZodEnum),
            storeLocation: z.enum(StorelocationZodEnum),
            emergencyContact: z.object({
                fullName: z.string(),
                contactNumber: z.string(),
            }),
            startDate: z.string(),
            roles: z.array(z.enum(UserRolesZodEnum)),
            active: z.boolean(),
            completedSurveys: z.array(z.string()),
            createdAt: z.string(),
            updatedAt: z.string(),
            __v: z.number(),
            isPrefersReducedMotion: z.boolean(),
        }),
    ),
    kind: z.enum(HttpResponseKindZodEnum),
    message: z.string(),
    pages: z.number(),
    status: z.number(),
    totalDocuments: z.number(),
    triggerLogout: z.boolean(),
});

export { loginResponseSchema };

/**
 * {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJ1c2VySWQiOiI2NGViYmMwNDhhNWIyZTVmOGI0YjU3ZTUiLCJ1c2VybmFtZSI6Im1hbmFnZXIiLCJyb2xlcyI6WyJNYW5hZ2VyIl19LCJzZXNzaW9uSWQiOiI2NmUxZWE4MzViYjgxNjRjYTkwM2QyZDkiLCJpYXQiOjE3MjYwODE2NjcsImV4cCI6MTcyNjA4MTcyNywianRpIjoiNGIxOTBmZGQtNTRlZC00NWE5LWI1ZWUtZGI1MGI1YmUzZWJkIn0.IzrzOfrzjcF-wxF23L76tlQf_H1DEuVn5ZhFf9gGOgk",
    "data": [
        {
            "_id": "64ebbc048a5b2e5f8b4b57e5",
            "username": "manager",
            "email": "manager@example.com",
            "firstName": "Miles",
            "middleName": "Naismith",
            "lastName": "Vorkosigan",
            "preferredName": "Admiral Naismith",
            "preferredPronouns": "He/Him",
            "profilePictureUrl": "https://images.pexels.com/photos/4777025/pexels-photo-4777025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "dateOfBirth": "1975-02-20T00:00:00.000Z",
            "contactNumber": "+(1)(555) 987-6543",
            "address": {
                "addressLine": "678 Redwood Avenue",
                "city": "Seattle",
                "province": "",
                "postalCode": "98101",
                "state": "Washington",
                "country": "United States"
            },
            "jobPosition": "Store Manager",
            "department": "Store Administration",
            "storeLocation": "Edmonton",
            "emergencyContact": {
                "fullName": "Elli Quinn",
                "contactNumber": "+(1)(555) 123-4567"
            },
            "startDate": "2020-01-15T00:00:00.000Z",
            "roles": [
                "Manager"
            ],
            "active": true,
            "completedSurveys": [
                "64d523a6f586df3f34a7db97"
            ],
            "createdAt": "2023-08-27T21:11:32.919Z",
            "updatedAt": "2023-11-15T22:35:39.201Z",
            "__v": 0,
            "isPrefersReducedMotion": false
        }
    ],
    "kind": "success",
    "message": "Successful operation",
    "pages": 0,
    "status": 200,
    "totalDocuments": 0,
    "triggerLogout": false
}
 */
