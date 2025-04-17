import { Center, Loader, Stack } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Ok } from "ts-results";
import { FETCH_REQUEST_TIMEOUT } from "../../constants";
import { CanadianPostalCode, UserSchema } from "../../types";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { DIRECTORY_EMPLOYEE_DATA } from "../directory/data";

function Testing() {
    const { showBoundary } = useErrorBoundary();

    const fetchAbortControllerRef = useRef<AbortController | null>(null);
    const isComponentMountedRef = useRef(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const timerId = setTimeout(() => {
            fetchAbortControllerRef?.current?.abort("Request timed out");
        }, FETCH_REQUEST_TIMEOUT);

        return () => {
            clearTimeout(timerId);
            fetchAbortControllerRef?.current?.abort("Component unmounted");
            isComponentMountedRef.current = false;
        };
    }, []);

    const button = (
        <AccessibleButton
            attributes={{
                kind: "submit",
                onClick: async (
                    event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
                ) => {
                    const roadNames = [
                        "Ocean Avenue",
                        "Maple Street",
                        "Sunset Boulevard",
                        "Elm Drive",
                        "Cedar Lane",
                        "Pine Avenue",
                        "Willow Way",
                        "Chestnut Road",
                        "Birch Boulevard",
                        "Highland Avenue",
                        "Riverside Drive",
                        "Ash Street",
                        "Meadow Lane",
                        "Hilltop Road",
                        "Lakeview Terrace",
                        "Forest Avenue",
                        "Broadway",
                        "Main Street",
                        "Sycamore Court",
                        "Rosewood Drive",
                        "Oak Hill Road",
                        "Magnolia Avenue",
                        "Horizon Street",
                        "Valley View Road",
                        "Golden Gate Avenue",
                        "Whyte Avenue",
                        "Jasper Avenue",
                        "MacLeod Trail",
                        "Crowchild Trail",
                        "Stoney Trail",
                        "16th Avenue NW",
                        "Kingsway NW",
                        "Riverbend Road",
                        "Heritage Drive SE",
                        "Bowness Road NW",
                        "Gateway Boulevard",
                        "Calgary Trail",
                        "Saddleback Road",
                        "Spruce Meadows Way",
                        "Silver Springs Blvd",
                        "Mill Woods Road",
                        "Chinook Gate",
                        "Banff Trail NW",
                        "Yellowhead Trail",
                        "Fort Road",
                        "Glenmore Trail",
                        "Windermere Boulevard",
                        "Big Rock Trail",
                        "Prairie Winds Drive",
                    ];

                    const results = DIRECTORY_EMPLOYEE_DATA.map(
                        async (employee) => {
                            const {
                                city,
                                country,
                                department,
                                email,
                                firstName,
                                jobPosition,
                                lastName,
                                orgId,
                                parentOrgId,
                                profilePictureUrl,
                                role,
                                storeLocation,
                                username,
                                province,
                                state,
                            } = employee;

                            const randomRoadName = roadNames[
                                Math.floor(Math.random() * roadNames.length)
                            ];

                            const randomAddressNumber = Math.floor(
                                Math.random() * 10000,
                            );

                            const addressLine =
                                `${randomAddressNumber} ${randomRoadName}`;

                            const randomPostalAlphabet = String.fromCharCode(
                                Math.floor(Math.random() * 26) + 65,
                            );
                            const postalCodeCanada = country === "United States"
                                ? "Not Applicable"
                                : `${randomPostalAlphabet}${
                                    Math.floor(
                                        Math.random() * 10,
                                    )
                                }${randomPostalAlphabet} ${
                                    Math.floor(
                                        Math.random() * 10,
                                    )
                                }${randomPostalAlphabet}${
                                    Math.floor(
                                        Math.random() * 10,
                                    )
                                }`;

                            const coinToss = Math.random() < 0.5;
                            const postalCodeUSFormat = coinToss
                                ? "short"
                                : "long";
                            const postalCodeUS = country === "Canada"
                                ? "Not Applicable"
                                : postalCodeUSFormat === "short"
                                ? Math.floor(
                                    Math.random() * 100000,
                                ).toString()
                                : `${
                                    Math.floor(
                                        Math.random() * 100000,
                                    )
                                }-${
                                    Math.floor(
                                        Math.random() * 10000,
                                    )
                                }`;

                            const schema: UserSchema = {
                                addressLine,
                                city,
                                country,
                                department,
                                email,
                                firstName,
                                jobPosition,
                                lastName,
                                orgId,
                                parentOrgId,
                                password: "passwordQ1!",
                                postalCodeCanada:
                                    postalCodeCanada as CanadianPostalCode,
                                postalCodeUS,
                                profilePictureUrl,
                                province: country === "Canada" && province
                                    ? province
                                    : "Not Applicable",
                                roles: role,
                                state: country === "United States" && state
                                    ? state
                                    : "Not Applicable",
                                storeLocation,
                                username,
                            };

                            return new Ok(schema);

                            // return await postUsersToDB({
                            //     body: JSON.stringify({ schema }),
                            //     event,
                            //     fetchAbortControllerRef,
                            //     isComponentMountedRef,
                            //     setIsSubmitting,
                            //     showBoundary,
                            //     url: REGISTER_URL,
                            // });
                        },
                    );

                    results.forEach(async (result) => {
                        const awaited = await result;
                        if (awaited.err) {
                            showBoundary(new Error("Error"));
                            return;
                        }

                        const responseResult = awaited.val;

                        console.log("responseResult", responseResult);
                    });
                },
            }}
        />
    );

    return (
        <Center h="100%" w="100%">
            <Stack>
                <h1>Testing</h1>
                <p>Testing component</p>
                {isSubmitting ? <Loader size="sm" /> : null}
                {button}
            </Stack>
        </Center>
    );
}

export default Testing;
