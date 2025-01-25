import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  return NextResponse.json({
    message: `Get all scans for project ${projectId}, profile ${profileId}`,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  return NextResponse.json({
    message: `Create a new scan for project ${projectId}, profile ${profileId}`,
  });
}
