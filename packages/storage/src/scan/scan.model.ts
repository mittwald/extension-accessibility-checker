import type { Ref } from "@typegoose/typegoose";
import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ScanProfile } from "../scanProfile/scanProfile.model.js";
import { getModel } from "../lib/mongoose.js";

export class Issue {
  @prop({ required: true })
  public errorCode: string;

  @prop({ required: true, enum: ["error", "warning", "notice"] })
  public severity!: "error" | "warning" | "notice";

  @prop({ required: true })
  public description: string;

  @prop({ required: true })
  public codeSnippet: string;

  @prop({ required: true })
  public selector: string;

  @prop({ required: true })
  public runner: string;

  @prop({ required: true, type: () => Object })
  public runnerExtras!: Record<string, any>;
}

export class Scan {
  public _id: ObjectId;

  @prop({
    required: true,
    ref: () => ScanProfile,
  })
  public profile: Ref<ScanProfile>;

  @prop({ required: true })
  public urls: string[];

  @prop({ required: true, enum: ["queued", "running", "completed", "failed"] })
  public status!: "queued" | "running" | "completed" | "failed";

  @prop()
  issues?: Issue[];

  @prop()
  public error?: string;

  @prop({ default: Date.now })
  public createdAt!: Date;

  @prop({ default: Date.now })
  public updatedAt!: Date;

  @prop()
  public completedAt?: Date;
}

export const ScanModel = getModel(Scan);
