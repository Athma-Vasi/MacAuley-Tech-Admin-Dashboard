import {
  Box,
  Button,
  type ButtonProps,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import type {
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  RefObject,
} from "react";
import { BiDislike, BiLike } from "react-icons/bi";
import {
  TbArrowDown,
  TbArrowUp,
  TbCircleArrowDown,
  TbCircleArrowUp,
  TbClearAll,
  TbDownload,
  TbEdit,
  TbFilter,
  TbFolderOpen,
  TbHelp,
  TbLogout,
  TbMessageCirclePlus,
  TbMessageReport,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlus,
  TbQuote,
  TbRefresh,
  TbRowInsertTop,
  TbSearch,
  TbStar,
  TbTrash,
  TbUpload,
} from "react-icons/tb";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";

import React from "react";
import { VscCollapseAll, VscExpandAll } from "react-icons/vsc";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors, splitCamelCase } from "../../utils";

type AccessibleButtonKind =
  | "add"
  | "collapse"
  | "default"
  | "delete"
  | "dislike"
  | "down"
  | "download"
  | "edit"
  | "expand"
  | "filter"
  | "help"
  | "hide"
  | "insert"
  | "like"
  | "logout"
  | "next"
  | "open"
  | "pause"
  | "play"
  | "previous"
  | "quote"
  | "rate"
  | "refresh"
  | "reply"
  | "report"
  | "reset"
  | "search"
  | "show"
  | "star"
  | "submit"
  | "up";

type AccessibleButtonAttributes = ButtonProps & {
  dataTestId?: string;
  disabledScreenreaderText?: string;
  enabledScreenreaderText?: string;
  label?: string;
  isTooltip?: boolean;
  kind: AccessibleButtonKind;
  leftIcon?: ReactNode;
  name?: string;
  onClick?: (
    event: MouseEvent<HTMLButtonElement> | PointerEvent<HTMLButtonElement>,
  ) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (
    event: MouseEvent<HTMLButtonElement> | PointerEvent<HTMLButtonElement>,
  ) => void;
  ref?: RefObject<HTMLButtonElement>;
  setIconAsLabel?: boolean;
};

type AccessibleButtonProps = {
  attributes: AccessibleButtonAttributes;
};

