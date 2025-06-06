import { Box, type MantineSize, Switch } from "@mantine/core";
import type { ChangeEvent, ReactNode, RefObject } from "react";

import { useGlobalState } from "../../hooks/useGlobalState";
import { splitCamelCase } from "../../utils";
import { createAccessibleSwitchOnOffTextElements } from "./utils";

type AccessibleSwitchInputAttributes<
  ValidValueAction extends string = string,
> = {
  checked: boolean;
  color?: string;
  disabled?: boolean;
  label?: ReactNode;
  labelPosition?: "left" | "right";
  name: string;
  offLabel: ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onLabel: ReactNode;
  parentDispatch: React.Dispatch<
    {
      action: ValidValueAction;
      payload: boolean;
    }
  >;
  radius?: MantineSize;
  ref?: RefObject<HTMLInputElement>;
  required?: boolean;
  size?: MantineSize;
  page?: number;
  preventErrorStateWhenOff?: boolean;
  /** Will be added to end of `${name} is off. ` */
  switchOffDescription?: string;
  /** Will be added to end of `${name} is on. ` */
  switchOnDescription?: string;
  thumbIcon?: ReactNode;
  validValueAction: ValidValueAction;
  value: boolean;
};

type AccessibleSwitchInputProps<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  attributes: AccessibleSwitchInputAttributes<
    ValidValueAction
  >;
  uniqueId?: string;
};

function AccessibleSwitchInput<
  ValidValueAction extends string = string,
>(
  { attributes, uniqueId }: AccessibleSwitchInputProps<
    ValidValueAction
  >,
) {
  const { globalState: { themeObject: { primaryColor } } } = useGlobalState();

  const {
    checked,
    color = primaryColor,
    disabled = false,
    labelPosition = "right",
    name,
    onChange,
    offLabel,
    onLabel,
    parentDispatch,
    preventErrorStateWhenOff = false,
    radius = "lg",
    ref = null,
    required = false,
    size = "sm",
    page = 0,
    switchOffDescription = "",
    switchOnDescription = "",
    thumbIcon = null,
    validValueAction,
    value,
  } = attributes;

  const label = attributes.label ?? splitCamelCase(name);

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { switchOnTextElement, switchOffTextElement } =
    createAccessibleSwitchOnOffTextElements({
      checked,
      name,
      switchOffDescription,
      switchOnDescription,
      themeObject,
    });

  return (
    <Box
      key={`${name}-${value}-${uniqueId}`}
      className="accessible-input"
    >
      <Switch
        aria-label={name}
        aria-required={required}
        aria-describedby={checked
          // id of switchOnTextElement
          ? `${name}-on`
          // id of switchOffTextElement
          : `${name}-off`}
        checked={checked}
        color={color}
        description={preventErrorStateWhenOff
          ? ""
          : checked
          ? switchOnTextElement
          : switchOffTextElement}
        disabled={disabled}
        label={label}
        labelPosition={labelPosition}
        name={name}
        offLabel={offLabel}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const {
            currentTarget: { checked },
          } = event;

          parentDispatch({
            action: validValueAction,
            payload: checked,
          });

          onChange?.(event);
        }}
        onLabel={onLabel}
        radius={radius}
        ref={ref}
        required={required}
        size={size}
        thumbIcon={thumbIcon}
        value={value.toString()}
      />

      <Box className="visually-hidden">
        {switchOnTextElement}
        {switchOffTextElement}
      </Box>
    </Box>
  );
}

export { AccessibleSwitchInput };

export type { AccessibleSwitchInputAttributes };
