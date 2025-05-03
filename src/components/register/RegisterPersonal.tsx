import { Card, Text } from "@mantine/core";

import React, { useEffect, useRef } from "react";
import {
    ALL_STORE_LOCATIONS_DATA,
    DEPARTMENTS_DATA,
    JOB_POSITIONS_DATA,
} from "../../constants";
import { Department, JobPosition } from "../../types";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../accessibleInputs/AccessibleTextInput";
import { AllStoreLocations } from "../dashboard/types";
import type { RegisterAction } from "./actions";
import { RegisterDispatch } from "./schemas";

type RegisterPersonalProps = {
    department: Department;
    firstName: string;
    jobPosition: JobPosition;
    lastName: string;
    registerAction: RegisterAction;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    profilePictureUrl: string;
    storeLocation: AllStoreLocations;
};

function RegisterPersonal({
    department,
    firstName,
    jobPosition,
    lastName,
    registerAction,
    registerDispatch,
    profilePictureUrl,
    storeLocation,
}: RegisterPersonalProps) {
    const firstNameInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        firstNameInputRef.current?.focus();
    }, []);

    const firstNameTextInput = (
        <AccessibleTextInput
            attributes={{
                invalidValueAction: registerAction.setIsError,
                name: "firstName",
                parentDispatch: registerDispatch,
                ref: firstNameInputRef,
                validValueAction: registerAction.setFirstName,
                value: firstName,
            }}
        />
    );

    const lastNameTextInput = (
        <AccessibleTextInput
            attributes={{
                invalidValueAction: registerAction.setIsError,
                name: "lastName",
                parentDispatch: registerDispatch,
                validValueAction: registerAction.setLastName,
                value: lastName,
            }}
        />
    );

    // const profilePictureUrlTextInput = (
    //     <AccessibleTextInput
    //         attributes={{
    //             invalidValueAction: registerAction.setIsError,
    //             name: "profilePictureUrl",
    //             parentDispatch: registerDispatch,
    //             validValueAction: registerAction.setProfilePictureUrl,
    //             value: profilePictureUrl,
    //         }}
    //     />
    // );

    const jobPositionSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: JOB_POSITIONS_DATA,
                name: "jobPosition",
                parentDispatch: registerDispatch,
                validValueAction: registerAction.setJobPosition,
                value: jobPosition,
            }}
        />
    );

    const departmentSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: DEPARTMENTS_DATA,
                name: "department",
                parentDispatch: registerDispatch,
                validValueAction: registerAction.setDepartment,
                value: department,
            }}
        />
    );

    const storeLocationSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: ALL_STORE_LOCATIONS_DATA,
                name: "storeLocation",
                parentDispatch: registerDispatch,
                validValueAction: registerAction.setStoreLocation,
                value: storeLocation,
            }}
        />
    );

    return (
        <Card className="register-form-card">
            <Text size={24}>Personal</Text>
            {firstNameTextInput}
            {lastNameTextInput}
            {/* {profilePictureUrlTextInput} */}
            {jobPositionSelectInput}
            {departmentSelectInput}
            {storeLocationSelectInput}
        </Card>
    );
}

export { RegisterPersonal };
