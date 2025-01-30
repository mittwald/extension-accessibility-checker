import { NextRequest, NextResponse } from "next/server";
import dbConnect from "extension-a11y-checker-storage/src/lib/mongodb";
import { Project } from "extension-a11y-checker-storage/src/project/project.model";

export async function GET(request: NextRequest) {
  await dbConnect();

  const projects = await Project.find();
  return NextResponse.json(projects);
}
export async function POST(request: NextRequest) {
  await dbConnect();

  const input = await request.json();
  const project = await Project.create(input);
  return NextResponse.json(project.toJSON(), { status: 201 });
}
