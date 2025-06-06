import {
  Box,
  type MantineColor,
  type MantineNumberSize,
  type MantineSize,
  SegmentedControl,
  Text,
} from "@mantine/core";
import { useGlobalState } from "../../hooks/useGlobalState";
import type { CheckboxRadioSelectData } from "../../types";
import { splitCamelCase } from "../../utils";

type AccessibleSegmentedControlAttributes<
  ValidValueAction extends string = string,
  Payload extends string = string,
> = {
  color?: MantineColor;
  data: CheckboxRadioSelectData<Payload>;
  dataTestId?: string;
  defaultValue?: Payload;
  disabled?: boolean;
  fullWidth?: boolean;
  hideName?: boolean;
  label?: React.ReactNode;
  name: string;
  onChange?: (value: Payload) => void;
  orientation?: "horizontal" | "vertical";
  parentDispatch: React.Dispatch<{
    action: ValidValueAction;
    payload: Payload;
  }>;
  radius?: MantineNumberSize;
  readOnly?: boolean;
  size?: MantineSize;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  validValueAction: ValidValueAction;
  value: Payload;
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
    data,
    dataTestId = `${attributes.name}-segmentedControl`,
    defaultValue,
    disabled = false,
    fullWidth = false,
    hideName = true,
    name,
    onChange,
    orientation = "horizontal",
    parentDispatch,
    radius = "sm",
    readOnly = false,
    size = "sm",
    transitionDuration = 150,
    transitionTimingFunction = "ease",
    validValueAction,
    value,
  } = attributes;

  //   const {
  //     globalState: { themeObject },
  //   } = useGlobalState();

  //   const { switchOnTextElement, switchOffTextElement } =
  //     createAccessibleSwitchOnOffTextElements({
  //       checked,
  //       name,
  //       switchOffDescription,
  //       switchOnDescription,
  //       themeObject,
  //     });

  return (
    <Box>
      {hideName ? null : <Text>{splitCamelCase(name)}</Text>}
      <SegmentedControl
        aria-label={name}
        color={color}
        data={data}
        data-testid={dataTestId}
        defaultValue={defaultValue}
        disabled={disabled}
        fullWidth={fullWidth}
        onChange={(value: Payload) => {
          parentDispatch({ action: validValueAction, payload: value });
          onChange?.(value);
        }}
        orientation={orientation}
        radius={radius}
        readOnly={readOnly}
        size={size}
        transitionDuration={transitionDuration}
        transitionTimingFunction={transitionTimingFunction}
        value={value}
      />

      <Box className="visually-hidden">
        {
          /* {switchOnTextElement}
        {switchOffTextElement} */
        }
      </Box>
    </Box>
  );
}

export { AccessibleSegmentedControl };
export type { AccessibleSegmentedControlAttributes };
