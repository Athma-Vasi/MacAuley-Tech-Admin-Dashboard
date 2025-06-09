import { Box, NativeSelect, NativeSelectProps, Text } from "@mantine/core";
import { useGlobalState } from "../../hooks";
import { splitCamelCase } from "../../utils";

type AccessibleSelectInputAttributes<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = NativeSelectProps & {
  dataTestId?: string;
  hideLabel?: boolean;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  parentDispatch: React.Dispatch<{
    action: ValidValueAction;
    payload: Payload;
  }>;
  ref?: React.RefObject<HTMLSelectElement>;
  validValueAction: ValidValueAction;
};

type AccessibleSelectInputProps<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = {
  attributes: AccessibleSelectInputAttributes<ValidValueAction, Payload>;
};

function AccessibleSelectInput<
  ValidValueAction extends string = string,
  Payload extends string = string,
>(
  { attributes }: AccessibleSelectInputProps<
    ValidValueAction,
    Payload
  >,
) {
  const {
    globalState: {
      themeObject: {
        primaryColor,
      },
    },
  } = useGlobalState();

  const {
    data,
    dataTestId = `${attributes.name}-selectInput`,
    description,
    hideLabel = true,
    name,
    onChange,
    parentDispatch,
    ref,
    validValueAction,
    value,
    ...nativeSelectProps
  } = attributes;
  const label = attributes.label ?? splitCamelCase(name);
  const { screenreaderTextElement } =
    createAccessibleSelectInputScreenreaderTextElements({
      name,
      value: value as number,
    });

  const selectInput = (
    <NativeSelect
      aria-describedby={`${name}-selectInput-screenreader-text`}
      aria-label={`${description}. Currently selected ${value}`}
      color={primaryColor}
      data={data}
      data-testid={dataTestId}
      label={hideLabel ? null : label}
      name={name}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
        parentDispatch({
          action: validValueAction,
          payload: event.currentTarget.value as Payload,
        });

        onChange?.(event);
      }}
      ref={ref}
      value={value}
      {...nativeSelectProps}
    />
  );

  return (
    <Box className="accessible-input">
      {selectInput}
      {screenreaderTextElement}
    </Box>
  );
}

function createAccessibleSelectInputScreenreaderTextElements({
  name,
  value = 0,
}: {
  name: string;
  value?: number;
}): {
  screenreaderTextElement: React.JSX.Element;
} {
  const id = `${name}-selectInput-screenreader-text`;
  const screenreaderTextElement = (
    <Text
      aria-live="polite"
      className="visually-hidden"
      data-testid={id}
      id={id}
      w="100%"
    >
      {`${value} is selected for ${splitCamelCase(name)} select input.`}
    </Text>
  );

  return { screenreaderTextElement };
}

export { AccessibleSelectInput };
export type { AccessibleSelectInputAttributes, AccessibleSelectInputProps };
