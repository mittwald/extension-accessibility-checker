import mongoose from "mongoose";
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

export const serializeObjectWithIds = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (obj.constructor.name == "ObjectId") return obj.toString();
  if (obj.constructor.name == "Date") return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(serializeObjectWithIds);
  if (typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeObjectWithIds(value);
    }
    return result;
  }
  return obj;
};
