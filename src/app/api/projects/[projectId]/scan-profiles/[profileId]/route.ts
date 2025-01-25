import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  return NextResponse.json({
    message: `Get scan profile ${profileId} for project ${projectId}`,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  return NextResponse.json({
    message: `Update scan profile ${profileId} for project ${projectId}`,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  return NextResponse.json({
    message: `Delete scan profile ${profileId} for project ${projectId}`,
  });
}
