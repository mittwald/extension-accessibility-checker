import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Project } from "@/app/project/project.model";

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
