type CheckboxRadioSelectData<Payload extends string = string> = Array<{
    label: string;
    value: Payload;
}>;

type ScreenshotImageType = "image/png" | "image/jpeg" | "image/webp";

type SetPageInErrorPayload = {
    kind: "add" | "delete";
    page: number;
};

export type {
    CheckboxRadioSelectData,
    ScreenshotImageType,
    SetPageInErrorPayload,
};
