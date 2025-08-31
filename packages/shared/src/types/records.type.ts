export type Values<TRecord extends Record<string, unknown>> =
  TRecord[keyof TRecord];
