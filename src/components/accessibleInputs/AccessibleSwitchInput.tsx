import { Box, Container, type MantineSize, Switch } from "@mantine/core";
import type { ChangeEvent, ReactNode, RefObject } from "react";

import { INPUT_MAX_WIDTH, INPUT_MIN_WIDTH } from "../../constants/data";
import { useGlobalState } from "../../hooks";
import type { SetPageInErrorPayload } from "../../types";
import { splitCamelCase } from "../../utils";
import { createAccessibleSwitchOnOffTextElements } from "./utils";

type AccessibleSwitchInputAttributes<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
> = {
  checked: boolean;
  disabled?: boolean;
  invalidValueAction: InvalidValueAction;
  label?: ReactNode;
  labelPosition?: "left" | "right";
  name: string;
  offLabel: ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onLabel: ReactNode;
  parentDispatch: React.Dispatch<
    | {
      action: ValidValueAction;
      payload: boolean;
    }
    | {
      action: InvalidValueAction;
      payload: SetPageInErrorPayload;
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
    ValidValueAction,
    InvalidValueAction
  >;
  uniqueId?: string;
};

function AccessibleSwitchInput<
  ValidValueAction extends string = string,
  InvalidValueAction extends string = string,
>(
  { attributes, uniqueId }: AccessibleSwitchInputProps<
    ValidValueAction,
    InvalidValueAction
  >,
) {
  const {
    checked,
    disabled = false,
    invalidValueAction,
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
    <Container
      key={`${name}-${value}-${uniqueId}`}
      style={{ minWidth: INPUT_MIN_WIDTH, maxWidth: INPUT_MAX_WIDTH }}
      w="100%"
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

          if (!preventErrorStateWhenOff) {
            parentDispatch({
              action: invalidValueAction,
              payload: {
                kind: checked ? "delete" : "add",
                page,
              },
            });
          }

          onChange?.(event);
        }}
        onLabel={onLabel}
        radius={radius}
        ref={ref}
        required={required}
        size={size}
        thumbIcon={thumbIcon}
        value={value ? "Yes" : "No"}
      />

      <Box
        style={
          // This is an invisible element that is used to provide screen reader users with additional information
          // @see https://webaim.org/techniques/css/invisiblecontent/
          {
            height: "1px",
            left: "-9999px",
            position: "absolute",
            top: "auto",
            width: "1px",
          }
        }
      >
        {switchOnTextElement}
        {switchOffTextElement}
      </Box>
    </Container>
  );
}

export { AccessibleSwitchInput };

export type { AccessibleSwitchInputAttributes };
