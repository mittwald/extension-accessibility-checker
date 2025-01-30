import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { getModel } from "../lib/mongoose";

export interface Project {
  _id: ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = new mongoose.Schema<Project>({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Project = getModel<Project>("Project", ProjectSchema);
