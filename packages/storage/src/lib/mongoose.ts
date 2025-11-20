import mongoose, { ObjectId as MongooseObjectId } from "mongoose";
import { ObjectId as MongodbObjectId } from "mongodb";
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

export type Serialize<T> = T extends { toHexString(): string }
  ? string
  : T extends Date
  ? T
  : T extends (infer U)[]
  ? Serialize<U>[]
  : T extends object
  ? {
    [K in keyof T as T[K] extends Function
    ? never
    : K extends `\$${string}`
    ? never
    : K extends "toSerializable" | "db" | "baseModelName" | "errors" | "schema" | "collection"
    ? never
    : K]: Serialize<T[K]>;
  }
  : T;

function isObjectId(value: unknown): value is MongooseObjectId | MongodbObjectId {
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

  if (obj instanceof Date) return obj as Serialize<T>;

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

  if (typeof obj === "object" && (obj as any).toJSON instanceof Function) {
    return serializeObjectWithIds((obj as any).toJSON());
  }

  return obj as Serialize<T>;
}
