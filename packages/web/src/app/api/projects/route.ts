import { NextRequest, NextResponse } from "next/server";
import { ProjectModel, dbConnect } from "extension-a11y-checker-storage";

export async function GET(request: NextRequest) {
  await dbConnect();

  const projects = await ProjectModel.find();
  return NextResponse.json(projects);
}
export async function POST(request: NextRequest) {
  await dbConnect();

  const input = await request.json();
  const project = await ProjectModel.create(input);
  return NextResponse.json(project.toJSON(), { status: 201 });
}
