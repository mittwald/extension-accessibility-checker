import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  return NextResponse.json({ message: "Get all projects" });
}
export function POST(request: NextRequest) {
  return NextResponse.json({ message: "Create a new project" });
}
