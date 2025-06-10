import {
    Box,
    Checkbox,
    CheckboxGroupProps,
    Group,
    type MantineSize,
    Space,
    Stack,
    Text,
} from "@mantine/core";
import type { ChangeEvent, ReactNode, RefObject } from "react";

import { useGlobalState } from "../../hooks/useGlobalState";
import { CheckboxRadioSelectData } from "../../types";
import { splitCamelCase } from "../../utils";
import { createAccessibleCheckboxSelectionsTextElements } from "./utils";

type AccessibleCheckboxInputSingleAttributes<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
> = {
    checked: boolean;
    deselectedDescription?: string;
    disabled?: boolean;
    invalidValueAction: InvalidValueAction;
    key?: string;
    label?: ReactNode;
    name: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    parentDispatch: React.Dispatch<
        {
            action: ValidValueAction;
            payload: boolean;
        }
    >;
    ref?: RefObject<HTMLInputElement> | null;
    required?: boolean;
    selectedDescription?: string;
    size?: MantineSize;
    style?: React.CSSProperties;
    validValueAction: ValidValueAction;
    value: string;
};

type AccessibleCheckboxInputSingleProps<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
> = {
    attributes: AccessibleCheckboxInputSingleAttributes<
        ValidValueAction,
        InvalidValueAction
    >;
    uniqueId?: string;
};

function AccessibleCheckboxInputSingle<
    ValidValueAction extends string = string,
    InvalidValueAction extends string = string,
>({
    attributes,
    uniqueId,
}: AccessibleCheckboxInputSingleProps<ValidValueAction, InvalidValueAction>) {
    const {
        checked,
        deselectedDescription,
        disabled = false,
        invalidValueAction,
        onChange,
        name,
        parentDispatch,
        ref = null,
        required = false,
        selectedDescription,
        size = "sm",
        style,
        validValueAction,
        value,
    } = attributes;

    const key = attributes.key ?? `${name} - key`;
    const label = (
        <Text color={disabled ? "gray" : void 0}>
            {attributes.label ?? splitCamelCase(name)}
        </Text>
    );

    const {
        globalState: { themeObject },
    } = useGlobalState();

    const { selectedTextElement, deselectedTextElement } =
        createAccessibleCheckboxSelectionsTextElements({
            checked,
            deselectedDescription,
            kind: "single",
            name,
            selectedDescription,
            themeObject,
            value,
        });

    return (
        <Box
            key={`container-${name}-${uniqueId}`}
            className="accessible-input"
            w="100%"
        >
            <Checkbox
                aria-describedby={checked
                    // id of selectedTextElement
                    ? `${name}-selected`
                    // id of deselectedTextElement
                    : `${name}-deselected`}
                aria-label={name}
                aria-required={required}
                checked={checked}
                description={checked
                    ? selectedTextElement
                    : deselectedTextElement}
                disabled={disabled}
                key={key}
                label={label}
                name={name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    parentDispatch({
                        action: validValueAction,
                        payload: event.currentTarget.checked,
                    });

                    if (onChange) {
                        onChange(event);
                    }
                }}
                ref={ref}
                required={required}
                size={size}
                style={style}
                value={value}
            />
        </Box>
    );
}

type AccessibleCheckboxInputGroupAttributes<
    ValidValueAction extends string = string,
    Payload extends string = string,
> = CheckboxGroupProps & {
    dataTestId?: string;
    /**
     * Set of values that should be disabled. Used by QueryBuilder component to disable values from projection exclusion if they have already been queued for inclusion (by Filter, Sort, or Search).
     */
    disabledValuesSet?: Set<string>;
    inputData: CheckboxRadioSelectData<Payload>;
    key?: string;
    label?: ReactNode;
    onChange?: (value: string[]) => void;
    parentDispatch: React.Dispatch<{
        action: ValidValueAction;
        payload: Payload[];
    }>;
    ref?: RefObject<HTMLInputElement> | null;
    name: string;
    validValueAction: ValidValueAction;
};

type AccessibleCheckboxInputGroupProps<
    ValidValueAction extends string = string,
    Payload extends string = string,
> = {
    attributes: AccessibleCheckboxInputGroupAttributes<
        ValidValueAction,
        Payload
    >;
};

function AccessibleCheckboxInputGroup<
    ValidValueAction extends string = string,
    Payload extends string = string,
>(
    { attributes }: AccessibleCheckboxInputGroupProps<
        ValidValueAction,
        Payload
    >,
) {
    const {
        dataTestId,
        disabledValuesSet = new Set(),
        inputData,
        name,
        key = `${name} - key`,
        onChange,
        parentDispatch,
        ref = null,
        validValueAction,
        value = [],
        ...checkboxGroupProps
    } = attributes;
    const label = attributes.label ?? splitCamelCase(name);

    const {
        globalState: { themeObject },
    } = useGlobalState();

    const { selectedTextElement, deselectedTextElement } =
        createAccessibleCheckboxSelectionsTextElements({
            checked: value.length > 0,
            name,
            kind: "group",
            value,
            themeObject,
        });

    const checkboxes = inputData?.map(({ value, label }, idx) => (
        <Checkbox
            data-testid={dataTestId ?? `${name}-${value}-checkboxInputGroup`}
            disabled={disabledValuesSet.has(value) ||
                disabledValuesSet.has(label)}
            key={`${value}-${idx.toString()}`}
            label={<Text>{label}</Text>}
            name={value}
            value={value}
        />
    ));

    const [leftStack, middleStack, rightStack] = checkboxes.reduce(
        (acc, checkbox, idx) => {
            const [leftStack, middleStack, rightStack] = acc;

            if (idx % 3 === 0) {
                leftStack.push(checkbox);
            } else if (idx % 3 === 1) {
                middleStack.push(checkbox);
            } else {
                rightStack.push(checkbox);
            }

            return acc;
        },
        [[], [], []] as [
            React.JSX.Element[],
            React.JSX.Element[],
            React.JSX.Element[],
        ],
    );

    return (
        <Box w="100%">
            <Checkbox.Group
                aria-describedby={value.length > 0
                    // id of selectedTextElement
                    ? `${name}-selected`
                    // id of deselectedTextElement
                    : `${name}-deselected`}
                aria-label={name}
                description={value.length > 0
                    ? selectedTextElement
                    : deselectedTextElement}
                key={key}
                label={label}
                onChange={(value: Payload[]) => {
                    parentDispatch({
                        action: validValueAction,
                        payload: value,
                    });

                    onChange?.(value);
                }}
                ref={ref}
                value={value}
                {...checkboxGroupProps}
            >
                <Group w="100%" position="left" p="md" spacing="xl">
                    <Stack>
                        {leftStack}
                    </Stack>
                    <Space w="xl" />
                    <Stack>
                        {middleStack}
                    </Stack>
                    <Space w="xl" />
                    <Stack>
                        {rightStack}
                    </Stack>
                </Group>
            </Checkbox.Group>
        </Box>
    );
}

export { AccessibleCheckboxInputGroup, AccessibleCheckboxInputSingle };

export type {
    AccessibleCheckboxInputGroupAttributes,
    AccessibleCheckboxInputSingleAttributes,
};
