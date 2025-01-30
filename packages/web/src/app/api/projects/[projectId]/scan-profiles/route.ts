import { NextRequest, NextResponse } from "next/server";
import { ScanProfile } from "extension-a11y-checker-storage/src/scanProfile/scanProfile.model";
import { Project } from "extension-a11y-checker-storage/src/project/project.model";
import dbConnect from "extension-a11y-checker-storage/src/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  await dbConnect();

  const project = await Project.findById(projectId);
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const scanProfiles = await ScanProfile.find({ projectId });
  return NextResponse.json(scanProfiles);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  await dbConnect();

  const project = await Project.findById(projectId);
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const scanProfile = await ScanProfile.create({
    ...(await request.json()),
    projectId,
  });
  return NextResponse.json(scanProfile.toJSON(), { status: 201 });
}
