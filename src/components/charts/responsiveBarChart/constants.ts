import { CheckboxRadioSelectData } from "../../../types";
import {
  NivoAxisLegendPosition,
  NivoBarGroupMode,
  NivoBarLayout,
  NivoBarValueScale,
} from "../types";

const NIVO_BAR_GROUP_MODE_DATA: CheckboxRadioSelectData<
  NivoBarGroupMode
> = [
  { value: "stacked", label: "Stacked" },
  { value: "grouped", label: "Grouped" },
];

const NIVO_BAR_LAYOUT_DATA: CheckboxRadioSelectData<NivoBarLayout> = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
];

const NIVO_BAR_VALUE_SCALE_DATA: CheckboxRadioSelectData<
  NivoBarValueScale
> = [
  { value: "linear", label: "Linear" },
  { value: "symlog", label: "Symlog" },
];

const NIVO_BAR_AXIS_LEGEND_POSITION_DATA: CheckboxRadioSelectData<
  NivoAxisLegendPosition
> = [
  { value: "start", label: "Start" },
  { value: "middle", label: "Middle" },
  { value: "end", label: "End" },
];

export {
  NIVO_BAR_AXIS_LEGEND_POSITION_DATA,
  NIVO_BAR_GROUP_MODE_DATA,
  NIVO_BAR_LAYOUT_DATA,
  NIVO_BAR_VALUE_SCALE_DATA,
};
