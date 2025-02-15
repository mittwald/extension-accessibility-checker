import type { DocumentType, Ref } from "@typegoose/typegoose";
import { modelOptions, prop } from "@typegoose/typegoose";
import cronParser from "cron-parser";
import { ObjectId } from "mongodb";
import { Project, ProjectModel } from "../project/project.model.js";
import { getModel } from "../lib/mongoose.js";
import { ReturnModelType } from "@typegoose/typegoose/lib/types";
import { Scan } from "../scan/scan.model.js";

@modelOptions({ schemaOptions: { _id: false } })
class CronSchedule {
  @prop({ required: true })
  expression!: string;
}

@modelOptions({
  schemaOptions: {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
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

  @prop({
    ref: () => "Scan",
    foreignField: "profile",
    localField: "_id",
    justOne: true,
    match: { status: { $in: ["queued", "running"] } },
    options: { sort: { executionScheduledFor: 1 } },
  })
  public nextScan: Scan | null = null;

  public static async findForProject(
    this: ReturnModelType<typeof ScanProfile>,
    projectId: string,
  ) {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return null;
    }
    const profiles = await ScanProfileModel.find({ project: projectId }).exec();
    await Promise.all(
      profiles.map(async (p) => {
        await p.populate("nextScan");
      }),
    );
    return profiles;
  }

  public nextExecution(this: DocumentType<ScanProfile>) {
    if (!this.cronSchedule) {
      return null;
    }

    return cronParser
      .parseExpression(this.cronSchedule.expression)
      .next()
      .toDate();
  }
}

export const ScanProfileModel = getModel(ScanProfile);
