import {
    Box,
    Checkbox,
    CheckboxGroupProps,
    Group,
    Space,
    Stack,
    Text,
} from "@mantine/core";
import type { ReactNode, RefObject } from "react";

import { CheckboxRadioSelectData } from "../../types";
import { capitalizeJoinWithAnd, splitCamelCase } from "../../utils";

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

    const { screenreaderTextElement } =
        createAccessibleCheckboxSelectionsTextElements({
            name,
            value,
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

    const checkboxGroup = (
        <Checkbox.Group
            aria-describedby={value.length > 0
                // id of selectedTextElement
                ? `${name}-checkbox-group-selected`
                // id of deselectedTextElement
                : `${name}-checkbox-group-deselected`}
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
            <Group
                w="100%"
                position="left"
                p="md"
                spacing="xl"
                align="flex-start"
            >
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
    );

    return (
        <Box w="100%">
            {checkboxGroup}
            {screenreaderTextElement}
        </Box>
    );
}

function createAccessibleCheckboxSelectionsTextElements({
    name,
    value,
}: {
    name: string;
    value: string | string[];
}): {
    screenreaderTextElement: React.JSX.Element;
} {
    const stringifiedValue = Array.isArray(value)
        ? capitalizeJoinWithAnd(value)
        : value;

    const selectedText = `${stringifiedValue} ${
        value.length > 1 ? "are" : "is"
    } selected.`;
    const selectedTextElement = (
        <Text
            aria-live="polite"
            className="visually-hidden"
            data-testid={`${name}-checkbox-selected-text`}
            id={`${name}-checkbox-group-selected`}
        >
            {selectedText}
        </Text>
    );

    const deselectedTextElement = (
        <Text
            aria-live="polite"
            className="visually-hidden"
            data-testid={`${name}-checkbox-deselected-text`}
            id={`${name}-checkbox-group-deselected`}
        >
            {`No ${splitCamelCase(name)} selected.`}
        </Text>
    );

    return {
        screenreaderTextElement: value.length > 0
            ? selectedTextElement
            : deselectedTextElement,
    };
}

export { AccessibleCheckboxInputGroup };
export type {
    AccessibleCheckboxInputGroupAttributes,
    AccessibleCheckboxInputGroupProps,
};
