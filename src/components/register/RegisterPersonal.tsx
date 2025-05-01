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
    parentAction: RegisterAction;
    parentDispatch: React.Dispatch<RegisterDispatch>;
    profilePictureUrl: string;
    storeLocation: AllStoreLocations;
};

function RegisterPersonal({
    department,
    firstName,
    jobPosition,
    lastName,
    parentAction,
    parentDispatch,
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
                invalidValueAction: parentAction.setIsError,
                name: "firstName",
                parentDispatch,
                ref: firstNameInputRef,
                validValueAction: parentAction.setFirstName,
                value: firstName,
            }}
        />
    );

    const lastNameTextInput = (
        <AccessibleTextInput
            attributes={{
                invalidValueAction: parentAction.setIsError,
                name: "lastName",
                parentDispatch,
                validValueAction: parentAction.setLastName,
                value: lastName,
            }}
        />
    );

    const profilePictureUrlTextInput = (
        <AccessibleTextInput
            attributes={{
                invalidValueAction: parentAction.setIsError,
                name: "profilePictureUrl",
                parentDispatch,
                validValueAction: parentAction.setProfilePictureUrl,
                value: profilePictureUrl,
            }}
        />
    );

    const jobPositionSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: JOB_POSITIONS_DATA,
                name: "jobPosition",
                parentDispatch,
                validValueAction: parentAction.setJobPosition,
                value: jobPosition,
            }}
        />
    );

    const departmentSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: DEPARTMENTS_DATA,
                name: "department",
                parentDispatch,
                validValueAction: parentAction.setDepartment,
                value: department,
            }}
        />
    );

    const storeLocationSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: ALL_STORE_LOCATIONS_DATA,
                name: "storeLocation",
                parentDispatch,
                validValueAction: parentAction.setStoreLocation,
                value: storeLocation,
            }}
        />
    );

    return (
        <Card className="register-form-card">
            <Text size={24}>Personal</Text>
            {firstNameTextInput}
            {lastNameTextInput}
            {profilePictureUrlTextInput}
            {jobPositionSelectInput}
            {departmentSelectInput}
            {storeLocationSelectInput}
        </Card>
    );
}

export { RegisterPersonal };
