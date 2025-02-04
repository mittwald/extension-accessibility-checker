import { prop, modelOptions } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { getModel } from "../lib/mongoose.js";

@modelOptions({ schemaOptions: { versionKey: false } })
export class Project {
  public _id: ObjectId;

  @prop({ required: true })
  public name: string;

  @prop()
  public description?: string;

  @prop({ default: Date.now })
  public createdAt: Date;

  @prop({ default: Date.now })
  public updatedAt: Date;
}

export const ProjectModel = getModel(Project);
