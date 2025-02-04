import type { Ref } from "@typegoose/typegoose";
import { modelOptions } from "@typegoose/typegoose";
import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Project } from "../project/project.model.js";
import { getModel } from "../lib/mongoose.js";

class CronSchedule {
  @prop({ required: true })
  expression!: string;
}

@modelOptions({ schemaOptions: { versionKey: false } })
export class ScanProfile {
  @prop()
  public _id!: ObjectId;

  @prop({
    ref: () => Project,
    required: true,
  })
  public project: Ref<Project>;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public domain!: string;

  @prop({
    type: String,
    required: true,
    validate: {
      validator: (paths: string[]) => paths.every((p) => p.startsWith("/")),
      message: (props) => `${props.value} every path must start with '/'`,
    },
  })
  public paths!: string[];

  @prop({
    required: true,
    enum: ["WCAG2A", "WCAG2AA", "WCAG2AAA"],
    default: "WCAG2AA",
  })
  public standard!: "WCAG2A" | "WCAG2AA" | "WCAG2AAA";

  @prop({ default: false })
  public includeNotices!: boolean;

  @prop({ default: true })
  public includeWarnings!: boolean;

  @prop({ type: () => CronSchedule })
  public cronSchedule?: CronSchedule;

  @prop({ default: Date.now })
  public createdAt!: Date;

  @prop({ default: Date.now })
  public updatedAt!: Date;
}

export const ScanProfileModel = getModel(ScanProfile);
