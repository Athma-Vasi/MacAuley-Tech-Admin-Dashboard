import { Center, Loader, Stack } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Err, Ok } from "ts-results";
import { FETCH_REQUEST_TIMEOUT } from "../../constants";
import { CanadianPostalCode, UserSchema } from "../../types";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { DIRECTORY_USER_DOCUMENTS } from "../directory/data";
import { postUsersToDB } from "./handlers";

function Testing() {
    const { showBoundary } = useErrorBoundary();

    const fetchAbortControllerRef = useRef<AbortController | null>(null);
    const isComponentMountedRef = useRef(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [schemas, setSchemas] = useState<Array<Record<string, unknown>>>(
        [],
    );
    const [uploadedCount, setUploadedCount] = useState(0);

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

    useEffect(() => {
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

        const userSchemas = DIRECTORY_USER_DOCUMENTS.map(
            (employee) => {
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
                    roles,
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

                const addressLine = `${randomAddressNumber} ${randomRoadName}`;

                const randomAlphabet = () =>
                    String.fromCharCode(
                        Math.floor(Math.random() * 26) + 65,
                    );
                const randomNumber = () => Math.floor(Math.random() * 10);

                const postalCodeCanada = country === "United States"
                    ? "A0A 0A0"
                    : `${randomAlphabet()}${randomNumber()}${randomAlphabet()} ${randomNumber()}${randomAlphabet()}${randomNumber()}`;

                const coinToss = Math.random() < 0.5;
                const postalCodeUSFormat = coinToss ? "short" : "long";
                const postalCodeUS = country === "Canada"
                    ? "00000"
                    : postalCodeUSFormat === "short"
                    ? `${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`
                    : `${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}-${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`;

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
                    postalCodeCanada: postalCodeCanada as CanadianPostalCode,
                    postalCodeUS,
                    profilePictureUrl,
                    province: country === "Canada" && province
                        ? province
                        : "Not Applicable",
                    roles,
                    state: country === "United States" && state
                        ? state
                        : "Not Applicable",
                    storeLocation,
                    username,
                };

                return schema;
            },
        );

        setSchemas(userSchemas);
    }, []);

    const BATCH = 1;
    useEffect(() => {
        async function submitBatch() {
            const slicedSchemas = schemas.slice(
                uploadedCount,
                uploadedCount + BATCH,
            );

            const result = await postUsersToDB({
                body: JSON.stringify({ "schemas": slicedSchemas }),
                fetchAbortControllerRef,
                isComponentMountedRef,
                setIsSubmitting,
                showBoundary,
                url: "http://localhost:5000/api/v1/user/bulk",
            });

            if (result?.err) {
                showBoundary(
                    "Error occurred while posting user data",
                );
                return new Err(
                    "Error occurred while posting user data",
                );
            }

            const responseResult = result?.val;
            return new Ok(
                responseResult,
            );
        }

        if (schemas.length === 0 || uploadedCount >= schemas.length) {
            return;
        }

        // setTimeout(() => {
        //     const submitResult = submitBatch();
        //     console.log("submitResult", submitResult);
        //     setUploadedCount(
        //         (prevCount) => prevCount + BATCH,
        //     );
        // }, 1000);
    }, [uploadedCount]);

    const button = (
        <AccessibleButton
            attributes={{
                kind: "submit",
                onClick: async (
                    event:
                        | React.MouseEvent<HTMLButtonElement, MouseEvent>
                        | React.PointerEvent<HTMLButtonElement>,
                ) => {
                    setUploadedCount(
                        (prevCount) => prevCount + BATCH,
                    );
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
