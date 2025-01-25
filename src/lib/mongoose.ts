import mongoose from "mongoose";

export function getModel<T>(
  modelName: string,
  schema: mongoose.Schema<T>,
): mongoose.Model<T> {
  return mongoose.models[modelName] || mongoose.model<T>(modelName, schema);
}
