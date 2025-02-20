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
