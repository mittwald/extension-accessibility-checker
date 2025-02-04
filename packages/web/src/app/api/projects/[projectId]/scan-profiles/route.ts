import { NextRequest, NextResponse } from "next/server";
import {
  dbConnect,
  Project,
  ProjectModel,
  ScanProfile,
  ScanProfileModel,
} from "extension-a11y-checker-storage";
import { DocumentType } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  await dbConnect();

  const project: DocumentType<Project> | null =
    await ProjectModel.findById(projectId);
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const scanProfiles = await ScanProfileModel.find({ project: projectId });
  return NextResponse.json(scanProfiles);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  await dbConnect();

  const project = await ProjectModel.findById(projectId).exec();
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const scanProfile = await ScanProfileModel.create({
    ...(await request.json()),
    _id: new ObjectId(),
    project: project._id,
  });

  return NextResponse.json(scanProfile.toJSON(), { status: 201 });
}
