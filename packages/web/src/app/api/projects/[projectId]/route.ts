import { NextRequest, NextResponse } from "next/server";
import dbConnect from "extension-a11y-checker-storage/src/lib/mongodb";
import { Project } from "extension-a11y-checker-storage/src/project/project.model";

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
  return NextResponse.json(project.toJSON());
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  await dbConnect();

  const input = await request.json();
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $set: { ...input, updatedAt: new Date() } },
    { new: true },
  );
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project.toJSON());
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  await dbConnect();

  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project.toJSON());
}
