import { NavLink, NavLinkProps } from "@mantine/core";
import { TbChevronDownRight } from "react-icons/tb";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors, splitCamelCase } from "../../utils";

type AccessibleNavLinkAttributes = NavLinkProps & {
  children?: React.ReactNode;
  dataTestId?: string;
  name: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

type AccessibleNavLinkProps = {
  attributes: AccessibleNavLinkAttributes;
};

function AccessibleNavLink({ attributes }: AccessibleNavLinkProps) {
  const {
    globalState: { themeObject },
  } = useGlobalState();
  const { textColor } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    children,
    color = textColor,
    dataTestId,
    icon = <TbChevronDownRight />,
    name,
    onClick,
    onMouseEnter,
    ...navLinkProps
  } = attributes;
  const label = attributes.label ?? splitCamelCase(name);

  const navLink = (
    <NavLink
      color={color}
      data-testid={dataTestId}
      icon={icon}
      label={label}
      name={name}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{ color: textColor }}
      {...navLinkProps}
    >
      {children}
    </NavLink>
  );

  return navLink;
}

export { AccessibleNavLink };
export type { AccessibleNavLinkAttributes, AccessibleNavLinkProps };
