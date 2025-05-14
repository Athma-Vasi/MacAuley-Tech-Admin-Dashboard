import { FinancialYAxisKey } from "../../types";
import { PERTAction } from "./actions";

type PERTState = {
  yAxisKey: FinancialYAxisKey;
};

type PERTDispatch = {
  action: PERTAction["setYAxisKey"];
  payload: FinancialYAxisKey;
};

export type { PERTDispatch, PERTState };
