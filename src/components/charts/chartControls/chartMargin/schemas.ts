/**
 * marginBottom: number; // 0px - 200px default: 60 step: 1
  marginLeft: number; // 0px - 200px default: 60 step: 1
  marginRight: number; // 0px - 200px default: 60 step: 1
  marginTop: number; // 0px - 200px default: 60 step: 1
 */

import { z } from "zod";

const setMarginBottomDispatchZod = z.object({
    action: z.literal("setMarginBottom"),
    payload: z.number().min(0).max(200).step(1),
});
const setMarginLeftDispatchZod = z.object({
    action: z.literal("setMarginLeft"),
    payload: z.number().min(0).max(200).step(1),
});
const setMarginRightDispatchZod = z.object({
    action: z.literal("setMarginRight"),
    payload: z.number().min(0).max(200).step(1),
});
const setMarginTopDispatchZod = z.object({
    action: z.literal("setMarginTop"),
    payload: z.number().min(0).max(200).step(1),
});

type ChartMarginDispatchZod =
    | z.infer<typeof setMarginBottomDispatchZod>
    | z.infer<typeof setMarginLeftDispatchZod>
    | z.infer<typeof setMarginRightDispatchZod>
    | z.infer<typeof setMarginTopDispatchZod>;

export {
    setMarginBottomDispatchZod,
    setMarginLeftDispatchZod,
    setMarginRightDispatchZod,
    setMarginTopDispatchZod,
};
export type { ChartMarginDispatchZod };
