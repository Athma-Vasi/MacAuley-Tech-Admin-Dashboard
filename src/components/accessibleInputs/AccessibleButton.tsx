import {
  Box,
  Button,
  type ButtonProps,
  Group,
  type MantineSize,
  Text,
  Tooltip,
} from "@mantine/core";
import type {
  CSSProperties,
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

import { VscCollapseAll, VscExpandAll } from "react-icons/vsc";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors, splitCamelCase } from "../../utils";
import { createAccessibleButtonScreenreaderTextElements } from "./utils";

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
  compact?: boolean;
  dataTestId?: string;
  disabled?: boolean;
  disabledScreenreaderText?: string;
  enabledScreenreaderText?: string;
  index?: number;
  isTooltip?: boolean;
  kind: AccessibleButtonKind;
  label?: ReactNode;
  leftIcon?: ReactNode;
  setIconAsLabel?: boolean;
  name?: string;
  onClick?: (
    event: MouseEvent<HTMLButtonElement> | PointerEvent<HTMLButtonElement>,
  ) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (
    event: MouseEvent<HTMLButtonElement> | PointerEvent<HTMLButtonElement>,
  ) => void;
  ref?: RefObject<HTMLButtonElement>;
  rightIcon?: ReactNode;
  size?: MantineSize;
  style?: CSSProperties;
  type?: "button" | "submit" | "reset";
  variant?:
    | "outline"
    | "white"
    | "light"
    | "default"
    | "filled"
    | "gradient"
    | "subtle";
};

type AccessibleButtonProps = {
  attributes: AccessibleButtonAttributes;
  uniqueId?: string;
};

function AccessibleButton({ attributes, uniqueId }: AccessibleButtonProps) {
  const {
    globalState: { themeObject },
  } = useGlobalState();
  const { colorScheme } = themeObject;
  const { themeColorShade } = returnThemeColors({
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
    index,
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
    style,
    type = "button",
    variant = colorScheme === "dark" ? "outline" : "filled",
  } = attributes;

  const iconColor = colorScheme === "dark"
    ? themeColorShade
    : COLORS_SWATCHES.gray[1];
  const leftIconTable: Record<AccessibleButtonKind, ReactNode> = {
    add: <TbPlus color={iconColor} size={18} />,
    collapse: <VscCollapseAll color={iconColor} size={18} />,
    default: null,
    delete: <TbTrash color={iconColor} size={18} />,
    dislike: <BiDislike color={iconColor} size={18} />,
    down: <TbCircleArrowDown color={iconColor} size={18} />,
    download: <TbDownload color={iconColor} size={18} />,
    edit: <TbEdit color={iconColor} size={18} />,
    expand: <VscExpandAll color={iconColor} size={18} />,
    filter: <TbFilter color={iconColor} size={18} />,
    insert: <TbRowInsertTop color={iconColor} size={18} />,
    help: <TbHelp color={iconColor} size={18} />,
    hide: <TbArrowDown color={iconColor} size={18} />,
    like: <BiLike color={iconColor} size={18} />,
    logout: <TbLogout color={iconColor} size={18} />,
    next: <TiArrowRightThick color={iconColor} size={18} />,
    open: <TbFolderOpen color={iconColor} size={18} />,
    pause: <TbPlayerPauseFilled color={iconColor} size={18} />,
    play: <TbPlayerPlayFilled color={iconColor} size={18} />,
    previous: <TiArrowLeftThick color={iconColor} size={18} />,
    quote: <TbQuote color={iconColor} size={18} />,
    rate: <TbStar color={iconColor} size={18} />,
    refresh: <TbRefresh color={iconColor} size={18} />,
    reply: <TbMessageCirclePlus color={iconColor} size={18} />,
    report: <TbMessageReport color={iconColor} size={18} />,
    reset: <TbClearAll color={iconColor} size={18} />,
    search: <TbSearch color={iconColor} size={18} />,
    show: <TbArrowUp color={iconColor} size={18} />,
    star: <TbStar color={iconColor} size={18} />,
    submit: <TbUpload color={iconColor} size={18} />,
    up: <TbCircleArrowUp color={iconColor} size={18} />,
  };

  const leftIcon = setIconAsLabel
    ? null
    : attributes.leftIcon ?? leftIconTable[kind];
  const label = setIconAsLabel ? leftIconTable[kind] : (
    <Text
      size={size}
      color={colorScheme === "dark" ? themeColorShade : "white"}
    >
      {attributes.label ?? splitCamelCase(name)}
    </Text>
  );
  // const label = setIconAsLabel
  //   ? leftIconTable[kind]
  //   : attributes.label ?? splitCamelCase(name);

  const { disabledTextElement, enabledTextElement } =
    createAccessibleButtonScreenreaderTextElements({
      isEnabled: !disabled,
      disabledScreenreaderText,
      enabledScreenreaderText,
      name,
      themeObject,
    });

  // console.log(
  //   `AccessibleButton: Rendering button with name "${name}" and kind "${kind}"`,
  // );
  // console.log("disabledScreenreaderText:", disabledScreenreaderText);
  // console.log("enabledScreenreaderText:", enabledScreenreaderText);

  const button = (
    <Button
      aria-describedby={disabled
        // id of disabledTextElement
        ? `${name}-disabled`
        // id of enabledTextElement
        : `${name}-enabled`}
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
      style={style}
      type={type}
      variant={variant}
    >
      {label}
    </Button>
  );

  return (
    <Box
      key={`${name}-${index?.toString() ?? ""}-${uniqueId ?? ""}`}
    >
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

      <Box className="visually-hidden">
        {disabledTextElement}
        {enabledTextElement}
      </Box>
    </Box>
  );
}

export { AccessibleButton };

export type { AccessibleButtonAttributes, AccessibleButtonKind };
