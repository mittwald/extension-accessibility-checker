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

  @prop({ required: true })
  public context: string;

  @prop({ required: true })
  public selector: string;
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

  public constructor(url: string) {
    this.url = url;
  }
}

@index({ status: 1, executionScheduledFor: 1 })
@modelOptions({ schemaOptions: { versionKey: false } })
export class Scan {
  public _id: ObjectId;

  @prop({
    required: true,
    ref: () => ScanProfile,
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
}

export const ScanModel = getModel(Scan);
