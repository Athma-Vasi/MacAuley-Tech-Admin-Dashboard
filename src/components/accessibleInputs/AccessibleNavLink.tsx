import {
    Box,
    Container,
    type MantineColor,
    NavLink,
    type Variants,
} from "@mantine/core";
import type { ReactNode } from "react";
import { TbChevronDownRight } from "react-icons/tb";
import { useGlobalState } from "../../hooks";
import { splitCamelCase } from "../../utils";
import { createAccessibleNavLinkTextElement } from "./utils";

type AccessibleNavLinkAttributes = {
    active?: boolean;
    children?: ReactNode;
    childrenOffset?: number | "xs" | "sm" | "md" | "lg" | "xl";
    color?: MantineColor;
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

    const {
        active = false,
        children = null,
        childrenOffset = 0,
        color,
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
            opened={opened}
            rightSection={rightSection}
            variant={variant}
        >
            {children}
        </NavLink>
    );

    return (
        <Container key={`${name}-${index}`}>
            {navLink}
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
                {screenreaderTextElement}
            </Box>
        </Container>
    );
}

export { AccessibleNavLink };
export type { AccessibleNavLinkAttributes, AccessibleNavLinkProps };
