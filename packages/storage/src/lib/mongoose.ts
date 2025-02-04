import mongoose from "mongoose";
import type {
  AnyParamConstructor,
  ReturnModelType,
} from "@typegoose/typegoose/lib/types";
import { getModelForClass } from "@typegoose/typegoose";

export function getModel<U extends AnyParamConstructor<any>>(
  modelClass: U,
): ReturnModelType<U> {
  const modelName = modelClass.name;
  return (
    (mongoose.models[modelName] as ReturnModelType<U>) ??
    getModelForClass(modelClass)
  );
}
