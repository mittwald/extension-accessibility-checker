import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  return NextResponse.json({
    message: `Get all scan profiles for project ${projectId}`,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  return NextResponse.json({
    message: `Create a new scan profile for project ${projectId}`,
  });
}
