import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { getModel } from "@/lib/mongoose";

interface Issue {
  errorCode: string;
  severity: "error" | "warning" | "notice";
  description: string;
  line: number;
  codeSnippet: string;
}

export interface Scan {
  _id: ObjectId;
  profileId: ObjectId;
  queuedAt: Date;
  finishedAt?: Date;
  status: "queued" | "running" | "completed" | "failed";
  urls: string[];
  overallRating?: number;
  issues?: Issue[];
}

const ScanSchema = new mongoose.Schema<Scan>({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScanProfile",
    required: true,
  },
  queuedAt: { type: Date, default: Date.now },
  finishedAt: { type: Date },
  status: {
    type: String,
    enum: ["queued", "running", "completed", "failed"],
    required: true,
  },
  urls: { type: [String], required: true },
  overallRating: { type: Number },
  issues: [
    {
      errorCode: { type: String, required: true },
      severity: {
        type: String,
        enum: ["error", "warning", "notice"],
        required: true,
      },
      description: { type: String, required: true },
      line: { type: Number, required: true },
      codeSnippet: { type: String, required: true },
    },
  ],
});

export const Scan = getModel<Scan>("Scan", ScanSchema);
