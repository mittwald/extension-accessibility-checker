import type { Ref, ReturnModelType } from "@typegoose/typegoose";
import { index, modelOptions, prop } from "@typegoose/typegoose";
import { createHash } from "node:crypto";
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

export interface StoredScreenshot {
  id: ObjectId;
  width: number;
  height: number;
}

@index({ scan: 1 })
@index({ scan: 1, hash: 1 })
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

  @prop({ required: true })
  public hash!: string;

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
  ): Promise<Map<string, StoredScreenshot>> {
    if (screenshots.length === 0) {
      return new Map();
    }

    const hashedScreenshots = screenshots.map((screenshot) => ({
      screenshot,
      hash: createHash("sha256").update(screenshot.image).digest("hex"),
    }));
    const hashes = [...new Set(hashedScreenshots.map(({ hash }) => hash))];
    const existingDocuments = await this.find({
      scan: scanId,
      hash: { $in: hashes },
    });
    const documentsByHash = new Map(
      existingDocuments.map((screenshot) => [screenshot.hash, screenshot]),
    );

    const newScreenshots = new Map<string, ScreenshotInput>();
    for (const { screenshot, hash } of hashedScreenshots) {
      if (!documentsByHash.has(hash) && !newScreenshots.has(hash)) {
        newScreenshots.set(hash, screenshot);
      }
    }

    const insertedDocuments = await this.insertMany(
      [...newScreenshots].map(([hash, screenshot]) => ({
        ...screenshot,
        hash,
        scan: scanId,
        url,
      })),
    );
    for (const screenshot of insertedDocuments) {
      documentsByHash.set(screenshot.hash, screenshot);
    }

    return new Map(
      hashedScreenshots.map(({ screenshot, hash }) => {
        const document = documentsByHash.get(hash)!;
        return [
          screenshot.selector,
          {
            id: document._id,
            width: document.width,
            height: document.height,
          },
        ];
      }),
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
