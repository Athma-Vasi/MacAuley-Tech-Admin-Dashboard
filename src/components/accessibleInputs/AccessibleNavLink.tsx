import { Box, type MantineColor, NavLink, type Variants } from "@mantine/core";
import type { ReactNode } from "react";
import { TbChevronDownRight } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors, splitCamelCase } from "../../utils";
import { createAccessibleNavLinkTextElement } from "./utils";

type AccessibleNavLinkAttributes = {
  active?: boolean;
  children?: ReactNode;
  childrenOffset?: number | "xs" | "sm" | "md" | "lg" | "xl";
  color?: MantineColor;
  dataTestId?: string;
  defaultOpened?: boolean;
  description: string;
  disableRightSectionRotation?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  index?: number;
  label?: ReactNode;
  name: string;
  noWrap?: boolean;
  onChange?: (opened: boolean) => void;
  onClick: () => void;
  onMouseEnter?: () => void;
  opened?: boolean;
  rightSection?: ReactNode;
  variant?: Variants<"light" | "filled" | "subtle">;
};

type AccessibleNavLinkProps = {
  attributes: AccessibleNavLinkAttributes;
};

function AccessibleNavLink({ attributes }: AccessibleNavLinkProps) {
  const {
    globalState: { themeObject },
  } = useGlobalState();
  const { primaryColor } = themeObject;

  const { textColor } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    active = false,
    children = null,
    childrenOffset = 0,
    color = textColor,
    dataTestId,
    defaultOpened = false,
    description,
    disableRightSectionRotation = false,
    disabled = false,
    icon = <TbChevronDownRight />,
    index = 0,
    name,
    noWrap = false,
    onChange,
    onClick,
    onMouseEnter = () => {},
    opened = false,
    rightSection = null,
    variant = "light",
  } = attributes;
  const label = attributes.label ?? splitCamelCase(name);

  const { screenreaderTextElement } = createAccessibleNavLinkTextElement({
    active,
    description,
    name,
    themeObject,
  });

  const navLink = (
    <NavLink
      active={active}
      childrenOffset={childrenOffset}
      color={color}
      data-testid={dataTestId}
      defaultOpened={defaultOpened}
      // description={description}
      disableRightSectionRotation={disableRightSectionRotation}
      disabled={disabled}
      icon={icon}
      label={label}
      name={name}
      noWrap={noWrap}
      onChange={onChange}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      opened={opened}
      rightSection={rightSection}
      style={{ color: textColor }}
      variant={variant}
    >
      {children}
    </NavLink>
  );

  return (
    <Box key={`${name}-${index}`}>
      {navLink}
      <Box className="visually-hidden">
        {screenreaderTextElement}
      </Box>
    </Box>
  );
}

export { AccessibleNavLink };
export type { AccessibleNavLinkAttributes, AccessibleNavLinkProps };