function AccessibleButton({ attributes }: AccessibleButtonProps) {
  const {
    globalState: { themeObject },
  } = useGlobalState();
  const { colorScheme } = themeObject;
  const { grayBorderShade, themeColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    color = themeColorShade,
    compact = false,
    disabled = false,
    disabledScreenreaderText,
    dataTestId,
    enabledScreenreaderText,
    isTooltip = true,
    kind,
    name = kind,
    onClick,
    onKeyDown = () => {},
    onMouseEnter,
    ref = null,
    rightIcon = null,
    setIconAsLabel = false,
    size = "sm",
    type = "button",
    variant = colorScheme === "dark" ? "outline" : "filled",
    ...buttonProps
  } = attributes;

  const iconColor = colorScheme === "dark"
    ? themeColorShade
    : COLORS_SWATCHES.gray[1];
  const leftIconTable: Record<AccessibleButtonKind, ReactNode> = {
    add: (
      <TbPlus
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    collapse: (
      <VscCollapseAll
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    default: null,
    delete: (
      <TbTrash
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    dislike: (
      <BiDislike
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    down: (
      <TbCircleArrowDown
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    download: (
      <TbDownload
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    edit: (
      <TbEdit
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    expand: (
      <VscExpandAll
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    filter: (
      <TbFilter
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    insert: (
      <TbRowInsertTop
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    help: (
      <TbHelp
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    hide: (
      <TbArrowDown
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    like: (
      <BiLike
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    logout: (
      <TbLogout
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    next: (
      <TiArrowRightThick
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    open: (
      <TbFolderOpen
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    pause: (
      <TbPlayerPauseFilled
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    play: (
      <TbPlayerPlayFilled
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    previous: (
      <TiArrowLeftThick
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    quote: (
      <TbQuote
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    rate: (
      <TbStar
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    refresh: (
      <TbRefresh
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    reply: (
      <TbMessageCirclePlus
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    report: (
      <TbMessageReport
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    reset: (
      <TbClearAll
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    search: (
      <TbSearch
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    show: (
      <TbArrowUp
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    star: (
      <TbStar
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    submit: (
      <TbUpload
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
    up: (
      <TbCircleArrowUp
        color={disabled && colorScheme === "dark"
          ? "black"
          : disabled && colorScheme === "light"
          ? grayBorderShade
          : iconColor}
        size={18}
      />
    ),
  };

  const leftIcon = setIconAsLabel
    ? null
    : attributes.leftIcon ?? leftIconTable[kind];
  const label = setIconAsLabel ? leftIconTable[kind] : (
    <Text
      size={size}
      // color={colorScheme === "dark"
      //   ? themeColorShade
      //   : disabled
      //   ? grayBorderShade
      //   : "white"}
      color={disabled
        ? colorScheme === "dark" ? "black" : grayBorderShade
        : colorScheme === "dark"
        ? themeColorShade
        : "white"}
    >
      {attributes.label ?? splitCamelCase(name)}
    </Text>
  );
  console.log("leftIcon:", leftIcon);

  const { screenreaderTextElement } =
    createAccessibleButtonScreenreaderTextElements({
      disabledScreenreaderText,
      enabledScreenreaderText,
      isEnabled: !disabled,
      name,
    });

  const button = (
    <Button
      aria-describedby={disabled
        // id of disabledTextElement
        ? `${name}-button-disabled`
        // id of enabledTextElement
        : `${name}-button-enabled`}
      aria-label={name}
      color={color}
      compact={compact}
      data-testid={dataTestId}
      disabled={disabled}
      leftIcon={leftIcon}
      name={name}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onKeyDown={onKeyDown}
      ref={ref}
      rightIcon={rightIcon}
      size={size}
      type={type}
      variant={variant}
      {...buttonProps}
    >
      {label}
    </Button>
  );

  return (
    <Box>
      {isTooltip && enabledScreenreaderText?.length
        ? (
          <Tooltip
            label={disabled
              ? disabledScreenreaderText
              : enabledScreenreaderText}
          >
            <Group>{button}</Group>
          </Tooltip>
        )
        : button}

      {screenreaderTextElement}
    </Box>
  );
}

function createAccessibleButtonScreenreaderTextElements({
  disabledScreenreaderText,
  enabledScreenreaderText,
  isEnabled,
  name,
}: {
  disabledScreenreaderText?: string;
  enabledScreenreaderText?: string;
  isEnabled: boolean;
  name: string;
}): {
  screenreaderTextElement: React.JSX.Element;
} {
  const defaultEnabledText =
    `All form inputs are valid. ${name} is enabled. You may submit the form.`;
  const enabledTextElement = (
    <Text
      aria-live="polite"
      className="visually-hidden"
      data-testid={`${name}-button-enabled-screenreader-text`}
      id={`${name}-button-enabled`}
    >
      {`${enabledScreenreaderText ?? ""} ${defaultEnabledText}`}
    </Text>
  );

  const defaultDisabledText =
    `One or more inputs are in error. ${name} disabled. Please fix errors before continuing.`;
  const disabledTextElement = (
    <Text
      aria-live="polite"
      className="visually-hidden"
      data-testid={`${name}-button-disabled-screenreader-text`}
      id={`${name}-button-disabled`}
    >
      {`${disabledScreenreaderText ?? ""} ${defaultDisabledText}`}
    </Text>
  );

  return {
    screenreaderTextElement: isEnabled
      ? enabledTextElement
      : disabledTextElement,
  };
}

export { AccessibleButton };
export type { AccessibleButtonAttributes, AccessibleButtonKind };
