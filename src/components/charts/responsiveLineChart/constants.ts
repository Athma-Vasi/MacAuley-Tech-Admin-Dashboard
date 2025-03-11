import type { CheckboxRadioSelectData } from "../../../types";
import type {
  NivoLineAreaBlendMode,
  NivoLineAxesScale,
  NivoLineCrosshairType,
  NivoLineCurve,
  NivoLinePointLabel,
} from "../types";

const NIVO_LINE_AXES_SCALE: CheckboxRadioSelectData<NivoLineAxesScale> = [
  { label: "Linear", value: "linear" },
  { label: "Point", value: "point" },
];

const NIVO_LINE_CURVE_DATA: CheckboxRadioSelectData<NivoLineCurve> = [
  { label: "Basis", value: "basis" },
  { label: "Cardinal", value: "cardinal" },
  { label: "Catmull Rom", value: "catmullRom" },
  { label: "Linear", value: "linear" },
  { label: "Monotone X", value: "monotoneX" },
  { label: "Monotone Y", value: "monotoneY" },
  { label: "Natural", value: "natural" },
  { label: "Step", value: "step" },
  { label: "Step After", value: "stepAfter" },
  { label: "Step Before", value: "stepBefore" },
];

const NIVO_LINE_AREA_BLEND_MODE_DATA: CheckboxRadioSelectData<
  NivoLineAreaBlendMode
> = [
  { label: "Normal", value: "normal" },
  { label: "Multiply", value: "multiply" },
  { label: "Screen", value: "screen" },
  { label: "Overlay", value: "overlay" },
  { label: "Darken", value: "darken" },
  { label: "Lighten", value: "lighten" },
  { label: "Color Dodge", value: "color-dodge" },
  { label: "Color Burn", value: "color-burn" },
  { label: "Hard Light", value: "hard-light" },
  { label: "Soft Light", value: "soft-light" },
  { label: "Difference", value: "difference" },
  { label: "Exclusion", value: "exclusion" },
  { label: "Hue", value: "hue" },
  { label: "Saturation", value: "saturation" },
  { label: "Color", value: "color" },
  { label: "Luminosity", value: "luminosity" },
];

const NIVO_LINE_POINT_LABEL_DATA: CheckboxRadioSelectData<NivoLinePointLabel> =
  [
    { label: "X", value: "x" },
    { label: "Y", value: "y" },
  ];

const NIVO_LINE_CROSSHAIR_TYPE_DATA: CheckboxRadioSelectData<
  NivoLineCrosshairType
> = [
  { label: "X", value: "x" },
  { label: "Y", value: "y" },
  { label: "Top Left", value: "top-left" },
  { label: "Top", value: "top" },
  { label: "Top Right", value: "top-right" },
  { label: "Right", value: "right" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Bottom", value: "bottom" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Left", value: "left" },
  { label: "Cross", value: "cross" },
];

export {
  NIVO_LINE_AREA_BLEND_MODE_DATA,
  NIVO_LINE_AXES_SCALE,
  NIVO_LINE_CROSSHAIR_TYPE_DATA,
  NIVO_LINE_CURVE_DATA,
  NIVO_LINE_POINT_LABEL_DATA,
};
