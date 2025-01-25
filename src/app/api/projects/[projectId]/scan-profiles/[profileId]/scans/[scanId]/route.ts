import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string; profileId: string; scanId: string }>;
  },
) {
  const { projectId, profileId, scanId } = await params;
  return NextResponse.json({
    message: `Get scan ${scanId} for project ${projectId}, profile ${profileId}`,
  });
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string; profileId: string; scanId: string }>;
  },
) {
  const { projectId, profileId, scanId } = await params;
  return NextResponse.json({
    message: `Delete scan ${scanId} for project ${projectId}, profile ${profileId}`,
  });
}
