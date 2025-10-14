import mongoose, { ObjectId } from "mongoose";
import type {
  AnyParamConstructor,
  ReturnModelType,
} from "@typegoose/typegoose/lib/types";
import { getModelForClass } from "@typegoose/typegoose";

export function getModel<U extends AnyParamConstructor<any>>(
  modelClass: U,
  modelName: string,
): ReturnModelType<U> {
  return (
    (mongoose.models[modelName] as ReturnModelType<U>) ??
    getModelForClass(modelClass, { options: { customName: modelName } })
  );
}

export type Serialize<T> = T extends ObjectId
  ? string
  : T extends (infer U)[]
    ? Serialize<U>[]
    : T extends object
      ? { [K in keyof T]: Serialize<T[K]> }
      : T;

function isObjectId(value: unknown): value is ObjectId {
  return (
    !!value &&
    typeof value === "object" &&
    ((value as any).toHexString instanceof Function ||
      ((value as any).toString instanceof Function &&
        (value as any).constructor?.name === "ObjectId"))
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function serializeObjectWithIds<T>(obj: T): Serialize<T> {
  if (obj == null) return obj as Serialize<T>;

  if (isObjectId(obj)) return obj.toString() as Serialize<T>;

  if (Array.isArray(obj)) {
    return (obj as unknown[]).map(serializeObjectWithIds) as Serialize<T>;
  }

  if (isPlainObject(obj)) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      result[key] = serializeObjectWithIds(
        (obj as Record<string, unknown>)[key],
      );
    }
    return result as Serialize<T>;
  }

  return obj as Serialize<T>;
}
