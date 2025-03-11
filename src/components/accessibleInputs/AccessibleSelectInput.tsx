import { Container, type MantineSize, NativeSelect } from "@mantine/core";

import { INPUT_MAX_WIDTH, INPUT_MIN_WIDTH } from "../../constants/data";
import type { CheckboxRadioSelectData } from "../../types";
import { splitCamelCase } from "../../utils";
import type { SetFilterInputValuesDispatchData } from "../query/QueryFilter";

type AccessibleSelectInputAttributes<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = {
  data: CheckboxRadioSelectData<Payload>;
  describedBy?: string;
  description?: string;
  disabled?: boolean;
  label?: React.ReactNode;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  /** default generic dispatch */
  parentDispatch?: React.Dispatch<{
    action: ValidValueAction;
    payload: Payload;
  }>;
  setFilterInputValuesDispatchData?: SetFilterInputValuesDispatchData<
    ValidValueAction
  >;
  ref?: React.RefObject<HTMLSelectElement>;
  required?: boolean;
  size?: MantineSize;
  validValueAction: ValidValueAction;
  value: string;
  withAsterisk?: boolean;
};

type AccessibleSelectInputProps<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = {
  attributes: AccessibleSelectInputAttributes<ValidValueAction, Payload>;
  uniqueId?: string;
};

function AccessibleSelectInput<
  ValidValueAction extends string = string,
  Payload extends string = string,
>(
  { attributes, uniqueId }: AccessibleSelectInputProps<
    ValidValueAction,
    Payload
  >,
) {
  const {
    data,
    describedBy = "",
    description,
    disabled = false,
    name,
    onChange,
    parentDispatch,
    setFilterInputValuesDispatchData,
    ref = null,
    required = false,
    size = "sm",
    validValueAction,
    value,
    withAsterisk = required,
  } = attributes;

  const label = attributes.label ?? splitCamelCase(name);

  return (
    <Container
      key={`container-${name}-${uniqueId}`}
      style={{
        minWidth: INPUT_MIN_WIDTH,
        maxWidth: INPUT_MAX_WIDTH,
      }}
      w="100%"
    >
      <NativeSelect
        aria-describedby={describedBy}
        aria-label={`${description}. Currently selected ${value}`}
        aria-required={required}
        data={data}
        disabled={disabled}
        label={label}
        name={name}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          parentDispatch?.({
            action: validValueAction,
            payload: event.currentTarget.value as Payload,
          });

          if (setFilterInputValuesDispatchData) {
            const {
              fieldNamesOperatorsTypesMap,
              searchFieldSelectInputData,
              setFilterInputValuesDispatch,
              selectInputsDataMap,
            } = setFilterInputValuesDispatchData;

            setFilterInputValuesDispatch({
              action: validValueAction,
              payload: {
                fieldNamesOperatorsTypesMap,
                searchFieldSelectInputData,
                selectInputsDataMap,
                value: event.currentTarget.value,
              },
            });
          }

          onChange?.(event);
        }}
        ref={ref}
        required={required}
        size={size}
        value={value}
        withAsterisk={withAsterisk}
      />
    </Container>
  );
}

export { AccessibleSelectInput };

export type { AccessibleSelectInputAttributes };
