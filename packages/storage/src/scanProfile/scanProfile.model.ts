import type { DocumentType, Ref } from "@typegoose/typegoose";
import { modelOptions, prop } from "@typegoose/typegoose";
import { CronExpressionParser } from "cron-parser";
import { ObjectId } from "mongodb";
import { Context, ContextModel } from "../context/context.model.js";
import { getModel, serializeObjectWithIds } from "../lib/mongoose.js";
import { ReturnModelType } from "@typegoose/typegoose/lib/types";
import { Scan, ScanModel } from "../scan/scan.model.js";

@modelOptions({ schemaOptions: { _id: false } })
class CronSchedule {
  @prop({ required: true })
  expression!: string;
}

@modelOptions({
  schemaOptions: {
    collection: "scanprofiles",
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => serializeObjectWithIds(ret),
    },
    toObject: { virtuals: true },
  },
  options: { automaticName: false },
})
export class ScanProfile {
  @prop()
  public _id!: ObjectId;

  @prop({
    ref: () => "Context",
    type: () => String,
    required: true,
  })
  public context: Ref<Context>;

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

  @prop({
    ref: () => "Scan",
    foreignField: "profile",
    localField: "_id",
    justOne: true,
    match: { completedAt: { $exists: true } },
    options: { sort: { completedAt: -1 } },
  })
  public lastScan: Ref<Scan>;

  @prop({
    ref: () => "Scan",
    foreignField: "profile",
    localField: "_id",
    justOne: true,
    match: { status: { $in: ["queued", "running"] } },
    options: { sort: { executionScheduledFor: 1 } },
  })
  public nextScan: Ref<Scan>;

  public static async delete(
    this: ReturnModelType<typeof ScanProfile>,
    profileId: ObjectId | string,
  ) {
    await ScanModel.deleteMany({ profile: profileId });
    await ScanProfileModel.findByIdAndDelete(profileId);
  }

  public static async findForContext(
    this: ReturnModelType<typeof ScanProfile>,
    contextId: string,
  ) {
    const context = await ContextModel.findById(contextId);
    if (!context) {
      return null;
    }
    return await ScanProfileModel.find({ context: contextId })
      .populate("nextScan")
      .populate({ path: "lastScan", select: "-issues" })
      .exec();
  }

  public nextExecution(this: DocumentType<ScanProfile>) {
    if (!this.cronSchedule) {
      return null;
    }

    return CronExpressionParser.parse(this.cronSchedule.expression)
      .next()
      .toDate();
  }
}

export const ScanProfileModel = getModel(ScanProfile, "ScanProfile");
