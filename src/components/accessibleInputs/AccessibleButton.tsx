import {
  Box,
  Button,
  type ButtonProps,
  Group,
  type MantineSize,
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
  TbHelp,
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
import { useGlobalState } from "../../hooks";
import { splitCamelCase } from "../../utils";
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
  | "next"
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
  const { defaultGradient, colorScheme } = themeObject;

  const {
    compact = false,
    disabled = false,
    disabledScreenreaderText,
    enabledScreenreaderText,
    index,
    isTooltip = true,
    kind,
    name = kind,
    onClick,
    onKeyDown = () => {},
    ref = null,
    rightIcon = null,
    setIconAsLabel = false,
    size = "sm",
    style = {},
    type = "button",
    variant = colorScheme === "dark" ? "outline" : "subtle",
  } = attributes;

  const leftIconTable: Record<AccessibleButtonKind, ReactNode> = {
    add: <TbPlus />,
    collapse: <VscCollapseAll />,
    default: null,
    delete: <TbTrash />,
    dislike: <BiDislike />,
    down: <TbCircleArrowDown />,
    download: <TbDownload />,
    edit: <TbEdit />,
    expand: <VscExpandAll />,
    filter: <TbFilter />,
    insert: <TbRowInsertTop />,
    help: <TbHelp />,
    hide: <TbArrowDown />,
    like: <BiLike />,
    next: <TiArrowRightThick />,
    pause: <TbPlayerPauseFilled />,
    play: <TbPlayerPlayFilled />,
    previous: <TiArrowLeftThick />,
    quote: <TbQuote />,
    rate: <TbStar />,
    refresh: <TbRefresh />,
    reply: <TbMessageCirclePlus />,
    report: <TbMessageReport />,
    reset: <TbClearAll />,
    search: <TbSearch />,
    show: <TbArrowUp />,
    star: <TbStar />,
    submit: <TbUpload />,
    up: <TbCircleArrowUp />,
  };

  const leftIcon = setIconAsLabel
    ? null
    : attributes.leftIcon ?? leftIconTable[kind];
  const label = setIconAsLabel
    ? leftIconTable[kind]
    : attributes.label ?? splitCamelCase(name);
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

  const button = (
    <Button
      aria-describedby={disabled
        // id of disabledTextElement
        ? `${name}-disabled`
        // id of enabledTextElement
        : `${name}-enabled`}
      aria-label={name}
      compact={compact}
      disabled={disabled}
      gradient={variant === "gradient" ? defaultGradient : void 0}
      leftIcon={leftIcon}
      name={name}
      onClick={onClick}
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
        {disabledTextElement}
        {enabledTextElement}
      </Box>
    </Box>
  );
}

export { AccessibleButton };

export type { AccessibleButtonAttributes, AccessibleButtonKind };
