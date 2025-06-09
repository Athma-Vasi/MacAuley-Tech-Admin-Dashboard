import {
  Box,
  SegmentedControl,
  SegmentedControlProps,
  Text,
} from "@mantine/core";
import { useGlobalState } from "../../hooks";
import { splitCamelCase } from "../../utils";

type AccessibleSegmentedControlAttributes<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = SegmentedControlProps & {
  dataTestId?: string;
  hideName?: boolean;
  label?: React.ReactNode;
  name: string;
  onChange?: (value: Payload) => void;
  parentDispatch: React.Dispatch<{
    action: ValidValueAction;
    payload: Payload;
  }>;
  validValueAction: ValidValueAction;
};

type AccessibleSegmentedControlProps<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = {
  attributes: AccessibleSegmentedControlAttributes<ValidValueAction, Payload>;
};

function AccessibleSegmentedControl<
  ValidValueAction extends string = string,
  Payload extends string = string,
>({ attributes }: AccessibleSegmentedControlProps<ValidValueAction, Payload>) {
  const { globalState: { themeObject: { primaryColor } } } = useGlobalState();
  const {
    color = primaryColor,
    dataTestId = `${attributes.name}-segmentedControl`,
    hideName = true,
    name,
    onChange,
    parentDispatch,
    validValueAction,
    value,
    ...segmentedControlProps
  } = attributes;

  const { segmentedControlTextElement } =
    createAccessibleSegmentedControlTextElement({
      name,
      value,
    });
  const segmentedControl = (
    <SegmentedControl
      aria-describedby={`${name}-segmentedControl-text`}
      aria-label={name}
      color={color}
      data-testid={dataTestId}
      onChange={(value: Payload) => {
        parentDispatch({
          action: validValueAction,
          payload: value,
        });
        onChange?.(value);
      }}
      {...segmentedControlProps}
    />
  );

  return (
    <Box className="accessible-input">
      {hideName ? null : <Text>{splitCamelCase(name)}</Text>}
      {segmentedControl}
      {segmentedControlTextElement}
    </Box>
  );
}

function createAccessibleSegmentedControlTextElement({
  name,
  value,
}: {
  name: string;
  value: string | undefined;
}): {
  segmentedControlTextElement: React.ReactNode;
} {
  const segmentedControlTextElement = (
    <Text
      aria-live="polite"
      className="visually-hidden"
      data-testid={`${name}-segmentedControl-screenreader-text`}
      id={`${name}-segmentedControl-text`}
      w="100%"
    >
      {`${splitCamelCase(name)} is set to ${value ?? "unknown"}.`}
    </Text>
  );

  return { segmentedControlTextElement };
}

export { AccessibleSegmentedControl };
export type {
  AccessibleSegmentedControlAttributes,
  AccessibleSegmentedControlProps,
};
