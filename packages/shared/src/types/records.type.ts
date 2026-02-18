export type Values<TRecord extends Record<string, unknown>> =
  TRecord[keyof TRecord];

export type Dict<TValue = unknown> = Record<string, TValue | undefined>;
