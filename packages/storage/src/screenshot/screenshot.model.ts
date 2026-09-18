import type { Ref, ReturnModelType } from "@typegoose/typegoose";
import { index, modelOptions, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import type { Scan } from "../scan/scan.model.js";
import { getModel } from "../lib/mongoose.js";

export interface ScreenshotInput {
  selector: string;
  image: Buffer;
  mimeType: string;
  width: number;
  height: number;
}

@index({ scan: 1 })
// Keep one screenshot per issue location within a scanned URL.
@index({ scan: 1, url: 1, selector: 1 }, { unique: true })
@modelOptions({
  schemaOptions: { collection: "screenshots", versionKey: false },
  options: { automaticName: false },
})
export class Screenshot {
  public _id!: ObjectId;

  @prop({ required: true, ref: () => "Scan" })
  public scan!: Ref<Scan>;

  @prop({ required: true })
  public url!: string;

  @prop({ required: true })
  public selector!: string;

  // Exclude binary data unless a query explicitly requests it.
  @prop({ required: true, type: () => Buffer, select: false })
  public image!: Buffer;

  @prop({ required: true })
  public mimeType!: string;

  @prop({ required: true })
  public width!: number;

  @prop({ required: true })
  public height!: number;

  @prop({ default: Date.now })
  public createdAt!: Date;

  public static async storeForScan(
    this: ReturnModelType<typeof Screenshot>,
    scanId: ObjectId,
    url: string,
    screenshots: ScreenshotInput[],
  ): Promise<Map<string, ObjectId>> {
    if (screenshots.length === 0) {
      return new Map();
    }

    const documents = await this.insertMany(
      screenshots.map((screenshot) => ({
        ...screenshot,
        scan: scanId,
        url,
      })),
    );

    return new Map(
      documents.map((screenshot) => [screenshot.selector, screenshot._id]),
    );
  }

  public static async deleteForScans(
    this: ReturnModelType<typeof Screenshot>,
    scanIds: ObjectId[],
  ): Promise<void> {
    await this.deleteMany({ scan: { $in: scanIds } });
  }
}

export const ScreenshotModel = getModel(Screenshot, "Screenshot");
