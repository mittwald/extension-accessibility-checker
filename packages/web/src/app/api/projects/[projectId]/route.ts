import { NextRequest, NextResponse } from "next/server";
import { ProjectModel, dbConnect } from "extension-a11y-checker-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  await dbConnect();

  const project = await ProjectModel.findById(projectId);
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
  const project = await ProjectModel.findByIdAndUpdate(
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

  const project = await ProjectModel.findByIdAndDelete(projectId);
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project.toJSON());
}
