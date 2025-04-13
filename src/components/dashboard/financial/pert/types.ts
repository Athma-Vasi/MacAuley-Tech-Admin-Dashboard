import { ChartKindSegment, FinancialYAxisKey } from "../../types";
import { PERTAction } from "./actions";

type PERTState = {
  barLineRadialChartKind: ChartKindSegment;
  yAxisKey: FinancialYAxisKey;
};

type PERTDispatch =
  | {
    action: PERTAction["setBarLineRadialChartKind"];
    payload: ChartKindSegment;
  }
  | {
    action: PERTAction["setYAxisKey"];
    payload: FinancialYAxisKey;
  };

export type { PERTDispatch, PERTState };
