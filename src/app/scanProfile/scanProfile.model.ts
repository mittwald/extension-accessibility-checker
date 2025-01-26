import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Scan } from "@/app/scan/scan.model";
import { getModel } from "@/lib/mongoose";

export type Path = string;

export interface CronSchedule {
  expression: string;
}

export interface ScanProfile {
  _id: ObjectId;
  projectId: ObjectId;
  name: string;
  domain: string;
  paths: Path[];
  standard: "WCAG2A" | "WCAG2AA" | "WCAG2AAA";
  includeNotices: boolean;
  includeWarnings: boolean;
  cronSchedule?: CronSchedule;
  createdAt: Date;
  updatedAt: Date;
  latestScan?: Scan;
}

export const ScanProfileSchema = new mongoose.Schema<ScanProfile>({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true,
  },
  name: { type: String, required: true },
  domain: { type: String, required: true },
  paths: [
    {
      type: String,
      required: true,
      validate: {
        validator: (path: string) => path.startsWith("/"),
        message: (props) => `${props.value} must start with /`,
      },
    },
  ],
  standard: {
    type: String,
    enum: ["WCAG2A", "WCAG2AA", "WCAG2AAA"],
    default: "WCAG2AA",
  },
  includeNotices: { type: Boolean, default: false },
  includeWarnings: { type: Boolean, default: true },
  cronSchedule: {
    expression: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add a virtual property for latestScan
ScanProfileSchema.virtual("latestScan", {
  ref: "Scan", // This should match the name you used when defining the Scan model
  localField: "_id",
  foreignField: "profileId",
  justOne: true,
  options: { sort: { timestamp: -1 } }, // Sort by timestamp in descending order
});

// Ensure virtuals are included when the document is converted to JSON
ScanProfileSchema.set("toJSON", { virtuals: true });
ScanProfileSchema.set("toObject", { virtuals: true });

export const ScanProfile = getModel<ScanProfile>(
  "ScanProfile",
  ScanProfileSchema,
);
