export interface CallbackFormProps {
  propertyTypes: readonly { value: string; label: string }[];
  submitUrl: string;
}

export type CallbackResult =
  | { ok: true }
  | { ok: false; code: "invalid" | "property_unavailable" | "unavailable" };
