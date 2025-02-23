import { prop, modelOptions } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { getModel } from "../lib/mongoose.js";
import { ReturnModelType } from "@typegoose/typegoose/lib/types";
import { ScanProfileModel } from "../scanProfile/scanProfile.model.js";
import { ScanModel } from "../scan/scan.model.js";

@modelOptions({
  schemaOptions: { versionKey: false, collection: "projects" },
  options: { automaticName: false },
})
export class Project {
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
    this: ReturnModelType<typeof Project>,
    projectId: string,
  ) {
    return this.updateOne(
      { _id: projectId },
      {
        $setOnInsert: { _id: projectId },
      },
      { upsert: true, new: true, runValidators: true },
    );
  }

  public static async update(
    this: ReturnModelType<typeof Project>,
    projectId: string,
  ) {
    return this.updateOne(
      { _id: projectId },
      {
        $set: { updatedAt: new Date() },
      },
    );
  }

  public static async delete(
    this: ReturnModelType<typeof Project>,
    projectId: string,
  ) {
    const profiles = (await ScanProfileModel.findForProject(projectId)) ?? [];
    await Promise.all(profiles.map((p) => ScanProfileModel.delete(p._id)));
    await this.findByIdAndDelete(projectId);
  }
}

export const ProjectModel = getModel(Project, "Project");
