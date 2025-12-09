import { prop, modelOptions } from "@typegoose/typegoose";
import { getModel, serializeObjectWithIds } from "../lib/mongoose.js";
import { ReturnModelType } from "@typegoose/typegoose/lib/types";
import { ScanProfileModel } from "../scanProfile/scanProfile.model.js";

@modelOptions({
  schemaOptions: {
    versionKey: false,
    collection: "contexts",
    toJSON: {
      transform: (doc, ret) => serializeObjectWithIds(ret),
    },
  },
  options: { automaticName: false },
})
export class Context {
  @prop({ required: true })
  public _id: string;

  @prop({})
  public name: string;

  @prop()
  public description?: string;

  @prop({ default: Date.now })
  public createdAt: Date;

  @prop({ default: Date.now })
  public updatedAt: Date;

  public static async instanceAdded(
    this: ReturnModelType<typeof Context>,
    contextId: string,
  ) {
    return this.findOneAndUpdate(
      { _id: contextId },
      {
        $setOnInsert: { _id: contextId },
      },
      { upsert: true, new: true, runValidators: true },
    );
  }

  public static async update(
    this: ReturnModelType<typeof Context>,
    contextId: string,
  ) {
    return this.updateOne(
      { _id: contextId },
      {
        $set: { updatedAt: new Date() },
      },
    );
  }

  public static async delete(
    this: ReturnModelType<typeof Context>,
    contextId: string,
  ) {
    const profiles = (await ScanProfileModel.findForContext(contextId)) ?? [];
    await Promise.all(profiles.map((p) => ScanProfileModel.delete(p._id)));
    await this.findByIdAndDelete(contextId);
  }
}

export const ContextModel = getModel(Context, "Context");
