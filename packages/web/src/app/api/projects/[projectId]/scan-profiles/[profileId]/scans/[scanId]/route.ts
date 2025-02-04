import { NextRequest, NextResponse } from "next/server";
import { ScanModel } from "extension-a11y-checker-storage";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string; profileId: string; scanId: string }>;
  },
) {
  const { projectId, profileId, scanId } = await params;
  const scan = await ScanModel.findById(scanId).populate("profile").exec();
  if (!scan || !scan.profile || scan.profile._id.toString() !== profileId) {
    return NextResponse.json({ message: "Scan not found" }, { status: 404 });
  }
  return NextResponse.json(scan.toJSON());
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
  const scan = await ScanModel.findByIdAndDelete(scanId);
  if (!scan || !scan.profile || scan.profile._id.toString() !== profileId) {
    return NextResponse.json({ message: "Scan not found" }, { status: 404 });
  }
  return NextResponse.json(scan.toJSON());
}
