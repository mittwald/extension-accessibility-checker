import type { Ref, DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { index, modelOptions, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ScanProfile } from "../scanProfile/scanProfile.model.js";
import { getModel } from "../lib/mongoose.js";

@modelOptions({ schemaOptions: { _id: false } })
export class Issue {
  @prop({ required: true })
  public url: string;

  @prop({ required: true })
  public errorCode: string;

  @prop({ required: true, enum: ["error", "warning", "notice"] })
  public severity!: "error" | "warning" | "notice";

  @prop({ required: true })
  public description: string;

  @prop()
  public context?: string;

  @prop()
  public selector?: string;
}

@modelOptions({
  schemaOptions: { _id: false, suppressReservedKeysWarning: true },
})
export class Issues {
  @prop({ required: true })
  public errors: number = 0;
  @prop({ required: true })
  public warnings: number = 0;
  @prop({ required: true })
  public notices: number = 0;
}

@modelOptions({ schemaOptions: { _id: false } })
export class Page {
  @prop({ required: true })
  public url: string;
  @prop()
  public title?: string;
  @prop()
  public issues?: Issues;
  @prop()
  public score?: number;

  public constructor(url: string) {
    this.url = url;
  }
}

@index({ status: 1, executionScheduledFor: 1 })
@modelOptions({
  schemaOptions: { collection: "scans", versionKey: false },
  options: { automaticName: false },
})
export class Scan {
  public _id: ObjectId;

  @prop({
    required: true,
    ref: () => "ScanProfile",
  })
  public profile: Ref<ScanProfile>;

  @prop({ required: true, type: () => [Page] })
  public pages: Page[];

  @prop({ required: true, enum: ["queued", "running", "completed", "failed"] })
  public status!: "queued" | "running" | "completed" | "failed";

  @prop({ type: () => [Issue] })
  issues?: Issue[];

  @prop()
  public error?: string;

  @prop({ required: true })
  public scheduledBy: "system" | string;

  @prop({ default: Date.now })
  public createdAt!: Date;

  @prop({ default: Date.now })
  public updatedAt!: Date;

  @prop({ default: Date.now })
  public executionScheduledFor!: Date;

  @prop()
  public completedAt?: Date;

  public static async findPending(this: ReturnModelType<typeof Scan>) {
    return this.find({
      status: { $in: ["queued"] },
      executionScheduledFor: { $lte: new Date() },
    }).exec();
  }

  public static async getNextPending(this: ReturnModelType<typeof Scan>) {
    return this.findOneAndUpdate(
      {
        status: { $in: ["queued"] },
        executionScheduledFor: { $lte: new Date() },
      },
      {
        status: "running",
      },
    ).exec();
  }

  public static async nextScanOfProfile(
    this: ReturnModelType<typeof Scan>,
    profileId: string | ObjectId,
  ) {
    return this.findOne(
      { profile: profileId, status: { $in: ["queued", "running"] } },
      null,
      {
        sort: { executionScheduledFor: 1 },
      },
    ).exec();
  }

  public static async lastScanOfProfile(
    this: ReturnModelType<typeof Scan>,
    profileId: string,
  ) {
    return this.findOne(
      { profile: profileId, completedAt: { $exists: true } },
      null,
      {
        sort: { completedAt: -1 },
      },
    ).exec();
  }

  public static async createForProfile(
    this: ReturnModelType<typeof Scan>,
    profile: DocumentType<ScanProfile>,
    scheduledFor: Date,
    scheduler: string = "system",
  ) {
    return this.create({
      profile: profile._id,
      status: "queued",
      scheduledBy: scheduler,
      executionScheduledFor: scheduledFor,
      pages: profile.paths.map(
        (path) => new Page(`https://${profile.domain}${path}`),
      ),
    });
  }

  public async markAsRunning(this: DocumentType<Scan>) {
    this.status = "running";
    await this.save();
  }

  public async markAsCompleted(this: DocumentType<Scan>) {
    this.status = "completed";
    this.completedAt = new Date();
    await this.save();
  }

  public async markAsFailed(this: DocumentType<Scan>, error: string) {
    this.status = "failed";
    this.error = error;
    await this.save();
  }

  public getIssueSummary(this: DocumentType<Scan>) {
    const summary = this.pages.reduce(
      (c: Issues & { score: number }, page) => {
        return {
          errors: c.errors + (page.issues?.errors || 0),
          warnings: c.warnings + (page.issues?.warnings || 0),
          notices: c.notices + (page.issues?.notices || 0),
          score: c.score + (page.score || 0),
        };
      },
      { errors: 0, warnings: 0, notices: 0, score: 0 },
    );
    summary.score = Math.round(summary.score / this.pages.length);
    return summary;
  }
}

export const ScanModel = getModel(Scan, "Scan");
