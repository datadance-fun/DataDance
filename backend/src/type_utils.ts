import { SchemaOptions, Type } from "@sinclair/typebox";

export function StringEnum<T extends string[]>(
  values: [...T],
  options?: SchemaOptions
) {
  return Type.Unsafe<T[number]>({ type: "string", enum: values, ...options });
}
